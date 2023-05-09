import {useRecoilState} from "recoil";
import {mobileStatus} from "../../../stores/mobile-status";

const MobileProgress = () => {
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);

  return <>
    <div className="prog-wrap flex flex-col items-end">
      <div className="prog-bar-tit flex w-full space-between">
        <div className="prog-percent">進行度</div>
        <div className="percent"><span>{((mobile.progress / 15) * 100).toFixed(1)}</span>%</div>
      </div>
      <div className="progress">
        <progress value={mobile.progress / 15} max={1} />
      </div>
    </div>
  </>
}

export default MobileProgress
