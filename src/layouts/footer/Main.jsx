import { Link } from "react-router-dom";
import {userInfo} from "../../stores/user-info"
import {useRecoilState} from "recoil";
import { getCookie } from "../../utils/cookie";

function Footer() {
  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);
  const isSeeker = userInfoV.userType === 1;
  const token = getCookie("accessToken");

  return (
    <div className="flex flex-center" style={isSeeker || !token ? {display:"none"} : {backgroundColor:"#FEF6EA",padding:"20px"}}>
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
  );
}

export default Footer;
