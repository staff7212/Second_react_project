import React, { Component } from 'react'
import PropTypes from 'prop-types';


import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

import './charList.scss';

class CharList extends Component {
  
  state = {
    chars: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 228,
    charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }
  
  onRequest = (offset) => {
    this.onCharListLoading();

    this.marvelService
    .getAllCharacters(offset)
    .then(this.onCharLoaded)
    .catch(this.onError)
  }

  onCharListLoading = () => {
    this.setState({
      error: false,
      newItemLoading: true,
    })
  }
  
  onCharLoaded = (newChars) => {
    let ended = false;
    if (newChars.length < 9) {
      ended = true;
    }

    this.setState(({chars, offset}) => ({
      chars: [...chars, ...newChars],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended
    }))
  }

  onError = (e) => {
    console.log(e);
    this.setState({
      loading: false,
      error: true
    });
  }

  itemRefs = [];

  setRef = (ref) => {
    this.itemRefs.push(ref)
  }

  focusItem = (id) => {
    this.itemRefs.forEach(item => {
      item.classList.remove('char__item_selected')
    })
    this.itemRefs[id].classList.add('char__item_selected')
    this.itemRefs[id].focus();
  }

  setFocus = () => {
    this.itemRefs[this.itemRefs.length - 1].focus();
  }
  
  tranformArrayChars = (arrChars) => {
    const chars = arrChars.map(( {name, thumbnail, id}, index ) => {
      const imgStyle = {objectFit: `${thumbnail.includes('image_not_available') || thumbnail.includes('4c002e0305708') ? 'unset' : 'cover'}`};
      
      //const active = this.props.activeId === id;
      //const clazz = active ? 'char__item_selected' : '';

      //className={`char__item ${clazz}`}>

      return (
        <li 
        onClick={() => {
          this.props.getId(id)
          this.focusItem(index)
        }} 
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.props.getId(id)
            this.focusItem(index)
          }
        }}
        key={id}
        ref={this.setRef}
        tabIndex={'0'}
        className={`char__item`}>
          <img src={thumbnail} style={imgStyle} alt={`character ${name}`}/>
          <div className="char__name">{name}</div>
        </li>
      );
    });
    return chars;
  }

  render() {
    const {chars, loading, error, offset, newItemLoading, charEnded} = this.state;
    
    const items = this.tranformArrayChars(chars)
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
            this.onRequest(offset);
            this.setFocus();
          }}>
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

CharList.propTypes = {
  getId: PropTypes.func.isRequired,
}

export default CharList;