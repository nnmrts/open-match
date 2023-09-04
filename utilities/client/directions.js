const horizontalDirections = new Map([
	[0, "none"],
	[-1, "left"],
	[1, "right"]
]);

const verticalDirections = new Map([
	[0, "none"],
	[-1, "up"],
	[1, "down"]
]);

const directions = new Map([["horizontal", horizontalDirections], ["vertical", verticalDirections]]);

export default directions;
