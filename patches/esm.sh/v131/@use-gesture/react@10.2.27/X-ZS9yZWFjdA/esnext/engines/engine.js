import { getEventDetails } from "../utils/events.js";
import { call } from "../utils/fn.js";
import { V, computeRubberband } from "../utils/maths.js";

/**
 * The lib doesn't compute the kinematics on the last event of the gesture
 * (i.e. For a drag gesture, the `pointerup` coordinates will generally match the
 * last `pointermove` coordinates which would result in all drags ending with a
 * `[0,0]` velocity). However, when the timestamp difference between the last
 * event (ie pointerup) and the before last event (ie pointermove) is greater
 * than BEFORE_LAST_KINEMATICS_DELAY, the kinematics are computed (which would
 * mean that if you release your drag after stopping for more than
 * BEFORE_LAST_KINEMATICS_DELAY, the velocity will be indeed 0).
 *
 * See https://github.com/pmndrs/use-gesture/issues/332 for more details.
 */

const BEFORE_LAST_KINEMATICS_DELAY = 32;

// eslint-disable-next-line @typescript-eslint/no-unused-vars

/**
 *
 */
export class Engine {

	/**
	 * The Controller handling state.
	 */

	/**
	 * The gesture key ('drag' | 'pinch' | 'wheel' | 'scroll' | 'move' | 'hover').
	 */

	/**
	 * The key representing the active state of the gesture in the shared state.
	 * ('dragging' | 'pinching' | 'wheeling' | 'scrolling' | 'moving' | 'hovering').
	 */

	/**
	 * The arguments passed to the `bind` function.
	 */

	/**
	 * State prop that aliases state values (`xy` or `da`).
	 */

	/**
	 *
	 * @param ctrl
	 * @param args
	 * @param key
	 */
	constructor(ctrl, args, key) {
		this.ctrl = ctrl;
		this.args = args;
		this.key = key;

		if (!this.state) {
			this.state = {};
			this.computeValues([0, 0]);
			this.computeInitial();

			if (this.init) {
				this.init();
			}
			this.reset();
		}
	}

	/**
	 * Function implemented by gestures that compute the offset from the state
	 * movement.
	 */

	/**
	 * Shortcut to the gesture state read from the Controller.
	 */
	get state() {
		return this.ctrl.state[this.key];
	}

	/**
	 *
	 */
	set state(state) {
		this.ctrl.state[this.key] = state;
	}

	/**
	 * Shortcut to the shared state read from the Controller.
	 */
	get shared() {
		return this.ctrl.state.shared;
	}

	/**
	 * Shortcut to the gesture event store read from the Controller.
	 */
	get eventStore() {
		return this.ctrl.gestureEventStores[this.key];
	}

	/**
	 * Shortcut to the gesture timeout store read from the Controller.
	 */
	get timeoutStore() {
		return this.ctrl.gestureTimeoutStores[this.key];
	}

	/**
	 * Shortcut to the gesture config read from the Controller.
	 */
	get config() {
		return this.ctrl.config[this.key];
	}

	/**
	 * Shortcut to the shared config read from the Controller.
	 */
	get sharedConfig() {
		return this.ctrl.config.shared;
	}

	/**
	 * Shortcut to the gesture handler read from the Controller.
	 */
	get handler() {
		return this.ctrl.handlers[this.key];
	}

	/**
	 *
	 */
	reset() {
		const {
			state, shared, ingKey, args
		} = this;

		shared[ingKey] = state._active = state.active = state._blocked = state._force = false;
		state._step = [false, false];
		state.intentional = false;
		state._movement = [0, 0];
		state._distance = [0, 0];
		state._direction = [0, 0];
		state._delta = [0, 0];
		// prettier-ignore
		state._bounds = [[-Infinity, Infinity], [-Infinity, Infinity]];
		state.args = args;
		state.axis = undefined;
		state.memo = undefined;
		state.elapsedTime = state.timeDelta = 0;
		state.direction = [0, 0];
		state.distance = [0, 0];
		state.overflow = [0, 0];
		state._movementBound = [false, false];
		state.velocity = [0, 0];
		state.movement = [0, 0];
		state.delta = [0, 0];
		state.timeStamp = 0;
	}

	/**
	 * Function ran at the start of the gesture.
	 *
	 * @param event
	 */
	start(event) {
		const { state } = this;
		const { config } = this;

		if (!state._active) {
			this.reset();
			this.computeInitial();

			state._active = true;
			state.target = event.target;
			state.currentTarget = event.currentTarget;
			state.lastOffset = config.from ? call(config.from, state) : state.offset;
			state.offset = state.lastOffset;
			state.startTime = state.timeStamp = event.timeStamp;
		}
	}

	/**
	 * Assign raw values to `state._values` and transformed values to
	 * `state.values`.
	 *
	 * @param values
	 */
	computeValues(values) {
		const { state } = this;

		state._values = values;
		// transforming values into user-defined coordinates (#402)
		state.values = this.config.transform(values);
	}

	/**
	 * Assign `state._values` to `state._initial` and transformed `state.values` to
	 * `state.initial`.
	 *
	 * @param values
	 */
	computeInitial() {
		const { state } = this;

		state._initial = state._values;
		state.initial = state.values;
	}

