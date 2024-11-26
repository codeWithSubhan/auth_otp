import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

import avatar from "../assets/default.png";
import style from "../style/signin.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import useForm from "../hooks/useForm";
import { BASE_URL } from "../constant/constant";
import { login } from "../features/AuthSlice";

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuth } = useSelector((store) => store.auth);

  const { formData, handleChange } = useForm({
    email: "",
    password: "",
  });

  const inputFields = [
    {
      name: "email",
      placeholder: "email",
      value: formData.email,
      onchange: handleChange,
    },
    {
      name: "password",
      placeholder: "password",
      onchange: handleChange,
      value: formData.password,
    },
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/users/login`, formData);

      console.log("res:", res);
      if (res.status === 201) {
        toast.success("Successfully logged in!");
        dispatch(login(res.data));
        navigate("/");
      }
    } catch (err) {
      console.log("err:", err);
      if (err.response) toast.error(err.response.data.message);
      else toast.error(err.message);
    }
  }

  useEffect(() => {
    if (isAuth) {
      navigate("/", { replace: true });
    }
  }, [isAuth, navigate]);

  if (isAuth) return;

  return (
    <div className="container mx-auto">
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
                    value={item.value}
                    onChange={item.onchange}
                    key={item.name}
                  />
                ))}
              </div>
              <Button onClick={handleSubmit}>Log In</Button>
            </div>
            <div className="flex justify-between">
              <Footer
                text="Forgot Password"
                subText="Reset now"
                to="/resetpass"
              />

              <Footer
                text="Don't have account"
                subText="Sign Up"
                to="/signup"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
