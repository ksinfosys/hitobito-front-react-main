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
import MobileSelectBox from "@/views/resume-mng/mobile-items/MobileSelectBox";
import axios from "axios";
import { getCookie } from "../../../../utils/cookie";

const Education = () => {
  // 최종学歴
  const [EducationModal, setEducationModal] = useState(false);

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [slctEdu, setSlctEdu] = useState(mobile.education)


  const handleUpdateMobileBody = (e) => {
    setSlctEdu(e.target.value)
  }

  const modEduOnClick = () => {
    axios.put("api/resume/edit/scode", {
      sCode: slctEdu
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
          education: slctEdu
        });
        alert("最終学歴変更に成功しました。");
        setEducationModal(false);
      })() : console.log("fetching error:::", response);
    })
  }

  const getEduTxt = (code) => {
    let cInfo = mobile.api.educationList.filter(edu => edu.education === code);
    return cInfo[0]?.educationName;
  }

  return (
    <div className="change-box-item flex items-center">
      <div className="change-box-tit">最終学歴</div>
      <div className="change-box-cont">{getEduTxt(mobile.education)}</div>
      <div className="change-box-btn">
        <button
          className="btn btn-primary"
          onClick={() => setEducationModal(true)}
        >
          変更
        </button>
      </div>
      {/* 최종学歴 */}
      <Modal
        show={EducationModal}
        onHidden={() => {
          setEducationModal(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">最終学歴</h2>
            <button
              onClick={() => {
                setEducationModal(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">最終学歴を選択してください。</div>
            <div className="mobile-drop-wrap">
              <MobileSelectBox
                id={"education"}
                data={mobile.api && mobile.api.educationList}
                value={mobile.education}
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
                setEducationModal(false);
              }}
            >
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={modEduOnClick}>
              変更完了
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};
export default Education;
