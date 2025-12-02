import { useMsal } from '@azure/msal-react'
import { Routes, Route } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react';

import LoginPage from './Pages/LoginPage';
import NoAccessPage from './Pages/NoAccessPage';

import HomePage from './Pages/HomePage';
import MyPostsPage from './Pages/MyPostsPage';
import UserDisplayPage from './Pages/UserDisplayPage';

import AHomePage from './Pages/Admin/AHomePage';
import AUsersPage from './Pages/Admin/AUsersPage';
import ABlacklistPage from './Pages/Admin/ABlacklistPage';
import ASubjectsPage from './Pages/Admin/ASubjectsPage';

import { post } from './Util/http';
import { isCsrf, setCsrfToken } from './Util/csrf';
import { showNotification } from './Util/notifications';

/**
 * Main react app
 */
function App() {
  async function LogUserIn(idtoken: string) {
    let res = await post('/auth/idtoken', {idtoken: idtoken});
    setCsrfToken(res);
    if (res) {
      let js = await res.json();
      switch (res.status) {
        case 200:
          break;
        case 401:
          showNotification({title: 'Log in failed', message: js.msg, icon: 'ERR'});
          break;
        case 403:
          setBanMsg({reason: js.reason, until: (js.until) ? new Date(js.until) : null});
          break;
      }
    }
  }

  const getLoginState = () => {return Cookies.get('ROLE') !== undefined && isCsrf()};

  const {accounts} = useMsal();

  const [loggedIn, setLoggedIn] = useState<boolean>(getLoginState());
  const [banmsg, setBanMsg] = useState<{reason: string; until: Date | null}>();
  const msloggedIn = accounts.length !== 0

  useEffect(() => {
    if (!loggedIn && msloggedIn) {
      LogUserIn(accounts[0].idToken as string).then(() => {
        setLoggedIn(getLoginState())
      });
    }
  }, [loggedIn, msloggedIn])

  let routes = (Cookies.get('ROLE') === 'user') ? (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/my-posts' element={<MyPostsPage />} />
        <Route path='/my-account' element={<UserDisplayPage />} />
      </Routes>
    </>
  ) : (
    <>
      <Routes>
        <Route path='/' element={<AHomePage />} />
        <Route path='/users' element={<AUsersPage />} />
        <Route path='/blacklists' element={<ABlacklistPage />} />
        <Route path='/subjects' element={<ASubjectsPage />} />
      </Routes>
    </>
  );

  if (!msloggedIn) {
    return (<LoginPage />);
  }

  if (!loggedIn) {
    if (banmsg) {
      if (banmsg.until) {
        return (<NoAccessPage reason={banmsg.reason} until={banmsg.until} />);
      } else {
        return (<NoAccessPage reason={banmsg.reason} until={null} />);
      }
    }

    return (<NoAccessPage reason={null} until={null} />);
  }

  return (routes);
}

export default App;
