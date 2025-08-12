import React, { useState, useEffect } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const MemberDetail = () => {

    const [status, setStatus] = useState("Pending");
    const [renew, setRenew] = useState(false);
    const [data, setData] = useState(null);
    const [membership, setMembership] = useState([]);
    const [planMember, setPlanMember] = useState("");
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(()=>{
        fetchData();
        fetchMembership();
    },[]);

    const fetchMembership = async () => {
        await axios.get("http://localhost:4001/plans/get-membership", {withCredentials: true}).then((response) => {
            setMembership(response.data.membership)
            // console.log(response)
            setPlanMember(response.data.membership[0]._id)
        }).catch(err => {
            console.log(err);
            toast.error("Something wrong while fetching the Membershp.")
        })
    }

    const fetchData = async () => {
        await axios.get(`http://localhost:4001/members/get-member/${id}`, {withCredentials: true}).then((response) => {
            console.log(response);
            setData(response.data.member);
            setStatus(response.data.member.status);
            // toast.success(response.data.message);
            
        }).catch(err => {
            console.log(err);
            toast.error("Something wrong while fetching the Member Details.")
        })
    }

    const handleSwitchBtn = async() => {
        let statuss = status === "Active" ? "Pending" : "Active";

        await axios.post(`http://localhost:4001/members/status-change/${id}`, {status: statuss}, {withCredentials: true}).then((response) => {
            toast.success("Status Changed Sucessfully.")
        }).catch(err => {
            console.log(err);
            toast.error("Failed to Changed the status.");
        })
        setStatus(statuss);
    }

    const isDateInPast = (inputDate) => {
        const today = new Date();
        const givenDate = new Date(inputDate);//convert the input to a date object

        return givenDate < today;
    }

    const handleOnChangeSelect = (event)=> {
        let value = event.target.value;
        setPlanMember(value);
    }
    console.log(planMember);

    const handleRenewSaveBtn = async() => {
        await axios.put(`http://localhost:4001/members/update-member-plan/${id}`, {membership:membership}, {withCredentials: true}).then((response)=>{
            toast.success(response.data.message);
        }).catch(err => {
            console.log(err);
            toast.error('Failed to update the membership.')    
        })
    }

    return (
        <div className='w-3/4 text-black p-5'>
            <div onClick={() => { navigate(-1) }} className='w-fit bg-slate-900 p-2 text-xl border-2 text-white rounded-xl font-serif cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black'>
                <ArrowBackIcon /> Go Back
            </div>
            <div className='mt-10 p-2'>
                <div className='w-[100%] h-fit flex'>
                    <div className='W-1/3 mx-auto '>
                        <img className='mx-auto w-[500px] h-[600px]' src={data?.profilePic} />
                    </div>

                    <div className='w-2/3 mt-5 text-xl font-serif p-5'>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Name : {data?.name}</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Mobile : {data?.mobileNo}</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Address : {data?.address}</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Joined Data : {data?.createdAt.slice(0,10).split('-').reverse().join('-') }</div>
                        <div className='mt-1 mb-2 text-2xl font-semibold'>Next Bill Data : {data?.nextBillDate.slice(0,10).split('-').reverse().join('-') }</div>
                        <div className='mt-1 mb-2 flex gap-4 text-2xl font-semibold'>Status : <Switch onColor='#6366f1' checked={status == "Active"} onChange={() => handleSwitchBtn()} /> </div>
                        {
                            isDateInPast(data?.nextBillDate) && <div onClick={() => { setRenew(prev => !prev) }} className={`mt-1 p-3 rounded-lg border-2 border-slate-900 text-center w-full md:w-1/2 cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white ${renew && status === "Active" ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:white' : null}`}>Renew</div>

                        }
                        {/* This section for membership plan ok */}
                        {
                            renew && status === "Active" ? (
                                <div className='rounded-lg p-3 mt-5 h-fit bg-slate-100 w-[90%] font-serif'>
                                    <div className='w-full'>
                                        <div>Membership</div>
                                        <div className=' flex justify-between items-center '>

                                            <div className='w-[70%]'>


                                                <select value={planMember} onChange={handleOnChangeSelect} className='w-full border-2 p-3 rounded-lg'>
                                                   {
                                                        membership.map((item, index) => {
                                                            return(
                                                                <option value={item._id}>{item.months} month plan</option>
                                                            );
                                                        })
                                                   }
                                                   
                                                </select>
                                            </div>

                                            <div onClick={()=>{handleRenewSaveBtn()}} className={`p-3 rounded-lg  border-2 border-slate-900 text-center w-[20%] cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white`}>
                                                Save
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                        

                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default MemberDetail
