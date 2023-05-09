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

const Year = () => {
  // 経歴 모달
  const [YearModal, setYearModal] = useState(false);

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [slctCareer, setSlctCareer] = useState(mobile.career)

  const handleUpdateMobileBody = (e) => {
    setSlctCareer(e.target.value)
  }

  const getCareerTxt = (code) => {
    let cInfo = mobile.api.careerList.filter(career => career.career === code);
    return cInfo[0]?.careerName;
  }

  const modEduOnClick = () => {
    axios.put("api/resume/edit/scode", {
      sCode: slctCareer
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
          career: slctCareer
        });
        alert("経歴変更に成功しました。");
        setYearModal(false);
      })() : console.log("fetching error:::", response);
    })
  }

  return (
    <div className="change-box-item flex items-center">
      <div className="flex justify-start flex-col">
        <div className="change-box-tit">経歴</div>
        <div className="change-box-cont">{getCareerTxt(mobile.career)}</div>
      </div>
      <div className="change-box-btn">
        <button className="btn btn-primary"
          onClick={() =>
            setYearModal(true)
          }
        >変更</button>
      </div>

      {/* 経歴 변경 */}
      <Modal
        show={YearModal}
        onHidden={() => {
          setYearModal(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">経歴</h2>
            <button
              onClick={() => {
                setYearModal(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">経歴年数を入力してください。</div>
            <div className="mobile-drop-wrap">
              <MobileSelectBox
                id={"career"}
                data={mobile.api && mobile.api.careerList}
                value={mobile.career}
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
                setYearModal(false);
              }}
            >
              キャンセル
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

export default Year;
