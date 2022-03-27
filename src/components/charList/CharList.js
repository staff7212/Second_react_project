import { Component } from 'react'
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'

import './charList.scss';
//import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
  
  state = {
    chars: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 1540,
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
  
  tranformArrayChars = (arrChars) => {
    const chars = arrChars.map(( {name, thumbnail, id} ) => {
      const imgStyle = {objectFit: `${thumbnail.includes('image_not_available') || thumbnail.includes('4c002e0305708') ? 'unset' : 'cover'}`};
      
      const active = this.props.activeId === id;
      const clazz = active ? 'char__item_selected' : '';

      return (
        <li onClick={() => this.props.getId(id)} key={id} className={`char__item ${clazz}`}>
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
          onClick={() => this.onRequest(offset)}>
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

export default CharList;

/*
class CharList extends Component {

  state = {
    chars: [],
    loading: true,
    error: false
  };
  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChars();
  }

  updateChars = () => {
    this.setState({loading: true, error: false});
    this.marvelService
      .getAllCharacters()
      .then(this.tranformArrayChars)
      .catch(this.onError)
  } 

  tranformArrayChars = (arrChars) => {
    const chars = arrChars.map(({name, thumbnail, id}) => ({name, thumbnail, id}))
    this.onCharLoaded(chars)
  }

  onError = (e) => {
    console.log(e);
    this.setState({
      loading: false,
      error: true
    });
  }

  onCharLoaded = (chars) => {
    this.setState({
      chars,
      loading: false,
    })
  }

  render() {
    const {chars, loading, error} = this.state;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View chars={chars}/> : null

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        <ul className="char__grid">
        {content}
        </ul>
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    )
  }
}

const View = ({chars}) => {
  return chars.map(( {name, thumbnail, id} )=> {
    const imgStyle = {objectFit: `${thumbnail.includes('image_not_available') ? 'unset' : 'cover'}`};
    return (
      <li key={id} className="char__item">
        <img src={thumbnail} style={imgStyle} alt={`character ${name}`}/>
        <div className="char__name">{name}</div>
      </li>
    )
  })
};

export default CharList;
*/