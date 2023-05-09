
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


const FindIdResult = () => {
    const [findId, setfindId] = useState(false);

    return (
        <>
            <div className="find-wrap flex flex-col items-center">
                <img src={BigLogo} alt="" className="big-logo" />
                <div className="find-result-tit orange">
                    안녕하세요. <br />
                    귀하의 아이디는 <span>danaka </span> 입니다.
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
                    회원님이 아이디 찾기를 하신 것이 맞는지 확인 <br />
                    부탁드립니다.
                </div>
            </div>


        </>
    );
};

export default FindIdResult;
