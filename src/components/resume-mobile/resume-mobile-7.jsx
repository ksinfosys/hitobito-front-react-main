import { useEffect, useState } from 'react';

import Download from "@/assets/images/download-icon-sky.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import MobileSelectBox from "../../views/resume-mng/mobile-items/MobileSelectBox";
import { useRecoilState } from "recoil";
import { mobileStatus } from "../../stores/mobile-status";
import DepthSplit from "../../../util/DepthSplit";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import serviceFetch from "../../../util/ServiceFetch";

const ResumeMobile7 = (props) => {

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [depth, setDepth] = useState(mobile.mobileBusinessDeptIdx ? mobile.mobileBusinessDeptIdx : 0)

  const handleUpdateMobileBody = (e) => {
    const key = e.target.id
    const value = e.target.value

    if (key === 'businessTypeOneDeps') {
      setDepth(e.nativeEvent.target.selectedIndex)
    }

    setMobileStatus({
      ...mobile,
      mobileBusinessDeptIdx: depth,
      [key]: value
    })
  }

  useEffect(() => {
    serviceFetch('/resume/reg', 'get', {})
      .then((res) => {
        setMobileStatus(prev => {
          return { ...prev, api: res.data.result }
        })
        if (mobile) {
          setMobileStatus({
            ...mobile,
            businessDepthMenu: DepthSplit(mobile, 'businessDepthMenu', 'businessTypeList', 'businessType'),
          })
        }
      })
  }, [])

  return (
    <>
      <div className="mobile-resume-wrap">
        <div className="flex items-center gap-3 space-between">
          <MobileProgress />
          <button className="btn btn-sm btn-skyblue w-36 flex gap-1 items-center">
            <img src={Download} alt="" />
          </button>
        </div>
        <div className="mo-resume-tit">
          在職中の会社の業種を選択してください。　→　（大分類）と（小分類）があるので業種でOK
        </div>
        <div className="mobile-drop-wrap">
          <MobileSelectBox id={'businessTypeOneDeps'}
            data={mobile.businessDepthMenu && mobile.businessDepthMenu}
            value={mobile.businessDepthMenu && mobile.businessTypeOneDeps}
            onChange={handleUpdateMobileBody} />
          <MobileSelectBox id={'businessType'}
            data={mobile.businessDepthMenu.length > 0 ? mobile.businessDepthMenu[depth].child : []}
            value={mobile.businessDepthMenu.length > 0 ? mobile.businessType : []}
            onChange={handleUpdateMobileBody} disabled={!mobile.businessTypeOneDeps} />
        </div>
      </div>
    </>
  );
};
export default ResumeMobile7;
