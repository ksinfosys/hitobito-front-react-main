
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
// Axios
import axios from "axios";

import BigLogo from "@/assets/images/big-logo.svg";
import Blank from "@/assets/images/blank-img.png";
import Blank2 from "@/assets/images/blank2.png";
import LineIcon from "@/assets/images/line-icon.svg";
import GoogleIcon from "@/assets/images/google-icon.svg";
import KakaoIcon from "@/assets/images/kakao-icon.svg";

const FindId = () => {

    // 입력한 이메일값
    const [email, setEmail] = useState();

    // email 성공시 팝업
    const [findId, setfindId] = useState(false);
    // email 실패시 팝업(이메일 형식 체크)
    const [emailError1, setEmailError1] = useState(false);
    // email 실패시 팝업(401)
    const [emailError2, setEmailError2] = useState(false);

    // Id 찾기 API
    const searchId = () => {
        // 이메일 형식 체크
        const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

        !regExp.test(email) ? setEmailError1(true) :
            axios.post("/api" + "/company/forget/id", {
                cpEmail: email
            }, {
                withCredentials: true
            }).then(response => {
                const code = response.data.resultCode;
                code === "200" ? (() => {
                    setfindId(true);
                })() : ((response) => {
                    if (code === "902") {
                        alert('ネットワーク障害が発生いました。')
                    } else if (code === "401") {
                        setEmailError2(true);
                    } else if (code === "102") {
                        alert('処理中に問題が発生しました。')
                    }
                })()
            });
    };

    return (
        <>
            <div className="find-wrap flex flex-col items-center">
                <img src={BigLogo} alt="" className="big-logo" />
                <div className="find-tit">
                    ＩD　探し
                </div>
                <div className="find-subtit">
                    会員登録をする時、登録したID及びメールアドレスを入力してください。
                </div>
                <div className="find-email">
                    <input id="regular-form-1" type="text" className="h-48 form-control" placeholder="メールアドレスを入力" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="find-btn">
                    <button className="btn btn-pending h-48" onClick={() => { searchId() }}>
                        ＩD　探し
                    </button>
                </div>
            </div>

            {/* 이메일을 확인해 주세요..*/}
            <Modal
                show={findId}
                onHidden={() => {
                    setfindId(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">メールを確認してください。</div>
                    <div className="modal-subtit">
                        入力したメールアドレスに登録のID情報を送りました。 <br />メールを確認してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-pending"
                            onClick={() => {
                                setfindId(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>

            {/* 이메일 형식으로 입력해주세요. */}
            <Modal
                show={emailError1}
                onHidden={() => {
                    setEmailError1(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">メールアドレスの形式で入力してください。</div>
                    <div className="modal-subtit">
                        メールアドレスの形式で入力してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-pending"
                            onClick={() => {
                                setEmailError1(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>

            {/* 해당 정보를 찾을수 없습니다. */}
            <Modal
                show={emailError2}
                onHidden={() => {
                    setEmailError2(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">該当情報が見つかりません。</div>
                    <div className="modal-subtit">
                        該当情報が見つかりません。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-pending"
                            onClick={() => {
                                setEmailError2(false);
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

export default FindId;
