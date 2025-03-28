// src/components/Login.js

import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoading } from "../../features/productSlice";
import { useAuthentication } from "../../hooks/useAuthentication";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuthentication();
  const { loading } = useSelector((state) => state.productData);

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value)
          ? ""
          : "Please enter a valid email address.";
      case "password":
        return value.length >= 6
          ? ""
          : "Password must be at least 6 characters.";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    if (newErrors.name || newErrors.email || newErrors.password) {
      setErrors(newErrors);
    } else {
      // Proceed with form submission (e.g., API call)
      dispatch(setLoading(true));
      const response = await login(formData);
      if (response) {
        // Reset form
        setFormData({ email: "", password: "" });
        setErrors({ email: "", password: "" });
        navigate("/dashboard");
      }
    }
  };

  return (
    <Container>
      <Grid container justifyContent="center" style={{ marginTop: "50px" }}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h4" align="center">
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              type="email"
              required
              margin="normal"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              loading={loading}
              loadingPosition="center"
              onClick={handleLogin}
              style={{ height: 35 }}
            >
              {!loading ? "Login" : null}
            </Button>
          </form>
          <Typography align="center" style={{ marginTop: "10px" }}>
            Don't have an account? <a href="/signup">Sign up</a>
          </Typography>
          {/* <Typography align="center" style={{ marginTop: "10px" }}>
            <a href="/forgot-password">Forgot Password?</a>
          </Typography> */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
