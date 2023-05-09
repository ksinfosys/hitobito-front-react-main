
import { useState } from 'react';
import Download from "@/assets/images/download-icon-sky.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import { useRecoilState } from "recoil";
import { mobileStatus } from "../../stores/mobile-status";
import MobileSelectBox from "../../views/resume-mng/mobile-items/MobileSelectBox";
import { useEffect } from "react";
import serviceFetch from "../../../util/ServiceFetch";
import DepthSplit from "../../../util/DepthSplit";

const ResumeMobile8 = (props) => {

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [depth, setDepth] = useState(mobile.mobileJobDeptIdx ? mobile.mobileJobDeptIdx : 0)

  const handleUpdateMobileBody = (e) => {
    const key = e.target.id
    const value = e.target.value

    if (key === 'jobTypeOneDeps') setDepth(e.nativeEvent.target.selectedIndex)

    setMobileStatus({
      ...mobile,
      mobileJobDeptIdx: depth,
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
            jobDepthMenu: DepthSplit(mobile, 'jobDepthMenu', 'jobTypeList', 'jobType'),
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
            内容保存
          </button>
        </div>
        <div className="mo-resume-tit">
          あなたの職種を選択してください。→　（大分類）と（小分類）があるので職種でOK
        </div>
        <div className="mobile-drop-wrap">
          <MobileSelectBox id={'jobTypeOneDeps'}
            data={mobile.jobDepthMenu && mobile.jobDepthMenu}
            value={mobile.jobDepthMenu && mobile.jobTypeOneDeps}
            onChange={handleUpdateMobileBody} />
          <MobileSelectBox id={'jobType'}
            data={mobile.jobDepthMenu.length > 0 ? mobile.jobDepthMenu[depth].child : []}
            value={mobile.jobDepthMenu.length > 0 ? mobile.jobType : []}
            onChange={handleUpdateMobileBody} disabled={!mobile.jobTypeOneDeps} />
        </div>
      </div>
    </>
  );
};
export default ResumeMobile8;
