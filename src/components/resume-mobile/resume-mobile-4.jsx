import Download from "@/assets/images/download-icon-sky.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import { useRecoilState } from "recoil";
import { mobileStatus } from "../../stores/mobile-status";

const ResumeMobile4 = (props) => {

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
          <MobileProgress />
          <button className="btn btn-sm btn-skyblue w-36 flex gap-1 items-center">
            <img src={Download} alt="" />
            内容保存
          </button>
        </div>
        <div className="mo-resume-tit">
        最終学校名,専攻名,専攻名を選択してください。
        </div>

        <div className="mobile-drop-wrap">
          <input id={'schoolName'} type="text" className="form-control" placeholder="最終学校名入力" onChange={handleUpdateMobileBody} />
          <input id={'majorName'} type="text" className="form-control" placeholder="専攻名 · 専攻名入力" onChange={handleUpdateMobileBody} />
        </div>
      </div>
    </>
  );
};
export default ResumeMobile4;


