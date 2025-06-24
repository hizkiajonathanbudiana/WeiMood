import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import NavBar from "../components/NavBar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const axiosInstance = useMemo(
    () =>
      axios.create({
        baseURL: "http://localhost:3000",
        withCredentials: true,
      }),
    []
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Mencoba login dengan:", { email, password });

      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      console.log("Dapat respons dari server:", response);

      if (response.status === 200 && response.data.token) {
        console.log(
          "Login SUKSES. Cookie seharusnya sudah ditanam. Pindah ke dashboard..."
        );
        navigate("/dashboard");
      } else {
        alert("Login gagal, respons dari server tidak sesuai.");
      }
    } catch (error) {
      console.error("Login error:", error.response || error);
      alert(
        "Login gagal: " +
          (error.response?.data?.message || "Koneksi ke server gagal.")
      );
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/google",
        {
          token: credentialResponse.credential,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.success) {
        navigate("/dashboard");
      } else {
        alert("Google login failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed");
    }
  };

  return (
    <div className="login-container">
      <NavBar />
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          handleGoogleLogin(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
}

export default Login;
