import axios from "axios";

const getMonthlyJoined = async () => {
    try {
       
         const response = await axios.get("http://localhost:4001/members/monthlyMember", {withCredentials: true});
         return response.data;
    } catch (error) {
        console.error("Error while fetching Data: ", error)
        throw error;
    }
}

const expireWithInThreeDays = async () => {
    try {
       
         const response = await axios.get("http://localhost:4001/members/expire-within-3-days", {withCredentials: true});
         return response.data;
    } catch (error) {
        console.error("Error while fetching Data: ", error)
        throw error;
    }
}


const expireWithIn4To7Days = async () => {
    try {
       
         const response = await axios.get("http://localhost:4001/members/exipred-within-4-7-days", {withCredentials: true});
         return response.data;
    } catch (error) {
        console.error("Error while fetching Data: ", error)
        throw error;
    }
}


const expiredMember = async () => {
    try {
       
         const response = await axios.get("http://localhost:4001/members/expired-member", {withCredentials: true});
         return response.data;
    } catch (error) {
        console.error("Error while fetching Data: ", error)
        throw error;
    }
}


const inactiveMember = async () => {
    try {
       
         const response = await axios.get("http://localhost:4001/members/inactive-member", {withCredentials: true});
         return response.data;
    } catch (error) {
        console.error("Error while fetching Data: ", error)
        throw error;
    }
}
export {getMonthlyJoined, expireWithInThreeDays, expireWithIn4To7Days, expiredMember, inactiveMember}
