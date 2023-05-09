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
const Residence = () => {
  // 居住地 변경 모달
  const [ResidenceModal, setResidence] = useState(false);
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [slctRsdc, setSlctRsdc] = useState(mobile.residentialArea);

  const handleUpdateMobileBody = (e) => {
    setSlctRsdc(e.target.value);
  };

  const modRsdcOnClick = () => {
    axios.put("api/resume/edit/scode", {
      sCode: slctRsdc
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
          residentialArea: slctRsdc
        });
        alert("居住地変更に成功しました。");
        setResidence(false);
      })() : console.log("fetching error:::", response);
    })
  }

  const getRsdcTxt = (code) => {
    let cInfo = mobile.api.residentialAreaList.filter(rsdc => rsdc.residentialArea === code);
    return cInfo[0]?.residentialAreaName;
  }

  return (
    <div className="change-box-item flex items-center">
      <div className="flex justify-start flex-col">
        <div className="change-box-tit">居住地</div>
        <div className="change-box-cont">{getRsdcTxt(mobile.residentialArea)}</div>
      </div>
      <div className="change-box-btn">
        <button className="btn btn-primary"
          onClick={() =>
            setResidence(true)
          }
        >変更</button>
      </div>

      {/* 居住地 변경 */}
      <Modal
        show={ResidenceModal}
        onHidden={() => {
          setResidence(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">居住地</h2>
            <button
              onClick={() => {
                setResidence(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">居住地を選択してください</div>
            <div className="mobile-drop-wrap">
              <MobileSelectBox
                id={"residentialArea"}
                data={mobile.api && mobile.api.residentialAreaList}
                value={mobile.residentialArea}
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
                setResidence(false);
              }}
            >
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={modRsdcOnClick}>
              変更完了
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Residence;
