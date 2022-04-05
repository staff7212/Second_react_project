import { useState, useEffect} from 'react';
import {useParams, Link} from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';


import './singleComicPage.scss';

const SingleComicPage = () => {

  const [comic, setComic] = useState(null);
  const {loading, error, getComic, clearError} = useMarvelService();
  const {id} = useParams();

  useEffect(() => {
    updateComic();
  }, [id])

  const updateComic = () => {
    clearError();

    getComic(id)
    .then(onComicsLoaded)
  }

  const onComicsLoaded = (comic) => {
    setComic(comic);
  }

  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading ? <Spinner/> : null;
  const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

  return (
    <>
      {errorMessage}
      {spinner}
      {content}
    </>
  )
}

const View = ({comic}) => {
  const {title, price, thumbnail, pageCount, description, language} = comic;

  return (
    <div className="single-comic">
      <img src={thumbnail} alt={`comics ${title}`} className="single-comic__img"/>
      <div className="single-comic__info">
        <h2 className="single-comic__name">{title}</h2>
        <p className="single-comic__descr">{description}</p>
        <p className="single-comic__descr">{`${pageCount} pages`}</p>
        <p className="single-comic__descr">{`Language: ${language}`}</p>
        <div className="single-comic__price">{price}</div>
      </div>
      <Link to='/comics' className="single-comic__back">Back to all</Link>
    </div>
  )
}

export default SingleComicPage;