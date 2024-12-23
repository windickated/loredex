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
  if (sznNr.toString() == arrowContainer.dataset.season) {
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
    case 2: {
      sectionOffset = 39;
      break;
    }
    case 99: {
      sectionOffset = 0;
      break;
    }
  }
  if (episodesAmount) padding = (sectionOffset - episodesAmount * 2) * 10 - 2.5;
  return padding > 0 ? padding : -2.5;
};

export const getSeasonName = (season: number, epochOnly: boolean = false) => {
  if (season === 99) return 'CoNexus Events';
  const epoch = stories.find((section) => section.season === season)?.epoch;
  if (epochOnly) return epoch;
  else {
    const title = stories.find((section) => section.season === season)?.title;
    return epoch + ': ' + title;
  } 
}