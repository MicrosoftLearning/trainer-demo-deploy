/**
 * Centralized SVG path data for the Orchestrator Preview chrome.
 * Ported from the spike (TDDSync/us/spike-astro/.../icons.ts) so the
 * OPX header/composer renders the same VS Code-style monochrome icons
 * instead of emoji glyphs.
 *
 * Render via <Icon name="..." size={n} /> in any Astro template.
 */
export type IconDef = {
  v?: string;
  paths: string[];
  shapes?: string;
  fill?: "currentColor" | "none";
  stroke?: "currentColor" | "none";
  strokeWidth?: number;
};

export const icons: Record<string, IconDef> = {
  plus:      { stroke: "currentColor", fill: "none", strokeWidth: 1.3, paths: ["M8 3v10M3 8h10"] },
  caretDown: { fill: "currentColor", paths: ["m4 6 4 4 4-4z"] },
  gear:      {
    stroke: "currentColor", fill: "none", strokeWidth: 1.2,
    shapes: '<circle cx="8" cy="8" r="2"/>',
    paths: ["M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3"],
  },
  ellipsis:  {
    fill: "currentColor", paths: [],
    shapes: '<circle cx="3" cy="8" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="13" cy="8" r="1"/>',
  },
  expand:    { stroke: "currentColor", fill: "none", strokeWidth: 1.3, paths: ["M2 5V2h3M14 5V2h-3M2 11v3h3M14 11v3h-3"] },
  close:     { stroke: "currentColor", fill: "none", strokeWidth: 1.4, paths: ["m3 3 10 10M13 3 3 13"] },
  back:      { stroke: "currentColor", fill: "none", strokeWidth: 1.4, paths: ["M10 3 5 8l5 5"] },
  splitPane: {
    stroke: "currentColor", fill: "none", strokeWidth: 1.2,
    shapes: '<rect x="2" y="2.5" width="12" height="11" rx="1"/>',
    paths: ["M8 2.5v11"],
  },

  // Composer chrome
  caretRight: { fill: "currentColor", paths: ["m5 3 6 5-6 5z"] },
  collapseAll: {
    stroke: "currentColor", fill: "none", strokeWidth: 1.2,
    paths: ["M3 4h6M3 8h6M3 12h6", "m12 4 2 2-2 2M12 10l2 2-2 2"],
  },
  clipboard: {
    stroke: "currentColor", fill: "none", strokeWidth: 1.2,
    shapes: '<rect x="4" y="2" width="8" height="11" rx="1"/>',
    paths: ["M6 2v-.5h4V2"],
  },
  globe: {
    stroke: "currentColor", fill: "none", strokeWidth: 1.2,
    shapes: '<circle cx="8" cy="8" r="6"/>',
    paths: ["M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12"],
  },
  sliders: {
    stroke: "currentColor", fill: "none", strokeWidth: 1.2,
    shapes: '<circle cx="10.5" cy="4" r="1.3"/><circle cx="6.5" cy="8" r="1.3"/><circle cx="10.5" cy="12" r="1.3"/>',
    paths: ["M2 4h7M12 4h2M2 8h3M8 8h6M2 12h9M12 12h2"],
  },
  mic: {
    stroke: "currentColor", fill: "none", strokeWidth: 1.3,
    shapes: '<rect x="6" y="2" width="4" height="7" rx="2"/>',
    paths: ["M3.5 8a4.5 4.5 0 0 0 9 0M8 12.5V14"],
  },
};
