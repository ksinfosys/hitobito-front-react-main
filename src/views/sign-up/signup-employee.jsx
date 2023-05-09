
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
import axios from "axios";
import querystring from "querystring";
import UserLogin from "../login/job/UserLogin";


const SignupEmployee = () => {

    const snsLogin = (loginType) => window.open(`/api/auth/${loginType}`)

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
                <div className="find-btn userlogin">
                    <UserLogin />
                </div>
            </div>

        </>
    );
};

export default SignupEmployee;
