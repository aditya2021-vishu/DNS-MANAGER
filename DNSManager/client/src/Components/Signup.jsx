import React,{useEffect,useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import GoogleLogin from "react-google-login";
import "./Style.css";
import axios from 'axios';

function Signup(){
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
    });

    const handleChange=(e)=>{
       const{name,value} = e.target;
       setRegisterData((prevValue)=>{
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
            `http://localhost:5000/api/signup`,registerData,{withCredentials:true}
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
        <div className="lg-container sg-container">
        <h2 style={{"color":"#2c65d6"}}>DNS MANAGER ACCOUNT</h2>
        <div className="lg sg">
          <h2>Name</h2>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            onChange={handleChange}
          />
        </div>
        <div className="lg sg">
          <h2>Email</h2>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
          />
        </div>
        <div className="lg sg">
          <h2>Password</h2>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
          />
        </div>
        <div className="lg sg">
          <h2>Confirm Password</h2>
          <input
            type="password"
            name="confirmpassword"
            placeholder="Re-Enter Password"
            onChange={handleChange}
          />
        </div>
        <div className="lg">
          <input type="submit" value="SignUp" onClick={handleSubmit}/>
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
        <div className="gotologin">
          <p style={{"color":"#fff","marginTop":"7px"}}>Already have an account? <Link to={`/login`}>Login</Link></p>
        </div>
      </div>
      </form>
    );
}

export default Signup;