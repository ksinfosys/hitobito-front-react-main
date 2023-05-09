
import { useEffect, useState } from 'react';

import Download from "@/assets/images/download-icon-sky.svg";
import SelectArrow from "@/assets/images/select-arrow.svg";
import checkIcon from "@/assets/images/check-icon.svg";
import { useRecoilState } from "recoil";
import { mobileStatus } from "../../stores/mobile-status";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import MobileSelectBox from "../../views/resume-mng/mobile-items/MobileSelectBox";

const ResumeMobile2 = (props) => {
    const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
    const [year, setYear] = useState(mobile.api && mobile.userAge ? parseInt(mobile.api.userAgeList.filter(item => item.userAge === mobile.userAge)[0].userAgeName) : 0)
    const handleAgeCalculator = () => new Date().getFullYear() - parseInt(year) + '歳'



    const handleUpdateMobileBody = (e) => {
        const key = e.target.id
        const value = e.target.value

        setYear(parseInt(e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text.toString()))

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
                    誕生年を選択してください。
                </div>

                <div className="mobile-drop-wrap">
                    <button className="btn btn-skyblue2 w-full mt-2">
                        {year ? handleAgeCalculator(year) : '0歳'}
                    </button>
                    <div className="mobile-drop-wrap">
                        <MobileSelectBox id={'userAge'} data={mobile.api && mobile.api.userAgeList} value={mobile.userAge} onChange={handleUpdateMobileBody} />
                    </div>
                </div>
            </div>
        </>
    );
};
export default ResumeMobile2;
