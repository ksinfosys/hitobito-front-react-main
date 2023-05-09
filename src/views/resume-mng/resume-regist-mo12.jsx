import {
    TomSelect,
    Modal, ModalBody, ModalFooter
} from "@/base-components";
import { useState } from 'react';
import ResumeMobile12 from "../../components/resume-mobile/resume-mobile-12";
import MobileBottom2 from "../../components/mobileBottom/mobile-bottom2";


const ResumeRegistMo12 = () => {
    const [selectPop, setselectPop]= useState(false);


    return (
        <>
            <div className="resume-mng">
                <div className="mo-resume-mng">
                    <ResumeMobile12  progress="progress-bar  w-1/5 bg-green"/>
                </div>
            </div>
            <MobileBottom2 />
        </>
    );
};
export default ResumeRegistMo12;
