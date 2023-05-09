import {
    TomSelect,
    Modal, ModalBody, ModalFooter
} from "@/base-components";
import { useState } from 'react';
import ResumeMobile11 from "../../components/resume-mobile/resume-mobile-11";
import MobileBottom2 from "../../components/mobileBottom/mobile-bottom2";


const ResumeRegistMo11 = () => {
    const [selectPop, setselectPop]= useState(false);


    return (
        <>
            <div className="resume-mng">
                <div className="mo-resume-mng">
                    <ResumeMobile11  progress="progress-bar  w-1/5 bg-green"/>
                </div>
            </div>
            <MobileBottom2 />
        </>
    );
};
export default ResumeRegistMo11;
