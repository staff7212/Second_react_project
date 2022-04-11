import useHttp from "../hooks/http.hook";

const useMarvelService = () => {
  const {request, clearError, process, setProcess} = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=a98ec362bdd90ae8d5d093393fe03dd8';
  const _baseOffset = 228;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter)
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      //description: char.description,
      //description: char.description ? `${char.description.substring(0, 200)}...` : "There is no description for this person",
      description: _validDescription(char.description),
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: _validComics(char.comics.items),
    };
  };

  // валидация описания, можно и через тернарный, но '...' подставляется всегда
  // можно через CSS к блоку с описанием
  // display: -webkit-box;
  // -webkit-box-orient: vertical;
  // -webkit-line-clamp: 5;
  // overflow: hidden;
  // height: 90px;

  const _validDescription = (desc) => {
    if (desc.length === 0) {
      return "Description not available at the moment. We apologize to you. Go to Wiki."
    }
    if (desc.length >= 210) {
      return `${desc.substring(0, 210)}...`
    }
    return desc
  };

  const _validComics = (comics) => {
    if (comics.length === 0) {
      return [];
    }
    if (comics.length > 10) {
      return comics.slice(0, 10);
    }
    return comics;
  };

  const getAllComics = async (offset = _baseOffset) => {
    const res = await request(`${_apiBase}comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformComics);
  };

  const getComic = async (id) => {
    const res = await request(`${_apiBase}comics/${+id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  };

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      price: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available',
      thumbnail: `${comics.thumbnail.path}.${comics.thumbnail.extension}`,
      pageCount: comics.pageCount || 'No information about the number of pages',
      description: comics.description || 'There is no description.',
      language: comics.textObjects[0]?.language || 'en-us',
    }
  }

  const getCharacterByName = async (nameChar) => {
    const res = await request(`${_apiBase}characters?name=${nameChar}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  }

  return {
    process, 
    setProcess, 
    clearError, 
    getCharacter, 
    getAllCharacters, 
    getAllComics, 
    getComic, 
    getCharacterByName}
}

export default useMarvelService;