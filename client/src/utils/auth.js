import decode from 'jwt-decode';

class AuthService {
  // retrieve data saved in token
  getProfile() {
    return decode( this.getToken() );
  }

  // check if user is still logged in
  loggedIn() {
    const token = this.getToken();

    return !!token && !this.isTokenExpired( token );
  }

  // check if auth token expired
  isTokenExpired( token ) {
    try {
      const decoded = decode( token );
      if ( decoded.exp < Date.now() / 1000 ) return true;
      else return false;

    } catch ( e ) {
      return false;
    }
  }

  // retrieve token from local storage
  getToken() {
    return localStorage.getItem( 'id_token' );
  }

  // set token to localStorage and reload page to homepage
  login( idToken ) {
    localStorage.setItem( 'id_token', idToken );

    window.location.assign( '/' );
  }

  // clear token from local storage & force logout
  logout() {
    // clear user and profile data from local storage
    localStorage.removeItem( 'id_token' );

    // reload page
    window.location.assign( '/' );
  }
}

export default new AuthService();
