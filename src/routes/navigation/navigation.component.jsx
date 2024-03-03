import { Fragment, useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';

import { UserContext } from '../../contexts/user.context';
import { signOutUser } from '../../utils/firebase/firebase.utils';

import './navigation.styles.css'

const Navigation = () => {
  
  const { currentUser, userData } = useContext(UserContext);
 
  return (
    <Fragment>
      <div className="navigation-container">
        <div className="logo">Logo</div>
        <Link className="nav-link" to='/'>
          <div className="title">News Blog</div>
        </Link>
        <div>
          {currentUser ? (
            <div className="name-sign-out-container">
              {userData ? (<p>{userData.displayName}</p>
              ) : (<p>{currentUser.displayName}</p>)}
              <div className='nav-link nav-right-side sign-out'>
                <span onClick={signOutUser}>Sign Out</span>
              </div>
            </div>
          ) : (
            <Link className='nav-link' to="/auth">
              <div className="nav-right-side sign-in">Log In / Sign In</div>
            </Link>
          )}
        </div>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
