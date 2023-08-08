import React, { useEffect, useRef, useState } from "react";
import "./LoginSignup.css";
import Loader from "../layout/Loader/Loader.js";
import { Link } from "react-router-dom";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from '@material-ui/icons/Face';

import {login, register, clearErrors} from '../../actions/userAction'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom';

import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const LoginSignup = () => {

  const dispatch = useDispatch();
  const {loading, isAuthenticated, error }= useSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
 

 

  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [user, setUser] = useState({name: "", email: "", password: ""});
  const {name, email, password} = user;
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');



  const registerDataChange = (e)=> {

    if(e.target.name === 'avatar') {
      let file = e.target.files[0];

      if(file) {
        const reader = new FileReader();
        reader.onload = () => {
          if(reader.readyState === 2) {
            setAvatarPreview(reader.result);
            setAvatar(reader.result);
          }
        };
        reader.readAsDataURL(e.target.files[0]);

      }
     
    }else{
      setUser({...user, [e.target.name] : e.target.value})
    }
    
  }

  const redirect = location.search ? decodeURIComponent(location.search.split("=")[1]) : '/account';


  console.log(redirect); 

  useEffect(() => {

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    if(isAuthenticated) {
    
      navigate(redirect); 
    }
  }, [isAuthenticated, navigate, redirect]);

  const switchTabs = (e, tab) => {
    if (tab === "Login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    } 
    if(tab === 'Register') {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };



  const loginSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(loginEmail, loginPassword));
      toast.success("Logged in Successfully!");
      navigate(redirect);
      
    } catch (error) {
      
      
      // addToast("Incorrect email/password", { appearance: "error" });
      window.location.reload();
    }
   
  };


  const registerSubmit =async(e) => {
    e.preventDefault();
    try {

      const myForm = new FormData();
      myForm.set("name", name);
      myForm.set("email", email);
      myForm.set("password", password);
      myForm.set("avatar", avatar);
      await dispatch(register(myForm));
      toast.success("Account successfully Created");
      
    } catch (error) {
      window.location.reload();
    }
  
  
  }


  return (
    <>
    <>
    {
      loading ? <Loader/> : <div className="LoginSignUpContainer">
      <div className="LoginSignUpBox">
        <div>
          <div className="login_signup_toggle">
            <p onClick={(e) => switchTabs(e, "Login")}>Login</p>
            <p onClick={(e) => switchTabs(e, "Register")}>Register</p>
          </div>
          <button ref={switcherTab}></button>
        </div>

        <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
          <div className="loginEmail">
            <MailOutlineIcon />
            <input
              type="email"
              placeholder="Email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>

          <div className="loginPassword">
            <LockOpenIcon />
            <input
              type="password"
              placeholder="Password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
          <Link to="/password/forgot">Forgot Password?</Link>
          <input type="submit" value="Login" className="loginBtn" />
        </form>

        <form
          className="signUpForm"
          ref={registerTab}
          encType="multipart/form-data"
          onSubmit={registerSubmit}
        >
          <div className="signUpName">
            <FaceIcon />
            <input
              type="text"
              placeholder="Name"
              required
              name="name"
              value={name}
              onChange={registerDataChange}
            />
          </div>

          <div className="signUpEmail">
            <MailOutlineIcon />
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={registerDataChange}
            />
          </div>

          <div className="signUpPassword">
            <LockOpenIcon />
            <input
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={registerDataChange}
            />
          </div>

          <div id="registerImage">
            <img src={avatarPreview} alt="avatar preview"/>
            <input
              type="file"
              name="avatar"
              accept="image/"
              onChange={registerDataChange}
            />
          </div>
    

          <input type= 'submit' value='Register' className="signUpBtn" />


        </form>
      </div>
    </div>


    }
       
      
      
    </>

    <ToastContainer/>
    
    </>
  
  );
};

export default LoginSignup;
