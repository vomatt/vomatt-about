/**
 * The brand mark, the ballot box, as vomatt-web draws its first-load loader (`markLoaderSvg` in
 * vomatt-web's src/lib/brand/mark.ts). Only the loader's parts are copied, so check them when
 * that file changes. A cube seen at 30° on a 120-unit grid, the ballot slot cut into its lid.
 */

/** The box: 97 × 112 at x 11.5..108.5, y 4..116. */
const MARK_BOX =
	'M11.5 36.04 A7 7 0 0 1 15 29.98 L56.5 6.02 A7 7 0 0 1 63.5 6.02 L105 29.98 A7 7 0 0 1 108.5 36.04 L108.5 83.96 A7 7 0 0 1 105 90.02 L63.5 113.98 A7 7 0 0 1 56.5 113.98 L15 90.02 A7 7 0 0 1 11.5 83.96 Z';

/** The slot: 40 × 14 on the lid's centre, rising 30° to the right, ends r3, 7 from the box edge. */
const MARK_SLOT =
	'M69.76 19.37 A3 3 0 0 1 72.76 19.37 L78.88 22.9 A3 3 0 0 1 78.88 28.1 L50.24 44.63 A3 3 0 0 1 47.24 44.63 L41.12 41.1 A3 3 0 0 1 41.12 35.9 Z';

const MARK_PATH = `${MARK_BOX} ${MARK_SLOT}`;
const MARK_CENTER = 60;
const MARK_SQUARE_SIZE = 112;
/** `foreground` in the app's light theme. */
const MARK_INK = '#14213a';
/** `foreground` in the app's dark theme. */
const MARK_PAPER = '#f0f2f6';
/** The lid's far shade, also the edge of the paper ballot. */
const LID_SHADE = '#c9cdd4';

type Point = [number, number];

/** The cube's three faces: the lid, then the left and right sides. */
const LID: Point[] = [
	[60, 4],
	[108.5, 32],
	[60, 60],
	[11.5, 32],
];
const LEFT_FACE: Point[] = [
	[11.5, 32],
	[60, 60],
	[60, 116],
	[11.5, 88],
];
const RIGHT_FACE: Point[] = [
	[108.5, 32],
	[108.5, 88],
	[60, 116],
	[60, 60],
];
/** Each face's corners are rounded by this, so no seam ends in a sharp notch against the box's r7. */
const FACE_RADIUS = 5.5;

const n = (value: number) => String(Number(value.toFixed(2)));

/** A polygon as a path with its corners rounded to `radius` (a quadratic per corner). */
function roundedPolygon(points: Point[], radius: number): string {
	const corners = points.map(([x, y], i) => {
		const [ax, ay] = points[(i + points.length - 1) % points.length];
		const [bx, by] = points[(i + 1) % points.length];
		const la = Math.hypot(ax - x, ay - y);
		const lb = Math.hypot(bx - x, by - y);
		const [uax, uay] = [(ax - x) / la, (ay - y) / la];
		const [ubx, uby] = [(bx - x) / lb, (by - y) / lb];
		const angle = Math.acos(uax * ubx + uay * uby);
		const d = radius / Math.tan(angle / 2);
		const to = `${n(x + ubx * d)} ${n(y + uby * d)}`;
		return { from: `${n(x + uax * d)} ${n(y + uay * d)}`, to, corner: `Q${n(x)} ${n(y)} ${to}` };
	});
	const first = corners[0];
	const rest = corners
		.slice(1)
		.concat(first)
		.map((c) => `L${c.from} ${c.corner}`)
		.join(' ');
	return `M${first.to} ${rest} Z`;
}

/**
 * The glossy silver mark, its ids prefixed with `p`: three rounded faces over a base tone, a
 * line of light on each seam, a lid highlight and a lit rim; the slot stays a hole.
 */
