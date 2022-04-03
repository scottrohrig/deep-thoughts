import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';

const Profile = () => {

  // get username from params
  const { username: userParam } = useParams();

  // query data
  const { loading, data } = useQuery(
    userParam ? QUERY_USER : QUERY_ME,
    { variables: { username: userParam } }
  );

  // assign data to user
  const user = data?.me || data?.user || {};

  if ( loading ) {
    return <div>Loading...</div>;
  }

  // redirect to profile if username in JWT is same as userParam ie, `/profile/:username`
  if ( Auth.loggedIn() && Auth.getProfile().data.username === userParam ) {
    return <Redirect to='/profile' />;
  }

  if (!user?.username) {
    return (
      <h4>You must be logged in to view this content.</h4>
    )
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary rounded p-3 display-inline-block">
          {/* Viewing <usernames>'s profile. */ }
          Viewing { userParam ? `${ user.username }'s` : `your` } profile.
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList
            thoughts={ user.thoughts }
            title={ `${ user.username }'s thoughts...` }
          />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={ user.username }
            friends={ user.friends }
            friendCount={ user.friendCount }
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
