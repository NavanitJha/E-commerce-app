// src/components/Header.js

import React, { useEffect, useRef } from "react";
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../features/authSlice";
import { useProduct } from "../hooks/useProduct";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fetchCartItems } = useProduct();
  const token = localStorage.getItem("jwtToken");
  const { cartList } = useSelector((state) => state.cartData);
  const hasFetchedCartItems = useRef(false);

  useEffect(() => {
    if (token && !hasFetchedCartItems.current) {
      fetchCartItems(token);
      hasFetchedCartItems.current = true;
    }
  }, [token, fetchCartItems]);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">E-commerce</Navbar.Brand>
      <Nav className="ml-auto">
        <Link to="/orders">
          <Button variant="outline-primary">Orders</Button>
        </Link>
        <Link to="/cart">
          <Button variant="outline-primary">
            Cart {cartList?.items?.length || ""}
          </Button>
        </Link>
        {token ? (
          <Button onClick={handleLogout} variant="outline-danger">
            Logout
          </Button>
        ) : (
          <Link to="/login">
            <Button variant="outline-primary">Login</Button>
          </Link>
        )}
      </Nav>
    </Navbar>
  );
};

export default Header;
