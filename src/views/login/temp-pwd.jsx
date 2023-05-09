
import {
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Modal, ModalBody,
} from "@/base-components";
import { Link } from 'react-router-dom';
import { useState } from "react";

import BigLogo from "@/assets/images/big-logo.svg";
import Blank from "@/assets/images/blank-img.png";
import Blank2 from "@/assets/images/blank2.png";
import LineIcon from "@/assets/images/line-icon.svg";
import GoogleIcon from "@/assets/images/google-icon.svg";
import KakaoIcon from "@/assets/images/kakao-icon.svg";


const TempPwd = () => {
    const [findId, setfindId] = useState(false);

    return (
        <>
            <div className="find-wrap flex flex-col items-center">
                <img src={BigLogo} alt="" className="big-logo" />
                <div className="find-result-tit orange">
                    안녕하세요. <br />
                    임시 비밀번호는 <span>3@y1a#xsa0  </span> 입니다.
                </div>
                <div className="find-pwd-subtit">
                    임시 비밀번호로 로그인후 반드시 <br />
                    비밀번호 변경을 해주시기 바랍니다.
                </div>
                <div className="find-det">
                    <div className="find-det-item flex">
                        <div className="det-tit">
                            위치 :
                        </div>
                        <div className="det-cont">
                            Tokyo Minamoto gu
                        </div>
                    </div>
                    <div className="find-det-item flex">
                        <div className="det-tit">
                            기기 :
                        </div>
                        <div className="det-cont">
                            Windows 10
                        </div>
                    </div>
                    <div className="find-det-item flex">
                        <div className="det-tit">
                            브라우저 :
                        </div>
                        <div className="det-cont">
                            Chrome
                        </div>
                    </div>
                    <div className="find-det-item flex">
                        <div className="det-tit">
                            IP주소 :
                        </div>
                        <div className="det-cont">
                            218.333.111.234
                        </div>
                    </div>
                </div>
                <div className="find-result-subtit">
                    회원님이 임시 비밀번호 설정을 하신 것이 맞는지 <br />
                    확인 부탁드립니다.
                </div>
                <div className="find-result-subtit">
                    만약 회원님이 임시 비밀번호 설정을 하신 것이 아니라면 <br />
                    즉시 <Link to="/pwd-change">HITOBITO 비밀번호를 변경 </Link> 해서 <br />
                    회원님의 계정을 보호하세요. <br />
                </div>
            </div>


        </>
    );
};

export default TempPwd;
