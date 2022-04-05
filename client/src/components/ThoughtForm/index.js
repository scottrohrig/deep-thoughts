import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QueryManager } from '@apollo/client/core/QueryManager';

const ThoughtForm = () => {

  const [ thoughtText, setThoughtText ] = useState( '' );
  const [ charCount, setCharCount ] = useState( 0 );
  const [ addThought, { error } ] = useMutation( ADD_THOUGHT, {
    update( cache, { data: { addThought } } ) {
      try {

        // read what's currently in cache
        const { thoughts } = cache.readQuery( { query: QUERY_THOUGHTS } );

        // prepend the newest thought to the front of the array
        cache.writeQuery( {
          query: QUERY_THOUGHTS,
          data: { thoughts: [ addThought, ...thoughts ] }
        } );
      } catch ( error ) {
        console.error( error );
      }
      // update me object's cache, appending new thought to the end of the array
      const { me } = cache.readQuery( { query: QUERY_ME } );
      cache.writeQuery( {
        query: QUERY_ME,
        data: { me: { ...me, thoughts: [ ...me.thoughts, addThought ] } }
      } );
    }

  } );

  const handleChange = ( e ) => {
    if ( e.target.value.length <= 280 ) {
      setThoughtText( e.target.value );
      setCharCount( e.target.value.length );
    }
  };

  const handleFormSubmit = async ( e ) => {
    e.preventDefault();

    try {
      await addThought( { variables: { thoughtText } } );

      setThoughtText( '' );
      setCharCount( 0 );
    } catch ( error ) {
      console.error( error );
    }

  };

  return (
    <div>
      <p className={ `m-0 ${ charCount >= ( 280 * .75 ) || error
        ? ( charCount >= 280 )
          ? 'text-error'
          : 'text-fb5'
        : '' }` }>
        Character Count: { charCount }/280
        { error && <span className='ml-2'>Something went wrong...</span> }
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
