import React, { useState, useEffect } from "react";
import axios from "axios";

import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";
import { toast, ToastContainer } from "react-toastify";

function Addmembers() {
  const [inputField, setInputField] = useState({
    name: "",
    mobileNo: "",
    address: "",
    membership: "",
    profilePic:
      "https://static.vecteezy.com/system/resources/thumbnails/005/346/410/small_2x/close-up-portrait-of-smiling-handsome-young-caucasian-man-face-looking-at-camera-on-isolated-light-gray-studio-background-photo.jpg",
    joiningDate: "",
  });

  const [imageLoader, setImageLoder] = useState(false);
  const [memberShipList, setMembershipList] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  const handleOnChange = (event, name) => {
    setInputField({ ...inputField, [name]: event.target.value });
  };

  console.log(inputField);

  const uploadImage = async (event) => {
    console.log("Image Uploading.");

    setImageLoder(true);

    const file = event.target.files;
    const data = new FormData();

    data.append("file", file[0]);

    //dyvoygosh

    data.append("upload_preset", "gym-management");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dyvoygosh/image/upload",
        data
      );
      console.log(response);
      const imageUrl = response.data.url;
      setInputField({ ...inputField, ["profilePic"]: imageUrl });
      setImageLoder(false);
    } catch (error) {
      console.log(error);
      setImageLoder(false);
    }
  };

  useEffect(() => {
    fetchMemberShip();
    console.log(inputField);
  }, []);

  const fetchMemberShip = async () => {
    await axios
      .get("http://localhost:4001/plans/get-membership", {
        withCredentials: true,
      })
      .then((response) => {
        setMembershipList(response.data.membership);
        if (response.data.membership.length === 0) {
          return toast.error("No any Membership Added yet.", {
            className: "text-lg",
          });
        } else {
          let a = response.data.membership[0]._id;
          setSelectedOption(a);
          setInputField({ ...inputField, membership: a });
        }

        // toast.success(response.data.message)
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch the membership");
      });
  };

  const handleOnChangeSelect = (event) => {
    let value = event.target.value;
    setSelectedOption(value);
    setInputField({ ...inputField, membership: value });
  };

  const handleAddRegister = async () => {
    await axios
      .post("http://localhost:4001/members/register-member", inputField, {
        withCredentials: true,
      })
      .then((response) => {
        // toast.success(response.data.message);
        toast.success("Added new Member successfully.");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.data && err.response.data.error) {
          toast.error(err.response.data.error); // 🎯 show custom validation message
        } else {
          toast.error("Something went wrong. Please try again."); // fallback
        }
      });
  };

  return (
    <div className=" text-black font-serif">
      <div className="grid grid-cols-2 text-lg gap-5">
        <input
          value={inputField.name}
          onChange={(event) => {
            handleOnChange(event, "name");
          }}
          type="text"
          placeholder="Name of the Joinee"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />
        <input
          value={inputField.mobileNo}
          onChange={(event) => {
            handleOnChange(event, "mobileNo");
          }}
          type="text"
          placeholder="Mobile no."
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />
        <input
          value={inputField.address}
          onChange={(event) => {
            handleOnChange(event, "address");
          }}
          type="text"
          placeholder="Enter Address"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />
        <input
          value={inputField.joiningDate}
          onChange={(event) => {
            handleOnChange(event, "joiningDate");
          }}
          type="date"
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />

        <select
          value={selectedOption}
          onChange={handleOnChangeSelect}
          className="border-2 w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12 placeholder:text-gray"
        >
          {memberShipList.map((item, index) => {
            return (
              <option key={index} value={item._id}>
                {item.months} months membership. Npr {item.price}{" "}
              </option>
            );
          })}
        </select>

        <input
          type="file"
          onChange={(e) => {
            uploadImage(e);
          }}
          className=" w-[90%] pl-3 pr-3 pt-2 pb-2 border-slate-400 rounded-md h-12"
        />

        {/* image section */}
        <div className="w-[100px] h-[100px] ">
          <img
            className="rounded-full w-full h-full"
            src={inputField.profilePic}
            alt="Profile img"
          />
          {imageLoader && (
            <Stack sx={{ color: "grey.500" }} spacing={2}>
              <LinearProgress color="success" />
            </Stack>
          )}
        </div>

        <div
          onClick={() => handleAddRegister()}
          className="p-3 border-2 w-28 text-lg h-14 text-center  bg-slate-900 text-white rounded-2xl cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black"
        >
          Register
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Addmembers;
