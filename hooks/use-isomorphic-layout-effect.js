import { useEffect, useLayoutEffect } from "preact/hooks";

const useIsomorphicLayoutEffect = typeof window === "undefined"
	? useEffect
	: useLayoutEffect;

export default useIsomorphicLayoutEffect;
