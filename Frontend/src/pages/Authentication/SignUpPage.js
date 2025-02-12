import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    // Implement signup logic here, e.g., call an API
    navigate.push("/login");
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
              onClick={handleSignup}
            >
              Sign Up
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
