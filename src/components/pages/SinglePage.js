import { useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import AppBanner from '../appBanner/AppBanner';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

const SinglePage = ({Component, dataType}) => {

  const [data, setData] = useState(null);
  const {getCharacter, getComic, clearError, process, setProcess} = useMarvelService();
  const {id} = useParams();

  useEffect(() => {
    updateData();
  }, [id])

  const updateData = () => {
    clearError();

    switch (dataType) {
      case 'comic':
        getComic(id)
          .then(onDataLoaded)
          .then(() => setProcess('confirmed'));
        break;
      case 'character':
        getCharacter(id)
          .then(onDataLoaded)
          .then(() => setProcess('confirmed'));
        break;
      default:
        throw new Error('Unexpented data type')
    }
  }

  const onDataLoaded = (data) => {
    setData(data);
  }

  return (
    <>
      <AppBanner/>
      <div style={{marginTop: '50px'}}>
        {setContent(process, Component, data)}
      </div>
    </>
  )
}

export default SinglePage;