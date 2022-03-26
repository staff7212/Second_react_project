import { Component } from 'react'
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: false,
  }

  marvelService = new MarvelService();

  componentDidMount() {
    console.log('mount');
    this.updateChar();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('update');
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
      console.log('update22');
    }
  }

  updateChar = () => {
    const {charId} = this.props;
    if (!charId) return;

    this.setState({loading: true, error: false});

    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError)
  }

  onCharLoaded = (char) => {
    this.setState({
      char, 
      loading: false,
    });
  }

  onError = (err) => {
    console.log(err);
    this.setState({
      loading: false,
      error: true
    });
  }

  render() {
    console.log('render');
    const {char, loading, error} = this.state;

    const skeleton = !(loading || error || char) ? <Skeleton/> : null;
    const spinner = loading ? <Spinner/> : null;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    console.log(char);

    return (
      <div className="char__info">
        {skeleton}
        {spinner}
        {errorMessage}
        {content}
      </div>
    )
  }
}

const View = ({char}) => {
  const {name, description, thumbnail, homepage, wiki, comics} = char

  const imgStyle = {objectFit: `${thumbnail.includes('image_not_available') || thumbnail.includes('4c002e0305708') ? 'unset' : 'cover'}`};

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} style={imgStyle} alt="abyss"/>
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {
          comics.map((item, index) => {
            return (
              <li key={index} className="char__comics-item">
                <a href={item.resourceURI}>
                  {item.name}
                </a>
              </li>
            )
          })
        }


      </ul>
    </>
  )
}

export default CharInfo;