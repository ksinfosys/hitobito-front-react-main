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

const Major = () => {
  // 最終学校名 전공학부 입력
  const [MajorModal, setMajorModal] = useState(false);
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [slctMajor, setSlctMajor] = useState(mobile.major)

  const modMajorOnClick = () => {
    axios.put("/api/resume/edit/school", {
      schoolName: mobile.schoolName,
      majorName: slctMajor
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
          schoolName: mobile.schoolName,
          majorName: slctMajor
        });
        alert("학과명 변경에 성공하였습니다.");
        setMajorModal(false);
      })() : console.log("fetching error:::", response);
    })
  }

  const handleUpdateMobileBody = (e) => {
    setSlctMajor(e.target.value);
  };

  return (
    <div className="change-box-item flex items-center">
      <div className="change-box-tit">専攻名</div>
      <div className="change-box-cont">{mobile.majorName}</div>
      <div className="change-box-btn">
        <button className="btn btn-primary" onClick={() => setMajorModal(true)}>
          変更
        </button>
      </div>

      {/* 학과명 변경 */}
      <Modal
        show={MajorModal}
        onHidden={() => {
          setMajorModal(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">専攻名</h2>
            <button
              onClick={() => {
                setMajorModal(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">
              専攻名を入力してください。
            </div>

            <div className="mobile-drop-wrap">
              {/* <input
                id={"schoolName"}
                type="text"
                className="form-control"
                placeholder="最終学校名入力"
                onChange={handleUpdateMobileBody}
              /> */}
              <input
                id={"majorName"}
                type="text"
                className="form-control"
                placeholder="専攻名 · 専攻名入力"
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
                setMajorModal(false);
              }}
            >
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={modMajorOnClick}>
              変更完了
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Major;
