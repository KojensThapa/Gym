
import { useEffect, useState } from 'react';
import './App.css';
import Sidebar from './Components/Sidebar/sidebar';
import Dashboard from './Pages/Dashboard/dashboard';
import Home from './Pages/Home/home';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Member from './Pages/Member/member';
import GeneralUser from './Pages/GeneralUser/generalUser';
import MemberDetail from './Pages/MemberDetail/memberDetail';
import 'react-toastify/dist/ReactToastify.css';
import Chart from './Pages/Chart/chart';


function App() {

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  useEffect(()=>{
    let isLogedIn = localStorage.getItem("isLogin");
    if(isLogedIn){
      setIsLogin(true);
      navigate('/dashboard');
    } else {
      setIsLogin(false);
      //This navigate the same page if the user is login ok!
      navigate('/')
    }
  },[localStorage.getItem("isLogin")])

  return (
   <div className='flex'>
    {/* This slidebar is comman in every where if we have login in then it redirect to the dashboard */}
    {
      isLogin && <Sidebar />
    }
    
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/chart' element={<Chart />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/member' element={<Member />} />
      <Route path='/specific/:page' element={<GeneralUser />} />
      <Route path='/member/:id' element={<MemberDetail />} />
    </Routes>
   </div>
  );
}

export default App;
