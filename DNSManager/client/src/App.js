import './App.css';
import { Route,Routes } from 'react-router-dom';
import Signup from './Components/Signup';
import Login from './Components/Login';
import Home from "./Components/Home";
import ProjectDSCR from './Components/ProjectDSCR';
import {gapi} from "gapi-script";

function App() {
  gapi.load("client:auth2", () => {
    gapi.client.init({
      clientId: process.env.REACT_APP_GOOGLECLIENTID,
      scope:"email",
      plugin_name: "DNS MANAGER"
    });
  });
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/home/:dname/:zname' element={<ProjectDSCR/>}/>
      </Routes>
    </div>
  );
}

export default App;