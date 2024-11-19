import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";

import style from "../style/signin.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

export default function RecoverPass() {
  const navigate = useNavigate();

  // if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  // if (serverError)
  //   return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  const inputFields = [
    {
      name: "OTP",
      placeholder: "OTP",
    },
  ];
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={style.glass}>
          <Header
            heading="Recover your password"
            text="Enter OTP to get password"
          />{" "}
          <br /> <br /> <br />
          <form className="py-1">
            <div className="textbox flex flex-col  items-center gap-6">
              <div className="input">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                {inputFields.map((item) => (
                  <input
                    className={style.textbox}
                    style={{ width: "100%" }}
                    name={item.name}
                    placeholder={item.placeholder}
                  />
                ))}
              </div>

              <Button>Submit</Button>
            </div>

            <Footer text="can't get OTP" subText="Resend" to="/recoverPass" />
          </form>
        </div>
      </div>
    </div>
  );
}
