import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/avatar_2.jpeg";
import toast, { Toaster } from "react-hot-toast";

import style from "../style/signin.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import useForm from "../hooks/useForm";
import axios from "axios";
import { BASE_URL } from "../constant/constant";

export default function ResetPass() {
  const navigate = useNavigate();
  const { formData, handleChange } = useForm({ email: "" });
  const inputFields = [
    {
      name: "email",
      placeholder: "email",
      value: formData.email,
      onChange: handleChange,
    },
  ];

  async function handleGetOTP(e) {
    e.preventDefault();
    console.log(formData);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/users/forgotPassword`,
        formData
      );

      if (res.status === 200) {
        toast.success("OTP send to your email!");
        navigate("/recoverPass");
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  }
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={style.glass}>
          <Header heading="reset your password" text="Enter email to get OTP" />

          <form className="py-1">
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={localStorage.getItem("photo") || avatar}
                  className={style.profile_img}
                  alt="avatar"
                />
              </label>
            </div>

            <div className="textbox flex flex-col  items-center gap-6">
              {inputFields.map((item) => (
                <input
                  className={style.textbox}
                  style={{ width: "100%" }}
                  name={item.name}
                  placeholder={item.placeholder}
                  value={item.value}
                  onChange={item.onChange}
                />
              ))}

              <Button onClick={handleGetOTP}>Get OTP</Button>
            </div>

            <Footer text="I know password" subText="Login now" to="/signin" />
          </form>
        </div>
      </div>
    </div>
  );
}
