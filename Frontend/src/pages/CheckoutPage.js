import { Button } from "@mui/material";
import React, { useState } from "react";

const CheckoutPage = () => {
  const [userDetails, setUserDetails] = useState({ name: "", address: "" });

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log(userDetails);
    // Handle order confirmation and payment integration
  };

  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={userDetails.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="text"
          name="address"
          value={userDetails.address}
          onChange={handleChange}
          placeholder="Address"
        />
        <Button type="submit">Place Order</Button>
      </form>
    </div>
  );
}

export default CheckoutPage;
