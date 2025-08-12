import React from 'react'
import { Link } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MemeberCard from '../../Components/MemebrCard/memeberCard';
import { useEffect, useState } from 'react'
import { getMonthlyJoined, expireWithInThreeDays, expireWithIn4To7Days, expiredMember, inactiveMember } from './data';

function GeneralUser() {

  const [header, setHeader] = useState("");
  const [data, setData] = useState([])

  useEffect( () => {
    const func = sessionStorage.getItem("func");
    functionCall(func);
  },[])

  const functionCall = async (func)=>{
    switch (func) {
      case "monthlyJoined":
        setHeader("Monthly Joined Members")
        var datas = await getMonthlyJoined();
        setData(datas.members)
        break;

      case "threeDayExpire":
        setHeader("Expiring within 3 Days Members");
        var datas = await expireWithInThreeDays();
        setData(datas.members)
        break;

      case "fourToSevenDayExpire":
        setHeader("Expiring within 4-7 Days Members");
        var datas = await expireWithIn4To7Days();
        setData(datas.members)
        break;

      case "expired":
        setHeader("Expired Members");
        var datas = await expiredMember();
        setData(datas.members)
        break;

      case "inActiveMembers":
        setHeader("Inactive Members");
        var datas = await inactiveMember();
        setData(datas.members)
        break;
    }
  }

  return (
    <div className='text-black p-5 w-3/4 flex-col h-[100vh]'>
      
      <div className='w-full bg-slate-900 flex justify-between border-2 rounded-lg p-3 text-white'>
        <Link to={'/dashboard'} className='border-2 pl-3 pr-3 pb-1 pt-1 rounded-2xl cursor-pointer font-serif hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black'>
          <ArrowBackIcon /> Back to Dashboard
        </Link>
      </div>

      <div className='mt-5  text-xl text-slate-900 font-serif'>
        {header}
      </div>

      <div className='w-full bg-slate-100 bg-opacity-50 gap-2 grid grid-cols-3 p-5 rounded-lg h-[80%] mt-5 overflow-x-auto h-[80%]'>
        {
          data.map((item, index) => {
            return (
              <MemeberCard item={item} />
            );
          })
        }
       
      </div>

    </div>
  )
}

export default GeneralUser
