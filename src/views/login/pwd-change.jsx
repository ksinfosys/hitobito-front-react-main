import {
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Modal,
  ModalBody,
} from "@/base-components";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import BigLogo from "@/assets/images/big-logo.svg";
import Blank from "@/assets/images/blank-img.png";
import Blank2 from "@/assets/images/blank2.png";
import LineIcon from "@/assets/images/line-icon.svg";
import GoogleIcon from "@/assets/images/google-icon.svg";
import KakaoIcon from "@/assets/images/kakao-icon.svg";
import axios from "axios";
import { delCookie, getCookie } from "../../utils/cookie";
import { useRecoilState, useResetRecoilState } from "recoil";
import { userInfo } from "../../stores/user-info";
import CheckToken from "../../../util/CheckToken";
import ServiceFetch from "../../../util/ServiceFetch";

const PwdChange = () => {
  const [passwordChangeModal, passwordChange] = useState(false);
  const navigate = useNavigate();

  const resetInfoV = useResetRecoilState(userInfo);
  const [findId, setfindId] = useState(false);
  // 새로운 Password
  const [newPassword, setNewPassword] = useState();
  // 새로운 Password 체크
  const [newPasswordCheck, setNewPasswordCheck] = useState();

  // 비밀번호 입력 누락
  const [pwNullError, setPwNullError] = useState(false);
  // 현재 패스워드 검사
  const [pwError1, setPwError1] = useState(false);
  // 현재 패스워드, 새로운 패스워드 일치 검사
  const [pwError2, setPwError2] = useState(false);

  // back
  // 비밀번호 변경 통과
  const [passChange, setPassChange] = useState(false);
  // 유저 설정 실패
  const [userFail, setUserFail] = useState(false);
  // 동일패스워드 검사
  const [samePassword, setSamePassword] = useState(false);

  const logOut = () => {
    resetInfoV();
    ServiceFetch("/company/logout", "post", {})
      .then(res => {
        return Promise.all([
          CheckToken(res, navigate),
          delCookie("accessToken"),
          delCookie("lastLoginTime")
        ]);
      })
      .then(() => {
        navigate("/");
      });
  };

  const handleKeyDown = (e) => {
    if (e.code === "Enter") {
      pwChange(newPassword, newPasswordCheck);
    }
    return;
  };

  const pwChange = (pw, newPW) => {
    // 비밀번호 유효성 검사
    const regPw =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,16}$/;

    // 예외처리
    if (!newPassword || !newPasswordCheck) {
      // 입력누락 체크
      setPwNullError(true);
      return;
    } else if (!regPw.test(newPW)) {
      // 유효성검사 체크
      console.log("this");
      passwordChange(true);
      return;
    } else if (newPW !== newPassword) {
      // 비밀번호 일치 확인
      setPwError2(true);
      return;
    } else {
      axios
        .put(
          "/api" + "/join/modify/temp",
          {
            password: pw,
          },
          {
            withCredentials: true,
            headers: {
              accessToken: getCookie("accessToken"),
              lastLoginTime: getCookie("lastLoginTime"),
            },
          }
        )
        .then(response => {
          console.log(response);
          const code = response.data.resultCode;
          code === "200"
            ? (() => {
              setPassChange(true);
            })()
            : console.log("fetching error:::", response);
        });
    }
  };
  return (
    <>
      <div className="find-wrap flex flex-col items-center">
        <img src={BigLogo} alt="" className="big-logo" />
        <div className="find-tit">
          {/* 임시 아이디 비밀번호 변경하기 */}
          臨時パスワード変更
        </div>
        <div className="find-subtit">
          臨時パスワードでログインしました。 <br />
          新しいパスワードを設定してください。
        </div>
        <div className="pwd-change-wrap" onKeyDown={handleKeyDown}>
          {/* <input id="regular-form-1" type="text" className="h-48 form-control" placeholder="아이디" />
                    <div className="input-det">
                        입력  5~20자의 영문 대소문자,숫자 포함
                    </div> */}
          <input
            id="regular-form-1"
            type="password"
            className="h-48 form-control"
            placeholder="パスワード_英文・数字・特殊記号で組み合わせ8~16字で入力してください。"
            onChange={e => setNewPassword(e.currentTarget.value)}
          />
          <div className="input-det">
            英文・数字・特殊記号で組み合わせ8~16字で入力してください。
          </div>
          <input
            id="regular-form-1"
            type="password"
            className="h-48 form-control"
            placeholder="パスワード確認"
            onChange={e => setNewPasswordCheck(e.currentTarget.value)}
          />
        </div>
        <div className="find-btn">
          <button
            className="btn btn-pending h-48"
            onClick={() => {
              pwChange(newPassword, newPasswordCheck);
            }}
          >
            変更する
          </button>
        </div>
      </div>

      {/* 비밀번호 변경 확인 */}
      <Modal
        show={passwordChangeModal}
        onHidden={() => {
          passwordChange(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">パスワードの形式が正しくありません。</div>
          <div className="modal-subtit pt-2">
            英文・数字・特殊記号で組み合わせ8~16字で
            <br />
            入力してください。
          </div>
          <div className="flex flex-end pt-5 gap-3">
            <a
              href="#"
              className="btn btn-pending"
              onClick={() => {
                passwordChange(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 패스워드 누락 */}
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
              className="btn btn-business"
              onClick={() => {
                setPwNullError(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 기존 패스워드 확인 */}
      <Modal
        show={pwError1}
        onHidden={() => {
          setPwError1(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">パスワードが一致していません。</div>
          <div className="modal-subtit">
            入力した既存パスワードが一致していません。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setPwError1(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 기존 패스워드, 새로운 패스워드 일치 확인 */}
      <Modal
        show={pwError2}
        onHidden={() => {
          setPwError2(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">
            パスワードと確認用パスワードが不一致です。
          </div>
          <div className="modal-subtit">
            入力したパスワードと確認用パスワードが一致していません。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setPwError2(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 패스워드 변경 통과 */}
      <Modal
        show={passChange}
        onHidden={() => {
          setPassChange(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">パスワードを変更しました。</div>
          <div className="modal-subtit">
            パスワードを変更しました。 <br />
            変更したパスワードで再度ログインしてください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setPassChange(false);
                logOut();
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 유저 설정에 실패 */}
      <Modal
        show={userFail}
        onHidden={() => {
          setUserFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">パスワード変更に失敗しました。</div>
          <div className="modal-subtit">管理者にお問い合わせしてください。</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setUserFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default PwdChange;
