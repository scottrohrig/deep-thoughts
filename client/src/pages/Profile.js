import React from 'react';
import { useParams } from 'react-router-dom';
import ThoughtList from '../components/ThoughtList';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';

const Profile = () => {

  // get username from params
  const { username: userParam } = useParams();

  // query data
  const { loading, data } = useQuery( QUERY_USER, { variables: { username: userParam } } );

  // assign data to user
  const user = data?.user || {};

  if ( loading ) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary rounded p-3 display-inline-block">
          {/* Viewing <usernames>'s profile. */ }
          Viewing { user.username }'s profile.
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={ user.thoughts } title={ `${ user.username }'s thoughts...` } />
        </div>

        <div className="col-12 col-lg-3 mb-3">{/* PRINT FRIEND LIST */ }</div>
      </div>
    </div>
  );
};

export default Profile;
