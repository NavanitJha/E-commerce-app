import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../features/productSlice";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signUp } = useAuthentication();
  const { loading } = useSelector((state) => state.productData);

  const handleSignup = async (e) => {
    e.preventDefault();
    let newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    if (newErrors.name || newErrors.email || newErrors.password) {
      setErrors(newErrors);
    } else {
      // Proceed with form submission (e.g., API call)
      dispatch(setLoading(true));
      const response = await signUp(formData);
      if (response) {
        // Reset form
        setFormData({ name: "", email: "", password: "" });
        setErrors({ name: "", email: "", password: "" });
        navigate("/login");
      }
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() ? "" : "Name is required.";
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

  return (
    <Container>
      <Grid container justifyContent="center" style={{ marginTop: "50px" }}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h4" align="center">
            Sign Up
          </Typography>
          <form onSubmit={handleSignup}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
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
              onClick={handleSignup}
              style={{ height: 35 }}
            >
              {!loading ? "Sign Up" : null}
            </Button>
          </form>
          <Typography align="center" style={{ marginTop: "10px" }}>
            Already have an account? <a href="/login">Login</a>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignUpPage;
