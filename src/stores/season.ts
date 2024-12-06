import { writable } from "svelte/store";
import { stories } from "../data/timeline.ts";

export const activeSeasonNr = writable<number>(0);

export const setActiveSeason = (event: any) => {
  const target = event.target as HTMLDivElement;
  const arrowContainer =
    target.localName === "div"
      ? target
      : (target.parentElement as HTMLDivElement);
  let sznNr: number = 0;
  activeSeasonNr.subscribe((number) => sznNr = number);
  if (sznNr == Number(arrowContainer.dataset.season)) {
    activeSeasonNr.set(-1);
    return;
  }
  activeSeasonNr.set(Number(arrowContainer.dataset.season));
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
    case 1: {
      sectionOffset = 35;
      break;
    }
  }
  if (episodesAmount) padding = (sectionOffset - episodesAmount * 2) * 10 - 5;
  return padding;
};

export const getSeasonName = (season: number, epochOnly: boolean = false) => {
  const epoch = stories.find((section) => section.season === season)?.epoch;
  if (epochOnly) return epoch;
  else {
    const title = stories.find((section) => section.season === season)?.title;
    return epoch + ': ' + title;
  } 
}