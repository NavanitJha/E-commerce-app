import axios from "axios";
import { useDispatch } from "react-redux";
import { REST_API_BASE_URL, toastMsg } from "../config";
import { setLogin } from "../features/authSlice";
import { setLoading } from "../features/productSlice";

export const useAuthentication = () => {
  const dispatch = useDispatch();

  const signUp = async (formdata) => {
    const config = {
      method: "post",
      url: `${REST_API_BASE_URL}/auth/register`,
      headers: {
        "Content-Type": "application/json", // Set default headers
      },
      data: formdata,
    };
    return await axios
      .request(config) // Replace with your API endpoint
      .then((response) => {
        dispatch(setLoading(false));
        toastMsg({
          message: "User registered successfully!",
          type: "success",
        })
        return response;
      })
      .catch((error) => {
        console.error("Error fetching data:", error.response);
        dispatch(setLoading(false));
        toastMsg({
          message: error?.response?.data?.message || "Something went wrong.",
          type: "error",
        })
        return false;
      });
  };

  const login = async (formdata) => {
    const config = {
      method: "post",
      url: `${REST_API_BASE_URL}/auth/login`,
      headers: {
        "Content-Type": "application/json", // Set default headers
      },
      data: formdata,
    };
    return await axios
      .request(config) // Replace with your API endpoint
      .then((response) => {
        dispatch(setLogin(response.data));
        dispatch(setLoading(false));
        toastMsg({
          message: "Login successfully!",
          type: "success",
        })
        return response;
      })
      .catch((error) => {
        console.error("Error fetching data:", error.response);
        dispatch(setLoading(false));
        toastMsg({
          message: error?.response?.data?.message || "Something went wrong.",
          type: "error",
        })
        return false;
      });
  };

  return {
    signUp,
    login,
  };
};
