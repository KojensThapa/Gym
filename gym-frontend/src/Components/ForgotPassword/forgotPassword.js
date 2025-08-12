import React, { useState } from 'react'
import Loder from '../Loder/loder';
import axios from 'axios';
import {toast,ToastContainer} from 'react-toastify';
function ForgotPassword() {

    const [emailSubmit, setEmailSubmit] = useState(false);
    const [otpValidate, setOtpValidate] = useState(false);
    const [loder, setLoder] = useState(false);
    const [contentVale, setContentValue] = useState("Submit Your Email");

    const [inputField, setInputField] = useState({ email : "", otp : "", newPassword : ""});

    const handleSubmit = () => {
        if (!emailSubmit) {
            // setEmailSubmit(true);
            // setContentValue("Submit Your OTP");
            sendOtp();
        } else if(emailSubmit && !otpValidate) {
            // setOtpValidate(true);
            // setContentValue("Submit Your New Password")
            verifyOtp();
        } else {
            changePassword();
        }
    }

    const handleOnChange = (event, name)=> {
        setInputField({...inputField, [name]:event.target.value})
    }
    // console.log(inputField);

    const changePassword = async ()=>{
        setLoder(true);
        await axios.post("http://localhost:4001/auth/resetPassword", { email:inputField.email, newPassword:inputField.newPassword}).then((response) => {
            toast.success(response.data.message);
            setLoder(false)
        }).catch(err => {
            setLoder(false);
            console.log(err)
            toast.error("Failed to change Password. Try Again.");

        })
    }

    const verifyOtp = async () => {
        setLoder(true);
        await axios.post("http://localhost:4001/auth/reset-password/checkOtp", { email:inputField.email, otp: inputField.otp}).then((response) => {
            setOtpValidate(true);
            setContentValue("Submit Your New Password")
            toast.success(response.data.message)
            setLoder(false);
        }).catch(err => {
            setLoder(false);
            // toast.error(err.data.error)
            console.log(err)
            toast.error("Failed to verify the Otp.");

        })
    }

    const sendOtp = async () =>{
        setLoder(true);
        await axios.post("http://localhost:4001/auth/reset-password/sendOtp", {email: inputField.email}).then((response) => {
            setEmailSubmit(true);
            setContentValue("Submit Your OTP");
            toast.success(response.data.message)
            setLoder(false);
        }).catch(err => {
            setLoder(false);
            console.log(err);
            toast.error("There is technical error while sending the Otp.");
        })

    }



    return (
        <div>
            <div className='w-full'>
                <div className='w-full'>
                    <div className='font-serif mb-3'>Enter Email</div>
                    <input value={inputField.email} onChange={(event)=>{handleOnChange(event, "email")}} type="text" className='w-1/2  p-2 rounded-lg font-serif border-2 border-slate-500' placeholder='Enter Email' />
                </div>
                {
                    emailSubmit && <div className='w-full'>
                        <div className='font-serif mb-3 mt-3'>Enter OTP</div>
                        <input value={inputField.otp} onChange={(event)=>{handleOnChange(event, "otp")}} type="text" className='w-1/2  p-2 rounded-lg font-serif border-2 border-slate-500' placeholder='Enter OTP' />
                    </div>
                }
                {
                    otpValidate && <div className='w-full'>
                        <div className='font-serif mb-3 mt-3'>Enter Your New Password</div>
                        <input value={inputField.newPassword} onChange={(event)=>{handleOnChange(event, "newPassword")}} type="password" className='w-1/2  p-2 rounded-lg font-serif border-2 border-slate-500' placeholder='Enter New Password' />
                    </div>
                }
                <div className='font-serif font-semibold mx-auto bg-slate-800 text-white rounded-lg p-3 mt-3 w-2/3 text-center border-2 cursor-pointer hover:bg-white hover:text-black' onClick={() => handleSubmit()}>{contentVale}</div>
            </div>

            {loder && <Loder />}
            <ToastContainer />
        </div>
    )
}

export default ForgotPassword