function glossMark(p: string) {
	const lid = roundedPolygon(LID, FACE_RADIUS);
	const left = roundedPolygon(LEFT_FACE, FACE_RADIUS);
	const right = roundedPolygon(RIGHT_FACE, FACE_RADIUS);
	const stops = (...list: [string, string, number?][]) =>
		list
			.map(([offset, color, opacity]) => `<stop offset="${offset}" stop-color="${color}"${opacity === undefined ? '' : ` stop-opacity="${opacity}"`}/>`)
			.join('');
	const defs =
		`<mask id="${p}m"><path fill="#ffffff" fill-rule="evenodd" d="${MARK_PATH}"/></mask>` +
		`<mask id="${p}s"><path fill="#ffffff" d="${MARK_SLOT}"/></mask>` +
		`<clipPath id="${p}c"><path d="${lid}"/></clipPath>` +
		`<linearGradient id="${p}b" x2="0" y2="1">${stops(['0', '#e3e6ea'], ['1', '#555a63'])}</linearGradient>` +
		`<linearGradient id="${p}t" x2="1" y2="1">${stops(['0', '#ffffff'], ['1', LID_SHADE])}</linearGradient>` +
		`<linearGradient id="${p}l" x2="0" y2="1">${stops(['0', '#c8ccd3'], ['1', '#7a7f88'])}</linearGradient>` +
		`<linearGradient id="${p}r" x2="0" y2="1">${stops(['0', '#7b8089'], ['1', '#33383f'])}</linearGradient>` +
		`<linearGradient id="${p}v" x2="0" y2="1">${stops(['0', '#ffffff', 0.2], ['0.55', '#ffffff', 0], ['0.55', '#000000', 0], ['1', '#000000', 0.22])}</linearGradient>` +
		`<linearGradient id="${p}e" x2="1" y2="1">${stops(['0', '#ffffff', 0.95], ['0.6', '#ffffff', 0.12], ['1', '#ffffff', 0])}</linearGradient>` +
		`<radialGradient id="${p}p">${stops(['0', '#ffffff', 0.75], ['1', '#ffffff', 0])}</radialGradient>` +
		`<linearGradient id="${p}h" gradientUnits="userSpaceOnUse" x1="56.5" y1="25.94" x2="63.5" y2="38.06">${stops(['0', '#000000', 0.6], ['0.5', '#000000', 0], ['0.78', '#ffffff', 0], ['1', '#ffffff', 0.6])}</linearGradient>` +
		`<filter id="${p}g"><feGaussianBlur stdDeviation="0.9"/></filter>` +
		`<filter id="${p}d" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000000" flood-opacity="0.6"/></filter>`;
	const box =
		`<g mask="url(#${p}m)">` +
		`<path fill="url(#${p}b)" d="${MARK_BOX}"/>` +
		`<path fill="url(#${p}t)" d="${lid}"/><path fill="url(#${p}l)" d="${left}"/><path fill="url(#${p}r)" d="${right}"/>` +
		`<path fill="none" stroke="#ffffff" stroke-opacity="0.45" stroke-width="1.6" stroke-linecap="round" filter="url(#${p}g)" d="M11.5 32L60 60L108.5 32M60 60V116"/>` +
		`<path fill="url(#${p}v)" d="${MARK_BOX}"/>` +
		`<g clip-path="url(#${p}c)"><ellipse cx="40" cy="22" rx="22" ry="7" transform="rotate(-30 40 22)" fill="url(#${p}p)"/></g>` +
		`<path fill="none" stroke="url(#${p}e)" stroke-width="2" d="${MARK_BOX}"/>` +
		`</g>` +
		`<rect x="36" y="16" width="48" height="32" fill="url(#${p}h)" mask="url(#${p}s)"/>`;
	return { defs, box };
}

/** The slot's centre line runs through the lid's centre, rising 30° to the right. */
const SLOT_CENTRE: Point = [(LID[0][0] + LID[2][0]) / 2, (LID[0][1] + LID[2][1]) / 2];
const SLOT_RISE = Math.PI / 6;
/** The ballot card: narrower than the slot's 40 so it clears the rounded ends. */
const BALLOT_WIDTH = 28;
const BALLOT_HEIGHT = 34;

/** The ballot standing in the slot, and the half-plane above the slot's centre line it is clipped to. */
function ballotGeometry() {
	const [cx, cy] = SLOT_CENTRE;
	const [ux, uy] = [Math.cos(SLOT_RISE), -Math.sin(SLOT_RISE)];
	const half = BALLOT_WIDTH / 2;
	const [lx, ly, rx, ry] = [cx - ux * half, cy - uy * half, cx + ux * half, cy + uy * half];
	const card = `M${n(lx)} ${n(ly)} L${n(rx)} ${n(ry)} L${n(rx)} ${n(ry - BALLOT_HEIGHT)} L${n(lx)} ${n(ly - BALLOT_HEIGHT)} Z`;
	// Past the tile (about -37..157) on every side, so only the slot's line cuts the card
	const lineY = (x: number) => cy + (uy / ux) * (x - cx);
	const aboveSlot = `-40 -40 160 -40 160 ${n(lineY(160))} -40 ${n(lineY(-40))}`;
	return { card, aboveSlot };
}

/** The glossy mark at 58% on a rounded ink tile, like the app's home screen icon. */
const TILE = { scale: 0.58, radius: 0.22 };

/**
 * The glossy mark on its tile with a paper ballot standing in the slot (`.mark-ballot`, which
 * `animate-ballot-drop-once` in global.css drops), clipped above the slot so it vanishes inside.
 * `idPrefix` keeps each inline copy's ids its own.
 */
export function markLoaderSvg(idPrefix: string): string {
	const p = idPrefix;
	const side = MARK_SQUARE_SIZE / TILE.scale;
	const origin = n(MARK_CENTER - side / 2);
	const { defs, box } = glossMark(p);
	const { card, aboveSlot } = ballotGeometry();
	return (
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${origin} ${origin} ${n(side)} ${n(side)}">` +
		`<defs>${defs}<clipPath id="${p}k"><polygon points="${aboveSlot}"/></clipPath></defs>` +
		`<rect fill="${MARK_INK}" x="${origin}" y="${origin}" width="${n(side)}" height="${n(side)}" rx="${n(side * TILE.radius)}"/>` +
		`<g filter="url(#${p}d)">${box}` +
		`<g clip-path="url(#${p}k)"><path class="mark-ballot" fill="${MARK_PAPER}" stroke="${LID_SHADE}" stroke-width="1" d="${card}"/></g>` +
		`</g></svg>`
	);
}
