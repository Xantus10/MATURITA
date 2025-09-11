import { useMsal } from '@azure/msal-react'
import { Routes, Route } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react';

import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import MyPostsPage from './Pages/MyPostsPage';

import { post } from './Util/http';
import { isCsrf, setCsrfToken } from './Util/csrf';
import { autoHttpResponseNotification } from './Util/notifications';

async function LogUserIn(idtoken: string) {
  let res = await post('/auth/idtoken', {idtoken: idtoken});
  setCsrfToken(res);
  if (res) autoHttpResponseNotification(res);
}


function App() {
  const getLoginState = () => {return Cookies.get('ROLE') !== undefined && isCsrf()};

  const {accounts} = useMsal();

  const [loggedIn, setLoggedIn] = useState<boolean>(getLoginState());
  const msloggedIn = accounts.length !== 0

  useEffect(() => {
    if (!loggedIn && msloggedIn) {
      LogUserIn(accounts[0].idToken as string).then(() => {
        setLoggedIn(getLoginState())
      });
    }
  }, [loggedIn, msloggedIn])

  let routes = (
        <>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/my-posts' element={<MyPostsPage />} />
          </Routes>
        </>
  );

  if (!msloggedIn) {
    return (<LoginPage />);
  }

  if (!loggedIn) {
    return (<>INVALID MICROSOFT LOGIN</>);
  }

  return (routes);
}

export default App
