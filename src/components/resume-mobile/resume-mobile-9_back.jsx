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
import Search from "@/assets/images/search.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";


const ResumeMobile9 = (props) => {

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
                    <div className="mo-resume-tit">
                        自分が経験したスキルを検索し、追加してください。
                    </div>
                </div>

                <div className="mobile-drop-wrap long-height">
                    <Dropdown>
                        <Dropdown.Toggle id="dropdown-button-dark-example1" className="dropdown-basic-button flex items-center space-between">
                            全体
                            <img src={SelectArrow} alt="" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu variant="dark" className="dropdown-basic-menu drop-type5">
                            <Dropdown.Item href="#/action-1" active>
                                全体
                                <img src={checkIcon} alt="" />
                            </Dropdown.Item>
                            <Dropdown.Item href="#/action-2">option1</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">option2</Dropdown.Item>
                            <Dropdown.Item href="#/action-4">option3</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className="lang-search-box">
                        <div className="relative text-slate-500">
                            <input
                                type="text"
                                className="form-control pr-10"
                                placeholder="JAVA Script"
                            />
                            <button className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0">
                                <img src={Search} alt="" />
                            </button>
                        </div>
                        <div className="search-table">
                            <div className="search-table-item">
                                <div className="search-table-tit">言語</div>
                                <div className="search-table-cont">JAVA</div>
                            </div>
                            <div className="search-table-item select">
                                <div className="search-table-tit">Framework</div>
                                <div className="search-table-cont">JAVA Script</div>
                            </div>
                            <div className="search-table-item">
                                <div className="search-table-tit">言語</div>
                                <div className="search-table-cont">JAVA</div>
                            </div>
                            <div className="search-table-item">
                                <div className="search-table-tit">言語</div>
                                <div className="search-table-cont">JAVA</div>
                            </div>
                            <div className="search-table-item">
                                <div className="search-table-tit">言語</div>
                                <div className="search-table-cont">JAVA</div>
                            </div>
                        </div>
                    </div>
                    <div className="period-wrap flex items-center gap-2 w-full">
                        <Dropdown className="w-full">
                            <Dropdown.Toggle id="dropdown-button-dark-example1" className="dropdown-basic-button flex items-center space-between">
                                経歴期間
                                <img src={SelectArrow} alt="" />
                            </Dropdown.Toggle>

                            <Dropdown.Menu variant="dark" className="dropdown-basic-menu drop-type5">
                                <Dropdown.Item href="#/action-1" active>
                                    経歴期間
                                    <img src={checkIcon} alt="" />
                                </Dropdown.Item>
                                <Dropdown.Item href="#/action-2">option1</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">option2</Dropdown.Item>
                                <Dropdown.Item href="#/action-4">option3</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <button className="btn btn-skyblue2 w-24 h-full">登録</button>
                    </div>
                    <div className="skill-list-wrap">
                        <div className="skill-list-tit">
                            登録されたスキルリスト
                        </div>
                        <div className="skill-list-cont">
                            <div className="blue-btn-wrap flex gap-2 items-center">
                                <div className="blue-btn">
                                    <span>Framework</span>
                                    <span>JAVA</span>
                                    <span>3年以上</span>
                                    <button className="blue-x-btn">
                                        <img src={blueX} alt="" />
                                    </button>
                                </div>
                                <div className="blue-btn">
                                    <span>언어</span>
                                    <span>JAVA Script</span>
                                    <span>3年以上</span>
                                    <button className="blue-x-btn">
                                        <img src={blueX} alt="" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ResumeMobile9;
