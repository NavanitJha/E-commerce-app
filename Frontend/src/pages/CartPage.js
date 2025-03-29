import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCart,
  incrementQuantity,
  decrementQuantity,
} from "../features/cartSlice";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  IconButton,
} from "@mui/material";
import NoDataFound from "../components/NoDataFound";
import { useProduct } from "../hooks/useProduct";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { toastMsg } from "../config";
import LoadingWidget from "../components/LoadingWidget";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    fetchCartItems,
    deleteCartItems,
    addProductToCart,
    proceedToCheckout,
    decreaseItemQuantity,
  } = useProduct();
  const { cartList } = useSelector((state) => state.cartData);
  const { loading } = useSelector((state) => state.productData);
  const token = localStorage.getItem("jwtToken");
  const hasFetchedCartItems = useRef(false);

  useEffect(() => {
    if (token && !hasFetchedCartItems.current) {
      fetchCartItems(token);
      hasFetchedCartItems.current = true;
    }
  }, [token, fetchCartItems]);

  const handleRemove = (product) => {
    const { productId: { _id } } = product;   //product.productId._id
    deleteCartItems(token, _id);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = async () => {
    const response = await proceedToCheckout(token);
    if (response) {
      if (response) {
        toastMsg({
          message: "Congratulations!",
          text: "Order placed successfully!!",
          type: "success",
          showConfirmBtn: true,
          duration: 5000,
        });
        navigate("/orders");
      }
    }
  };

  const handleQuantityChange = (product, increment) => {
    const obj = {
      productId: product?._id,
    };
    if (increment) {
      dispatch(incrementQuantity(product));
      addProductToCart(obj, token, true);
    } else {
      dispatch(decrementQuantity(product));
      decreaseItemQuantity(obj, token);
    }
  };

  const totalAmount =
    cartList?.items?.length &&
    cartList.items.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );

  return loading ? (
    <LoadingWidget />
  ) : cartList?.items?.length ? (
    <div style={{ padding: 20, marginTop: 10, marginBottom: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")}
          style={{ marginTop: "20px", marginRight:"20px" }}
        >
          Back to home
        </Button>
      </div>
      <List>
        {cartList.items.map((value) => (
          <div key={value._id}>
            <ListItem>
              <img
                src={value.productId?.image}
                alt={value.productId?.name}
                style={{ width: 50, height: 50, marginRight: 16 }}
              />
              <ListItemText
                primary={value.productId?.name}
                secondary={`$${value.productId.price}`}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  onClick={() => handleQuantityChange(value.productId, false)}
                  color="secondary"
                >
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body1">{value.quantity}</Typography>
                <IconButton
                  onClick={() => handleQuantityChange(value.productId, true)}
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              </div>
              <Typography variant="body1" style={{ marginLeft: 16 }}>
                Total: ${value.productId.price * value.quantity}
              </Typography>
              <Button
                onClick={() => handleRemove(value)}
                color="secondary"
                style={{ marginLeft: 16 }}
              >
                <DeleteIcon />
              </Button>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
      <Typography variant="h6" style={{ marginTop: 16 }}>
        Total Amount: ${totalAmount}
      </Typography>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClearCart}
          style={{ marginTop: 16 }}
        >
          Clear Cart
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckout}
          style={{ marginTop: 16, marginRight: 30, backgroundColor: "green" }}
        >
          Place order
        </Button>
      </div>
    </div>
  ) : (
    <NoDataFound NoDataMessage={"No data found"} />
  );
}

export default CartPage;
