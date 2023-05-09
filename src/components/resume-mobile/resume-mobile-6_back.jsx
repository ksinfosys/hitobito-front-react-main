
import Dropdown from 'react-bootstrap/Dropdown';

import Download from "@/assets/images/download-icon-sky.svg";
import SelectArrow from "@/assets/images/select-arrow.svg";
import checkIcon from "@/assets/images/check-icon.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";

const ResumeMobile6 = (props) => {


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
                    メールアドレスと電話番号を入力し、公開したい <br />
                    項目のボタンを設定してください。
                </div>
                <div className="mo-resume-subtit">
                    少なくとも1つは公開でボタンを設定してください。あなたが面談依頼を承諾した企業だけに公開されます。
                </div>
                <div className="mobile-drop-wrap">
                    <div className="flex items-center gap-2">
                        <input id="regular-form-1" type="text" className="form-control" placeholder="メールアドレス入力" />
                        <div className="toggle-wrap">
                            <div className="form-check form-switch flex flex-col items-end">
                                <label className="form-check-label" htmlFor="checkbox-events">
                                    公開
                                </label>
                                <input
                                    className="show-code form-check-input ml-auto"
                                    type="checkbox"
                                    id="checkbox-events"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="regular-form-1" type="text" className="form-control" placeholder="'-なしで数字だけ入力してください。" />
                        <div className="toggle-wrap">
                            <div className="form-check form-switch flex flex-col items-end">
                                <label className="form-check-label" htmlFor="checkbox-events">
                                    非公開
                                </label>
                                <input
                                    className="show-code form-check-input ml-auto"
                                    type="checkbox"
                                    id="checkbox-events"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ResumeMobile6;
