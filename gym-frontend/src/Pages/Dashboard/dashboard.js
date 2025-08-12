import React, { useState, useEffect, useRef } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ErrorIcon from '@mui/icons-material/Error';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { Link } from 'react-router-dom';
function Dashboard() {

  const [accordianDashboard, setAccordianDashboard] = useState(false);
  const ref = useRef();

  useEffect(()=>{
    const checkIfClickedOutside = e => {
      if(accordianDashboard && ref.current && !ref.current.contains(e.target)){
        setAccordianDashboard(false);
      }
    }
    document.addEventListener("mousedown", checkIfClickedOutside)
    return () =>{
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  },[accordianDashboard]);

  const handleOnClickMenu = (value)=>{
    sessionStorage.setItem("func", value)
  }

  return (
    // relative add garna last ma ok in main div
    <div className='w-3/4 text-black p-5 relative'>
      <div className='bg-slate-900 text-white w-full p-3  rounded-xl  flex justify-between items-center'>
        <MenuIcon sx={{ cursor: "pointer" }} onClick={ () => { setAccordianDashboard(prev => !prev) }} />
        <img className='w-8 h-8 rounded-3xl border-2' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcc1zSdQVcB5jBDzFuaH_5IBpdHXJeCiOnZw&s' alt='Logo' />
      </div>

      {
        accordianDashboard && <div ref={ref} className='absolute bg-slate-900 text-white p-3 rounded-xl font-extralight text-xl mt-1'>
          <div>Hi Welcome to our GYM management System.</div>
          <p>Feel free to ask any querries.</p>
        </div>
      }
      {/* This is the main conent in the dashboard ok */}
      <div className='w-full bg-slate-100 bg-opacity-50 gap-5 grid grid-cols-3 pb-5  h-[80%] mt-5 overflow-x-auto'>

        {/* This is the card block */}
        <Link to={'/member'} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
          <div className=' py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg  hover:bg-slate-900 hover:text-white'>
            <PeopleAltIcon sx={{ color: "green", fontSize: "50px" }} />
            <p className='font-mono font-semibold text-xl py-3'>Joined Members</p>
          </div>
        </Link>

        {/* This is the card block */}
        <Link to={'/specific/monthly'} onClick={()=>handleOnClickMenu("monthlyJoined")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
          <div className=' py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg  hover:bg-slate-900 hover:text-white'>
            <SignalCellularAltIcon sx={{ color: "purple", fontSize: "50px" }} />
            <p className='font-mono font-semibold text-xl py-3'>Monthly Joined</p>
          </div>
        </Link>

        {/* This is the card block */}
        <Link to={'/specific/expire-with-in-3-days'} onClick={()=>handleOnClickMenu("threeDayExpire")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
          <div className=' py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg  hover:bg-slate-900 hover:text-white'>
            <AccessAlarmIcon sx={{ color: "red", fontSize: "50px" }} />
            <p className='font-mono font-semibold text-xl py-3'>Expiring within 3 Days</p>
          </div>
        </Link>

        {/* This is the card block */}
        <Link to={'/specific/expire-with-in-4-7-days'} onClick={()=>handleOnClickMenu("fourToSevenDayExpire")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
          <div className=' py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg  hover:bg-slate-900 hover:text-white'>
            <AccessAlarmIcon sx={{ color: "red", fontSize: "50px" }} />
            <p className='font-mono font-semibold text-xl py-3'>Expiring within 4-7 Days</p>
          </div>
        </Link>

        {/* This is the card block */}
        <Link to={'/specific/expired'} onClick={()=>handleOnClickMenu("expired")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
          <div className=' py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg  hover:bg-slate-900 hover:text-white'>
            <ErrorIcon sx={{ color: "red", fontSize: "50px" }} />
            <p className='font-mono font-semibold text-xl py-3'>Expired</p>
          </div>
        </Link>

        {/* This is the card block */}
        <Link to={'/specific/inactive-members'} onClick={()=>handleOnClickMenu("inActiveMembers")} className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'>
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
          <div className=' py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg  hover:bg-slate-900 hover:text-white'>
            <ReportGmailerrorredIcon sx={{ color: "green", fontSize: "50px" }} />
            <p className='font-mono font-semibold text-xl py-3'>Inactive Members</p>
          </div>
        </Link>




      </div>

      {/* last part of the dashboard or content with the techical support team */}
      <div className='md:bottom-4 mb-4 md:mb-0 absolute mt-8 bg-slate-900 text-white w-3/4 p-3 rounded-xl text-xl font-serif '>
        <p>Contact Developer for any techical support at +977-98_______ </p>
      </div>

    </div>
  )
}

export default Dashboard
