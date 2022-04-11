import {useState, useEffect} from 'react'
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {

  const [char, setChar] = useState(null);

  const {process, setProcess, getCharacter, clearError} = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [props.charId])

  const updateChar = () => {
    clearError();
    const {charId} = props;
    if (!charId) return;


    getCharacter(charId)
      .then(onCharLoaded)
      .then(() => setProcess('confirmed'));
  }

  const onCharLoaded = (char) => {
    setChar(char) 
  }

  return (
    <div className="char__info">
      {setContent(process, View, char)}
    </div>
  )
}

const View = ({data}) => {
  const {name, description, thumbnail, homepage, wiki, comics} = data;

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