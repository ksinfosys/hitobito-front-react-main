import {getCookie} from "../src/utils/cookie";
import axios from "axios";

const ServiceFetch = (url, method, data) => {
  return new Promise((resolve, reject) => {
    axios({
      url: '/api' + url,
      method: method,
      data,
      withCredentials: true,
      headers: {
        accessToken: getCookie("accessToken").toString(),
        lastLoginTime: getCookie("lastLoginTime").toString(),
      }
    }).then(res => {
      resolve(res.data)
    }).catch(e => {
      reject(e)
    })
  })
}

export default ServiceFetch
