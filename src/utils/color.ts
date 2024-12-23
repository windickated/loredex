import characters from "../data/characters.ts";

const setColor = (state: string, opacity: number = 1): string => {
  const color = state === "good"
  ? `rgba(0, 185, 55, ${opacity})`
  : state === "evil"
    ? `rgba(255, 60, 64, ${opacity})`
    : `rgba(150, 150, 150, ${opacity})`;
  return color;
}

export const getColor = (name: string, opacity: number = 1): string => {
  let color = setColor("neutral");
  characters.map((character) => {
    if (name === character.name) color = setColor(character.state, opacity);
  })
  return color;
}

export default setColor;