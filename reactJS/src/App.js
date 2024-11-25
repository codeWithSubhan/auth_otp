import { BrowserRouter, Route, Routes } from "react-router-dom";

import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import ResetPass from "./pages/ResetPass";
import RecoverPass from "./pages/RecoverPass";
import ProtectedRoute from "./features/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="signup" element={<Signup />} />
        <Route path="signin" element={<Signin />} />
        <Route path="resetpass" element={<ResetPass />} />
        <Route path="recoverPass" element={<RecoverPass />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
