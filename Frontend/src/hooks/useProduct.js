import axios from "axios";
import { useDispatch } from "react-redux";
import { setLoading, setOrderList, setProducts } from "../features/productSlice";
import { REST_API_BASE_URL, toastMsg } from "../config";
import { addItem, removeItem, setCartList } from "../features/cartSlice";

export const useProduct = () => {
  const dispatch = useDispatch();

  const fetchProducts = async () => {
    const config = {
      method: "get",
      url: `${REST_API_BASE_URL}/products`,
      headers: {
        "Content-Type": "application/json", // Set default headers
      },
    };
    await axios
      .request(config) // Replace with your API endpoint
      .then((response) => {
        dispatch(setProducts(response.data));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        dispatch(setLoading(false));
        toastMsg({
          message: error?.response?.data?.message || "Something went wrong.",
          type: "error",
        });
        return error;
      });
  };

  const fetchOrderList = async (token) => {
    const config = {
      method: "get",
      url: `${REST_API_BASE_URL}/order`,
      headers: {
        "Content-Type": "application/json", // Set default headers
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .request(config) // Replace with your API endpoint
      .then((response) => {
        dispatch(setOrderList(response.data));
        dispatch(setLoading(false));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        dispatch(setLoading(false));
        toastMsg({
          message: error?.response?.data?.message || "Something went wrong.",
          type: "error",
        });
        return error;
      });
  };

  const fetchCartItems = async (token) => {
    const config = {
      method: "get",
      url: `${REST_API_BASE_URL}/cart`,
      headers: {
        "Content-Type": "application/json", // Set default headers
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .request(config) // Replace with your API endpoint
      .then((response) => {
        dispatch(setLoading(false));
        dispatch(setCartList(response.data));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        dispatch(setLoading(false));
        toastMsg({
          message: error?.response?.data?.message || "Something went wrong.",
          type: "error",
        });
        return error;
      });
  };

  const deleteCartItems = async (token, productId) => {
    const config = {
      method: "delete",
      url: `${REST_API_BASE_URL}/cart/remove/${productId}`,
      headers: {
        "Content-Type": "application/json", // Set default headers
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .request(config) // Replace with your API endpoint
      .then((response) => {
        dispatch(removeItem(response.data));
        dispatch(setLoading(false));
        toastMsg({
          message: "Item deleted successfully!",
          type: "success",
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        dispatch(setLoading(false));
        toastMsg({
          message: error?.response?.data?.message || "Something went wrong.",
          type: "error",
        });
        return error;
      });
  };

  const decreaseItemQuantity = async (formdata, token) => {
    const config = {
      method: "patch",
      url: `${REST_API_BASE_URL}/cart/decrease`,
      headers: {
        "Content-Type": "application/json", // Set default headers
        Authorization: `Bearer ${token}`,
      },
      data: formdata,
    };
    return await axios
      .request(config) // Replace with your API endpoint
      .then((response) => {
        dispatch(setLoading(false));
        toastMsg({
          message: "Item quantity decreased!",
          type: "success",
        });
        return response;
      })
      .catch((error) => {
        console.error("Error fetching data:", error.response);
        dispatch(setLoading(false));
        toastMsg({
          message: error?.response?.data?.message || "Something went wrong.",
          type: "error",
        });
        return false;
      });
  };

  const addProductToCart = async (
    formdata,
    token,
    isQuantityChange = false
  ) => {
    const config = {
      method: "post",
      url: `${REST_API_BASE_URL}/cart/add`,
      headers: {
        "Content-Type": "application/json", // Set default headers
        Authorization: `Bearer ${token}`,
      },
      data: formdata,
    };
    return await axios
      .request(config) // Replace with your API endpoint
      .then((response) => {
        dispatch(addItem(response.data));
        dispatch(setLoading(false));
        toastMsg({
          message: isQuantityChange
            ? "Item quantity increased!"
            : "Item added to cart!",
          type: "success",
        });
        return response;
      })
      .catch((error) => {
        console.error("Error fetching data:", error.response);
        dispatch(setLoading(false));
        toastMsg({
          message: error?.response?.data?.message || "Something went wrong.",
          type: "error",
        });
        return false;
      });
  };

  const proceedToCheckout = async (token) => {
    const config = {
      method: "post",
      url: `${REST_API_BASE_URL}/order/checkout`,
      headers: {
        "Content-Type": "application/json", // Set default headers
        Authorization: `Bearer ${token}`,
      },
    };
    return await axios
      .request(config) // Replace with your API endpoint
      .then((response) => {
        dispatch(setLoading(false));
        return response;
      })
      .catch((error) => {
        console.error("Error fetching data:", error.response);
        dispatch(setLoading(false));
        toastMsg({
          message: error?.response?.data?.message || "Something went wrong.",
          type: "error",
        });
        return false;
      });
  };

  return {
    fetchProducts,
    fetchOrderList,
    fetchCartItems,
    addProductToCart,
    deleteCartItems,
    decreaseItemQuantity,
    proceedToCheckout,
  };
};
