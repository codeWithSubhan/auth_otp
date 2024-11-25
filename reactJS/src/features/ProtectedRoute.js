import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuth } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  console.log("render");

  useEffect(() => {
    if (!isAuth) {
      navigate("/signin", { replace: true });
    }
  }, [isAuth, navigate]);

  return isAuth ? children : null;
}

export default ProtectedRoute;
