import characters from "../data/characters.ts";

const getImage = (name: string): string => {
  let image = '/blank.avif';
  characters.map((character) => {
    if (name === character.name) image = character.picture;
  })
  return image;
}

export default getImage;