
import {
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Modal, ModalBody,
} from "@/base-components";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";

import Blank from "@/assets/images/blank-img.png";
import Blank2 from "@/assets/images/blank2.png";
import LineIcon from "@/assets/images/line-icon.svg";
import GoogleIcon from "@/assets/images/google-icon.svg";
import KakaoIcon from "@/assets/images/kakao-icon.svg";


const LoginCompany = () => {
    const [pwdError, setpwdError] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <div className="login-wrap flex">
                <div className="login-left">
                    <img src={Blank} alt="" />
                    <img src={Blank} alt="" />
                    <img src={Blank} alt="" />
                </div>
                <div className="login-right">
                    <TabGroup>
                        <TabList className="nav-link-tabs">
                            <Tab className="w-full py-2" tag="button">求職者ログイン</Tab>
                            <Tab className="w-full py-2" tag="button">企業ログイン</Tab>
                        </TabList>
                        <TabPanels className="mt-5">
                            <TabPanel className="leading-relaxed">
                                <div className="login-tab-wrap">
                                    <div className="login-tab-tit">
                                        HITOBITOにようこそ！
                                    </div>
                                    <div className="login-tab-subtit">
                                    手軽なSNSログイン！以下のSNSアカウントでログインしよう。。
                                    </div>
                                    <div className="btn-wrap">
                                        <button className="btn-line flex flex-center">
                                            <div className="button-wrap flex items-center">
                                                <img src={LineIcon} alt="" />
                                                Lineログイン
                                            </div>
                                        </button>
                                        <button className="btn-google flex flex-center">
                                            <div className="button-wrap flex items-center">
                                                <img src={GoogleIcon} alt="" />
                                                Googleログイン
                                            </div>
                                        </button>
                                        <button className="btn-kakao flex flex-center">
                                            <div className="button-wrap flex items-center">
                                                <img src={KakaoIcon} alt="" />
                                                Kakaoログイン
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </TabPanel>
                            <TabPanel className="leading-relaxed">
                                <div className="login-tab-wrap">
                                    <div className="login-tab-tit">
                                        HITOBITOにようこそ！
                                    </div>
                                    <div className="login-tab-subtit">
                                    当サービスをご利用いただく場合は、ログインが必要です。
                                    </div>
                                    <div className="id-wrap flex flex-col">
                                        <input id="regular-form-1" type="text" className="id-input h-48 form-control" placeholder="아이디" />
                                        <input id="regular-form-1" type="text" className="id-input h-48 form-control" placeholder="비밀번호" />
                                        <button className="btn-black flex flex-center" onClick={() => { setpwdError(true); }}>
                                            ログイン
                                        </button>
                                    </div>
                                    <div className="find-wrap-login">
                                        <div className="form-check w-24 save-id">
                                            <input id="vertical-form-3" className="form-check-input" type="checkbox" value="" />
                                            <label className="form-check-label" htmlFor="vertical-form-3">ＩD　保存</label>
                                        </div>
                                        <div className="find-id-wrap">
                                            <Link to="/find-id">IDを忘れた場合</Link>
                                            <Link to="/find-pwd">パスワードを忘れた場合</Link>
                                        </div>
                                    </div>
                                    <div className="signup-wrap flex items-center space-between">
                                        <div className="signup-tit">
                                        HITOBITOのユーザーでない<br />
                                        方の会員登録はこちら
                                        </div>
                                        <div className="signup-btn">
                                            <button className="btn btn-primary w-40" onClick={() => navigate('/signup')}>
                                                新規会員登録
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* 비밀번호가 맞지 않습니다.*/}
                                <Modal
                                    show={pwdError}
                                    onHidden={() => {
                                        setpwdError(false);
                                    }}
                                >
                                    <ModalBody className="p-10 text-center">
                                        <div className="modal-tit">パスワードが間違ってます。</div>
                                        <div className="modal-subtit">
                                            IDまたはパスワードが正しくありません。<br />
                                            再度確認してください。
                                        </div>
                                        <div className="flex flex-end gap-3">
                                            <a
                                                href="#"
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    setpwdError(false);
                                                }}
                                            >
                                                確認
                                            </a>
                                        </div>
                                    </ModalBody>
                                </Modal>
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
            </div>


        </>
    );
};

export default LoginCompany;
