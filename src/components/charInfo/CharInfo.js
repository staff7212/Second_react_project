import {useState, useEffect} from 'react'
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage'
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = (props) => {

  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const marvelService = new MarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId])

  const updateChar = () => {
    const {charId} = props;
    if (!charId) return;

    setLoading(true)
    setError(false);

    marvelService
      .getCharacter(charId)
      .then(onCharLoaded)
      .catch(onError)
  }

  const onCharLoaded = (char) => {
    setChar(char) 
    setLoading(false)
  }

  const onError = (err) => {
    console.log(err);

    setLoading(false)
    setError(true);
  };

  const skeleton = !(loading || error || char) ? <Skeleton/> : null;
  const spinner = loading ? <Spinner/> : null;
  const errorMessage = error ? <ErrorMessage/> : null;
  const content = !(loading || error || !char) ? <View char={char}/> : null;

  return (
    <div className="char__info">
      {skeleton}
      {spinner}
      {errorMessage}
      {content}
    </div>
  )

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
        {comics.length === 0 ? 'There are no comics with this character yet.' : null}
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

CharInfo.propTypes = {
  charId: PropTypes.number,
}

export default CharInfo;