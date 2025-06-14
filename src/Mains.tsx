import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import App from './App';

const Main = () => {
  const [ isLoggedIn, setIsLoggedIn ] = useState( false );
  const navigate = useNavigate();

  useEffect( () => {
    const accountId = localStorage.getItem( 'accountId' );
    if ( accountId ) {
      setIsLoggedIn( true );
    } else {
      navigate( '/login' );
    }
  }, [ navigate ] );

  return isLoggedIn ? <App /> : null;
};

export default Main;
