import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@/base-components";
import { useEffect, useRef, useState } from "react";

import { useRecoilState } from "recoil";
import { mobileStatus } from "@/stores/mobile-status";
import MobileSelectBox from "@/views/resume-mng/mobile-items/MobileSelectBox";
import { useDidMountEffect } from "../../../../utils/customHooks";
import axios from "axios";
import { getCookie } from "../../../../utils/cookie";
const CurrentIndustry = () => {
  // 현재 업종 변경 모달
  const [CurrentIndustryModal, setCurrentIndustry] = useState(false);

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [depth, setDepth] = useState(mobile.mobileJobDeptIdx ? mobile.mobileJobDeptIdx : 0)

  const [slctCrntIndDep1, setSlctCrntIndDep1] = useState(mobile.jobTypeOneDeps);
  const [slctCrntIndDep2, setSlctCrntIndDep2] = useState(mobile.jobType);

  const dep2Ref = useRef();

  const handleUpdateMobileBody = (e) => {
    const key = e.target.id
    const value = e.target.value

    if (key === 'jobTypeOneDeps') {
      setDepth(e.nativeEvent.target.selectedIndex);
      setSlctCrntIndDep1(value);
    } else {
      setSlctCrntIndDep2(value);
    }
  }

  const modCrntIndOnClick = () => {
    axios.put("api/resume/edit/scode", {
      sCode: slctCrntIndDep2
    }, {
      withCredentials: true,
      headers: {
        accessToken: getCookie("accessToken"),
        lastLoginTime: getCookie("lastLoginTime"),
      }
    }).then(response => {
      console.log(response)
      response.data.resultCode === '200' ? (() => {
        setMobileStatus({
          ...mobile,
          mobileJobDeptIdx: depth,
          jobTypeOneDeps: slctCrntIndDep1,
          jobType: slctCrntIndDep2
        })
        alert("現在業種変更に成功しました。");
        setCurrentIndustry(false);
      })() : console.log("fetching error:::", response);
    })
  }

  const getCrntIndTxt = (code) => {
    let cInfo = mobile.api.jobTypeList.filter(job => job.jobType === code);
    return cInfo[0]?.jobTypeName;
  }

  useDidMountEffect(() => {
    dep2Ref.current.value = mobile.jobDepthMenu[depth].child[0]?.jobType;
    setSlctCrntIndDep2(mobile.jobDepthMenu[depth].child[0]?.jobType);
  }, [slctCrntIndDep1])

  return (
    <div className="change-box-item flex items-center">
      <div className="flex justify-start flex-col">
        <div className="change-box-tit">現在の職種</div>
        <div className="change-box-cont">{getCrntIndTxt(mobile.jobTypeOneDeps)} / {getCrntIndTxt(mobile.jobType)}</div>
      </div>
      <div className="change-box-btn">
        <button className="btn btn-primary"
          onClick={() =>
            setCurrentIndustry(true)
          }
        >変更</button>
      </div>

      {/* 현재 업종 변경 */}
      <Modal
        show={CurrentIndustryModal}
        onHidden={() => {
          setCurrentIndustry(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">現在の職種</h2>
            <button
              onClick={() => {
                setCurrentIndustry(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">
              あなたの職種を選択してください。→　（大分類）と（小分類）があるので職種でOK
            </div>
            <div className="mobile-drop-wrap">
              <MobileSelectBox
                id={"jobTypeOneDeps"}
                data={mobile.jobDepthMenu && mobile.jobDepthMenu}
                value={mobile.jobDepthMenu && mobile.jobTypeOneDeps}
                onChange={handleUpdateMobileBody}
              />
              <MobileSelectBox
                id={"jobType"}
                data={
                  mobile.jobDepthMenu.length > 0
                    ? mobile.jobDepthMenu[depth].child
                    : []
                }
                value={mobile.jobType.length > 0 ? mobile.jobType : []}
                onChange={handleUpdateMobileBody}
                disabled={!mobile.jobTypeOneDeps}
                reference={dep2Ref}
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
                setCurrentIndustry(false);
              }}
            >
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={modCrntIndOnClick}>
              変更完了
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default CurrentIndustry;
