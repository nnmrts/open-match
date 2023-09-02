import { pointerValues } from "../utils/events.js";
import { V } from "../utils/maths.js";

import { CoordinatesEngine } from "./coordinates-engine.js";

/**
 *
 */
export class MoveEngine extends CoordinatesEngine {

	ingKey = "moving";

	/**
	 *
	 * @param event
	 */
	move(event) {
		if (this.config.mouseOnly && event.pointerType !== "mouse") {
			return;
		}
		if (!this.state._active) {
			this.moveStart(event);
		}
		else {
			this.moveChange(event);
		}
		this.timeoutStore.add("moveEnd", this.moveEnd.bind(this));
	}

	/**
	 *
	 * @param event
	 */
	moveStart(event) {
		this.start(event);
		this.computeValues(pointerValues(event));
		this.compute(event);
		this.computeInitial();
		this.emit();
	}

	/**
	 *
	 * @param event
	 */
	moveChange(event) {
		if (!this.state._active) {
			return;
		}
		const values = pointerValues(event);
		const { state } = this;

		state._delta = V.sub(values, state._values);
		V.addTo(state._movement, state._delta);

		this.computeValues(values);

		this.compute(event);
		this.emit();
	}

	/**
	 *
	 * @param event
	 */
	moveEnd(event) {
		if (!this.state._active) {
			return;
		}
		this.state._active = false;
		this.compute(event);
		this.emit();
	}

	/**
	 *
	 * @param bindFunction
	 */
	bind(bindFunction) {
		bindFunction("pointer", "change", this.move.bind(this));
		bindFunction("pointer", "leave", this.moveEnd.bind(this));
	}

}
