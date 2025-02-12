import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
// import { useDispatch } from 'react-redux';
// import { addToCart } from '../features/cartSlice';

const ProductCard = ({ product }) => {
//   const dispatch = useDispatch();

  const handleAddToCart = () => {
    console.log("teettstt")
    // dispatch(addToCart(product));
  };

  return (
    <Card>
      <img src={product.imageUrl} alt={product.name} />
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
    // <Row>
    //   {products.map(product => (
    //     <Col key={product.id} sm={12} md={6} lg={4}>
    //       <Card>
    //         <Card.Img variant="top" src={product.image} />
    //         <Card.Body>
    //           <Card.Title>{product.name}</Card.Title>
    //           <Card.Text>${product.price}</Card.Text>
    //           <Button>Add to Cart</Button>
    //         </Card.Body>
    //       </Card>
    //     </Col>
    //   ))}
    // </Row>
  );
}

export default ProductCard;
