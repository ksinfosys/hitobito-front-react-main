import {useEffect, useState} from "react";
import serviceFetch from "../../../util/ServiceFetch";
import ResumeChange from "./resume-change";
import ResumeRegist from "./resume-regist";
import {useRecoilState, useResetRecoilState} from "recoil";
import {mobileStatus} from "../../stores/mobile-status";
import DepthSplit from "../../../util/DepthSplit";
import axios from "axios";
import Main from "../../layouts/side-menu/Main";
import {useLiff} from "react-liff";
import {userInfo} from "../../stores/user-info";
import {delCookie} from "../../utils/cookie";
import {useNavigate} from "react-router-dom";

const Resume = () => {

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [isLoading, setLoading] = useState(false)
  const [isResume, setResume] = useState(false)
  const resetInfoV = useResetRecoilState(userInfo);
  const { liff } = useLiff();
  const navigate = useNavigate();

  useEffect(() => {
    serviceFetch('/resume/reg','get')
      .then((res) => {
        setLoading(true)
        if(res.result.regiInfoDto){
          setResume(true)
        }else{
          setResume(false)
        }
      })
      .catch(e => {
        if(e.response && e.response.data.resultCode === '403'){
          alert(e.response.data.resultMessage)
          //window.location.href = '/'
          serviceFetch('/auth/logout', 'put', {})
            .then((response) => {
              liff.logout();
              resetInfoV();
              delCookie("accessToken");
              delCookie("lastLoginTime");
              navigate('/')
            })
        }
      })
    setMobileStatus({
      ...mobile,
      progress: 1,
    })
  },[])


  return<>
    {
      isLoading ?
        isResume ? <ResumeChange /> : <ResumeRegist />
        : null
    }
  </>
}

export default Resume
