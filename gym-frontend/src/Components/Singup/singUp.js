import React, { useState } from "react";
import "./signUp.css";
import Model from "../Model/model";
import ForgotPassword from "../ForgotPassword/forgotPassword";
import axios from "axios";

import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { ToastContainer, toast } from "react-toastify";

function SingUp() {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [inputField, setInputField] = useState({
    gymName: "",
    email: "",
    userName: "",
    password: "",
    profilePic:
      "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=1996&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  });

  const [imageLoader, setImageLoder] = useState(false);

  const handleClose = () => {
    setForgotPassword((prev) => !prev);
  };

  const handleOnChange = async (event, name) => {
    setInputField({ ...inputField, [name]: event.target.value });
  };

  // console.log(inputField);

  const uploadImage = async (event) => {
    console.log("Image Uploading.");

    setImageLoder(true);

    const file = event.target.files;
    const data = new FormData();

    data.append("file", file[0]);

    //dyvoygosh

    data.append("upload_preset", "gym-management");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dyvoygosh/image/upload",
        data
      );
      // console.log(response)
      const imageUrl = response.data.url;
      setInputField({ ...inputField, ["profilePic"]: imageUrl });
      setImageLoder(false);
    } catch (error) {
      console.log(error);
      setImageLoder(false);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4001/auth/register",
        inputField
      );
      const successMessage = response.data.message;
      toast.success(successMessage);

      setTimeout(() => {
        window.location.reload(); // reloads after 2 seconds
      }, 2000);
    } catch (err) {
      // Check if server responded with validation or custom error
      if (err.response && err.response.data && err.response.data.error) {
        toast.error("hello " + err.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="signupCustom lg:w-1/3 border-2 rounded-lg p-10 bg-gray-50 bg-opacity-50 lg:m-10  h-[580px] overflow-y-auto">
      <div className="font-serif text-black text-center text-3xl ">
        Register Your GYM
      </div>

      <input
        value={inputField.value}
        onChange={(event) => {
          handleOnChange(event, "email");
        }}
        type="text"
        className="w-full my-10 p-2 rounded-lg font-serif"
        placeholder="Enter Email"
      />

      <input
        value={inputField.value}
        onChange={(event) => {
          handleOnChange(event, "gymName");
        }}
        type="text"
        className="w-full mb-10 p-2 rounded-lg font-serif"
        placeholder="Enter Gym Name"
      />

      <input
        value={inputField.value}
        onChange={(event) => {
          handleOnChange(event, "userName");
        }}
        type="text"
        className="w-full mb-10 p-2 rounded-lg font-serif"
        placeholder="Enter Username"
      />

      <input
        value={inputField.value}
        onChange={(event) => {
          handleOnChange(event, "password");
        }}
        type="password"
        className="w-full mb-10 p-2 rounded-lg font-serif"
        placeholder="Enter Password"
      />

      <input
        type="file"
        onChange={(e) => {
          uploadImage(e);
        }}
        className="w-full mb-10 p-2 rounded-lg font-serif"
      />

      <div className="flex justify-center mb-2 ">
        {imageLoader && (
          <Stack sx={{ width: "200px", color: "grey.500" }} spacing={2}>
            <LinearProgress color="success" />
          </Stack>
        )}
      </div>

      <img
        src={inputField.profilePic}
        alt="img"
        className="h-[250px] w-[200px] mb-8 rounded-md mx-auto"
      />
      <div
        className="w-[80%] p-2 bg-slate-800 border-2 text-center font-serif rounded-lg cursor-pointer hover:bg-white hover:text-black text-white mx-auto mb-4"
        onClick={() => handleRegister()}
      >
        Register
      </div>
      <div
        className="w-[80%] p-2 bg-slate-800 border-2 text-center font-serif rounded-lg cursor-pointer hover:bg-white hover:text-black text-white mx-auto"
        onClick={() => handleClose()}
      >
        Forgot Password
      </div>
      {forgotPassword && (
        <Model
          header={"Forgot Password"}
          handleClose={handleClose}
          content={<ForgotPassword />}
        />
      )}
    </div>
  );
}

export default SingUp;
