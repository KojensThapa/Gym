import React, { useEffect, useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import AddchartIcon from '@mui/icons-material/Addchart';
// import { FaChartArea } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
function Sidebar() {
    

    const location = useLocation();
    const navigate = useNavigate();
    const [greeting, setGreeting] = useState("");


    const greetingMessage = () => {
        const currentHour = new Date().getHours();
        if(currentHour < 12) {
            setGreeting("Good Morning 🌞");
        } else if(currentHour < 18) {
            setGreeting("Good Afternoon 💥")
        } else if (currentHour < 21) {
            setGreeting("Good Evening 🌙")
        } else {
            setGreeting("Good Night 🌛")
        }
    }

    useEffect (()=>{
        greetingMessage();
    },[])

    const handleLogout = async ()=>{
        localStorage.clear();
        navigate('/');
    }

    return (
        <div className='w-1/4 h-screen bg-black border-2 text-white font-serif p-5'>
            <div className='text-3xl text-center underline font-semibold'>
                {localStorage.getItem("gymName")}
            </div>
            <div className='flex gap-5 my-6 justify-center items-center'>
                <div className='w-[100px] h-[100px] '>
                    <img alt='Gym Img' className='h-full w-full rounded-full border-2' src={localStorage.getItem("gymPic")} />
                </div>
                <div className=''>
                    <div className='text-2xl'>{greeting}</div>
                    <div className='text-xl font-semibold mt-1'>Admin</div>
                </div>
            </div>

            <div className='py-10 border-t-2 border-gray-700 mt-10 cursor-pointer'>
                <Link to={'/dashboard'} className={`flex items-center gap-6 bg-slate-800 p-3 rounded-xl border-2 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ${location.pathname === "/dashboard" ? 'border-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ' : null}`}>
                    <div>{<HomeIcon />}</div>
                    <div>Dashboard</div>
                </Link>
                <Link to={'/member'} className={`flex items-center my-5 gap-6 bg-slate-800 p-3 rounded-xl border-2 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ${location.pathname === "/member" ? 'border-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ' : null}`}>
                    <div>{<GroupIcon />}</div>
                    <div>Members</div>
                </Link>
                <Link to={'/chart'} className={`flex items-center my-5 gap-6 bg-slate-800 p-3 rounded-xl border-2 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ${location.pathname === "/chart" ? 'border-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ' : null}`}>
                    <div>{<AddchartIcon /> }</div>
                    <div>Chart</div>
                </Link>
                <div onClick={()=>handleLogout()} className='flex items-center gap-6 bg-slate-800 p-3 rounded-xl border-2 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black'>
                    <div>{<LogoutIcon />}</div>
                    <div>Logout</div>
                </div>
            </div>

        </div>
    )
}

export default Sidebar
