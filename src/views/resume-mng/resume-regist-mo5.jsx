import {
    TomSelect,
    Modal, ModalBody, ModalFooter
} from "@/base-components";
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ListGroup from 'react-bootstrap/ListGroup';
import ResumeMobile1 from "../../components/resume-mobile/resume-mobile";
import ResumeMobile2 from "../../components/resume-mobile/resume-mobile-2";
import ResumeMobile3 from "../../components/resume-mobile/resume-mobile-3";
import ResumeMobile4 from "../../components/resume-mobile/resume-mobile-4";
import ResumeMobile5 from "../../components/resume-mobile/resume-mobile-5";
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


const ResumeRegistMo5 = () => {
    const [selectPop, setselectPop]= useState(false);


    return (
        <>
            <div className="resume-mng">
                <div className="mo-resume-mng">
                    <ResumeMobile5  progress="progress-bar  w-1/5 bg-green"/>
                </div>
            </div>
            <MobileBottom2 />
        </>
    );
};
export default ResumeRegistMo5;
