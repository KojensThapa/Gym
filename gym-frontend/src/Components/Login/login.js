import React, {useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {toast,ToastContainer} from 'react-toastify';

function Login() {
    const [loginField, setLoginField] = useState({"userName":"", "password":""})
    const navigate = useNavigate();

    const handleLogin = async()=> {
        // sessionStorage.setItem("isLogin", true);
        // navigate('/dashboard');
        await axios.post(
            'http://localhost:4001/auth/login',
            loginField,
            { withCredentials: true }
        ).then((response)=> {
            const successMessage = response.data.message;
            toast.success(successMessage)

            localStorage.setItem('gymName', response.data.gym.gymName)
            localStorage.setItem('gymPic', response.data.gym.profilePic)
            localStorage.setItem('isLogin', true)
            localStorage.setItem('token', response.data.token)

            navigate('/dashboard')


            console.log(response);
        }).catch(err => {
            const errorMessage = err.response.data.error;
            toast.error(errorMessage);
        })


    }

    const handleOnChange = (event, name)=> {
        setLoginField({...loginField, [name]:event.target.value });
    }
    // console.log(loginField);

    return (
        <div className='lg:w-1/3 rounded-lg p-10 bg-gray-50 bg-opacity-50 lg:m-10 sm:m-0 h-fit mb-2  sm:mb-2'>
            <div className='font-serif text-black text-center text-3xl'>Login</div>

            <input value={loginField.value} onChange={(event) =>{handleOnChange(event, "userName")}} type="text" className='w-full my-10 p-2 rounded-lg font-serif text-black' placeholder='Enter Username' />

            <input value={loginField.value} onChange={(event)=>{handleOnChange(event, "password")}} type="password" className='w-full mb-10 p-2 rounded-lg font-serif' placeholder='Enter Password' />

            <div className='w-[80%] p-2 bg-slate-800 border-2 text-center font-serif rounded-lg cursor-pointer hover:bg-white hover:text-black text-white mx-auto' onClick={()=>{handleLogin()}}>Login</div>

            <ToastContainer />
        </div>
    )
}

export default Login
