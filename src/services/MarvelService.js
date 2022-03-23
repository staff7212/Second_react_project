
class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=a98ec362bdd90ae8d5d093393fe03dd8'

  getResource = async (url) => {
    const res = await fetch(url);
  
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${res.status}`)
    }
  
    return await res.json();
  };

  // валидация описания, можно и через тернарный, но ... подставляется всегда
  validDescription = (desc) => {
    if (desc.length === 0) {
      return "There is no description for this person. We apologize to you. Go to Wiki."
    }
    if (desc.length >= 210) {
      return `${desc.substring(0, 210)}...`
    }
    return desc
  }

  getAllCharacters = async () => {
    const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=228&${this._apiKey}`);
    return res.data.results.map(this._transformCharacter)
  }

  getCharacter = async (id) => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    return this._transformCharacter(res.data.results[0]);
  }

  _transformCharacter = (char) => {
    return {
      name: char.name,
      //description: char.description ? `${char.description.substring(0, 200)}...` : "There is no description for this person",
      description: this.validDescription(char.description),
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
    };
  }
}


export default MarvelService;