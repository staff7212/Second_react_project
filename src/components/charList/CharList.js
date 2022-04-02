import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types';


import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

import './charList.scss';

const CharList = (props) => {

  const [chars, setChars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(228);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    onRequest();
  }, [])
  
  const onRequest = (offset) => {
    onCharListLoading();

    marvelService
    .getAllCharacters(offset)
    .then(onCharLoaded)
    .catch(onError);
  };

  const onCharListLoading = () => {
    setError(false);
    setNewItemLoading(true);
  };
  
  const onCharLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 9) {
      ended = true;
    }

    setChars(chars => [...chars, ...newChars]);
    setLoading(false);
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setCharEnded(ended);
  };

  const onError = (e) => {
    console.log(e);
    setLoading(false);
    setError(true);
  }

  const itemRefs = useRef([]);

  const focusItem = (id) => {
    itemRefs.current.forEach(item => {
      item.classList.remove('char__item_selected')
    })
    itemRefs.current[id].classList.add('char__item_selected')
    itemRefs.current[id].focus();
  }

  const setFocus = () => {
    itemRefs.current[itemRefs.current.length - 1].focus();
  }
  
  const tranformArrayChars = (arrChars) => {
    const chars = arrChars.map(( {name, thumbnail, id}, index ) => {
      const imgStyle = {objectFit: `${thumbnail.includes('image_not_available') || thumbnail.includes('4c002e0305708') ? 'unset' : 'cover'}`};
      
      //const active = this.props.activeId === id;
      //const clazz = active ? 'char__item_selected' : '';

      //className={`char__item ${clazz}`}>

      return (
        <li 
        onClick={() => {
          props.getId(id)
          focusItem(index)
        }} 
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            props.getId(id)
            focusItem(index)
          }
        }}
        key={id}
        ref={el => itemRefs.current[index] = el}
        tabIndex={'0'}
        className={`char__item`}>
          <img src={thumbnail} style={imgStyle} alt={`character ${name}`}/>
          <div className="char__name">{name}</div>
        </li>
      );
    });
    return chars;
  }
 
  const items = tranformArrayChars(chars)
  const errorMessage = error ? <ErrorMessage/> : null;
  const spinner = loading ? <Spinner/> : null;
  const content = !(loading || error) ? items : null

  return (
    <div className="char__list">
      {errorMessage}
      {spinner}
      <ul className="char__grid">
      {content}
      </ul>
      <button 
        className="button button__main button__long"
        disabled={newItemLoading}
        style={{display: charEnded ? 'none' : 'block'}}
        onClick={() => {
          onRequest(offset);
          setFocus();
        }}>
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

CharList.propTypes = {
  getId: PropTypes.func.isRequired,
}

export default CharList;