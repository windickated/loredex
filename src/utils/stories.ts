import characters from "../data/characters.ts";

const getCharacterStories = (name: string) => {
  let stories: any = [];
  let flatStories: string[] = [];
  characters.map((character) => {
    if (name === character.name) stories = character.stories;
  })
  if (!stories) return null;

  // console.log(stories)
  stories.map((section: any) => {
    section.episodes.map((episode: number) => {
      // console.log(section.season + ',' + episode)
      flatStories.push(section.season + ',' + episode);
    })
  })
  // console.log(flatStories)
  return flatStories;
}

export default getCharacterStories;