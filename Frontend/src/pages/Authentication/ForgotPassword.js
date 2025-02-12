// src/components/ForgotPassword.js

import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    // Implement forgot password logic (e.g., send email with reset link)
    alert("Password reset link sent");
    navigate.push("/login");
  };

  return (
    <Container>
      <Grid container justifyContent="center" style={{ marginTop: "50px" }}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="h4" align="center">
            Forgot Password
          </Typography>
          <form onSubmit={handleForgotPassword}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleForgotPassword}
            >
              Submit
            </Button>
          </form>
          <Typography align="center" style={{ marginTop: "10px" }}>
            <a href="/login">Back to Login</a>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPassword;
