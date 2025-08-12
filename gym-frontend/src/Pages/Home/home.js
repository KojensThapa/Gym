import React from 'react';
import Login from '../../Components/Login/login';
import SingUp from '../../Components/Singup/singUp';


function Home() {
  return (
    <div className=' w-full '>
      <div className='border-2 border-slate-800 bg-slate-800 p-5 mb-1'>
        <p className='text-white font-semibold text-2xl font-serif'>FlexFit</p>
        <p className='text-white font-bold font-serif'>(Gym Management System)</p>
      </div>
      <div
        className='w-full lg:h-auto lg:bg-cover bg-center flex justify-center'
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")`,
        }}
      >
        {/* login form */}
        <div className='w-full lg:flex justify-center m-10 '>

          <Login />
          <SingUp />
          


        </div>
        
      </div>
    </div>
  );
}

export default Home;