import { isExpired } from "react-jwt";
import { toast } from "react-toastify";

const api = "https://localhost:7011/api";
export let jwtToken = "";
if (JSON.parse(localStorage?.getItem("user"))) {
  jwtToken = JSON.parse(localStorage?.getItem("user"))["jwtToken"];
}


export default api;
