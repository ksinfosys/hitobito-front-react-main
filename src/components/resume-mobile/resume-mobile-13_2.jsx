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
import InchargeAdd from "@/assets/images/incharge-add.svg";
import blueX from "@/assets/images/blue-x.svg";
import setting from "@/assets/images/setting-icon.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";


const ResumeMobile132 = (props) => {

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
                        主要経歴を入力してください。
                        <button className="add-career-btn flex items-center">
                            <img src={AddBtn} alt="" />
                            主要経歴追加
                        </button>
                    </div>
                </div>

                <div className="mobile-drop-wrap long-height">
                    <div className="career-box">
                        <div className="career-box-tit flex space-between items-center">
                        プロジェクト名
                            <div className="setting-wrap">
                                {['bottom'].map((placement) => (
                                    <OverlayTrigger
                                        trigger="click"
                                        key={placement}
                                        placement={placement}
                                        overlay={
                                            <Popover id={`popover-positioned-${placement}`}>
                                                <Popover.Header as="h3"></Popover.Header>
                                                <Popover.Body>
                                                    <div className="setting-select-mo">
                                                        <div className="setting-select-item">修正</div>
                                                        <div className="setting-select-item">削除</div>
                                                    </div>
                                                </Popover.Body>
                                            </Popover>
                                        }
                                    >
                                        <Button><img src={setting} alt="" /></Button>
                                    </OverlayTrigger>
                                ))}
                            </div>
                        </div>
                        <div className="career-box-subtit">
                            ウェブデザイナー<br />
                            2022. 07. 11
                        </div>
                        <div className="career-box-incharge">
                            <div className="career-box-incharge-tit">
                                担当工程
                            </div>
                            <div className="career-box-incharge-cont">
                                <span>要件分析</span>
                                <span>見積作成</span>
                                <span>製造</span>
                                <span>詳細設計</span>
                                <span>基本設計</span>
                            </div>
                        </div>
                    </div>
                    <div className="career-box">
                        <div className="career-box-tit flex space-between items-center">
                            プロジェクト名
                            <div className="setting-wrap">
                                {['bottom'].map((placement) => (
                                    <OverlayTrigger
                                        trigger="click"
                                        key={placement}
                                        placement={placement}
                                        overlay={
                                            <Popover id={`popover-positioned-${placement}`}>
                                                <Popover.Header as="h3"></Popover.Header>
                                                <Popover.Body>
                                                    <div className="setting-select-mo">
                                                        <div className="setting-select-item">修正</div>
                                                        <div className="setting-select-item">削除</div>
                                                    </div>
                                                </Popover.Body>
                                            </Popover>
                                        }
                                    >
                                        <Button><img src={setting} alt="" /></Button>
                                    </OverlayTrigger>
                                ))}
                            </div>
                        </div>
                        <div className="career-box-subtit">
                            ウェブデザイナー<br />
                            2022. 07. 11
                        </div>
                        <div className="career-box-incharge">
                            <div className="career-box-incharge-tit">
                                担当工程
                            </div>
                            <div className="career-box-incharge-cont">
                                <span>要件分析</span>
                                <span>見積作成</span>
                                <span>製造</span>
                                <span>詳細設計</span>
                                <span>基本設計</span>
                            </div>
                        </div>
                    </div>
                    <div className="career-box">
                        <div className="career-box-tit flex space-between items-center">
                            プロジェクト名
                            <div className="setting-wrap">
                                {['bottom'].map((placement) => (
                                    <OverlayTrigger
                                        trigger="click"
                                        key={placement}
                                        placement={placement}
                                        overlay={
                                            <Popover id={`popover-positioned-${placement}`}>
                                                <Popover.Header as="h3"></Popover.Header>
                                                <Popover.Body>
                                                    <div className="setting-select-mo">
                                                        <div className="setting-select-item">修正</div>
                                                        <div className="setting-select-item">削除</div>
                                                    </div>
                                                </Popover.Body>
                                            </Popover>
                                        }
                                    >
                                        <Button><img src={setting} alt="" /></Button>
                                    </OverlayTrigger>
                                ))}
                            </div>
                        </div>
                        <div className="career-box-subtit">
                            ウェブデザイナー<br />
                            2022. 07. 11
                        </div>
                        <div className="career-box-incharge">
                            <div className="career-box-incharge-tit">
                                担当工程
                            </div>
                            <div className="career-box-incharge-cont">
                                <span>要件分析</span>
                                <span>見積作成</span>
                                <span>製造</span>
                                <span>詳細設計</span>
                                <span>基本設計</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ResumeMobile132;
