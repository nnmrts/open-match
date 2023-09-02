import { pointerValues } from "../utils/events.js";
import { V } from "../utils/maths.js";

import { CoordinatesEngine } from "./coordinates-engine.js";

/**
 *
 */
export class HoverEngine extends CoordinatesEngine {

	ingKey = "hovering";

	/**
	 *
	 * @param event
	 */
	enter(event) {
		if (this.config.mouseOnly && event.pointerType !== "mouse") {
			return;
		}
		this.start(event);
		this.computeValues(pointerValues(event));

		this.compute(event);
		this.emit();
	}

	/**
	 *
	 * @param event
	 */
	leave(event) {
		if (this.config.mouseOnly && event.pointerType !== "mouse") {
			return;
		}

		const { state } = this;

		if (!state._active) {
			return;
		}

		state._active = false;
		const values = pointerValues(event);

		state._movement = state._delta = V.sub(values, state._values);

		this.computeValues(values);
		this.compute(event);

		state.delta = state.movement;
		this.emit();
	}

	/**
	 *
	 * @param bindFunction
	 */
	bind(bindFunction) {
		bindFunction("pointer", "enter", this.enter.bind(this));
		bindFunction("pointer", "leave", this.leave.bind(this));
	}

}
