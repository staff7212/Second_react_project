import { useState, useEffect, useRef, useMemo } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';


import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const setContent = (process, Component, newItemLoading) => {
  switch (process) {
    case 'waiting':
      return <Spinner/>;
    case 'loading':
      return newItemLoading ? <Component/> : <Spinner/>;
    case 'confirmed':
      return <Component/>;
    case 'error':
      return <ErrorMessage/>
    default:
      throw new Error('Unexpented process state');
  }
};

const CharList = (props) => {

  const [chars, setChars] = useState([]);
  const [newItemLoading, setNewItemLoading] = useState(false);
  const [offset, setOffset] = useState(228);
  const [charEnded, setCharEnded] = useState(false);

  const {getAllCharacters, clearError, process, setProcess}  = useMarvelService();

  useEffect(() => {
    onRequest(offset, true);
  }, [])
  
  const onRequest = (offset, initial) => {
    clearError();
    initial ? setNewItemLoading(false) : setNewItemLoading(true)

    getAllCharacters(offset)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed'));
  };
  
  const onCharLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 9) {
      ended = true;
    }

    setChars(chars => [...chars, ...newChars]);
    setNewItemLoading(false);
    setOffset(offset => offset + 9);
    setCharEnded(ended);
  };

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
    return (
      <TransitionGroup component={'ul'} className="char__grid">
        {arrChars.map(( {name, thumbnail, id}, index ) => {
          const imgStyle = {objectFit: `${thumbnail?.includes('image_not_available') || thumbnail?.includes('4c002e0305708') ? 'unset' : 'cover'}`};
            
            //const active = this.props.activeId === id;
            //const clazz = active ? 'char__item_selected' : '';
      
            //className={`char__item ${clazz}`}>
      
          return (
            <CSSTransition
              timeout={Math.round(350 + Math.random() * 1000)} 
              key={id}
              classNames='char__item'>
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
                ref={el => itemRefs.current[index] = el}
                tabIndex={'0'}
                className='char__item'>
                  <img src={thumbnail} style={imgStyle} alt={`character ${name}`}/>
                  <div className="char__name">{name}</div>
              </li>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    )
  }

  const element = useMemo(() => {
    return setContent(process, () => tranformArrayChars(chars), newItemLoading)
  }, [process])

  return (
    <div className="char__list">
      {element}
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