import ScrollToTop from "@/base-components/scroll-to-top/Main";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import Loading from "./components/loading";
import Router from "./router";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { LiffProvider } from "react-liff";
import { delCookie } from "./utils/cookie";
import Footer from "./layouts/footer/Main";

function App() {
  const [loading, setLoading] = useState(false);
  const liffId = '1657832968-ZeGx3gbz'

  useEffect(() => {

    //axios 호출시 인터셉트 abcaaa

    axios.interceptors.request.use(function (config) {
      if (config.url !== '/api/search/tags') { // '/api/search/tags' API 요청이 아닌 경우만 로딩 상태 변경
        setLoading(true);
      }
      return config
    }, function (error) {
      return Promise.reject(error);
    });
    //axios 호출 종료시 인터셉트--
    axios.interceptors.response.use(function (response) {
      if (response.config.url !== '/api/search/tags') { // '/api/search/tags' API 요청이 아닌 경우만 로딩 상태 변경
        setLoading(false);
      }
      return response;
    }, function (error) {
      if (error.response.data?.resultCode === "403") {
        alert("認証がタイムオーバーになりました。再度ログインしてください。")
        delCookie("accessToken");
        delCookie("lastLoginTime");
        window.location.href = "/"
      }
      setLoading(false)
      return Promise.reject(error);
    });
  }, []);

  return (
    <RecoilRoot>
      <Loading loading={loading} />
      <BrowserRouter>
        <GoogleOAuthProvider clientId={'994073566161-uheufnfp50scmu1lquhkg0mdbpr7ip56.apps.googleusercontent.com'}>
          <LiffProvider liffId={liffId}>
            <Router />
            <Footer />
          </LiffProvider>
        </GoogleOAuthProvider>
        <ScrollToTop />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
