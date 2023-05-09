import {
    TomSelect,
    Modal, ModalBody, ModalFooter
} from "@/base-components";
import { useState } from 'react';
import ResumeMobile10 from "../../components/resume-mobile/resume-mobile-10";
import MobileBottom from "../../components/mobileBottom/mobile-bottom";
import MobileBottom2 from "../../components/mobileBottom/mobile-bottom2";

import CameraPhoto from "@/assets/images/camera.png";
import AddBtn from "@/assets/images/add-btn.svg";
import MinusBtn from "@/assets/images/minus-icon.svg";
import Search from "@/assets/images/search.svg";
import blueX from "@/assets/images/blue-x.svg";
import attachIcon from "@/assets/images/attach-icon.svg";
import blacksmallX from "@/assets/images/black-small-x.svg";
import Download from "@/assets/images/download-icon.svg";
import SelectArrow from "@/assets/images/select-arrow.svg";
import checkIcon from "@/assets/images/check-icon.svg";


const ResumeRegistMo10 = () => {
    const [selectPop, setselectPop]= useState(false);


    return (
        <>
            <div className="resume-mng">
                <div className="mo-resume-mng">
                    <ResumeMobile10  progress="progress-bar  w-1/5 bg-green"/>
                </div>
            </div>
            <MobileBottom2 />
        </>
    );
};
export default ResumeRegistMo10;
