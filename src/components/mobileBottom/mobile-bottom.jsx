import {useRecoilState} from "recoil";
import {mobileStatus} from "../../stores/mobile-status";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const MobileBottom = (props) => {

  const navigate = useNavigate()
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);

  const changePage = () => {
    let url = '/resume-regist' + `-mo${parseInt(mobile.progress) + 1}`
    if(mobile.country) {
      setMobileStatus({...mobile, progress: parseInt(mobile.progress) + 1})
      navigate(url)
    }
  }

  return (
    <>
      <div className="mobile-bottom">
        <div className="bottom-btn">
          <button className="btn btn-primary w-full full-button" onClick={changePage}>決定して次へ</button>
        </div>
      </div>
    </>
  );
};
export default MobileBottom;
