// Kahoot-style answer styling: 4 colored shapes.
export interface ChoiceStyle {
  bg: string; // base background
  ring: string; // focus/selected ring color
  shape: string; // glyph shown next to the answer
}

export const CHOICE_STYLES: ChoiceStyle[] = [
  { bg: "bg-red-600 hover:bg-red-500", ring: "ring-red-300", shape: "▲" },
  { bg: "bg-blue-600 hover:bg-blue-500", ring: "ring-blue-300", shape: "◆" },
  { bg: "bg-amber-500 hover:bg-amber-400", ring: "ring-amber-200", shape: "●" },
  { bg: "bg-green-600 hover:bg-green-500", ring: "ring-green-300", shape: "■" },
];

export const LETTERS = ["A", "B", "C", "D"];
