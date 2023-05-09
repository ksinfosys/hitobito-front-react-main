import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@/base-components";
import { useState } from "react";

import { useRecoilState } from "recoil";
import { mobileStatus } from "@/stores/mobile-status";
import axios from "axios";
import { getCookie } from "../../../../utils/cookie";

const Contact = () => {
  // 이메일 연락처 모달
  const [Contact, setContact] = useState(false);

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [modEmail, setModEmail] = useState(mobile.userEmail);
  const [modPhone, setModPhone] = useState(mobile.phoneNumber);


  // const handleUpdateMobileBody = (e) => {
  //   const key = e.target.id.replaceAll(' regular-form-1', '').replaceAll(' checkbox-events', '')
  //   let value = e.target.value

  //   if(key === 'phoneNumberFlag') {
  //     setModPhone(value);
  //   } else {
  //     setModEmail(value);
  //   }
  // }

  const modContactOnClick = () => {
    const emailCheck = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/
    const phoneCheck = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/

    if (!emailCheck.test(modEmail)) {
      console.log(modEmail)
      alert('入力形式：abc@test.com에 맞춰주세요.')
      return false;
    }
    if (!phoneCheck.test(modPhone)) {
      alert('入力形式：000-0000-0000.에 맞춰주세요.')
      return false;
    }

    axios.put("api/resume/edit/contact", {
      phoneNumber: modPhone,
      userEmail: modEmail,
      phoneNumberFlag: mobile.phoneNumberFlag,
      userEmailFlag: mobile.userEmailFlag
    }, {
      withCredentials: true,
      headers: {
        accessToken: getCookie("accessToken"),
        lastLoginTime: getCookie("lastLoginTime"),
      }
    }).then(response => {
      response.data.resultCode === '200' ? (() => {
        setMobileStatus({
          ...mobile,
          phoneNumber: modPhone,
          userEmail: modEmail,
          phoneNumberFlag: mobile.phoneNumberFlag,
          userEmailFlag: mobile.userEmailFlag
        })
        alert("連絡先とイーメール要請を完了しました。");
        setContact(false);
      })() : console.log("fetching error:::", response);
    })
  }
  return (
    <div className="change-box-item flex items-center">
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="change-box-tit">イーメール</div>
          <div className="change-box-cont">{mobile.userEmail}</div>
        </div>
        <div className="flex items-center mt-2">
          <div className="change-box-tit">連絡先</div>
          <div className="change-box-cont">{mobile.phoneNumber}</div>
        </div>
      </div>
      <div className="change-box-btn">
        <button className="btn btn-primary"
          onClick={() =>
            setContact(true)
          }
        >変更</button>
      </div>

      {/* 이메일 연락처 변경 */}
      <Modal
        show={Contact}
        onHidden={() => {
          setContact(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">連絡先/イーメール</h2>
            <button
              onClick={() => {
                setContact(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">
              連絡先と メールアドレスを入力してください。
            </div>
            <div className="mobile-drop-wrap">
              <div className="flex items-center gap-2">
                <input
                  id="userEmail regular-form-1"
                  type="text"
                  className="form-control"
                  placeholder="メールアドレスを入力"
                  defaultValue={mobile.userEmail}
                  onChange={(e) => { setModEmail(e.target.value) }}
                />
                {/* <div className="toggle-wrap">
                  <div className="form-check form-switch flex flex-col items-end">
                    <label
                      className="form-check-label"
                      htmlFor="checkbox-events"
                    >
                      {mobile.userEmailFlag === 1 ? "공개" : "非公開"}
                    </label>
                    <input
                      className="show-code form-check-input ml-auto"
                      type="checkbox"
                      id="userEmailFlag checkbox-events"
                      onChange={handleUpdateMobileBody}
                    />
                  </div>
                </div> */}
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="phoneNumber regular-form-1"
                  type="text"
                  className="form-control"
                  placeholder="'-なしで数字だけ入力してください。"
                  defaultValue={mobile.phoneNumber}
                  onChange={(e) => { setModPhone(e.target.value) }}
                />
                {/* <div className="toggle-wrap">
                  <div className="form-check form-switch flex flex-col items-end">
                    <label
                      className="form-check-label"
                      htmlFor="checkbox-events"
                    >
                      {mobile.phoneNumberFlag === 1 ? "공개" : "非公開"}
                    </label>
                    <input
                      className="show-code form-check-input ml-auto"
                      type="checkbox"
                      id="phoneNumberFlag checkbox-events"
                      onChange={handleUpdateMobileBody}
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setContact(false);
              }}
            >
              キャンセル
            </button>
            <button type="button" className="btn btn-primary" onClick={modContactOnClick}>
              変更完了
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Contact;
