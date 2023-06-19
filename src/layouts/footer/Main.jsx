import { Link } from "react-router-dom";
import {userInfo} from "../../stores/user-info"
import {useRecoilState} from "recoil";
import { getCookie } from "../../utils/cookie";

function Footer() {
  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);
  const isSeeker = userInfoV.userType === 1;
  const token = getCookie("accessToken");

  return (
    <div style={isSeeker || !token ? {display:"none"} : {
      backgroundColor:"#fff",
      padding:"20px",
      borderTop:"1px solid #E4E7EA",
      boxShadow:"0 -4px 6px #0000000d"
    }}>
      <div className="flex flex-center">
        <Link to="/user-guide-business">
        企業利用ガイド 
        </Link> &nbsp;&nbsp;|&nbsp;&nbsp; 
        <Link to="/terms-of-use">
        利用規約 
        </Link> &nbsp;&nbsp;|&nbsp;&nbsp; 
        <Link to="/terms-of-privacy">
        プライバシー規約 
        </Link> &nbsp;&nbsp;|&nbsp;&nbsp;
        <Link to="/plan-detail">
        特定商取引法に基づく表示 
        </Link>
      </div>
      <div className="text-center" style={{fontSize:"12px"}}>
      © 2022 KS Information System Co. Ltd. All Rights Reserved.
      </div>
    </div>
  );
}

export default Footer;
