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
    error: false
  };
  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChars();
  }

  updateChars = () => {
    this.marvelService
      .getAllCharacters()
      .then(this.tranformArrayChars)
      .catch(this.onError)
  } 

  tranformArrayChars = (arrChars) => {
    const chars = arrChars.map(( {name, thumbnail}, index) => {
      return (
        <li key={index} className="char__item char__item">
          <img src={thumbnail} style={{objectFit: `${thumbnail.includes('image_not_available') ? 'contain' : 'cover'}`}} alt={`character ${index + 1}`}/>
          <div className="char__name">{name}</div>
        </li>
      );
    });
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
    const content = !(loading || error) ? chars : null

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

export default CharList;

/*
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
    const chars = arrChars.map(({name, thumbnail}, index) => ({name, thumbnail, index}))
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
  return chars.map(( {name, thumbnail}, index) => {
    return (
      <li key={index} className="char__item char__item">
        <img src={thumbnail} style={{objectFit: `${thumbnail.includes('image_not_available') ? 'contain' : 'cover'}`}} alt={`character ${index + 1}`}/>
        <div className="char__name">{name}</div>
      </li>
    )
  })
};

export default CharList;
*/ 