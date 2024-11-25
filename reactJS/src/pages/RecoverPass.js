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

export default function RecoverPass() {
  const navigate = useNavigate();
  const { formData, handleChange } = useForm({ OTP: "", password: "" });
  const inputFields = [
    {
      name: "OTP",
      placeholder: "Enter 6 digit OTP",
      value: formData.OTP,
      onChange: handleChange,
      label: "",
    },
    {
      name: "password",
      placeholder: "New Password",
      value: formData.password,
      onChange: handleChange,
    },
  ];
  async function handleSubmit(e) {
    e.preventDefault();
    console.log(formData);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/users/resetPassword/${formData.OTP}`,
        formData
      );

      if (res.status === 200) {
        toast.success("Successfully reset password!");
        navigate("/signin", { replace: true });
      }
    } catch (err) {
      console.log("err:", err);
      toast.error(err.response?.data.message);
    }
  }
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={style.glass}>
          <Header heading="Recover your password" text="Create new password" />{" "}
          <br /> <br /> <br />
          <form className="py-1">
            <div className="textbox flex flex-col  items-center gap-6">
              {inputFields.map((item) => (
                <input
                  className={style.textbox}
                  style={{ width: "100%" }}
                  name={item.name}
                  placeholder={item.placeholder}
                  value={item.value}
                  onChange={item.onChange}
                  key={item.name}
                />
              ))}

              <Button onClick={handleSubmit}>Submit</Button>
            </div>

            <Footer text="I know password" subText="Login now" to="/signin" />
          </form>
        </div>
      </div>
    </div>
  );
}
