class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=a98ec362bdd90ae8d5d093393fe03dd8';
  _baseOffset = 228;


  getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status ${res.status}`)
    }

    return await res.json();
  };

  // валидация описания, можно и через тернарный, но ... подставляется всегда
  // можно через CSS
  // display: -webkit-box;
  // -webkit-box-orient: vertical;
  // -webkit-line-clamp: 5;
  // overflow: hidden;
  // height: 90px;
  validDescription = (desc) => {
    if (desc.length === 0) {
      return "There is no description for this person. We apologize to you. Go to Wiki."
    }
    if (desc.length >= 210) {
      return `${desc.substring(0, 210)}...`
    }
    return desc
  }

  validComics = (comics) => {
    if (comics.length === 0) {
      return [];
    }
    if (comics.length > 10) {
      return comics.slice(0, 10);
    }
    return comics;
  }

  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
    return res.data.results.map(this._transformCharacter)
  }

  getCharacter = async (id) => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    return this._transformCharacter(res.data.results[0]);
  }

  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      //description: char.description,
      //description: char.description ? `${char.description.substring(0, 200)}...` : "There is no description for this person",
      description: this.validDescription(char.description),
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: this.validComics(char.comics.items),
    };
  }
}


export default MarvelService;