import { useEffect, useState } from 'react'

import { DefaultLayout } from './layouts/DefaultLayout'

import { UserContext } from './core/UserContext'
import { getMe } from './core/api/user/me'

import logo from './logo.svg';
import './App.css';

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

  return (
    <UserContext.Provider value={[user, setUser]}>
      <DefaultLayout>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </DefaultLayout>
    </UserContext.Provider>
  );
}

export default App;
