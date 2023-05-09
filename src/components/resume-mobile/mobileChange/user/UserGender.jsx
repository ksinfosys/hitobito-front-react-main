import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@/base-components";
import { useEffect, useState } from "react";

import { useRecoilState } from "recoil";
import { mobileStatus } from "@/stores/mobile-status";
import MobileSelectBox from "@/views/resume-mng/mobile-items/MobileSelectBox";
import axios from "axios";
import { getCookie } from "../../../../utils/cookie";

const UserGender = () => {
  // 性別
  const [GenderModal, setGenderModal] = useState(false);
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [slctGender, setSlctGender] = useState(mobile.userGender)

  const handleUpdateMobileBody = (e) => {
    setSlctGender(e.target.value);
  };

  const modUserGenderOnClick = () => {
    axios.put("api/resume/edit/scode", {
      sCode: slctGender
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
            userGender: slctGender
          });
          alert("性別変更に成功しました。");
          setGenderModal(false);
        })() : console.log("fetching error:::", response);
    })
  }

  const getUserGender = (code) => {
    let cInfo = mobile.api.userGenderList.filter(gender => gender.userGender === code);
    return cInfo[0]?.userGenderName;
  }

  return (
    <div className="change-box-item flex items-center">
      <div className="change-box-tit">性別</div>
      <div className="change-box-cont">{getUserGender(mobile.userGender)}</div>
      <div className="change-box-btn">
        <button
          className="btn btn-primary"
          onClick={() => setGenderModal(true)}
        >
          変更
        </button>
      </div>

      {/* 性別 */}
      <Modal
        show={GenderModal}
        onHidden={() => {
          setGenderModal(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">性別</h2>
            <button
              onClick={() => {
                setGenderModal(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">性別を選択してください。</div>
            <div className="mobile-drop-wrap">
              <MobileSelectBox
                id={"userGender"}
                data={mobile.api && mobile.api.userGenderList}
                value={mobile.userGender}
                onChange={handleUpdateMobileBody}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setGenderModal(false);
              }}
            >
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={modUserGenderOnClick}>
              変更完了
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserGender;
