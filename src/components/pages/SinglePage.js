import { useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import AppBanner from '../appBanner/AppBanner';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const SinglePage = ({Component, dataType}) => {

  const [data, setData] = useState(null);
  const {loading, error, getCharacter, getComic, clearError} = useMarvelService();
  const {id} = useParams();
  console.log(useParams());

  useEffect(() => {
    updateData();
  }, [id])

  const updateData = () => {
    clearError();

    // eslint-disable-next-line default-case
    switch (dataType) {
      case 'comic':
        getComic(id)
          .then(onDataLoaded)
        break;
      case 'character':
        getCharacter(id)
          .then(onDataLoaded)
        break;
    }
  }

  const onDataLoaded = (data) => {
    setData(data);
  }

  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading ? <Spinner/> : null;
  const content = !(loading || error || !data) ? <Component data={data}/> : null;

  return (
    <>
      <AppBanner/>
      {errorMessage}
      {spinner}
      {content}
    </>
  )
}

export default SinglePage;