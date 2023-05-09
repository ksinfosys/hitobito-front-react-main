import { useState } from 'react';
import ResumeMobile10 from "../../components/resume-mobile/resume-mobile-10";
import MobileBottom2 from "../../components/mobileBottom/mobile-bottom2";
import ResumeMobile14 from "../../components/resume-mobile/resume-mobile-14";

const ResumeRegistMo14 = () => {
    const [selectPop, setselectPop]= useState(false);


    return (
        <>
            <div className="resume-mng">
                <div className="mo-resume-mng">
                    <ResumeMobile14  progress="progress-bar  w-1/5 bg-green"/>
                </div>
            </div>
            <MobileBottom2 />
        </>
    );
};
export default ResumeRegistMo14;
