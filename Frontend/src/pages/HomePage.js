import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { fetchProducts } from '../services/api';
// import { Card, Button } from '@mui/material';
import { Container, Row, Col } from "react-bootstrap";
import { useProduct } from "../hooks/useProduct";
import ProductCard from "../components/ProductCard";
// import LoadingWidget from "../components/LoadingWidget";
import NoDataFound from "../components/NoDataFound";

function HomePage() {
  const dispatch = useDispatch();
  const { fetchProducts } = useProduct();
  const products = useSelector((state) => state.products);
  console.log("products==", products);
  useEffect(() => {
    const getProducts = async () => {
      await fetchProducts();
    };

    getProducts();
  }, [dispatch, fetchProducts]);

  //   if (status === "loading") return <div>Loading...</div>;
  console.log("insideee");
  return products?.length ? (
    <Container>
      <Row>
        {(products || []).map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  ) : (
    <NoDataFound NoDataMessage={"No data found"} stepToProceed={"hello"} />
  );
}

export default HomePage;
