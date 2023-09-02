/**
 *
 * @param v
 * @param min
 * @param max
 */
export function clamp(v, min, max) {
	return Math.max(min, Math.min(v, max));
}

export const V = {
	toVector(v, fallback) {
	  if (v === undefined) {
			v = fallback;
		}

	  return Array.isArray(v) ? v : [v, v];
	},
	add(v1, v2) {
	  return [v1[0] + v2[0], v1[1] + v2[1]];
	},
	sub(v1, v2) {
	  return [v1[0] - v2[0], v1[1] - v2[1]];
	},
	addTo(v1, v2) {
	  v1[0] += v2[0];
	  v1[1] += v2[1];
	},
	subTo(v1, v2) {
	  v1[0] -= v2[0];
	  v1[1] -= v2[1];
	}
};

// Based on @aholachek ;)
// https://twitter.com/chpwn/status/285540192096497664
// iOS constant = 0.55

// https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5

function rubberband(distance, dimension, constant) {
	if (dimension === 0 || Math.abs(dimension) === Infinity) {
		return distance ** (constant * 5);
	}

	return (distance * dimension * constant) / (dimension + constant * distance);
}

/**
 *
 * @param position
 * @param min
 * @param max
 * @param constant
 */
export function rubberbandIfOutOfBounds(position, min, max, constant = 0.15) {
	if (constant === 0) {
		return clamp(position, min, max);
	}
	if (position < min) {
		return -rubberband(min - position, max - min, constant) + min;
	}
	if (position > max) {
		return Number(rubberband(position - max, max - min, constant)) + max;
	}

	return position;
}

/**
 *
 * @param bounds
 * @param root0
 * @param root0."0"
 * @param root0."1"
 * @param root1
 * @param root1."0"
 * @param root1."1"
 */
export function computeRubberband(bounds, [Vx, Vy], [Rx, Ry]) {
	const [[X0, X1], [Y0, Y1]] = bounds;

	return [rubberbandIfOutOfBounds(Vx, X0, X1, Rx), rubberbandIfOutOfBounds(Vy, Y0, Y1, Ry)];
}
