import React,{useEffect,useState} from "react";
import GoogleLogin from "react-google-login";
import { Link ,useNavigate} from "react-router-dom";
import "./Style.css";
import axios from 'axios';

function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
      email: "",
      password: "",
    });

    const handleChange=(e)=>{
      const{name,value} = e.target;
      setLoginData((prevValue)=>{
        return{
         ...prevValue,
         [name]:value
        }
      });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const {data} = await axios.post(
            `http://localhost:5000/api/login`,loginData,{withCredentials:true}
          );
          navigate('/home')
        } catch (error) {
          console.log(error);
        }
    };

    const googleSuccess = async(res) =>{
        console.log(res);
        const googleToken = {
          tokenId : res?.tokenId
        };
        try {
          //send data to backend
          const {data} = await axios.post(
            `http://localhost:5000/api/login`,googleToken,{withCredentials:true}
          );
          navigate(`/home`);
        }catch(error){
          console.log(error);
        }
    }
  
    const googleFailure = (error) =>{
        console.log(error);
    }

  return(
    <form className="overLay">
      <div className="lg-container">
      <h2 style={{"color":"#2c65d6"}}>DNS MANAGER ACCOUNT</h2>
        <div className="lg">
          <h2 className="h2-lg">Email</h2>
          <input
            className="input-margin"
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />
        </div>
        <div className="lg">
          <h2 className="h2-lg">Password</h2>
          <input
            className="input-margin"
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
          />
        </div>
        <div className="lg">
          <input type="submit" value="Login" className="lg-sub" onClick={handleSubmit}/>
        </div>
        {/* <div>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLECLIENTID}
            theme="dark"
            buttonText="Login with Google"
            className="google-login"
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />
        </div> */}
        <div className="btm-content">
          <p>Create Account here </p>
          <Link to={`/`}>Signup</Link>
        </div>
      </div>
    </form>
  );
}

export default Login;