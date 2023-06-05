import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { userInfo } from "../../stores/user-info";
import { getCookie } from "../../utils/cookie";

function IsLogin(prop) {
    const navigate = useNavigate();
    const location = useLocation();

    const userInfoV = useRecoilValue(userInfo);

    return (
        <div className="flex items-center topuser-menu">
            {prop.login == 'N' ?
                <div className="flex items-center topuser-menu">
                    {/* <Link to="/" className="top-menu-login-text">로그인</Link> */}
                </div>
                :
                <React.Fragment>
                    <div className="topuser-item">
                        {userInfoV.userNickName || userInfoV.cpUserName}
                    </div>
                    <div className="topuser-item historyBalance">
                        {userInfoV.historyBalance} P
                    </div>
                </React.Fragment>
            }
        </div>
    );
}

export default IsLogin;
