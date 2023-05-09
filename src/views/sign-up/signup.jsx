
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


const Signup = () => {

    return (
        <>
            <div className="find-wrap flex flex-col items-center">
                <img src={BigLogo} alt="" className="big-logo" />
                <div className="find-subtit">
                    HITOBITOにようこそ！
                </div>
                <div className="signup-subtit">
                    未会員のかたは会員登録からお願いします。
                </div>
                <div className="find-btn flex flex-col">
                    <Link to="/signup-em" className="btn btn-primary h-48">
                        求職者会員加入
                    </Link>
                    <Link to="/signup-em-term-business" className="btn btn-pending h-48 mt-5">
                        企業会員加入
                    </Link>
                </div>
            </div>

        </>
    );
};

export default Signup;
