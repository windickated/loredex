import characters from "../data/characters.ts";
import { type CharacterStories } from "../lib/types.ts";

const getCharacterStories = (name: string) => {
  let stories: CharacterStories[] = [];
  let flatStories: string[] = [];
  characters.map((character) => {
    if (name === character.name) stories = character.stories!;
  })
  if (!stories) return null;
  stories.map((section: CharacterStories) => {
    section.episodes.map((episode: number) => {
      flatStories.push(section.season + ',' + episode);
    })
  })
  return flatStories;
}

export default getCharacterStories;