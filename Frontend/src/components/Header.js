// src/components/Header.js

import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

function Header() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">E-commerce</Navbar.Brand>
      <Nav className="ml-auto">
        <Link to="/cart">
          <Button variant="outline-primary">Cart</Button>
        </Link>
        {isAuthenticated ? (
          <Button onClick={handleLogout} variant="outline-danger">Logout</Button>
        ) : (
          <Link to="/login">
            <Button variant="outline-primary">Login</Button>
          </Link>
        )}
      </Nav>
    </Navbar>
  );
}

export default Header;
