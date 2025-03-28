import React, { useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useProduct } from "../hooks/useProduct";
import { useNavigate } from "react-router-dom";
import LoadingWidget from "../components/LoadingWidget";

const OrderList = () => {
  const navigate = useNavigate();
  const { fetchOrderList } = useProduct();
  const token = localStorage.getItem("jwtToken");
  const { orders } = useSelector((state) => state.productData);

  useEffect(() => {
    if (token) {
      fetchOrderList(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !orders?.length ? (
    <LoadingWidget />
  ) : (
    <Container maxWidth="md" style={{ marginTop: 20, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" gutterBottom>
          Your Orders
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")}
          style={{ marginBottom: "20px" }}
        >
          Back to home
        </Button>
      </div>
      {orders?.map((val) => {
        return (
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                {val.items?.map((item) => {
                  return (
                    <>
                      <Grid item xs={8} container spacing={2}>
                        <Grid item xs={4}>
                          <img
                            src={item.productId.image}
                            alt={item.productId.name}
                            style={{
                              width: "80%",
                              borderRadius: "8px",
                              height: "80%",
                              marginTop: "10px",
                            }}
                          />
                        </Grid>
                        <Grid item xs={8} spacing={2}>
                          <Typography variant="h6">
                            {item.productId.name}
                          </Typography>
                          <Typography variant="body2">
                            {item.productId.description}
                          </Typography>
                          <Typography variant="body1">
                            Quantity: {item.quantity}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={4} style={{ textAlign: "right" }}>
                        <Typography variant="h6">
                          ${(val.totalAmount * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                    </>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
};

export default OrderList;
