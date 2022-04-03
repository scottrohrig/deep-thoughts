import { gql } from '@apollo/client';


// mutation named login takes in email and password
// returns token and user
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// mutation for 'signup' named addUser takes in username, email, password
// returns token & user
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser( username: $username , email: $email , password: $password )
    token
    user {
      _id
      username
    }
  }
`;
