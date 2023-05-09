import {useState} from 'react';

import Download from "@/assets/images/download-icon-sky.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import {useRecoilState} from "recoil";
import {mobileStatus} from "../../stores/mobile-status";
import {useEffect} from "react";
import MobileSelectBox from "../../views/resume-mng/mobile-items/MobileSelectBox";
import serviceFetch from "../../../util/ServiceFetch";
import DepthSplit from "../../../util/DepthSplit";

const ResumeMobile10 = (props) => {

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [depth, setDepth] = useState(mobile.mobileHopeCareerDeptIdx ? mobile.mobileHopeCareerDeptIdx : 0)

  const handleUpdateMobileBody = (e) => {
    const key = e.target.id
    const value = e.target.value

    if (key === 'hopeCareerOneDeps') {
      setDepth(e.nativeEvent.target.selectedIndex)
    }

    console.log(key)
    console.log(value)
    setMobileStatus({
      ...mobile,
      mobileHopeCareerDeptIdx : depth,
      [key]: value
    })
  }

  useEffect(() => {
    serviceFetch('/resume/reg', 'get',{})
      .then((res) => {
        setMobileStatus(prev => {
          return {...prev, api: res.data.result}
        })
        if (mobile) {
          setMobileStatus({
            ...mobile,
            hopeCareerDepthMenu: DepthSplit(mobile, 'hopeCareerDepthMenu', 'hopeCareerList', 'hopeCareer'),
          })
        }
      })
  }, [])

  return (
    <>
      <div className="mobile-resume-wrap">
        <div className="flex items-center gap-3 space-between">
          <MobileProgress/>
          <button className="btn btn-sm btn-skyblue w-36 flex gap-1 items-center">
            <img src={Download} alt=""/>
            一時保存
          </button>
        </div>
        <div className="mo-resume-tit">
         あなたの将来の目標を選択してください。
        </div>
        <div className="mobile-drop-wrap">
          <MobileSelectBox id={'hopeCareerOneDeps'}
                           data={mobile.hopeCareerDepthMenu && mobile.hopeCareerDepthMenu}
                           value={mobile.hopeCareerDepthMenu && mobile.hopeCareerOneDeps}
                           onChange={handleUpdateMobileBody}/>
          <MobileSelectBox id={'hopeCareer'}
                           data={mobile.hopeCareerDepthMenu.length > 0 ? mobile.hopeCareerDepthMenu[depth].child : []}
                           value={mobile.hopeCareerDepthMenu.length > 0 ? mobile.hopeCareer : []}
                           onChange={handleUpdateMobileBody} disabled={!mobile.hopeCareerOneDeps}/>
        </div>
      </div>
    </>
  );
};
export default ResumeMobile10;
