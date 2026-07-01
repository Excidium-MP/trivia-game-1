// Answer-tile palette — 4 distinct shapes, retinted to the Aries brand.
export interface ChoiceStyle {
  bg: string; // base background (hex)
  shape: string; // glyph shown next to the answer
}

export const CHOICE_STYLES: ChoiceStyle[] = [
  { bg: "#BF1B76", shape: "▲" }, // A · magenta
  { bg: "#29348F", shape: "◆" }, // B · brand blue
  { bg: "#E0940F", shape: "●" }, // C · amber
  { bg: "#12967A", shape: "■" }, // D · teal
];

export const LETTERS = ["A", "B", "C", "D"];
