import { useState } from 'react';
import { Formik, Field, Form, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from "yup";
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './searchPanel.scss';

const SearchPanel = () => {

  const [char, setChar] = useState(null);
  const {loading, error, getCharacterByName, clearError} = useMarvelService();

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const updateChar = (charName) => {
    clearError();

    getCharacterByName(charName)
      .then(onCharLoaded);
  };

  const errorMessage = error ? <div className="char__search-critical-error"><ErrorMessage/></div> : null;
  const result = !char ? null : char.length > 0 ? 
            <div className='search__panel-wrapper'>
              <div className="search__panel-success">There is! Visit {char[0].name} page?</div>
              <Link to={`character/${char[0].id}`} className="button button__secondary">
                <div className="inner">to page</div>
              </Link>
            </div> :
            <div className="search__panel-error">
              The character was not found. Check the name and try again
            </div>;

  return (
    <div className='search__panel'>

      <Formik
        initialValues = {{
          charName: '',
        }}

        validationSchema = {Yup.object({
          charName: Yup.string().required('This field is required')
        })}

        onSubmit = {({charName}) => updateChar(charName)}
      >

        <Form>
          <label className='search__panel-label'>Or find a character by name:</label>
          <div className='search__panel-wrapper'>
          <Field id='charName' name='charName' type='text' placeholder='Enter name'/>
          <button type='submit' className="button button__main" disabled={loading}>
            <div className="inner">find</div>
          </button>
          </div>
          <FormikErrorMessage className='search__panel-error' component='div' name='charName'/>
        </Form>
      </Formik>
      {errorMessage}
      {result}
    </div>
  )
};

export default SearchPanel;

