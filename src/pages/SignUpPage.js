"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function SignUpPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      await API.post("/auth/signup", { username, email, password })
      // Redirect to login page after successful signup
      navigate("")
    } catch (err) {
      setError(err.response?.data?.message || "Sign up failed")
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSignUp} style={styles.form}>
        <img src="/images/logo_it_bafa.png" alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>Create Account</h2>
        {error && <p style={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Sign Up
        </button>

        <p style={styles.signupLink}>
          Already have an account?{" "}
          <a href="" style={styles.link}>
            Login
          </a>
        </p>
      </form>
    </div>
  )
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e6d0f7, #cce1fa)",
  },
  form: {
    background: "#fff",
    padding: "60px 50px",
    borderRadius: "24px",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "500px",
  },
  logo: {
    width: "200px",
    marginBottom: "30px",
  },
  title: {
    marginBottom: "32px",
    color: "#222",
    fontWeight: 700,
    fontSize: "26px",
    textAlign: "center",
  },
  input: {
    marginBottom: "20px",
    padding: "14px 18px",
    fontSize: "16px",
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "14px 18px",
    fontSize: "16px",
    borderRadius: "10px",
    background: "#8568f0",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    width: "100%",
    transition: "0.3s",
  },
  error: {
    color: "red",
    marginBottom: "20px",
    textAlign: "center",
  },
  signupLink: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#8568f0",
    textDecoration: "none",
    fontWeight: "bold",
  },
}

export default SignUpPage
