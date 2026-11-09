import { COLUMN_COUNTS, gridWidth } from './index.js';

describe('gridWidth', () => {
	it('matches the 1140px Grid.Studio container at 12 columns', () => {
		expect(gridWidth(12)).toBe(1140);
	});

	it('steps down by two columns per breakpoint', () => {
		expect(COLUMN_COUNTS.map((columns) => gridWidth(columns))).toEqual([1140, 948, 756, 564, 372]);
	});
});
