import { toDomEventType } from "./utils/events.js";

/**
 *
 */
export class EventStore {

	#listeners = new Set();

	#ctrl;

	#gestureKey;

	/**
	 *
	 * @param ctrl
	 * @param gestureKey
	 */
	constructor(ctrl, gestureKey) {
		this.#ctrl = ctrl;
		this.#gestureKey = gestureKey;
	}

	/**
	 *
	 * @param element
	 * @param device
	 * @param action
	 * @param handler
	 * @param options
	 */
	add(
		element,
		device,
		action,
		handler,
		options
	) {
		const listeners = this.#listeners;
		const type = toDomEventType(device, action);
		const _options = this.#gestureKey ? this.#ctrl.config[this.#gestureKey].eventOptions : {};
		const eventOptions = {
			..._options,
			...options
		};

		element.addEventListener(type, handler, eventOptions);
		const remove = () => {
			element.removeEventListener(type, handler, eventOptions);
			listeners.delete(remove);
		};

		listeners.add(remove);

		return remove;
	}

	/**
	 *
	 */
	clean() {
		this.#listeners.forEach((remove) => remove());
		this.#listeners.clear(); // just for safety
	}

}
