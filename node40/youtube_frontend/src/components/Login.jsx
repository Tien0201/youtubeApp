import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, CardMedia } from "@mui/material";
import ReactFacebookLogin from 'react-facebook-login'
import { Videos, ChannelCard } from ".";
import { logiFacebooknAPI, loginAPI } from "../utils/fetchFromAPI";



const Login = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {

  }, []);

  return <div className="p-5 " style={{ minHeight: "100vh" }}>
    <div className=" d-flex justify-content-center">
      <form className="row g-3 text-white">
        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" />
        </div>

        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Password</label>
          <input className="form-control" id="pass" />
        </div>
        <div className="col-12">
          <button type="button" className="btn btn-primary" onClick={() => {

            let email = document.querySelector("#email").value;
            let password = document.querySelector("#pass").value;

            let newData = {
              email, password
            }

            loginAPI(newData).then(result => {
              // lưu localStorage
              localStorage.setItem("LOGIN_USER", result.data)
              console.log(result)
              window.location.reload()

              alert("Login thành công")
            }).catch(err => {

              alert(err?.response?.data?.message)
            })

          }}>Login</button>

  <a className="text-primary" href="#" onClick={() => navigate("/forget-pass")}>Forget password</a>
        </div>
        <ReactFacebookLogin
          appId="826992395907634"
          fields="name,email,picture"
          callback={(response) => {
            console.log(response)

            let {name, email, id} = response
            let model = {
              fullName : name,
              email : email,
              faceAppId : id
            }
            logiFacebooknAPI(model).then(result =>{
              localStorage.setItem("LOGIN_USER", result.data)
              window.location.reload()
              // console.log("result",result)
              alert("Login thành công")
            })
           }} 
        />
      </form>
    </div>
  </div>
};

export default Login;