	/**
	 * Computes all sorts of state attributes, including kinematics.
	 *
	 * @param event
	 */
	compute(event) {
		const {
			state, config, shared
		} = this;

		state.args = this.args;

		let dt = 0;

		if (event) {
			// sets the shared state with event properties
			state.event = event;
			// if config.preventDefault is true, then preventDefault
			if (config.preventDefault && event.cancelable) {
				state.event.preventDefault();
			}
			state.type = event.type;
			shared.touches = this.ctrl.pointerIds.size || this.ctrl.touchIds.size;
			shared.locked = Boolean(document.pointerLockElement);
			Object.assign(shared, getEventDetails(event));
			shared.down = shared.pressed = shared.buttons % 2 === 1 || shared.touches > 0;

			// sets time stamps
			dt = event.timeStamp - state.timeStamp;
			state.timeStamp = event.timeStamp;
			state.elapsedTime = state.timeStamp - state.startTime;
		}

		// only compute _distance if the state is active otherwise we might compute it
		// twice when the gesture ends because state._delta wouldn't have changed on
		// the last frame.
		if (state._active) {
			const _absoluteDelta = state._delta.map(Math.abs);

			V.addTo(state._distance, _absoluteDelta);
		}

		// let's run intentionality check.
		if (this.axisIntent) {
			this.axisIntent(event);
		}

		// _movement is calculated by each gesture engine
		const [_m0, _m1] = state._movement;
		const [t0, t1] = config.threshold;

		const { _step, values } = state;

		if (config.hasCustomTransform) {
			// When the user is using a custom transform, we're using `_step` to store
			// the first value passing the threshold.
			if (_step[0] === false) {
				_step[0] = Math.abs(_m0) >= t0 && values[0];
			}
			if (_step[1] === false) {
				_step[1] = Math.abs(_m1) >= t1 && values[1];
			}
		}
		else {
			// `_step` will hold the threshold at which point the gesture was triggered.
			// The threshold is signed depending on which direction triggered it.
			if (_step[0] === false) {
				_step[0] = Math.abs(_m0) >= t0 && Math.sign(_m0) * t0;
			}
			if (_step[1] === false) {
				_step[1] = Math.abs(_m1) >= t1 && Math.sign(_m1) * t1;
			}
		}

		state.intentional = _step[0] !== false || _step[1] !== false;

		if (!state.intentional) {
			return;
		}

		const movement = [0, 0];

		if (config.hasCustomTransform) {
			const [v0, v1] = values;

			movement[0] = _step[0] !== false ? v0 - _step[0] : 0;
			movement[1] = _step[1] !== false ? v1 - _step[1] : 0;
		}
		else {
			movement[0] = _step[0] !== false ? _m0 - _step[0] : 0;
			movement[1] = _step[1] !== false ? _m1 - _step[1] : 0;
		}

		if (this.restrictToAxis && !state._blocked) {
			this.restrictToAxis(movement);
		}

		const previousOffset = state.offset;

		const gestureIsActive = (state._active && !state._blocked) || state.active;

		if (gestureIsActive) {
			state.first = state._active && !state.active;
			state.last = !state._active && state.active;
			state.active = shared[this.ingKey] = state._active;

			if (event) {
				if (state.first) {
					if ("bounds" in config) {
						state._bounds = call(config.bounds, state);
					}
					if (this.setup) {
						this.setup();
					}
				}

				state.movement = movement;
				this.computeOffset();
			}
		}

		const [ox, oy] = state.offset;
		const [[x0, x1], [y0, y1]] = state._bounds;

		state.overflow = [ox < x0 ? -1 : ox > x1 ? 1 : 0, oy < y0 ? -1 : oy > y1 ? 1 : 0];

		// _movementBound will store the latest _movement value
		// before it went off bounds.
		state._movementBound[0] = state.overflow[0]
			? state._movementBound[0] === false
				? state._movement[0]
				: state._movementBound[0]
			: false;

		state._movementBound[1] = state.overflow[1]
			? state._movementBound[1] === false
				? state._movement[1]
				: state._movementBound[1]
			: false;

		// @ts-ignore
		const rubberband = state._active ? config.rubberband || [0, 0] : [0, 0];

		state.offset = computeRubberband(state._bounds, state.offset, rubberband);
		state.delta = V.sub(state.offset, previousOffset);

		this.computeMovement();

		if (gestureIsActive && (!state.last || dt > BEFORE_LAST_KINEMATICS_DELAY)) {
			state.delta = V.sub(state.offset, previousOffset);
			const absoluteDelta = state.delta.map(Math.abs);

			V.addTo(state.distance, absoluteDelta);
			state.direction = state.delta.map(Math.sign);
			state._direction = state._delta.map(Math.sign);

			// calculates kinematics unless the gesture starts or ends or if the
			// dt === 0 (which can happen on high frame rate monitors, see issue #581)
			// because of privacy protection:
			// https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp#reduced_time_precision
			if (!state.first && dt > 0) {
				state.velocity = [absoluteDelta[0] / dt, absoluteDelta[1] / dt];
				state.timeDelta = dt;
			}
		}
	}

	/**
	 * Fires the gesture handler.
	 */
	emit() {
		const { state } = this;
		const { shared } = this;
		const { config } = this;

		if (!state._active) {
			this.clean();
		}

		// we don't trigger the handler if the gesture is blocked or non intentional,
		// unless the `_force` flag was set or the `triggerAllEvents` option was set
		// to true in the config.
		if ((state._blocked || !state.intentional) && !state._force && !config.triggerAllEvents) {
			return;
		}

		// @ts-ignore
		const memo = this.handler({
			...shared,
			...state,
			[this.aliasKey]: state.values
		});

		// Sets memo to the returned value of the handler (unless it's  undefined)
		if (memo !== undefined) {
			state.memo = memo;
		}
	}

	/**
	 * Cleans the gesture timeouts and event listeners.
	 */
	clean() {
		this.eventStore.clean();
		this.timeoutStore.clean();
	}

}
