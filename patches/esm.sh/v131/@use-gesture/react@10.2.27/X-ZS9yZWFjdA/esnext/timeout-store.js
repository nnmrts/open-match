/**
 *
 */
export class TimeoutStore {

	#timeouts = new Map();

	/**
	 *
	 * @param key
	 * @param callback
	 * @param ms
	 * @param {...any} args
	 */
	add(
		key,
		callback,
		ms = 140,
		...args
	) {
		this.remove(key);
		this.#timeouts.set(key, window.setTimeout(callback, ms, ...args));
	}

	/**
	 *
	 * @param key
	 */
	remove(key) {
		const timeout = this.#timeouts.get(key);

		if (timeout) {
			window.clearTimeout(timeout);
		}
	}

	/**
	 *
	 */
	clean() {
		this.#timeouts.forEach((timeout) => void window.clearTimeout(timeout));
		this.#timeouts.clear();
	}

}
