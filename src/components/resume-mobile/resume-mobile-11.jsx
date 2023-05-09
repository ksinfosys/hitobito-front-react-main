import Download from "@/assets/images/download-icon-sky.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import MobileSelectBox from "../../views/resume-mng/mobile-items/MobileSelectBox";
import {useRecoilState} from "recoil";
import {mobileStatus} from "../../stores/mobile-status";
import {useEffect} from "react";

const ResumeMobile10 = () => {

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);

  const handleUpdateMobileBody = (e) => {
    const key = e.target.id
    const value = e.target.value

    setMobileStatus({
      ...mobile,
      [key]: value
    })
  }

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
          <MobileSelectBox id={'hopeIncome'} data={mobile.api && mobile.api.hopeIncomeList} value={mobile.hopeIncome}
                           onChange={handleUpdateMobileBody}/>
        </div>
      </div>
    </>
  );
};
export default ResumeMobile10;
