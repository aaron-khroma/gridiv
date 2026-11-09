/**
 * Gridiv: grid-based content management for React.
 * The gridmap schema, auto-fit algorithm, and renderer arrive in v0.1.
 */

/** Column counts a gridmap can define layouts for, widest first. */
export const COLUMN_COUNTS = [12, 10, 8, 6, 4] as const;
export type ColumnCount = (typeof COLUMN_COUNTS)[number];

/** Default grid geometry, matching the media exported from Grid.Studio (84px cells, 12px gaps). */
export const DEFAULT_GEOMETRY = { cell: 84, gap: 12 } as const;

/** Total pixel width of a grid with the given column count. */
export function gridWidth(columns: ColumnCount, geometry = DEFAULT_GEOMETRY): number {
	return columns * geometry.cell + (columns - 1) * geometry.gap;
}
