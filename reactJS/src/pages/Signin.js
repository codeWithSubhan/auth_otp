import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";

import style from "../style/signin.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

export default function Signin() {
  const navigate = useNavigate();

  // if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  // if (serverError)
  //   return <h1 className="text-xl text-red-500">{serverError.message}</h1>;
  const inputFields = [
    {
      name: "email",
      placeholder: "email",
    },
    {
      name: "password",
      placeholder: "password",
    },
  ];
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={style.glass}>
          <Header
            heading="log into your account"
            text="Enter credential to log in"
          />

          <form className="py-1">
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img src={avatar} className={style.profile_img} alt="avatar" />
              </label>

              <input
                // onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
              />
            </div>

            <div className="textbox flex flex-col  items-center gap-6">
              <div className="flex items-center gap-6">
                {inputFields.map((item) => (
                  <input
                    className={style.textbox}
                    name={item.name}
                    placeholder={item.placeholder}
                  />
                ))}
              </div>
              <Button>Log In</Button>
            </div>

            <Footer
              text="Forgot Password"
              subText="Reset now"
              to="/resetpass"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
