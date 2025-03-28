import Swal from "sweetalert2";

export const REST_API_BASE_URL = `https://ecommerce-backend-black-ten.vercel.app/api`;

export const toastMsg = ({
  message,
  type,
  text,
  duration,
  showConfirmBtn = false,
}) => {
  return Swal.fire({
    icon: type,
    title: message,
    showConfirmButton: showConfirmBtn,
    timer: duration || 3000,
    text: text || "",
  });
};
