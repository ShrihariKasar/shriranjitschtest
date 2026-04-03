import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/auth/verify-email/${token}/`
        );
        const data = await res.json();

        if (res.ok) {
          alert("Email verified ✅ You can now login");
          navigate("/");
        } else {
          alert(data.error || "Verification failed");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    };

    verify();
  }, []);

  return <h2 style={{ textAlign: "center" }}>Verifying your email...</h2>;
}