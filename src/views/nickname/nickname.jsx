import { Modal, ModalBody, } from "@/base-components";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userInfo } from "../../stores/user-info";
import axios from "axios";
import ServiceFetch from "../../../util/ServiceFetch";
import { useNavigate } from "react-router-dom";
import { delCookie } from "../../utils/cookie";
import NicknameM from "@/views/nickname/nickname-mobile";

import ResumeMobile from "../../components/resume-mobile/resume-mobile";


function Nickname() {
  // const handleClick2 = () => {
  //     setIsActive3(current => !current);
  //     setIsActive2(current => !current);
  // }
  //const [userInfoV, setUserInfoV] = useRecoilState(userInfo);

  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);

  const [changeNickname, setChangeNickname] = useState("")
  const [nicknameChangeModal, setNicknameChangeModal] = useState(false);
  const [prevNickname, setPrevNickname] = useState('')
  const [apiResponse, setApiResponse] = useState({})

  const navigate = useNavigate();

  // 닉네임 없음
  const [nullFail, setNullFail] = useState(false);
  // 중복
  const [duplicateFail, setDuplicateFail] = useState(false);
  // 입력정보 못찾음
  const [notFoundFail, setNotFoundFail] = useState(false);
  // 유저 설정 실패
  const [settingFail, setSettingFail] = useState(false);
  // 부적절한 닉네임
  const [goodNameFail, setGoodNameFail] = useState(false);
  // 완료
  const [completeFlag, setCompleteFlag] = useState(false);

  const CheckLength = (str, flg) => {
    if (str.length > 30) return false
    if (str.length === 0) return true

    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i);
      // Shift_JIS: 0x0 ～ 0x80, 0xa0 , 0xa1 ～ 0xdf , 0xfd ～ 0xff
      // Unicode : 0x0 ～ 0x80, 0xf8f0, 0xff61 ～ 0xff9f, 0xf8f1 ～ 0xf8f3
      if ((c >= 0x0 && c < 0x81) || (c == 0xf8f0) || (c >= 0xff61 && c < 0xffa0) || (c >= 0xf8f1 && c < 0xf8f4)) {
        if (!flg) return true;
      } else {
        if (flg) return true;
      }
    }
    return false;
  }

  const handleChangeNickname = (e) => {
    const text = e.target.value

    const flag = {
      regular: CheckLength(text, 0),
      half_width: CheckLength(text, 1)
    }

    if (flag.regular || flag.half_width) setChangeNickname(text)
    else setApiResponse({ resultCode: '5000' })

  }

  const handleUpdateNickname = async () => {
    console.log(apiResponse)
    if (changeNickname || apiResponse.resultCode === '5000') {
      ServiceFetch('/user/modify', 'put', {
        modifiedNickname: changeNickname
      }).then(res => {
        console.log(res, "resssss")
        res.resultCode === "200"
          ? (() => {
            setUserInfoV(prev => ({
              ...prev,
              userNickName: res.result.modifiedNickname
            }))
            setApiResponse(res)
            setCompleteFlag(true);
          })()
          : (() => {
            switch (res.resultCode) {
              case "216":
                setDuplicateFail(true)
                break;
              case "104":
                setNotFoundFail(true)
                break;
              case "219":
                setSettingFail(true)
                break;
              case "221":
                setGoodNameFail(true)
                break;
              default:
                
            }
          })()
      })
    } else {
      setApiResponse({
        resultMessage: 'ニックネームを入力してください。'
      })
      setNullFail(true)
    }
  }

  useEffect(() => {
    ServiceFetch('/user/modify', 'get', {})
      .then((res) => {
        // setPrevNickname(res.result.nickname)
        setUserInfoV(prev => ({
          ...prev,
          userNickName: res.result.nickname
        }))
      })
  }, [])

  return (
    <>
      <div className="nickname hidden lg:block">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-lg font-bold lg:text-sm lg:font-normal">
            ニックネーム変更
          </div>
          <div className="cont-wrap py-10 px-5">
            <div className="form p-5 bg-lb">
              <div>
                <label htmlFor="vertical-form-1" className="form-label mb-2">現在ニックネーム</label>
                <input id="vertical-form-1" type="text" className="form-control" value={userInfoV.userNickName}
                  disabled />
              </div>
              <div className="mt-5">
                <label htmlFor="vertical-form-2" className="form-label mb-2">変更ニックネーム</label>
                <input id="vertical-form-2" value={changeNickname} type="text" className="form-control" placeholder="変更するニックネームを入力してください。"
                  onChange={(e) => handleChangeNickname(e)} />
              </div>
              <button type="button" className="btn btn-primary w-full mt-10" onClick={() => {
                handleUpdateNickname().then(res => {
                  setNicknameChangeModal(true)
                })
              }}>変更</button>
            </div>
          </div>
        </div>
      </div>

      {/* 닉네임 모바일 분기 */}
      <NicknameM />

      {/* 변경 완료 */}
      <Modal
        show={completeFlag}
        onHidden={() => {
          setCompleteFlag(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">ニックネームの変更に成功しました。</div>

          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setCompleteFlag(false)
                setChangeNickname("")
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 닉네임입력 없음 */}
      <Modal
        show={nullFail}
        onHidden={() => {
          setNullFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">ニックネームを入力してください。</div>
          {/* <div className="modal-subtit">
            
          </div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setNullFail(false)
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>


      {/* 설정 실패 */}
      <Modal
        show={goodNameFail}
        onHidden={() => {
          setGoodNameFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">不適切な単語が含まれています。</div>
          <div className="modal-subtit">
          もう一度設定してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setGoodNameFail(false)
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 중복 에러 없음 */}
      <Modal
        show={duplicateFail}
        onHidden={() => {
          setDuplicateFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">このニックネームは既に登録されています。</div>
          {/* <div className="modal-subtit">
            
          </div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setDuplicateFail(false)
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 입력정보 없음 */}
      <Modal
        show={notFoundFail}
        onHidden={() => {
          setNotFoundFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">入力情報が見つかりません。</div>
          {/* <div className="modal-subtit">
            
          </div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setNotFoundFail(false)
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 설정 실패 */}
      <Modal
        show={settingFail}
        onHidden={() => {
          setSettingFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">ユーザー設定に失敗しました。</div>
          <div className="modal-subtit">
            管理者にお問い合わせください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setSettingFail(false)
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

export default Nickname;
