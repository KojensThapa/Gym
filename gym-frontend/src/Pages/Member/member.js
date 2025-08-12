import React, { useEffect, useState } from 'react'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from 'react-router-dom';
import MemeberCard from '../../Components/MemebrCard/memeberCard';
import Model from '../../Components/Model/model';
import AddmemeberShip from '../../Components/AddmemberShip/addmemberShip';
import Addmembers from '../../Components/Addmembers/addmembers';
import { NoFlash } from '@mui/icons-material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
function Member() {

  const [addMemberShip, setAddMemberShip] = useState(false);
  const [addMember, setMember] = useState(false);

  const [data, setData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [search, setSearch] = useState("");
  const [isSearchModeOn, setIsSearchModeOn] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [startFrom, setStartFrom] = useState(0);
  const [endTo, setEndTo] = useState(9);
  const [totalData, setTotalData] = useState(0);
  const [limit, setLimit] = useState(9);

  const [noOfPage, setNoOfPage] = useState(0);

  useEffect(() => {
    fetchData(0, 9);
  }, [])
  // This is for the page card for the memeber ok 
  const fetchData = async (skip, limits) => {

    await axios.get(`http://localhost:4001/members/all-member?skip=${skip}&limit=${limits}`, { withCredentials: true }).then((response) => {
      console.log(response);

      let totalData = response.data.totalMembers;
      setTotalData(totalData);
      setData(response.data.members)

      let extraPage = totalData % limit === 0 ? 0 : 1;
      let totalPage = parseInt(totalData / limit + extraPage);

      setNoOfPage(totalPage);

      if (totalData === 0) {
        setStartFrom(-1);
        setEndTo(0);
      } else if (totalData < 10) {
        setStartFrom(0);
        setEndTo(totalData)
      }

    }).catch(err => {
      toast.error("Something technical error.")
      console.log(err)
    })




  }

  const handleMemberShip = () => {
    setAddMemberShip(prev => !prev);
  }

  const handleMembers = () => {
    setMember(prev => !prev);
  }

  const handlePrev = () => {
    if (currentPage !== 1) {
      let currPage = currentPage - 1;
      setCurrentPage(currPage);
      var from = (currPage - 1) * 9;
      var to = (currPage * 9);
      setStartFrom(from);
      setEndTo(to);

      let skipVal = skip - 9;
      setSkip(skipVal);
      fetchData(skipVal, 9)

    }
  }

  const handleNext = () => {
    if (currentPage !== noOfPage) {
      let currPage = currentPage + 1;
      setCurrentPage(currPage);
      var from = (currPage - 1) * 9;
      var to = (currPage * 9);
      if (to > totalData) {
        to = totalData;
      }

      setStartFrom(from);
      setEndTo(to);

      let skipVal = skip + 9;
      setSkip(skipVal);
      fetchData(skipVal, 9)
    }
  }

  const handleSearchBtn = async () => {
    if (search !== "") {
      setIsSearchModeOn(true);
      await axios.get(`http://localhost:4001/members/search-member?searchTerm=${search}`, { withCredentials: true }).then((response) => {
        console.log(response);
        setData(response.data.members);
        setTotalData(response.data.totalMember);
        // toast.success("fetch data")

      }).catch(err => {
        toast.error("Something Technical Error.");
        console.log(err);
      })
    } else {
      if(isSearchModeOn) {
        window.location.reload();
      } else {
        toast.error("Enter valid value for search.");
      }
    }

  }

  return (
    <div className='w-3/4 text-black p-5 h-[100vh]'>
      {/* block for banner */}
      <div className='border-2 bg-slate-900 text-white p-3 flex justify-between  font-serif rounded-lg'>
        <div className='border-2 pl-3 pr-3 pt-1 pb-1 rounded-2xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ' onClick={() => handleMembers()}>Add Memeber <FitnessCenterIcon /></div>
        <div className='border-2 pl-3 pr-3 pt-1 pb-1 rounded-2xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black' onClick={() => handleMemberShip()}>Memebership <AddIcon /></div>
      </div>

      {/* block for back to dashboard  */}
      <div className='font-semibold font-serif mt-1'>
        <Link to={'/dashboard'}> <ArrowBackIcon /> Back to Dashboard</Link>
      </div>

      {/* block for the input and search buttom  */}
      <div className='mt-5 w-1/2 flex gap-2'>
        <input value={search} onChange={(e) => { setSearch(e.target.value) }} type='text' className='border-2 w-full p-2 rounded-lg ' placeholder='Search by Name or Phone Number..' />
        <div onClick={() => { handleSearchBtn() }} className='bg-slate-900 text-white p-2 border-2 rounded-lg hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black cursor-pointer'><SearchIcon /></div>
      </div>

      {/* total Memeber and member shown buttom section ok */}
      <div className='mt-5 text-xl flex justify-between text-slate-900 font-serif'>
        <div>Total Numbers { isSearchModeOn? totalData: null}</div>
        {
          !isSearchModeOn ? <div className='flex gap-5'>
            <div>{startFrom + 1} - {endTo} of {totalData} Memebers </div>
            <div className={`w-8 h-8 cursor-pointer border-2 flex items-center justify-center hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : null}`} onClick={() => handlePrev()}><ChevronLeftIcon /></div>
            <div className={`w-8 h-8 cursor-pointer border-2 flex items-center justify-center hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black ${currentPage === noOfPage ? 'bg-gray-200 text-gray-400' : null}`} onClick={() => handleNext()}><ChevronRightIcon /></div>
          </div> : null
        }
      </div>

      {/* Card section ok */}
      <div className='bg-slate-100 mt-5 p-5 rounded-lg grid gap-2 grid-cols-3 overflow-x-auto h-[65%]'>

        {/* div for memeber cards */}
        {
          data.map((item, index) => {
            return (
              <MemeberCard item={item} />
            );
          })
        }



      </div>

      {addMemberShip && <Model header={"Membership"} handleClose={handleMemberShip} content={<AddmemeberShip handleClose={handleMemberShip} />} />}
      {addMember && <Model header={"Add New Member"} handleClose={handleMembers} content={<Addmembers />} />}
      <ToastContainer />
    </div>
  )
}

export default Member
