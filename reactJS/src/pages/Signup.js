import { useNavigate } from "react-router-dom";
import avatar from "../assets/avatar_2.jpeg";
import toast, { Toaster } from "react-hot-toast";

import style from "../style/signin.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import { BASE_URL } from "../constant/constant";
import useForm from "../hooks/useForm";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Signup() {
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.auth);

  const { formData, handleChange } = useForm({
    email: "",
    password: "",
    name: "",
    contact: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.status === "success") {
        navigate("/signin");
        return toast.success("Successfully created account!");
      }

      if (result.status === "error") return toast.error(result.message);

      toast.error("Internal sever error");
    } catch (err) {
      toast.error(err.message);
    }
  }

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
    {
      name: "name",
      placeholder: "name",
      onchange: handleChange,
      value: formData.name,
    },
    {
      name: "contact",
      placeholder: "contact",
      onchange: handleChange,
      value: formData.contact,
    },
  ];

  useEffect(() => {
    console.log(isAuth);
    if (isAuth) {
      navigate("/", { replace: true });
    }
  }, [isAuth, navigate]);

  if (isAuth) return;
  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={style.glass}>
          <Header heading="Create Account" text="Sign up to connect with us." />
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
            <div className="textbox flex flex-col  items-center gap-3">
              <div className="flex items-center gap-3">
                {inputFields.slice(0, 2).map((item) => (
                  <input
                    className={style.textbox}
                    name={item.name}
                    placeholder={item.placeholder}
                    value={item.value}
                    onChange={item.onchange}
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
                    onChange={item.onchange}
                  />
                ))}
              </div>
              <Button onClick={handleSubmit}>Register</Button>
            </div>

            <Footer text="Already Register" subText="Login now" to="/signin" />
          </form>
        </div>
      </div>
    </div>
  );
}
