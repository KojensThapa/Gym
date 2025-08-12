import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
function AddmemeberShip({ handleClose }) {
  const [inputField, setInputField] = useState({ months: "", price: "" });
  const [memberShip, setMembership] = useState([]);

  const [selectedOption, setSelectedOption] = useState("");
  const [memberShipList, setMembershipList] = useState([]);

  const handleOnChange = (event, name) => {
    setInputField({ ...inputField, [name]: event.target.value });
  };
  // console.log(inputField);
  useEffect(() => {
    fetchMemberShip();
  }, []);

  const fetchMemberShip = async () => {
    await axios
      .get("http://localhost:4001/plans/get-membership", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        setMembership(response.data.membership);
        // toast.success(response.data.membership.length + " Membership fetch.");
        if (response.data.membership.length === 0) {
          return toast.error("No any Membership Added yet.", {
            className: "text-lg",
          });
        } else {
          let a = response.data.membership[0]._id;
          setSelectedOption(a);
          setInputField({ ...inputField, membership: a });
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch membership");
      });
  };

  const handleAddMembership = async () => {
    await axios
      .post("http://localhost:4001/plans/add-membership", inputField, {
        withCredentials: true,
      })
      .then((response) => {
        toast.success(response.data.message);
        handleClose();
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error); // Shows things like "Months must be at least 1"
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      });
  };

  const handleOnChangeSelect = (event) => {
    let value = event.target.value;
    setSelectedOption(value);
    setInputField({ ...inputField, membership: value });
  };

  const handleDeleteMembership = async () => {
    if (!selectedOption) {
      toast.warning("Please select a membership to delete.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:4001/plans/delete-membership/${selectedOption}`,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Membership deleted.");

      // Refresh membership list
      fetchMemberShip();
      setSelectedOption(""); // reset selection
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="text-black">
      <div className="flex flex-wrap gap-5 items-center justify-center">
        {/* block for membership Details */}
        {memberShip.map((item, index) => {
          return (
            <>
              <div className="text-lg bg-slate-900 text-white border-2 pl-2 pr-2 flex-col gap-3 justify-between pt-1 pb-1 rounded-xl font-semibold hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black">
                <div>
                  <div>{item.months} Month Membership</div>
                  <div>Npr {item.price}</div>
                </div>
              </div>
            </>
          );
        })}
      </div>

      <hr className="my-10" />

      <div className="flex gap-10 pb-10">
        <input
          value={inputField.months}
          onChange={(event) => {
            handleOnChange(event, "months");
          }}
          className="border-2 rounded-lg text-lg w-1/3  h-1/2 p-2"
          type="number"
          placeholder="Add no. of Months"
        />
        <input
          value={inputField.price}
          onChange={(event) => {
            handleOnChange(event, "price");
          }}
          className="border-2 rounded-lg text-lg w-1/3  h-1/2 p-2"
          type="number"
          placeholder="Add Price"
        />
        <div
          onClick={() => {
            handleAddMembership();
          }}
          className="text-lg border-2 p-1 w-auto mt-0 rounded-xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black"
        >
          Add <AddIcon />
        </div>
      </div>

      {/* To delete the membership */}
      <div className=" flex gap-4">
        <div
          onClick={handleDeleteMembership}
          className={`text-lg border-2 pr-3 pl-3 flex items-center rounded-xl cursor-pointer ${
            selectedOption
              ? "hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          <DeleteIcon className="mr-1" />
          Delete
        </div>

        <div className="w-full">
          <select
            value={selectedOption}
            onChange={handleOnChangeSelect}
            className="border-2 w-1/2 pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12 placeholder:text-gray"
          >
            {memberShip.map((item, index) => {
              return (
                <option key={index} value={item._id}>
                  {item.months} months membership. Npr {item.price}{" "}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default AddmemeberShip;
