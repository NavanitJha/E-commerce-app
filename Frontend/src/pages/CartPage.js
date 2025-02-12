import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, clearCart } from "../features/cartSlice";
import { Button, List, ListItem, ListItemText, Divider } from "@mui/material";

function CartPage() {
  const cart = useSelector((state) => state.cart.items);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const dispatch = useDispatch();

  const handleRemove = (product) => {
    dispatch(removeItem(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div>
      <h1>Your Cart</h1>
      <List>
        {cart.map((item) => (
          <div key={item.id}>
            <ListItem>
              <ListItemText primary={item.name} secondary={`$${item.price}`} />
              <Button onClick={() => handleRemove(item)} color="secondary">
                Remove
              </Button>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
      <h2>Total: ${totalAmount}</h2>
      <Button variant="contained" color="primary" onClick={handleClearCart}>
        Clear Cart
      </Button>
    </div>
  );
}

export default CartPage;
