import { writable } from "svelte/store";
import { stories } from "../data/timeline.ts";

export const activeSeasonNr = writable<number>(-1);

export const setActiveSeason = (event: any) => {
  const target = event.target as HTMLDivElement;
  const arrowContainer =
    target.localName === "div"
      ? target
      : (target.parentElement as HTMLDivElement);
  const [p, img] = arrowContainer.children;
  const arrow = img as HTMLImageElement;
  let sznNr: number = 0;
  activeSeasonNr.subscribe((number) => sznNr = number);
  resetArrows();
  if (sznNr == Number(arrowContainer.dataset.season)) {
    activeSeasonNr.set(-1);
    return;
  }
  activeSeasonNr.set(Number(arrowContainer.dataset.season));
  arrow.src = "/arrow-active.png";
};

const resetArrows = () => {
  const arrows = document.querySelectorAll(".arrow");
  Array.from(arrows).map((arrow: Node) => {
    const image = arrow as HTMLImageElement;
    image.src = "/arrow-inactive.png";
  });
};

export const setSeasonPadding = (season: number) => {
  let padding: number = 0;
  let sectionOffset: number = 0;
  const episodesAmount = stories.find((section) => section.season === season)
    ?.episodes.length;
  switch (season) {
    case 0: {
      sectionOffset = 31;
      break;
    }
  }
  if (episodesAmount) padding = (sectionOffset - episodesAmount * 2) * 10 - 5;
  return padding;
};