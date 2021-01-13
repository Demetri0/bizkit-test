import { useEffect, useState } from 'react'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import { UserContext } from './core/UserContext'
import { getMe } from './core/api/user/me'

import { DefaultLayout } from './layouts/DefaultLayout'

import { PageLogin } from './pages/PageLogin/PageLogin'
import { PageCustomerList } from './pages/PageCustomerList'

import './App.css'

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

  let body = null
  if (!user) {
    body = (
      <PageLogin />
    )
  } else {
    body = (
      <DefaultLayout>
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
      <UserContext.Provider value={[user, setUser]}>
        {body}
      </UserContext.Provider>
    </Router>
  );
}

export default App;
