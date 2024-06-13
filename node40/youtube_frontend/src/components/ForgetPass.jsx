import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, CardMedia } from "@mui/material";

import { Videos, ChannelCard } from ".";
import { checkCodeApi, checkEmailApi, loginAPI, loginFacebookAPI } from "../utils/fetchFromAPI";
import ReactFacebookLogin from "react-facebook-login";



const ForgetPass = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);

  // tour => 0: email, 1: nhập code, 2: đổi mật khẩu
  const [tour, setTour] = useState(0);

  const { id } = useParams();

  useEffect(() => {

  }, []);

  return <div className="p-5 " style={{ minHeight: "100vh" }}>
    <div className=" d-flex justify-content-center">
      {/* nhập mail */}
      {
        tour == 0 && <form className="row g-3 text-white">
          <div className="col-md-12">
            <label htmlFor="inputEmail4" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" />
          </div>
          <div className="col-12">
            <button type="button" className="btn btn-primary" onClick={() => {

              let email = document.querySelector("#email").value;


              let newData = {
                email
              }

              checkEmailApi(newData).then(result => {

                setTour(1)

              }).catch(err => {
                alert(err?.response?.data?.message)
              })

            }}>Gửi mail</button>

          </div>

        </form>
      }

      {/* nhập code */}
      {
        tour == 1 && <form className="row g-3 text-white">
          <div className="col-md-12">
            <label htmlFor="inputEmail4" className="form-label">Nhập code</label>
            <input className="form-control" id="code" />
          </div>
          <div className="col-12">
            <button type="button" className="btn btn-success" onClick={() => {
              let code = document.querySelector("#code").value;
              let newData = {
                code
              }
              checkCodeApi(newData).then(result => {

                setTour(2)

              }).catch(err => {
                alert(err?.response?.data?.message)
              })


            }}>Xác minh code</button>

          </div>

        </form>
      }

      {/* đổi pass */}
      {
        tour == 2 && <form className="row g-3 text-white">
          <div className="col-md-12">
            <label htmlFor="inputEmail4" className="form-label">Nhập mật khẩu mới</label>
            <input className="form-control" id="password" />
          </div>
          <div className="col-12">
            <button type="button" className="btn btn-danger" onClick={() => {

            }}>Đổi mật khẩu</button>

          </div>

        </form>
      }
    </div>
  </div>
};

export default ForgetPass;

// yarn add react-facebook-login