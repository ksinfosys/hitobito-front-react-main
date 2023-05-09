import Download from "@/assets/images/download-icon-sky.svg";
import { useRecoilState } from "recoil";
import { mobileStatus } from "../../stores/mobile-status";
import MobileSelectBox from "../../views/resume-mng/mobile-items/MobileSelectBox";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

const ResumeMobile = (props) => {

    const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
    const navigate = useNavigate();

    // useEffect(() => {
    //     console.log(mobile)
    //     isMobile && mobile.country.length > 0 ? navigate('/resume-change') : void 0;
    // }, [])

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
                    国籍を選択してください。
                </div>
                <div className="mobile-drop-wrap">
                    <MobileSelectBox id={'country'} value={mobile.country} data={mobile.api && mobile.api.countryList} onChange={handleUpdateMobileBody} />
                </div>
            </div>
        </>
    );
};
export default ResumeMobile;
