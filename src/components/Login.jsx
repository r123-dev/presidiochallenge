import React, { useState, useEffect } from "react";
import API from "../config.api";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_email: "",
    user_password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkTokenAndRole = async () => {
      const token = localStorage.getItem("x-auth-token");
      if (token) {
        try {
          const response = await axios.get(`${API}/verify`, {
            headers: { "x-auth-token": token },
          });
          if (response.status === 200) {
            if (response.data.role === "seller") {
              navigate("/dashboardSeller");
            } else if (response.data.role === "seeker") {
              navigate("/dashboard");
            } else {
              setError("Unknown user role");
            }
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          setError("Invalid token");
        }
      }
    };

    checkTokenAndRole();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "user_email") {
      validateEmail(value);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || !formData.user_email || !formData.user_password) {
      if (!formData.user_email) setEmailError("Email is required");
      if (!formData.user_password) setError("Password is required");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API}/login`, formData);
      if (response.data.token) {
        localStorage.setItem("x-auth-token", response.data.token);

        const verifyResponse = await axios.get(`${API}/verify`, {
          headers: { "x-auth-token": response.data.token },
        });

        if (verifyResponse.status === 200) {
          if (verifyResponse.data.role === "seller") {
            navigate("/dashboardSeller");
          } else if (verifyResponse.data.role === "seeker") {
            navigate("/dashboard");
          } else {
            setError("Unknown user role");
          }
        }
      } else {
        setError("Login failed");
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundImage:
          "url(https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?auto=compress&cs=tinysrgb&w=600)",
      }}
    >
      <div
        style={{
          flex: 1,
          backgroundImage:
            "url(https://media.istockphoto.com/id/1148812518/photo/concept-of-selling-a-house-a-hand-is-holding-a-model-house-above-green-meadow.webp?b=1&s=170667a&w=0&k=20&c=IP1BoI8ZyXk3LcO5LRrZ_Xff0jVq17Nx4JKfB0TuFsQ=)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Container
        component="main"
        maxWidth="sm"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card
          style={{
            width: "100%",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="center" mb={2}>
              {/* <img
                src={logo}
                alt="Logo"
                style={{ width: "80px", height: "auto" }}
              /> */}
            </Box>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Welcome Back
            </Typography>
            <form noValidate onSubmit={handleSubmit} style={{ marginTop: 20 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="filled"
                    required
                    fullWidth
                    id="user_email"
                    label="Email Address"
                    name="user_email"
                    value={formData.user_email}
                    onChange={handleChange}
                    type="email"
                    error={!!emailError}
                    helperText={emailError}
                    InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="filled"
                    required
                    fullWidth
                    name="user_password"
                    label="Password"
                    type="password"
                    id="user_password"
                    value={formData.user_password}
                    onChange={handleChange}
                    error={
                      !formData.user_password &&
                      error === "Password is required"
                    }
                    helperText={
                      !formData.user_password &&
                      error === "Password is required"
                        ? "Password is required"
                        : ""
                    }
                    InputProps={{ style: { backgroundColor: "#f9f9f9" } }}
                  />
                </Grid>
              </Grid>
              {loading ? (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress />
                </Box>
              ) : (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{
                    marginTop: 20,
                    backgroundColor: "#007bff",
                    color: "#fff",
                  }}
                  disabled={
                    !!emailError ||
                    !formData.user_email ||
                    !formData.user_password
                  }
                >
                  Login
                </Button>
              )}
              {error && (
                <Alert severity="error" style={{ marginTop: 20 }}>
                  {error}
                </Alert>
              )}
            </form>
          </CardContent>
          <CardActions style={{ justifyContent: "center", marginTop: "10px" }}>
            <Button
              fullWidth
              variant="text"
              color="secondary"
              onClick={() => navigate("/register")}
              style={{ textDecoration: "underline" }}
            >
              New here? Create an account
            </Button>
          </CardActions>
        </Card>
      </Container>
    </div>
  );
};

export default LoginPage;
