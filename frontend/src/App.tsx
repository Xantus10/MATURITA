import { useMsal } from '@azure/msal-react'
import { Routes, Route } from 'react-router-dom'
import Cookies from 'js-cookie'

import LoginPage from './Pages/LoginPage';
import HomePage from './Pages/HomePage';
import { post } from './Util/http';
import { setCsrfToken } from './Util/csrf';

async function LogUserIn(idtoken: string) {
  let res = await post('/idtoken', {idtoken: idtoken});
  setCsrfToken(res);
  console.log(res?.status); // Use notifications to switch through codes
}


function App() {
  const {accounts} = useMsal();

  let loggedIn = (Cookies.get('ROLE') !== undefined);
  let msloggedIn = (accounts.length !== 0);

  if (!loggedIn) {
    if (!msloggedIn) {
      return (
        <LoginPage />
      );
    }
    
    LogUserIn(accounts[0].idToken as string).then(() => {
      let loggedIn = (Cookies.get('ROLE') !== undefined);
      if (!loggedIn) {
        console.error('User was not logged in after login'); // After notifications - questionable usability
      }
    })
  }

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App
