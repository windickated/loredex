const setColor = (state: string): string => {
  const color = state === "good"
  ? "rgba(0, 185, 55, 0.75)"
  : state === "evil"
    ? "rgba(255, 60, 64, 0.75)"
    : "rgba(150, 150, 150, 0.75)";
  return color;
}

export default setColor;