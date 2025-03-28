import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import { useProduct } from "../hooks/useProduct";
import ProductCard from "../components/ProductCard";
import NoDataFound from "../components/NoDataFound";
import Header from "../components/Header";
import LoadingWidget from "../components/LoadingWidget";
import { setLoading } from "../features/productSlice";

const HomePage = () => {
  const dispatch = useDispatch();
  const { fetchProducts } = useProduct();
  const { products, loading } = useSelector((state) => state.productData);

  useEffect(() => {
    const fetchProductList = async () => {
      dispatch(setLoading(true)); // Set loading true before fetching
      await fetchProducts();
      dispatch(setLoading(false)); // Set loading false after fetching
    };
    fetchProductList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <LoadingWidget />;
  }
  return products?.length ? (
    <Container>
      <Header />
      <Row>
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  ) : (
    <NoDataFound NoDataMessage={"No data found"} />
  );
};

export default HomePage;
