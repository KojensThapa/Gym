import React from 'react'
import CircleIcon from '@mui/icons-material/Circle';
import { Link } from 'react-router-dom';
function MemeberCard({item}) {
    return (
        <Link to={`/member/${item?._id}`} className='bg-white rounded-lg p-3 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white'>
            <div className='w-28 h-28 flex justify-center relative items-center border-2 p-1 mx-auto rounded-full'>
                <img className='w-full h-full rounded-full' src={item?.profilePic} alt='Profile Img' />
                <CircleIcon className='absolute top-0 left-0' sx={{ color: item?.status === "Active"?"greenYellow":"red" }} />
            </div>

            <div className='mx-auto text-center font-semibold font-serif mt-5 text-xl'>
                {item?.name}
            </div>

            <div className='mx-auto text-center font-sans mt-3 text-xl'>
                {"+977" + item?.mobileNo}
            </div>

            <div className='mx-auto text-center font-sans mt-3 text-xl'>
                Next Bill Date: {item?.nextBillDate.slice(0,10).split('-').reverse().join('-')}
            </div>
        </Link>
    )
}

export default MemeberCard
