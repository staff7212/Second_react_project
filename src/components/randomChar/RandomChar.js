import { Component } from 'react'
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage'

import './randomChar.scss';
//import thor from '../../resources/img/thor.jpeg';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {

  state = {
    char: {},
    loading: true,
    error: false,
  }

  marvelService = new MarvelService();

  componentDidMount() {
    //console.log('mount');
    this.updateChar();
  }

  // componentDidUpdate() {
  //   console.log('update');
  // }

  onCharLoaded = (char) => {
    this.setState({
      char, 
      loading: false
    });
  }

  onError = (err) => {
    console.log(err);
    this.setState({
      loading: false,
      error: true
    });
  }

  updateChar = () => {
    this.setState({loading: true, error: false});
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000)
    this.marvelService
      .getCharacter(id)
      .then(this.onCharLoaded)
      .catch(this.onError)
  }

  render() {
    //console.log('render');
    const {char, loading, error} = this.state;

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? <View char={char}/> : null

    return (
      <div className="randomchar">
        {errorMessage}
        {spinner}
        {content}
        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!<br/>
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">
              Or choose another one
          </p>
          <button onClick={this.updateChar} className="button button__main">
            <div className="inner">try it</div>
          </button>
          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
        </div>
      </div>
    )
  }
}

const View = ({char}) => {
  const {name, description, thumbnail, homepage, wiki} = char;

  //const objectFit = thumbnail.includes('image_not_available') ? 'contain' : 'cover'

  return (
    <div className="randomchar__block">
      <img src={thumbnail} style={{objectFit: `${thumbnail.includes('image_not_available') ? 'contain' : 'cover'}`}} alt="Random character" className="randomchar__img"/>
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">
          {description}
        </p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  )
};

export default RandomChar;