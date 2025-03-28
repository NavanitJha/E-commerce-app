import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import { useProduct } from "../hooks/useProduct";

const ProductCard = ({ product }) => {
  const token = localStorage.getItem("jwtToken");
  const { addProductToCart } = useProduct();

  const handleAddToCart = () => {
    const obj = {
      productId: product?._id,
    };
    addProductToCart(obj, token);
  };

  return (
    <Card>
      <img src={product.image} alt={product.name} />
      <CardContent>
        <Typography variant="h5">{product.name}</Typography>
        <Typography variant="body2">{product.description}</Typography>
        <Typography variant="h6">${product.price}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
