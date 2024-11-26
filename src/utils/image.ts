const getImage = (name: string): string => {
  return `/src/data/pictures/${name.replace(/[^a-zA-Z0-9]/g, "")}.avif`
}

export default getImage;