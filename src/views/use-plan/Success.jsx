import React from "react";
import {useEffect} from "react";
import axios from "axios";
import {getCookie} from "../../utils/cookie";
import {useRecoilState} from "recoil";
import {businessPlan} from "../../stores/business-plan";

const Success = () => {
  
  const [BusinessPlan, setBusinessPlan] = useRecoilState(businessPlan);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    axios
      .post(
        `/api/stripe/sub/success/${sessionId}`,
        {},
        {
          withCredentials: true,
          headers: {
            accessToken: getCookie("accessToken"),
            lastLoginTime: getCookie("lastLoginTime"),
          },
        }
      )
      .then(() => {
        setBusinessPlan({
          isOpen: 2,
          sessionId: '',
          isOpenWindow: BusinessPlan.isOpenWindow
        })
        localStorage.removeItem("sessionId");
        window.location.replace("/use-plan");
      });
  }, [])

  return<>
  </>
}

export default Success
