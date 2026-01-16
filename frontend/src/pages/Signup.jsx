import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Optional: store user in backend
      await axios.post("http://localhost:8000/api/signup", { uid, email });

      alert("Signup successful!");
      navigate("/login"); // Redirect to login page after signup
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Signup</h2>
        <div className="auth-form">
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button onClick={handleSignup}>Signup</button>
        </div>
        <div className="auth-footer">
          <span>Already have an account?</span>
          <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
}
