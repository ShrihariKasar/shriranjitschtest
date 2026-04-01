import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

import bg from "../../assets/bg.png";
import illustration from "../../assets/illustration.png";
import logo from "../../assets/logo.png";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // 🔐 LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup
  const [fileName, setFileName] = useState("No file chosen");
  const [signupData, setSignupData] = useState({
  email: "",
  password: "",
  confirmPassword: "",
  schoolName: "",
  address: "",
  city: "",
  phone: "",
});

  // popup
  const [showForgot, setShowForgot] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const navigate = useNavigate();

  // 🔥 LOGIN FUNCTION (FINAL)
  const handleLogin = async () => {
  if (!email || !password) {
    alert("Enter email & password");
    return;
  }

  console.log("SENDING:", { email, password });

  try {
    const res = await fetch("https://northmarkschoolerp.pythonanywhere.com/api/school/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const text = await res.text();
    console.log("RAW RESPONSE:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      alert("Invalid backend response");
      return;
    }

    console.log("PARSED:", data);
    console.log("EMAIL STATE:", email);
    console.log("PASSWORD STATE:", password);

    if (!res.ok) {
      alert(data.error || data.detail || "Invalid credentials");
      return;
    }

    localStorage.setItem("token", data.access);
localStorage.setItem("role", data.role);

alert("Login successful ✅");

// 🔥 ADD THIS
if (data.role === "admin") {
  navigate("/admin/dashboard");
} else {
  navigate("/staff/dashboard");
}
  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  }
};

  // 🔁 AUTO LOGIN CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/staff/dashboard");
      }
    }
  }, []);

const handleSignup = async () => {
  const {
    email,
    password,
    confirmPassword,
    schoolName,
    address,
    city,
    phone,
  } = signupData;

  // 🔴 VALIDATION
  if (!email || !password || !confirmPassword) {
    alert("Email & password required");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("https://northmarkschoolerp.pythonanywhere.com/api/school/create-school/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,

        // 🔥 EXTRA DATA (for future use)
        school_name: schoolName,
        address: address,
        city: city,
        phone: phone,
      }),
    });

    const data = await res.json();
    console.log("SIGNUP:", data);

    if (!res.ok) {
      alert(data.error || "Signup failed");
      return;
    }

    setShowVerify(true); // ✅ show popup

    // 🔁 RESET FORM
    setSignupData({
      email: "",
      password: "",
      confirmPassword: "",
      schoolName: "",
      address: "",
      city: "",
      phone: "",
    });

    setIsLogin(true);

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
};

  const handleForgot = () => {
    if (!forgotEmail) {
      alert("Enter email");
      return;
    }

    alert("Reset link sent to " + forgotEmail);
    setShowForgot(false);
  };

  return (
    <div className="auth-wrapper" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay"></div>
      <img src={logo} alt="logo" className="site-logo" />

      <div className="auth-card">
        {/* LEFT */}
        <div className="left-panel">
          <div>
            <h2>Continue Managing!</h2>
            <p>
              Pick up right where you left off. login login to the world's favorite fast, easy, and 100% free school management platform{" "}
              {isLogin ? "login" : "Sign up"} to your system
            </p>
          </div>

          <div className="illustration-box">
            <img src={illustration} alt="illustration" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          <div className="icon-box">
            <i className="fas fa-graduation-cap"></i>
          </div>

          <h3>1</h3>
          <p className="sub">
            Login to your account or <span>create new one</span>
          </p>

          {/* TOGGLE */}
          <div className="toggle">
            <div className={`slider ${isLogin ? "" : "right"}`}></div>
            <button onClick={() => setIsLogin(true)}>Login</button>
            <button onClick={() => setIsLogin(false)}>Sign up</button>
          </div>

          {/* LOGIN */}
          {isLogin ? (
            <div className="form">
              <label>Email</label>
              <input
  type="text"
  value={email || ""}
  onChange={(e) => {
    console.log("Typing email:", e.target.value);
    setEmail(e.target.value);
  }}
/>
<label>Password</label>
<input
  type="password"
  value={password || ""}
  onChange={(e) => {
    console.log("Typing password:", e.target.value);
    setPassword(e.target.value);
  }}
/>

              <div className="form-row">
                <label className="remember">
                  <input type="checkbox" /> Remember me
                </label>

                <span className="link" onClick={() => setShowForgot(true)}>
                  Forgot password?
                </span>
              </div>

              <button
                className="primary-btn"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          ) : (
 /* SIGNUP */
<div className="form grid">
  {/* LOGO */}
  <div className="file-upload">
    <label className="file-label">
      Choose Logo
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) setFileName(file.name);
        }}
      />
    </label>
    <span className="file-name">{fileName}</span>
  </div>

  {/* SCHOOL NAME */}
  <input
    placeholder="School Name"
    value={signupData.schoolName || ""}
    onChange={(e) =>
      setSignupData({ ...signupData, schoolName: e.target.value })
    }
  />

  {/* EMAIL */}
  <input
    placeholder="Email"
    value={signupData.email}
    onChange={(e) =>
      setSignupData({ ...signupData, email: e.target.value })
    }
  />

  {/* ADDRESS */}
  <input
    placeholder="Address"
    value={signupData.address || ""}
    onChange={(e) =>
      setSignupData({ ...signupData, address: e.target.value })
    }
  />

  {/* CITY */}
  <input
    placeholder="City"
    value={signupData.city || ""}
    onChange={(e) =>
      setSignupData({ ...signupData, city: e.target.value })
    }
  />

  {/* PHONE */}
  <input
    placeholder="Contact Number"
    value={signupData.phone || ""}
    onChange={(e) =>
      setSignupData({ ...signupData, phone: e.target.value })
    }
  />

  {/* PASSWORD */}
  <input
    type="password"
    placeholder="Password"
    value={signupData.password}
    onChange={(e) =>
      setSignupData({ ...signupData, password: e.target.value })
    }
  />

  {/* CONFIRM PASSWORD */}
  <input
    type="password"
    placeholder="Confirm Password"
    value={signupData.confirmPassword}
    onChange={(e) =>
      setSignupData({
        ...signupData,
        confirmPassword: e.target.value,
      })
    }
  />

  <button className="primary-btn full" onClick={handleSignup}>
    Register School
  </button>
</div>
          )}

          <p className="support">
            Need help? <span>Contact support</span>
          </p>
        </div>
      </div>

      {/* FORGOT PASSWORD */}
      {showForgot && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Forgot password?</h3>

            <input
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />

            <button className="popup-btn" onClick={handleForgot}>
              Confirm
            </button>

            <span className="close" onClick={() => setShowForgot(false)}>
              ✖
            </span>
          </div>
        </div>
      )}

      {/* VERIFY */}
      {showVerify && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Email Verification</h3>
            <p>Verification link sent to {signupData.email}</p>

            <button
              className="popup-btn"
              onClick={() => setShowVerify(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;