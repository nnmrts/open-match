/**
 *
 * @param originalArray
 * @param predicate
 * @param limit
 */
// eslint-disable-next-line max-statements
const findPermutation = async (originalArray, predicate, limit = Infinity) => {
	let attempts = 0;

	const resultArray = [];

	const permutableArray = [...originalArray];

	const arrayLength = permutableArray.length;

	if (arrayLength === 0) {
		return resultArray;
	}

	// Heap's Algorithm
	const iterationCounts = new Array(arrayLength).fill(0);

	if (await predicate([...permutableArray])) {
		return [...permutableArray];
	}

	let currentIteration = 1;

	while (currentIteration < arrayLength && attempts <= limit) {
		attempts += 1;
		if (iterationCounts[currentIteration] < currentIteration) {
			if (currentIteration % 2 === 0) {
				[permutableArray[0], permutableArray[currentIteration]] = [permutableArray[currentIteration], permutableArray[0]];
			}
			else {
				[permutableArray[iterationCounts[currentIteration]], permutableArray[currentIteration]] = [permutableArray[currentIteration], permutableArray[iterationCounts[currentIteration]]];
			}

			if (await predicate([...permutableArray])) {
				return [...permutableArray];
			}

			iterationCounts[currentIteration] += 1;
			currentIteration = 1;
		}
		else {
			iterationCounts[currentIteration] = 0;
			currentIteration += 1;
		}
	}

	return undefined;
};

export default findPermutation;
