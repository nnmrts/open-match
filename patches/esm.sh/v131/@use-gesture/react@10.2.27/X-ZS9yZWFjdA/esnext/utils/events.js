const EVENT_TYPE_MAP = {
	pointer: {
		start: "down",
		change: "move",
		end: "up"
	},
	mouse: {
		start: "down",
		change: "move",
		end: "up"
	},
	touch: {
		start: "start",
		change: "move",
		end: "end"
	},
	gesture: {
		start: "start",
		change: "change",
		end: "end"
	}
};

const capitalize = (string) => {
	if (!string) {
		return "";
	}

	return string[0].toUpperCase() + string.slice(1);
};

const actionsWithoutCaptureSupported = ["enter", "leave"];

const hasCapture = (capture = false, actionKey) => capture && !actionsWithoutCaptureSupported.includes(actionKey);

/**
 *
 * @param device
 * @param action
 * @param capture
 */
export function toHandlerProp(device, action = "", capture = false) {
	const deviceProps = EVENT_TYPE_MAP[device];
	const actionKey = deviceProps ? deviceProps[action] || action : action;

	return `on${capitalize(device)}${capitalize(actionKey)}${hasCapture(capture, actionKey) ? "Capture" : ""}`;
}

const pointerCaptureEvents = ["gotpointercapture", "lostpointercapture"];

/**
 *
 * @param prop
 */
export function parseProp(prop) {
	let eventKey = prop.substring(2).toLowerCase();
	const passive = Boolean(~eventKey.indexOf("passive"));

	if (passive) {
		eventKey = eventKey.replace("passive", "");
	}

	const captureKey = pointerCaptureEvents.includes(eventKey) ? "capturecapture" : "capture";
	// capture = true
	const capture = Boolean(~eventKey.indexOf(captureKey));

	// pointermovecapture => pointermove
	if (capture) {
		eventKey = eventKey.replace("capture", "");
	}

	return {
		device: eventKey,
		capture,
		passive
	};
}

/**
 *
 * @param device
 * @param action
 */
export function toDomEventType(device, action = "") {
	const deviceProps = EVENT_TYPE_MAP[device];
	const actionKey = deviceProps ? deviceProps[action] || action : action;

	return device + actionKey;
}

/**
 *
 * @param event
 */
export function isTouch(event) {
	return "touches" in event;
}

/**
 *
 * @param event
 */
export function getPointerType(event) {
	if (isTouch(event)) {
		return "touch";
	}
	if ("pointerType" in event) {
		return (event).pointerType;
	}

	return "mouse";
}

const getCurrentTargetTouchList = (event) => Array.from(event.touches).filter(
	(e) => e.target === event.currentTarget || event.currentTarget?.contains(e.target)
);

const getTouchList = (event) => (event.type === "touchend" || event.type === "touchcancel" ? event.changedTouches : event.targetTouches);

function getValueEvent(
	event
) {
	return (isTouch(event) ? getTouchList(event)[0] : event);
}

/**
 *
 * @param P1
 * @param P2
 */
export function distanceAngle(P1, P2) {
	// add a try catch
	// attempt to fix https://github.com/pmndrs/use-gesture/issues/551
	try {
		const dx = P2.clientX - P1.clientX;
		const dy = P2.clientY - P1.clientY;
		const cx = (P2.clientX + P1.clientX) / 2;
		const cy = (P2.clientY + P1.clientY) / 2;

		const distance = Math.hypot(dx, dy);
		const angle = -(Math.atan2(dx, dy) * 180) / Math.PI;
		const origin = [cx, cy];

		return {
			angle,
			distance,
			origin
		};
	}
	catch (e2) {}

	return null;
}

/**
 *
 * @param event
 */
export function touchIds(event) {
	return getCurrentTargetTouchList(event).map((touch) => touch.identifier);
}

/**
 *
 * @param event
 * @param ids
 */
export function touchDistanceAngle(event, ids) {
	const [P1, P2] = Array.from(event.touches).filter((touch) => ids.includes(touch.identifier));

	return distanceAngle(P1, P2);
}

/**
 *
 * @param event
 */
export function pointerId(event) {
	const valueEvent = getValueEvent(event);

	return isTouch(event) ? (valueEvent).identifier : (valueEvent).pointerId;
}

/**
 *
 * @param event
 */
export function pointerValues(event) {
	// if ('spaceX' in event) return [event.spaceX, event.spaceY]
	const valueEvent = getValueEvent(event);

	return [valueEvent.clientX, valueEvent.clientY];
}

// wheel delta defaults from https://github.com/facebookarchive/fixed-data-table/blob/master/src/vendor_upstream/dom/normalizeWheel.js
const LINE_HEIGHT = 40;
const PAGE_HEIGHT = 800;

/**
 *
 * @param event
 */
export function wheelValues(event) {
	let {
		deltaX, deltaY, deltaMode
	} = event;

	// normalize wheel values, especially for Firefox
	if (deltaMode === 1) {
		deltaX *= LINE_HEIGHT;
		deltaY *= LINE_HEIGHT;
	}
	else if (deltaMode === 2) {
		deltaX *= PAGE_HEIGHT;
		deltaY *= PAGE_HEIGHT;
	}

	return [deltaX, deltaY];
}

/**
 *
 * @param event
 */
export function scrollValues(event) {
	// If the currentTarget is the window then we return the scrollX/Y position.
	// If not (ie the currentTarget is a DOM element), then we return scrollLeft/Top
	const {
		scrollX, scrollY, scrollLeft, scrollTop
	} = event.currentTarget;

	return [scrollX ?? scrollLeft ?? 0, scrollY ?? scrollTop ?? 0];
}

/**
 *
 * @param event
 */
export function getEventDetails(event) {
	const payload = {};

	if ("buttons" in event) {
		payload.buttons = event.buttons;
	}
	if ("shiftKey" in event) {
		const {
			shiftKey, altKey, metaKey, ctrlKey
		} = event;

		Object.assign(payload, {
			shiftKey,
			altKey,
			metaKey,
			ctrlKey
		});
	}

	return payload;
}
