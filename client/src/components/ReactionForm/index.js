import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_REACTION } from '../../utils/mutations';

const ReactionForm = ( { thoughtId } ) => {

  const [ reactionBody, setReactionBody ] = useState( '' );
  const [ charCount, setCharCount ] = useState( 0 );
  const [ addReaction, { error } ] = useMutation( ADD_REACTION );

  const handleChange = ( event ) => {
    if ( event.target.value.length <= 280 ) {
      setReactionBody( event.target.value );
      setCharCount( event.target.value.length );
    }
  };

  const handleSubmit = async ( event ) => {
    event.preventDefault();

    try {
      await addReaction( {
        variables: { reactionBody, thoughtId }
      } );

      // clear form
      setReactionBody( '' );
      setCharCount( 0 );
    } catch ( err ) {
      console.error( err );
    }
  };

  return (
    <div>
      <p
        className={ `m-0 ${ charCount === 280 || error ? 'text-error' : '' }` }
      >
        Character Count: { charCount }/280
        { error && <span className='ml-2'>Something went wrong...</span> }
      </p>
      <form
        className='flex-row justify-center justify-space-between-md align-stretch'
        onSubmit={ handleSubmit }
      >
        <textarea
          className='form-input col-12 col-md-9'
          placeholder='Leave a reaction to this thought...'
          value={ reactionBody }
          onChange={ handleChange }
        ></textarea>

        <button className='btn col-12 col-md-3' type='submit'>
          Submit
        </button>
      </form>

      { error && <div>Something when wrong...</div> }
    </div>
  );
};

export default ReactionForm;
