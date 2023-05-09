import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@/base-components";
import { useEffect, useRef, useState } from "react";

import MobileSelectBox from "@/views/resume-mng/mobile-items/MobileSelectBox";
import { useRecoilState } from "recoil";
import { mobileStatus } from "@/stores/mobile-status";
import axios from "axios";
import { getCookie } from "../../../../utils/cookie";
import { useDidMountEffect } from "../../../../utils/customHooks";


const Sectors = () => {
  // 재직회사 업종 모달
  const [SectorsModal, setSectors] = useState(false);
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [depth, setDepth] = useState(mobile.mobileBusinessDeptIdx ? mobile.mobileBusinessDeptIdx : 0)
  const [slctSectorDep1, setSlctSectorDep1] = useState(mobile.businessTypeOneDeps);
  const [slctSectorDep2, setSlctSectorDep2] = useState(mobile.businessType);
  const dep2Ref = useRef();

  const handleUpdateMobileBody = (e) => {
    const key = e.target.id
    const value = e.target.value
    console.log(key, value)

    if (key === 'businessTypeOneDeps') {
      setDepth(e.nativeEvent.target.selectedIndex)
      setSlctSectorDep1(value)
    } else {
      setSlctSectorDep2(value)
    }
  }

  useDidMountEffect(() => {
    dep2Ref.current.value = mobile.businessDepthMenu[depth].child[0].businessType;
    setSlctSectorDep2(mobile.businessDepthMenu[depth].child[0].businessType);
  }, [slctSectorDep1])

  const modSectorsOnClick = () => {
    // let parms = slctSectorDep2 === "" ? slctSectorDep1 : slctSectorDep2;
    axios.put("api/resume/edit/scode", {
      sCode: slctSectorDep2
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
          mobileBusinessDeptIdx: depth,
          businessTypeOneDeps: slctSectorDep1,
          businessType: slctSectorDep2
        })
        alert("在籍会社変更に成功しました。");
        setSectors(false);
      })() : console.log("fetching error:::", response);
    })
  }

  const getSectorTxt = (code) => {
    let cInfo = mobile.api.businessTypeList.filter(sector => sector.businessType === code);
    return cInfo[0]?.businessTypeName;
  }


  return (
    <div className="change-box-item flex items-center">
      <div className="flex justify-start flex-col">
        <div className="change-box-tit">在職中の会社の業種</div>
        <div className="change-box-cont">{getSectorTxt(mobile.businessTypeOneDeps)} / {getSectorTxt(mobile.businessType)}</div>
      </div>
      <div className="change-box-btn">
        <button className="btn btn-primary" onClick={() => setSectors(true)}>
          変更
        </button>
      </div>

      {/* 재직회사 업종 변경 */}
      <Modal
        show={SectorsModal}
        onHidden={() => {
          setSectors(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">在職中の会社の業種</h2>
            <button
              onClick={() => {
                setSectors(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">
              在職中の会社の業種を選択してください。　→　（大分類）と（小分類）があるので業種でOK
            </div>
            <div className="mobile-drop-wrap">
              <MobileSelectBox
                id={"businessTypeOneDeps"}
                data={mobile.businessDepthMenu && mobile.businessDepthMenu}
                value={mobile.businessDepthMenu && mobile.businessTypeOneDeps}
                onChange={handleUpdateMobileBody}
              />
              <MobileSelectBox
                id={"businessType"}
                data={
                  mobile.businessDepthMenu.length > 0
                    ? mobile.businessDepthMenu[depth].child
                    : []
                }
                value={
                  mobile.businessType > 0 ? mobile.businessType : []
                }
                reference={dep2Ref}
                onChange={handleUpdateMobileBody}
                disabled={!mobile.businessTypeOneDeps}
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
                setSectors(false);
              }}
            >
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={modSectorsOnClick}>
              変更完了
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Sectors;
