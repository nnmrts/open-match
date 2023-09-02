/**
 *
 * @param v
 * @param {...any} args
 */
export function call(v, ...args) {
	if (typeof v === "function") {
	  // @ts-ignore
	  return v(...args);
	}

	  return v;
}

/**
 *
 */
export function noop() {}

/**
 *
 * @param {...any} fns
 */
export function chain(...fns) {
	if (fns.length === 0) {
		return noop;
	}
	if (fns.length === 1) {
		return fns[0];
	}

	return function () {
	  let result;

	  for (const fn of fns) {
			result = fn.apply(this, arguments) || result;
	  }

	  return result;
	};
}

/**
 *
 * @param value
 * @param fallback
 */
export function assignDefault(value, fallback) {
	return {
		...fallback,
		...(value || {})
	};
}
