import { useState } from 'react';
import {
    Modal, ModalBody, ModalFooter
} from "@/base-components";
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import Download from "@/assets/images/download-icon-sky.svg";
import SelectArrow from "@/assets/images/select-arrow.svg";
import checkIcon from "@/assets/images/check-icon.svg";
import AddBtn from "@/assets/images/add-btn.svg";
import AttachedX from "@/assets/images/attached-x.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";


const ResumeMobile10 = (props) => {

    const [selectPop, setselectPop] = useState(false);

    return (
        <>
            <div className="mobile-resume-wrap">
                <div className="flex items-center gap-3 space-between">
                    <MobileProgress />
                    <button className="btn btn-sm btn-skyblue w-36 flex gap-1 items-center">
                        <img src={Download} alt="" />
                        一時保存
                    </button>
                </div>
                <div className="">
                    <div className="mo-resume-tit flex space-between items-center">
                        履歴書に添付したいファイルがあれば <br />
                        添付してください。
                        <button className="add-career-btn flex items-center">
                            <img src={AddBtn} alt="" />
                            ファイル追加
                        </button>
                    </div>
                </div>

                <div className="mobile-drop-wrap">
                    <div className="attached-file-wrap">
                        <div className="attached-file-item flex space-between items-center">
                            <div className="attached-tit">ファイル名</div>
                            <div className="attached-cont">
                                <button><img src={AttachedX} alt="" /></button>
                            </div>
                        </div>
                        <div className="attached-file-item flex space-between items-center">
                            <div className="attached-tit">ファイル名</div>
                            <div className="attached-cont">
                                <button><img src={AttachedX} alt="" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ResumeMobile10;
