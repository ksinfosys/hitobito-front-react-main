import {delCookie} from "../src/utils/cookie";

const CheckToken = (res, navigate) => {
  if (res.resultCode === '200') {
    delCookie("accessToken");
    delCookie("lastLoginTime");
    navigate("/");
    return true
  }
}

export default CheckToken
