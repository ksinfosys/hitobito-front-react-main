import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Modal,
  ModalBody,
} from "@/base-components";
import { Link, redirect, useNavigate } from "react-router-dom";
import { useState } from "react";

import Blank from "@/assets/images/blank-img.png";
import Blank2 from "@/assets/images/blank2.png";
import axios from "axios";

import { setCookie } from "../../utils/cookie";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userInfo } from "../../stores/user-info";
import UserLogin from "./job/UserLogin";
import logoUrl from "@/assets/images/logo.svg";
import { userCount } from "../../stores/search-count";


const Login = () => {
  // 존재하지 않는 유저
  const [emptyError, setEmptyError] = useState(false);
  // 패스워드에러
  const [pwdError, setpwdError] = useState(false);
  // 입력 누락
  const [nullError, setNullError] = useState(false);
  // 아이디 입력 누락
  const [idNullError, setIdNullError] = useState(false);
  // 비밀번호 입력 누락
  const [pwNullError, setPwNullError] = useState(false);
  // 권한 없음
  const [permissionFail, setPermissionFail] = useState(false);


  // 비밀번호 버튼 설정
  const [pwEyeClosed, setpwEyeClosed] = useState(false);
  const handlepwEyeClosed = () => {
    setpwEyeClosed(current => !current);
  }

  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");

  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);
  const [userCountV, setUserCountV] = useRecoilState(userCount);
  const resetInfoV = useResetRecoilState(userInfo);
  const businessLogin = (id, pw) => {
    if (id.length < 1) {
      setIdNullError(true);
      return;
    } else if (pw.length < 1) {
      setPwNullError(true);
      return;
    }

    axios
      .post(
        "/api" + "/company/login",
        {
          cpLoginId: id,
          password: pw,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        const {
          data: { resultCode },
        } = response;
        const {
          data: { result },
        } = response;
        resultCode === "200"
          ? (() => {
            setCookie("accessToken", response.headers.accesstoken, 1);
            setCookie("lastLoginTime", response.headers.lastlogintime, 1);
            // navigate("/");

            // 기업회원 닉네임 있을경우
            if (result.cpUserName) {
              setUserInfoV((prevValue) => ({
                ...prevValue,
                userType: 2,
                cpUserName: result.cpUserName,
                historyBalance: result.historyBalance,
              }));
              setUserCountV((prev) => ({
                ...prev,
                searchCount: result.searchCount
              }))
            }

            if (result.tempFlag === "0") {
              // FIX: 구직자 검색으로 이동
              navigate("/business");
            } else if (result.tempFlag === "1") {
              // FIX: 임시 비밀번호 변경으로 이동
              navigate("/pwd-change")
            } else {
            }
          })()
          : (() => {
            if (resultCode === "226") {
              // 존재하지 않는 유저
              setEmptyError(true);
            } else if (resultCode === "202") {
              // 패스워드에러
              setpwdError(true);
            } else if (resultCode === "222") {
              // 입력 누락
              setNullError(true);
            } else if (resultCode === "403") {
              setPermissionFail(true)
            } else {
              return;
            }
          })();
      });
  };

  const snsLogin = (loginType) => {
    window.open(`/api/auth/${loginType}`);

    function setCookie(cookie_name, value, days) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + days);
      // 설정 일수만큼 현재시간에 만료값으로 지정
      var cookie_value =
        escape(value) +
        (days == null ? "" : ";expires=" + exdate.toUTCString());
      document.cookie = cookie_name + "=" + cookie_value;
    }

    setCookie(
      "accessToken",
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJVMDAwNTAwNCIsImlhdCI6MTY3OTU0ODcyOSwiZXhwIjoxNjc5OTA4NzI5fQ.BxolHRnJ2wTTj8JCwMIGdks_VGSba6JVzi9ROWDLo28",
      "3"
    );
    setCookie("lastLoginTime", "2023-03-23 14:18:49.67932", "3");

    setUserInfoV((prevValue) => ({
      ...prevValue,
      userType: 1,
    }));
  };

  const handleKeyDown = (e) => {
    if (e.code === "Enter") {
      businessLogin(loginId, loginPw);
    }
    return;
  };

  // 비밀번호 미리보기 플래그
  const [visiblePW, setVisiblePW] = useState(false);

  return (
    <>
      <div className="login-wrap flex mobile_flex-col">
        <img src={logoUrl} alt="" className="mobile_logo" />
        <div className="login-left">
          <img src="/images/login-banner.png" alt="" className="mobile_none" />
          <img src="/images/mobile-login-banner.png" alt="" className="mo_only" />
        </div>

        {/* pc-mobile 분기 */}
        {/* pc */}
        <div className="login-right pc_login">
          <TabGroup>
            <TabList className="nav-link-tabs">
              <Tab className="w-full py-2" tag="button">
                求職者ログイン
              </Tab>
              <Tab className="w-full py-2" tag="button">
                企業ログイン
              </Tab>
            </TabList>
            <TabPanels className="mt-5">
              <TabPanel className="leading-relaxed">
                <div className="login-tab-wrap first-tab">
                  <div className="login-tab-tit">
                    HITOBITOにようこそ！
                  </div>
                  <div className="login-tab-subtit">
                  手軽な以下のSNSアカウントでログインしよう。
                  </div>
                  <UserLogin />
                </div>
              </TabPanel>
              <TabPanel className="leading-relaxed">
                <div className="login-tab-wrap">
                  <div className="login-tab-tit">
                    HITOBITOにようこそ！
                  </div>
                  <div className="login-tab-subtit">
                  当サービスをご利用いただく場合は、ログインが必要です
                  </div>
                  <div
                    className="id-wrap flex flex-col"
                    onKeyDown={handleKeyDown}
                  >
                    <input
                      id="regular-form-1"
                      type="text"
                      className="id-input h-48 form-control"
                      placeholder="ＩD"
                      maxLength={20}
                      onChange={(e) => {
                        setLoginId(e.currentTarget.value);
                      }}
                    />
                    <div className="pwd-eye-wrap">
                      <input
                        id="regular-form-1"
                        type={visiblePW ? "text" : "password"}
                        className="id-input h-48 form-control"
                        placeholder="パスワード"
                        maxLength={16}
                        onChange={(e) => {
                          setLoginPw(e.currentTarget.value);
                        }}
                      />
                      <button className="eye-btn" onClick={() => {
                        handlepwEyeClosed(prev => !prev);
                        setVisiblePW(prev => !prev)
                      }}>
                        {
                          pwEyeClosed ? <img src="/images/eye-open.svg" alt="" /> : <img src="/images/eye-close.svg" alt="" />
                        }

                      </button>
                    </div>
                    <button
                      className="btn-black flex flex-center"
                      onClick={() => {
                        businessLogin(loginId, loginPw);
                      }}
                    >
                      ログイン
                    </button>
                    {/* <button
                      onClick={() => {
                        resetInfoV();
                      }}
                    >
                      recoil info 초기화
                    </button> */}
                  </div>
                  <div className="find-wrap-login">
                    <div className="form-check w-24 save-id">
                      {/* <input
                        id="vertical-form-3"
                        className="form-check-input"
                        type="checkbox"
                        value=""
                      />
                      <label
                        className="form-check-label"
                        htmlFor="vertical-form-3"
                      >
                        아이디 저장
                      </label> */}
                    </div>
                    <div className="find-id-wrap">
                      <Link to="/find-id">ＩDを忘れた場合</Link>
                      <Link to="/find-pwd">パスワードを忘れた場合</Link>
                    </div>
                  </div>
                  <div className="signup-wrap flex items-center space-between">
                    <div className="signup-tit">
                    HITOBITOのユーザーでない <br />
                    方の会員登録はこちら
                    </div>
                    <div className="signup-btn">
                      <button
                        className="btn btn-primary w-40"
                        onClick={() => navigate("/signup")}
                      >
                        新規会員登録
                      </button>
                    </div>
                  </div>
                </div>
                {/* 유저가 존재하지 않습니다 */}
                <Modal
                  show={emptyError}
                  onHidden={() => {
                    setEmptyError(false);
                  }}
                >
                  <ModalBody className="p-10 text-center">
                    <div className="modal-tit">存在しないユーザです。</div>
                    <div className="modal-subtit pt-2">
                      {loginId}は存在しないユーザーです。<br />
                      もう一度確認してください。
                    </div>
                    <div className="flex flex-end pt-5 gap-3">
                      <a
                        href="#"
                        className="btn btn-primary"
                        onClick={() => {
                          setEmptyError(false);
                        }}
                      >
                        確認
                      </a>
                    </div>
                  </ModalBody>
                </Modal>

                {/* 비밀번호가 맞지 않습니다.*/}
                <Modal
                  show={pwdError}
                  onHidden={() => {
                    setpwdError(false);
                  }}
                >
                  <ModalBody className="p-10 text-center">
                    <div className="modal-tit">パスワードが間違ってます。</div>
                    <div className="modal-subtit pt-2">
                      IDまたはパスワードが正しくありません。 <br />
                      再度確認してください。
                    </div>
                    <div className="flex flex-end pt-5 gap-3">
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

                {/* 입력이 누락된 경우 */}
                <Modal
                  show={nullError}
                  onHidden={() => {
                    setNullError(false);
                  }}
                >
                  <ModalBody className="p-10 text-center">
                    <div className="modal-tit">入力した情報に問題があります。</div>
                    <div className="modal-subtit pt-2">入力した内容を確認してください。</div>
                    <div className="flex flex-end pt-5 gap-3">
                      <a
                        href="#"
                        className="btn btn-primary"
                        onClick={() => {
                          setNullError(false);
                        }}
                      >
                        確認
                      </a>
                    </div>
                  </ModalBody>
                </Modal>

                {/* ID 입력 누락 */}
                <Modal
                  show={idNullError}
                  onHidden={() => {
                    setIdNullError(false);
                  }}
                >
                  <ModalBody className="p-10 text-center">
                    <div className="modal-tit">IDを入力してください。</div>
                    <div className="modal-subtit pt-2">IDを確認してください。</div>
                    <div className="flex flex-end pt-5 gap-3">
                      <a
                        href="#"
                        className="btn btn-primary"
                        onClick={() => {
                          setIdNullError(false);
                        }}
                      >
                        確認
                      </a>
                    </div>
                  </ModalBody>
                </Modal>

                {/* PW 입력 누락 */}
                <Modal
                  show={pwNullError}
                  onHidden={() => {
                    setPwNullError(false);
                  }}
                >
                  <ModalBody className="p-10 text-center">
                    <div className="modal-tit">パスワードを入力してください。</div>
                    <div className="modal-subtit pt-2">パスワードを確認してください。</div>
                    <div className="flex flex-end pt-5 gap-3">
                      <a
                        href="#"
                        className="btn btn-primary"
                        onClick={() => {
                          setPwNullError(false);
                        }}
                      >
                        確認
                      </a>
                    </div>
                  </ModalBody>
                </Modal>


                {/* 이용권한 없음 */}
                <Modal
                  show={permissionFail}
                  onHidden={() => {
                    setPermissionFail(false);
                  }}
                >
                  <ModalBody className="p-10 text-center">
                    <div className="modal-tit">このページの利用権限がありません。</div>
                    <div className="flex flex-end gap-3">
                      <a
                        href="#"
                        className="btn btn-primary"
                        onClick={() => {
                          setPermissionFail(false);
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

        {/* mobile */}
        <div className="login-right mobile_login">
          <div className="login-tab-wrap ">
            {/* <UserLogin /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
