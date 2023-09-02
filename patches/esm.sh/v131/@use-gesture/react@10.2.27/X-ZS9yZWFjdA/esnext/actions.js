import { DragEngine } from "./engines/drag-engine.js";
import { dragConfigResolver } from "./config/drag-config-resolver.js";
import { MoveEngine } from "./engines/move-engine.js";
import { moveConfigResolver } from "./config/move-config-resolver.js";
import { HoverEngine } from "./engines/hover-engine.js";
import { hoverConfigResolver } from "./config/hover-config-resolver.js";

const EngineMap = new Map();
const ConfigResolverMap = new Map();

/**
 *
 * @param action
 */
const registerAction = (action) => {
	EngineMap.set(action.key, action.engine);
	ConfigResolverMap.set(action.key, action.resolver);
};

const dragAction = {
	key: "drag",
	engine: DragEngine,
	resolver: dragConfigResolver
};

const hoverAction = {
	key: "hover",
	engine: HoverEngine,
	resolver: hoverConfigResolver
};

const moveAction = {
	key: "move",
	engine: MoveEngine,
	resolver: moveConfigResolver
};

export {
	EngineMap,
	ConfigResolverMap,
	registerAction,
	dragAction,
	hoverAction,
	moveAction
};
