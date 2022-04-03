import { useState, useEffect} from 'react'

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

import './comicsList.scss';

const ComicsList = () => {

  const [comics, setComics] = useState([]);
  const [offset, setOffset] = useState(228);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [comicsEnded, setComicsEnded] = useState(false);

  const {loading, error, getAllComics, clearError}  = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, [])

  const onRequest = (offset, initial) => {
    clearError();

    initial ? setNewItemLoading(false) : setNewItemLoading(true)

    getAllComics(offset)
    .then(onComicsLoaded);
  }

  const onComicsLoaded = (newComics) => {
    let ended = false;
    if (newComics.length < 8) {
      ended = true;
    }

    setComics(comics => [...comics, ...newComics]);
    setNewItemLoading(false);
    setOffset(offset => offset + 8);
    setComicsEnded(ended);
  }

  const transforArrayCommics = (allComics) => {
    const comics = allComics.map(({id, title, thumbnail, price}, index) => {
      return (
        <li key={index} className="comics__item">
          <a href="#">
            <img src={thumbnail} alt={`comics ${title}`} className="comics__item-img"/>
            <div className="comics__item-name">{title}</div>
            <div className="comics__item-price">{`${price}$`}</div>
          </a>
        </li>
      )
    })
    return comics;
  };

  const items = transforArrayCommics(comics);
  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading && !newItemLoading ? <Spinner/> : null;
  const content = error ? null : items

  return (
    <div className="comics__list">
      {errorMessage}
      {spinner}
      <ul className="comics__grid">
        {content}
      </ul>
      <button 
      onClick={onRequest} 
      disabled={newItemLoading}
      style={{display: comicsEnded ? 'none' : 'block'}} 
      className="button button__main button__long">
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

export default ComicsList;