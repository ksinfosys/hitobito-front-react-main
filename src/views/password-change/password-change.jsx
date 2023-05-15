import { Modal, ModalBody } from "@/base-components";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResetRecoilState } from "recoil";
import CheckToken from "../../../util/CheckToken";
import ServiceFetch from "../../../util/ServiceFetch";
import { userInfo } from "../../stores/user-info";
import { delCookie, getCookie } from "../../utils/cookie";

function PasswordChange() {
  const [passwordChangeModal, passwordChange] = useState(false);
  const navigate = useNavigate();

  const resetInfoV = useResetRecoilState(userInfo);

  // 기존 Password
  const [password, setPassword] = useState();
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

  // 표시 flag
  // 현재 비밀번호
  const [currentFlag, setCurrentFlag] = useState(false)
  // 바꿀 비밀번호
  const [changeFlag, setChangeFlag] = useState(false)
  //確認 비밀번호
  const [checkFlag, setCheckFlag] = useState(false)


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
  }

  const handleChange = (pw, newPW) => {
    // 비밀번호 유효성 검사
    const regPw = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,16}$/;

    // 예외처리
    if (!password || !newPassword || !newPasswordCheck) {
      // 입력누락 체크
      setPwNullError(true);
      return;
    } else if (!regPw.test(newPW)) {
      // 유효성검사 체크
      console.log('this')
      passwordChange(true);
      return;
    } else if (newPW !== newPassword) {
      // 비밀번호 일치確認
      setPwError2(true);
      return;
    } else {
      axios
        .put(
          "/api" + "/join/modify/password",
          {
            password: pw,
            updatedPassword: newPW,
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
          console.log(response)
          const code = response.data.resultCode;
          code === "200"
            ? (() => {
              setPassChange(true);
            })()
            : (response => {
              if (code === "202") {
                setPwError1(true);
              } else if (code === "219") {
                setUserFail(true);
              } else if (code === "230") {
                setSamePassword(true);
              } else {
                passwordChange(true);
              }
            })();
        });
    }
  };

  return (
    <>
      <div className="nickname">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-sm">
            パスワード変更
          </div>
          <div className="cont-wrap p-10">
            <div className="form p-5 bg-lo">
              {/* 여기가 로그인과 레이아웃이 달라서 좀 깨지는 부분입니다. */}
              <label htmlFor="vertical-form-1" className="form-label mb-2">
                既存パスワード<span className="import ml-1">*</span>
              </label>
              <div className="pwd-eye-wrap">
                <input
                  id="vertical-form-1"
                  type={currentFlag ? "text" : "password"}
                  className="form-control"
                  placeholder="英字・数字・特殊記号を組み合わせて８～16桁で入力"
                  onChange={e => setPassword(e.currentTarget.value)}
                />
                <button className="eye-btn" onClick={() => {
                  setCurrentFlag(prev => !prev)
                }}>
                  {
                    currentFlag === true ? <img src="/images/eye-open.svg" alt="" /> : <img src="/images/eye-close.svg" alt="" />
                  }
                </button>
              </div>
              <div className="mt-5">
                <label htmlFor="vertical-form-1" className="form-label mb-2">
                  新規パスワード<span className="import ml-1">*</span>
                </label>
                <div className="pwd-eye-wrap">
                  <input
                    id="vertical-form-1"
                    type={changeFlag ? "text" : "password"}
                    className="form-control"
                    placeholder="英字・数字・特殊記号を組み合わせて８～16桁で入力"
                    onChange={e => setNewPassword(e.currentTarget.value)}
                  />
                  <button className="eye-btn" onClick={() => {
                    setChangeFlag(prev => !prev)
                  }}>
                    {
                      changeFlag === true ? <img src="/images/eye-open.svg" alt="" /> : <img src="/images/eye-close.svg" alt="" />
                    }
                  </button>
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="vertical-form-2" className="form-label mb-2">
                  パスワード確認<span className="import ml-1">*</span>
                </label>
                <div className="pwd-eye-wrap">
                  <input
                    id="vertical-form-2"
                    type={checkFlag ? "text" : "password"}
                    className="form-control"
                    placeholder="英字・数字・特殊記号を組み合わせて８～16桁で入力"
                    onChange={e => setNewPasswordCheck(e.currentTarget.value)}
                  />
                  <button className="eye-btn" onClick={() => {
                    setCheckFlag(prev => !prev)
                  }}>
                    {
                      checkFlag === true ? <img src="/images/eye-open.svg" alt="" /> : <img src="/images/eye-close.svg" alt="" />
                    }
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-pending w-full mt-10"
                onClick={() => {
                  handleChange(password, newPasswordCheck);
                }}
              >
                変更
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 비밀번호 변경確認 */}
      <Modal
        show={passwordChangeModal}
        onHidden={() => {
          passwordChange(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">パスワードの形式が正しくありません。</div>
          <div className="modal-subtit">
            英字・数字・特殊記号を組み合わせて８～16桁で
            <br />
            入力してください。
          </div>
          <div className="flex flex-end gap-3">
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
          <div className="modal-subtit">パスワードを確認してください。</div>
          <div className="flex flex-end gap-3">
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

      {/* 기존 패스워드確認 */}
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

      {/* 기존 패스워드, 새로운 패스워드 일치確認 */}
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
          <div className="modal-subtit">
            管理者にお問い合わせしてください。
          </div>
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

      {/* 현재 패스워드와 새로운 패스워드가 같음 */}
      <Modal
        show={samePassword}
        onHidden={() => {
          setSamePassword(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">パスワード変更に失敗しました。</div>
          <div className="modal-subtit">
            현재 패스워드와 새로운 패스워드가 같습니다.
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setSamePassword(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default PasswordChange;
