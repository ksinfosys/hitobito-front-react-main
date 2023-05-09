import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@/base-components";
import { useRef, useState } from "react";

import { useRecoilState } from "recoil";
import { mobileStatus } from "@/stores/mobile-status";
import MobileSelectBox from "@/views/resume-mng/mobile-items/MobileSelectBox";
import axios from "axios";
import { getCookie } from "../../../../utils/cookie";
import { useDidMountEffect } from "../../../../utils/customHooks";
const Target = () => {
  // 将来の目標 변경 모달
  const [TargetModal, setTargetModal] = useState(false);

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [depth, setDepth] = useState(mobile.mobileHopeCareerDeptIdx ? mobile.mobileHopeCareerDeptIdx : 0)

  const [slctHopeCareerDep1, setSlctHopeCareerDep1] = useState(mobile.hopeCareerOneDeps);
  const [slctHopeCareerDep2, setSlctHopeCareerDep2] = useState(mobile.hopeCareer);
  const dep2Ref = useRef();

  const handleUpdateMobileBody = (e) => {
    const key = e.target.id
    const value = e.target.value

    if (key === 'hopeCareerOneDeps') {
      setDepth(e.nativeEvent.target.selectedIndex);
      setSlctHopeCareerDep1(value);
    } else {
      setSlctHopeCareerDep2(value);
    }
  }

  const modHopeCareerOnClick = () => {
    axios.put("api/resume/edit/scode", {
      sCode: slctHopeCareerDep2
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
          mobileHopeCareerDeptIdx: depth,
          hopeCareerOneDeps: slctHopeCareerDep1,
          hopeCareer: slctHopeCareerDep2
        })
        alert("現在業種変更に成功しました。");
        setTargetModal(false);
      })() : console.log("fetching error:::", response);
    })
  }

  const getHopeCareerTxt = (code) => {
    let cInfo = mobile.api.hopeCareerList.filter(hc => hc.hopeCareer === code);
    return cInfo[0]?.hopeCareerName;
  }

  useDidMountEffect(() => {
    dep2Ref.current.value = mobile.hopeCareerDepthMenu[depth].child[0].hopeCareer;
    setSlctHopeCareerDep2(mobile.hopeCareerDepthMenu[depth].child[0].hopeCareer);
  }, [slctHopeCareerDep1])

  return (
    <div className="change-box-item flex items-center">
      <div className="flex justify-start flex-col">
        <div className="change-box-tit">将来の目標</div>
        <div className="change-box-cont">
          {getHopeCareerTxt(mobile.hopeCareerOneDeps)} / <br />
          {getHopeCareerTxt(mobile.hopeCareer)}
        </div>
      </div>
      <div className="change-box-btn">
        <button className="btn btn-primary"
          onClick={() =>
            setTargetModal(true)
          }
        >変更</button>
      </div>

      {/* 将来の目標 변경 */}
      <Modal
        show={TargetModal}
        onHidden={() => {
          setTargetModal(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">将来の目標</h2>
            <button
              onClick={() => {
                setTargetModal(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">
              あなたの将来の目標を選択してください。
            </div>
            <div className="mobile-drop-wrap">
              <MobileSelectBox
                id={"hopeCareerOneDeps"}
                data={mobile.hopeCareerDepthMenu && mobile.hopeCareerDepthMenu}
                value={mobile.hopeCareerDepthMenu && mobile.hopeCareerOneDeps}
                onChange={handleUpdateMobileBody}
              />
              <MobileSelectBox
                id={"hopeCareer"}
                data={
                  mobile.hopeCareerDepthMenu.length > 0
                    ? mobile.hopeCareerDepthMenu[depth].child
                    : []
                }
                value={
                  mobile.hopeCareerDepthMenu.length > 0 ? mobile.hopeCareer : []
                }
                onChange={handleUpdateMobileBody}
                disabled={!mobile.hopeCareerOneDeps}
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
                setTargetModal(false);
              }}
            >
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={modHopeCareerOnClick}>
              変更完了
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Target;
