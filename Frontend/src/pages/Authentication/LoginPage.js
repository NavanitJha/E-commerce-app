// src/components/Login.js

import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Container } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add your authentication logic here
    dispatch(login({ user: { email }, token: "jwt-token" }));
    navigate.push("/");
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
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
            >
              Login
            </Button>
          </form>
          <Typography align="center" style={{ marginTop: "10px" }}>
            Don't have an account? <a href="/signup">Sign up</a>
          </Typography>
          <Typography align="center" style={{ marginTop: "10px" }}>
            <a href="/forgot-password">Forgot Password?</a>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
