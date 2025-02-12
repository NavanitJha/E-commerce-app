import axios from "axios";
// import { useDispatch } from "react-redux";
// import { REST_API_BASE_URL, TOKE_API_BASE_URL } from "../../config";
import { setError, setLoading, setProducts } from "../features/productSlice";

export const useProduct = () => {
//   const dispatch = useDispatch();

  const fetchProducts = () => async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get('https://api.example.com/products');
      dispatch(setProducts(response.data));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    fetchProducts
  };
};
