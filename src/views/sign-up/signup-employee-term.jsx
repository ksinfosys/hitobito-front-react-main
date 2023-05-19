
import {
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Modal, ModalBody,
} from "@/base-components";
import { Link } from 'react-router-dom';
import { useState } from "react";

import BigLogo from "@/assets/images/big-logo.svg";
import Blank from "@/assets/images/blank-img.png";
import Blank2 from "@/assets/images/blank2.png";
import LineIcon from "@/assets/images/line-icon.svg";
import GoogleIcon from "@/assets/images/google-icon.svg";
import KakaoIcon from "@/assets/images/kakao-icon.svg";


const SignupEmployeeTerm = () => {
    const [signupModal, setsignupModal] = useState(false);

    // 체크버튼 State
    const [checkState01, setCheckState01] = useState();
    const [checkState02, setCheckState02] = useState();

    return (
        <>
            <div className="find-wrap flex flex-col items-center">
                <div className="term-tit">
                    求職者会員加入
                </div>
                <div className="term-subtit">
                    利用規約
                </div>
                <div className="term-wrap">
                    <div className="term-div">
                        HITOBITO 관리자에서 등록한 내용 출력 <br />
                        내용 <br />
                        내용 <br />
                        내용
                    </div>
                </div>
                <div className="term-check">
                    <input id="vertical-form-3" className="form-check-input" type="checkbox" value="" />
                    <label className="form-check-label" htmlFor="vertical-form-3">上記の利用規約に同意します。</label>
                </div>
                <div className="term-subtit">
                    プライバシーポリシー
                </div>
                <div className="term-wrap">
                    <div className="term-div">
                        HITOBITO 관리자에서 등록한 내용 출력 <br />
                        내용 <br />
                        내용 <br />
                        내용
                    </div>
                </div>
                <div className="term-check">
                    <input id="vertical-form-4" className="form-check-input" type="checkbox" value="" />
                    <label className="form-check-label" htmlFor="vertical-form-4">上記のプライバシーポリシーに同意します。</label>
                </div>
                <div className="find-btn flex flex-col gap-2">
                    <button className="btn btn-primary h-48" onClick={() => { setsignupModal(true); }}>
                        登録
                    </button>
                    <button className="btn btn-outline-primary h-48">
                        取消
                    </button>
                </div>
            </div>
            {/* 회원가입 팝업*/}
            <Modal
                show={signupModal}
                onHidden={() => {
                    setsignupModal(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">HITOBITOにようこそ！</div>
                    <div className="modal-subtit">
                        会員登録が完了しました。 ’確認’ボタンを押すとHITOBITOの <br />
                        利用ガイドが表示されます。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setsignupModal(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>

        </>
    );
};

export default SignupEmployeeTerm;
