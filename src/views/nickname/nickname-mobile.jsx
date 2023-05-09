import { Modal, ModalBody, } from "@/base-components";
import { useEffect, useState } from "react";
import ServiceFetch from "../../../util/ServiceFetch";
import { useNavigate } from "react-router-dom";
import { delCookie } from "../../utils/cookie";

function NicknameM() {


  const [changeNickname, setChangeNickname] = useState("")
  const [nicknameChangeModal, setNicknameChangeModal] = useState(false);
  const [prevNickname, setPrevNickname] = useState('')
  const [apiResponse, setApiResponse] = useState({})

  const navigate = useNavigate();

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
    if (changeNickname || apiResponse.resultCode === '5000') {
      ServiceFetch('/user/modify', 'put', {
        modifiedNickname: changeNickname
      }).then(res => {
        console.log(res)
        setApiResponse(res)
      }).catch(e => { })
    } else {
      setApiResponse({
        resultMessage: 'ニックネームを入力してください。'
      })
    }
  }

  useEffect(() => {
    ServiceFetch('/user/modify', 'get', {})
      .then((res) => {
        setPrevNickname(res.result.nickname)
      })
  }, [])

  return (
    <>
      <div className="nickname lg:hidden">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-lg font-bold lg:text-sm lg:font-normal">
            ニックネーム変更
          </div>
          <div className="cont-wrap py-10 px-5">
            <div className="form p-5 bg-lb">
              <div>
                <label htmlFor="vertical-form-1" className="form-label mb-2">現在ニックネーム</label>
                <input id="vertical-form-1" type="text" className="form-control" value={prevNickname}
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
      {/* 닉네임 변경 확인 */}
      <Modal
        show={nicknameChangeModal}
        onHidden={() => {
          setNicknameChangeModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">ニックネーム変更</div>
          <div className="modal-subtit">
            {apiResponse.resultMessage}
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setNicknameChangeModal(false);
                if (apiResponse.resultCode === '200') {
                  delCookie("accessToken");
                  delCookie("lastLoginTime");
                  navigate("/");
                }
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

export default NicknameM;
