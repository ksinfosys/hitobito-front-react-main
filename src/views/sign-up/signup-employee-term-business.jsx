
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
import { useNavigate } from "react-router-dom";

import BigLogo from "@/assets/images/big-logo.svg";
import Blank from "@/assets/images/blank-img.png";
import Blank2 from "@/assets/images/blank2.png";
import LineIcon from "@/assets/images/line-icon.svg";
import GoogleIcon from "@/assets/images/google-icon.svg";
import KakaoIcon from "@/assets/images/kakao-icon.svg";


const SignupEmployeeTerm = () => {

    const navigate = useNavigate();

    const [signupModal, setsignupModal] = useState(false);

    // Modal State
    const [modalState01, setModalState01] = useState(false);
    const [modalState02, setModalState02] = useState(false);

    // 체크버튼 State
    const [agreeState01, setAgreeState01] = useState(false);
    const [agreeState02, setAgreeState02] = useState(false);

    // 약관 동의후 회원가입 페이지 진입
    const agreeSubmit = () => {
        !agreeState01 ? setModalState01(true) :
            !agreeState02 ? setModalState02(true) : navigate('/signup-business');
    };

    return (
        <>
            <div className="find-wrap flex flex-col items-center">
                <div className="term-tit">
                    企業 会員加入
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
                    <input id="vertical-form-3" className="form-check-input" type="checkbox" checked={agreeState01} onChange={() => setAgreeState01(!agreeState01)} />
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
                    <input id="vertical-form-4" className="form-check-input" type="checkbox" checked={agreeState02} onChange={() => setAgreeState02(!agreeState02)} />
                    <label className="form-check-label" htmlFor="vertical-form-4">上記のプライバシーポリシーに同意します。</label>
                </div>
                <div className="find-btn flex flex-col gap-2">
                    <button className="btn btn-primary h-48" onClick={agreeSubmit}>
                        登録
                    </button>
                    <button className="btn btn-outline-primary h-48" onClick={() => navigate("/")}>
                        取消
                    </button>
                </div>
            </div>

            {/* 약관동의 팝업*/}
            <Modal
                show={modalState01}
                onHidden={() => {
                    setModalState01(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">利用規約</div>
                    <div className="modal-subtit">
                        利用規約を確認してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setModalState01(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                show={modalState02}
                onHidden={() => {
                    setModalState02(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">プライバシーポリシー</div>
                    <div className="modal-subtit">
                        プライバシーポリシーを確認してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setModalState02(false);
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
