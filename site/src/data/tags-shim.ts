/**
 * Re-export `TagType` + the `Tags` metadata table from the canonical
 * catalog source-of-truth file at the repo root (`src/data/tags.tsx`).
 *
 * The original file has a `.tsx` extension but contains no JSX. We
 * import through this shim so site-side modules use a stable,
 * JSX-free module specifier.
 */
export { Tags } from "../../../src/data/tags.tsx";
export type { Tag, TagType, User } from "../../../src/data/tags.tsx";
