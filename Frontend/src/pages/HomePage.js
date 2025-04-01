import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Row, Col, Form } from "react-bootstrap";
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchProductList = async () => {
      dispatch(setLoading(true)); // Set loading true before fetching
      await fetchProducts();
      dispatch(setLoading(false)); // Set loading false after fetching
    };
    fetchProductList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and sort products
  const filteredProducts = products
    .filter((product) =>
      selectedCategory === "all" ? true : product.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

  const getUniqueCategories = (products) => {
    const categories = products.map((product) => product.category);
    return [...new Set(categories)];
  };
  const uniqueCategories = getUniqueCategories(products);

  if (loading) {
    return <LoadingWidget />;
  }
  return products?.length ? (
    <Container>
      <Header />
      <Form.Group controlId="categorySelect">
        <Form.Label>Filter by Category</Form.Label>
        <Form.Control
          as="select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {(uniqueCategories || []).map((item) => {
            return <option value={item}>{item}</option>;
          })}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="sortSelect">
        <Form.Label>Sort by Price</Form.Label>
        <Form.Control
          as="select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </Form.Control>
      </Form.Group>
      <Row>
        {filteredProducts.length ? (
          filteredProducts.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4}>
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <NoDataFound NoDataMessage={"No data found"} />
        )}
      </Row>
      {/* <Row>
        {products.map((product) => (
          <Col key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row> */}
    </Container>
  ) : (
    <NoDataFound NoDataMessage={"No data found"} />
  );
};

export default HomePage;
