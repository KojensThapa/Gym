import React from 'react'
import ClearIcon from '@mui/icons-material/Clear';
function Model({handleClose, content, header}) {
  return (
    <div className='w-full h-[100vh] fixed bg-black bg-opacity-50 text-black top-0 left-0 flex justify-center'>
        <div className='w-1/2 bg-white mt-32 h-fit rounded-lg p-5'>
            <div className='flex justify-between mb-5'>
                <div className='font-serif font-semibold text-2xl'>{header}</div>
                <div onClick={()=>handleClose()} className='hover:cursor-pointer'><ClearIcon sx={{fontSize:"32px"}} /></div>
            </div>
            <div>
                {content}
            </div>
        </div>
    </div>
  )
}

export default Model
