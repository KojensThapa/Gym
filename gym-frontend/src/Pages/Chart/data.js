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