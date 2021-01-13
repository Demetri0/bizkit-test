import { useEffect, useState } from 'react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import { UserContext } from './core/UserContext'
import { getMe } from './core/api/user/me'
import { createToken } from './core/api/token/createToken'

import { DefaultLayout } from './layouts/DefaultLayout'

import { PageLogin } from './pages/PageLogin/PageLogin'
import { PageCustomerList } from './pages/PageCustomerList'

import './App.css'

const ACCESS_TOKEN_KEY = 'token/access'

function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    getMe()
      .then(({ data }) => {
        console.log(data)
        setUser(data)
      })
      .catch(console.error)
  },[])
  function login({email, password}) {
    return createToken({email, password})
      .then(({ data }) => {
          if (data.access) {
              localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
          } else {
              throw data
          }
      })
      .then(getMe)
      .then(({ data }) => {
          setUser(data)
      })
  }
  function logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    setUser(null)
  }
  const ctxUser = {
    user,
    login,
    logout,
  }

  let body = null
  if (!user) {
    body = (
      <PageLogin login={login}  />
    )
  } else {
    body = (
      <DefaultLayout logout={logout}>
        <Switch>
          <Route exact path='/'>
            <PageCustomerList />
          </Route>
        </Switch>
      </DefaultLayout>
    )
  }

  return (
    <Router>
      <UserContext.Provider value={ctxUser}>
        {body}
      </UserContext.Provider>
    </Router>
  );
}

export default App;
