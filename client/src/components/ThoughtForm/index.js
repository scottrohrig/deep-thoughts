import React, { useState } from 'react';

const ThoughtForm = () => {

  const [ thoughtText, setThoughtText ] = useState( '' );
  const [ charCount, setCharCount ] = useState( 0 );

  const handleChange = ( e ) => {
    if ( e.target.value.length <= 280 ) {
      setThoughtText( e.target.value );
      setCharCount( e.target.value.length );
    }
  };

  const handleFormSubmit = async ( e ) => {
    e.preventDefault();
    setThoughtText( '' );
    setCharCount( 0 );
  };

  return (
    <div>
      <p className={ `m-0 ${ charCount >= ( 280 * .75 )
        ? ( charCount >= 280 )
          ? 'text-error'
          : 'text-fb5'
        : '' }` }>
        Character Count: { charCount }/280
      </p>
      <form
        className='flex-row justify-center justify-space-between-md align-stretch'
        onSubmit={ handleFormSubmit }
      >
        <textarea
          placeholder="Here's a new thought..."
          value={ thoughtText }
          className='form-input col-12 col-md-9'
          onChange={ handleChange }
        ></textarea>
        <button className='btn col-12 col-md-3' type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default ThoughtForm;
