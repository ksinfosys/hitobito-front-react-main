import { useState } from 'react';
import {
    Modal, ModalBody, ModalFooter
} from "@/base-components";
import Dropdown from 'react-bootstrap/Dropdown';
import Download from "@/assets/images/download-icon-sky.svg";
import SelectArrow from "@/assets/images/select-arrow.svg";
import checkIcon from "@/assets/images/check-icon.svg";
import AddBtn from "@/assets/images/add-btn.svg";
import InchargeAdd from "@/assets/images/incharge-add.svg";
import blueX from "@/assets/images/blue-x.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";


const ResumeMobile7 = (props) => {

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

                <div className="mobile-drop-wrap">
                    <div className="flex items-center gap-2">
                        <div className="drop-left-tit">
                            プロジェクト名
                        </div>
                        <div className="drop-right-cont">
                            <Dropdown>
                                <Dropdown.Toggle id="dropdown-button-dark-example1" className="dropdown-basic-button flex items-center space-between">
                                    プロジェクト名入力
                                    <img src={SelectArrow} alt="" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu variant="dark" className="dropdown-basic-menu mo-dropdown-menu">
                                    <Dropdown.Item href="#/action-1" active>
                                        プロジェクト名入力
                                        <img src={checkIcon} alt="" />
                                    </Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">option1</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">option2</Dropdown.Item>
                                    <Dropdown.Item href="#/action-4">option3</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="drop-left-tit">
                            期間
                        </div>
                        <div className="drop-right-cont">
                            <Dropdown>
                                <Dropdown.Toggle id="dropdown-button-dark-example1" className="dropdown-basic-button flex items-center space-between">
                                    期間
                                    <img src={SelectArrow} alt="" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu variant="dark" className="dropdown-basic-menu mo-dropdown-menu">
                                    <Dropdown.Item href="#/action-1" active>
                                        期間
                                        <img src={checkIcon} alt="" />
                                    </Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">option1</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">option2</Dropdown.Item>
                                    <Dropdown.Item href="#/action-4">option3</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="drop-left-tit">
                            役割
                        </div>
                        <div className="drop-right-cont flex items-center gap-2">
                            <Dropdown>
                                <Dropdown.Toggle id="dropdown-button-dark-example1" className="dropdown-basic-button flex items-center space-between">
                                    役割
                                    <img src={SelectArrow} alt="" />
                                </Dropdown.Toggle>

                                <Dropdown.Menu variant="dark" className="dropdown-basic-menu mo-dropdown-menu">
                                    <Dropdown.Item href="#/action-1" active>
                                        役割
                                        <img src={checkIcon} alt="" />
                                    </Dropdown.Item>
                                    <Dropdown.Item href="#/action-2">option1</Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">option2</Dropdown.Item>
                                    <Dropdown.Item href="#/action-4">option3</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <button className="btn btn-rounded btn-outline-primary btn-role-select">복수 선택</button>
                        </div>
                    </div>
                    <div className="incharge-select">
                        <div className="incharge-tit flex items-center gap-2" >担当工程 <button onClick={() => { setselectPop(true); }} ><img src={InchargeAdd} alt="" /></button></div>
                        <div className="blue-btn-wrap flex items-center">
                            <div className="blue-btn no-after items-center flex">
                                <span>要件分析</span>
                                <button className="blue-x-btn">
                                    <img src={blueX} alt="" />
                                </button>
                            </div>
                            <div className="blue-btn no-after">
                                <span>見積作成</span>
                                <button className="blue-x-btn">
                                    <img src={blueX} alt="" />
                                </button>
                            </div>
                            <div className="blue-btn no-after">
                                <span>基本設計</span>
                                <button className="blue-x-btn">
                                    <img src={blueX} alt="" />
                                </button>
                            </div>
                            <div className="blue-btn no-after">
                                <span>詳細設計</span>
                                <button className="blue-x-btn">
                                    <img src={blueX} alt="" />
                                </button>
                            </div>
                            <div className="blue-btn no-after">
                                <span>製造</span>
                                <button className="blue-x-btn">
                                    <img src={blueX} alt="" />
                                </button>
                            </div>
                            <div className="blue-btn no-after">
                                <span>単位テスト</span>
                                <button className="blue-x-btn">
                                    <img src={blueX} alt="" />
                                </button>
                            </div>
                            <div className="blue-btn no-after">
                                <span>統合テスト</span>
                                <button className="blue-x-btn">
                                    <img src={blueX} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 担当工程選択 */}
            <Modal
                show={selectPop}
                onHidden={() => {
                    setselectPop(true);
                }}
                className="select-modal mo-select-modal"
            >
                <ModalBody className="p-10 text-center">
                    <div className="select-modal-pop">
                        <div className="select-modal-tit">
                            担当工程選択
                        </div>
                        <div className="select-input-wrap">
                            <div className="form-check">
                                <input id="vertical-form-3" className="form-check-input" type="checkbox" value="" />
                                <label className="form-check-label" htmlFor="vertical-form-3">要件分析</label>
                            </div>
                            <div className="form-check">
                                <input id="vertical-form-3" className="form-check-input" type="checkbox" value="" />
                                <label className="form-check-label" htmlFor="vertical-form-3">見積作成</label>
                            </div>
                            <div className="form-check">
                                <input id="vertical-form-3" className="form-check-input" type="checkbox" value="" />
                                <label className="form-check-label" htmlFor="vertical-form-3">基本設計</label>
                            </div>
                            <div className="form-check">
                                <input id="vertical-form-3" className="form-check-input" type="checkbox" value="" />
                                <label className="form-check-label" htmlFor="vertical-form-3">詳細設計</label>
                            </div>
                            <div className="form-check">
                                <input id="vertical-form-3" className="form-check-input" type="checkbox" value="" />
                                <label className="form-check-label" htmlFor="vertical-form-3">단체테스트</label>
                            </div>
                            <div className="form-check">
                                <input id="vertical-form-3" className="form-check-input" type="checkbox" value="" />
                                <label className="form-check-label" htmlFor="vertical-form-3">통합테스트</label>
                            </div>
                        </div>

                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="mo-sel-btn-wrap flex space-between">
                        <button className="btn btn-primary" onClick={() => { setselectPop(true); }}>
                            確認
                        </button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
};
export default ResumeMobile7;
