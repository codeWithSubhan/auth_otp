import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/default.png";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import style from "../style/signin.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { BASE_URL } from "../constant/constant";
import useForm from "../hooks/useForm";
import { logout } from "../features/AuthSlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState(
    localStorage.getItem("photo", image) || ""
  );
  const { formData, handleChange, setFormData } = useForm({
    email: "",
    name: "",
    password: "********",
    contact: "",
    photo: "",
  });

  const inputFields = [
    {
      name: "email",
      placeholder: "email",
      value: formData.email,
    },
    {
      name: "password",
      placeholder: "password",
      value: formData.password,
      isReadOnly: true,
    },
    {
      name: "name",
      placeholder: "name",
      value: formData.name,
    },
    {
      name: "contact",
      placeholder: "contact",
      value: formData.contact,
    },
  ];

  function handleFile(e) {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();

    reader.onload = function (e) {
      setPreview(e.target.result);
    };

    reader.readAsDataURL(file);
  }

  async function getUseData() {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/getMe`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      setFormData(res.data.data.user);
    } catch (err) {
      console.log("err:", err);
      toast.error(err.response.data.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      if (image) data.append("photo", image);

      const res = await fetch(`${BASE_URL}/api/users/updateMe`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();

      if (result.status === "success") {
        if (preview) localStorage.setItem("photo", preview);
        return toast.success("Successfully upated data!");
      }

      if (result.status === "error") return toast.error(result.message);

      toast.error("Internal sever error");
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleLogOut() {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/logout`);
      if (res.status === 200) {
        toast.success("Successfully logout!");
        dispatch(logout());
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  async function handleDeleteUserAccount() {
    try {
      const res = await axios.delete(`${BASE_URL}/api/users/deleteMe`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 204) {
        dispatch(logout());
        localStorage.removeItem("photo");
        toast.error("Successfully deleted account!");
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  useEffect(() => {
    getUseData();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex justify-center items-center h-screen">
        {formData && (
          <div className={style.glass}>
            <Header heading="Your Profile" text="You can update details" />

            <form className="py-1">
              <div className="profile flex justify-center py-4">
                <label htmlFor="profile">
                  <img
                    src={preview || avatar}
                    className={style.profile_img}
                    alt="avatar"
                  />
                </label>

                <input
                  onChange={handleFile}
                  type="file"
                  id="profile"
                  name="profile"
                />
              </div>

              <div className="textbox flex flex-col  items-center gap-3">
                <div className="flex items-center gap-3">
                  {inputFields.slice(0, 2).map((item) => (
                    <input
                      className={style.textbox}
                      name={item.name}
                      placeholder={item.placeholder}
                      value={item.value}
                      readOnly={item.isReadOnly}
                      onChange={handleChange}
                      key={item.name}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {inputFields.slice(2, 4).map((item) => (
                    <input
                      className={style.textbox}
                      name={item.name}
                      placeholder={item.placeholder}
                      value={item.value}
                      onChange={handleChange}
                      key={item.name}
                    />
                  ))}
                </div>
                <Button onClick={handleSubmit}>Update</Button>
              </div>

              <div className="flex justify-between">
                <Footer subText="Log Out" onClick={handleLogOut} />
                <Footer
                  subText="Delete My Account"
                  onClick={handleDeleteUserAccount}
                />
              </div>
            </form>
          </div>
        )}

        {!formData && <p>Loading...</p>}
      </div>
    </div>
  );
}
