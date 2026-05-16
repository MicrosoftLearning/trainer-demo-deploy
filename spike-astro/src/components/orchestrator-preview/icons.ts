// Centralized SVG paths used by Orchestrator Preview.
// All paths are designed for a 16x16 viewBox unless noted.
// Render with <Icon name="..." size={n} stroke|fill="currentColor" />.

export type IconDef = {
  v?: string;          // viewBox (default "0 0 16 16")
  paths: string[];     // raw <path d="..."/> bodies
  shapes?: string;     // optional extra inner SVG (rects/circles)
  fill?: "currentColor" | "none";
  stroke?: "currentColor" | "none";
  strokeWidth?: number;
};

export const icons: Record<string, IconDef> = {
  // Header / chrome
  plus:        { stroke: "currentColor", fill: "none", strokeWidth: 1.3, paths: ["M8 3v10M3 8h10"] },
  caretDown:   { fill: "currentColor", paths: ["m4 6 4 4 4-4z"] },
  gear:        { stroke: "currentColor", fill: "none", strokeWidth: 1.2,
                 shapes: '<circle cx="8" cy="8" r="2"/>',
                 paths: ["M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3"] },
  ellipsis:    { fill: "currentColor", paths: [],
                 shapes: '<circle cx="3" cy="8" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="13" cy="8" r="1"/>' },
  expand:      { stroke: "currentColor", fill: "none", strokeWidth: 1.3,
                 paths: ["M2 5V2h3M14 5V2h-3M2 11v3h3M14 11v3h-3"] },
  close:       { stroke: "currentColor", fill: "none", strokeWidth: 1.4, paths: ["m3 3 10 10M13 3 3 13"] },
  back:        { stroke: "currentColor", fill: "none", strokeWidth: 1.4, paths: ["M10 3 5 8l5 5"] },
  splitPane:   { stroke: "currentColor", fill: "none", strokeWidth: 1.2,
                 shapes: '<rect x="2" y="2.5" width="12" height="11" rx="1"/>',
                 paths: ["M8 2.5v11"] },

  // Composer chrome
  caretRight:  { fill: "currentColor", paths: ["m5 3 6 5-6 5z"] },
  collapseAll: { stroke: "currentColor", fill: "none", strokeWidth: 1.2,
                 paths: ["M3 4h6M3 8h6M3 12h6", "m12 4 2 2-2 2M12 10l2 2-2 2"] },
  clipboard:   { stroke: "currentColor", fill: "none", strokeWidth: 1.2,
                 shapes: '<rect x="4" y="2" width="8" height="11" rx="1"/>',
                 paths: ["M6 2v-.5h4V2"] },
  globe:       { stroke: "currentColor", fill: "none", strokeWidth: 1.2,
                 shapes: '<circle cx="8" cy="8" r="6"/>',
                 paths: ["M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12"] },
  sliders:     { stroke: "currentColor", fill: "none", strokeWidth: 1.2,
                 shapes: '<circle cx="10.5" cy="4" r="1.3"/><circle cx="6.5" cy="8" r="1.3"/><circle cx="10.5" cy="12" r="1.3"/>',
                 paths: ["M2 4h7M12 4h2M2 8h3M8 8h6M2 12h9M12 12h2"] },
  mic:         { stroke: "currentColor", fill: "none", strokeWidth: 1.3,
                 shapes: '<rect x="6" y="2" width="4" height="7" rx="2"/>',
                 paths: ["M3.5 8a4.5 4.5 0 0 0 9 0M8 12.5V14"] },

  // Step content
  github:      { fill: "currentColor", paths: [
    "M7.998 0a8 8 0 0 0-2.529 15.59c.4.074.547-.174.547-.385 0-.19-.007-.693-.011-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.888-1.17-.888-1.17-.726-.496.055-.486.055-.486.803.057 1.226.824 1.226.824.714 1.223 1.873.87 2.33.665.072-.517.279-.87.508-1.07-1.777-.202-3.644-.889-3.644-3.953 0-.873.312-1.587.823-2.146-.082-.202-.357-1.015.078-2.117 0 0 .672-.215 2.2.82a7.66 7.66 0 0 1 2.003-.27 7.7 7.7 0 0 1 2.003.27c1.527-1.035 2.198-.82 2.198-.82.436 1.102.162 1.915.08 2.117.512.559.822 1.273.822 2.146 0 3.072-1.87 3.748-3.653 3.946.287.247.543.735.543 1.481 0 1.07-.01 1.933-.01 2.195 0 .213.144.463.55.385A8 8 0 0 0 7.998 0Z"
  ] },
  search:      { fill: "currentColor", paths: [
    "M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 1 1-1.06 1.06l-3.04-3.04ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"
  ] },
  // Generic file icon (folded corner)
  file:        { fill: "currentColor", paths: [
    "M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Z"
  ] },
  check:       { fill: "currentColor", paths: [
    "M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
  ] },
};

export function iconHtml(name: keyof typeof icons, size = 14, color?: string): string {
  const i = icons[name];
  if (!i) return "";
  const v = i.v ?? "0 0 16 16";
  const fill = i.fill ?? "none";
  const stroke = i.stroke ?? "none";
  const sw = i.strokeWidth ?? 1.2;
  const colorAttr = color ? ` color="${color}"` : "";
  const inner = (i.shapes ?? "") + i.paths.map((d) => `<path d="${d}"/>`).join("");
  return `<svg width="${size}" height="${size}" viewBox="${v}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${colorAttr} aria-hidden="true">${inner}</svg>`;
}
