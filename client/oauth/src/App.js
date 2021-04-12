import { useEffect, useState } from 'react';
import Axios from 'axios';
import './App.css';
import Background from './components/Background/Background'
import Form from './components/Form/Form'
import Profile from './components/Profile/Profile'

function App() {
  const [user, setUser] = useState(null)
  const url = ""

  useEffect(() => {
    Axios.get(url + '/auth/getuser', {withCredentials: true})
    .then((res) => {
      setUser(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  return (
    <div className="App">     
      <Background/>
      {
        user ? <Profile user={user} url={url}/> : <Form url={url}/>
      }
      
    </div>
  );
}

export default App;
