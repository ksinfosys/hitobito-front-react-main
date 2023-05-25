
import {
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Modal, ModalBody,
} from "@/base-components";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
// Axios
import axios from "axios";

import BigLogo from "@/assets/images/big-logo.svg";
import Blank from "@/assets/images/blank-img.png";
import Blank2 from "@/assets/images/blank2.png";
import LineIcon from "@/assets/images/line-icon.svg";
import KakaoIcon from "@/assets/images/kakao-icon.svg";

const FindPwd = () => {

    const navigate = useNavigate();

    // 입력한 아이디값
    const [id, setId] = useState();
    // 입력한 이메일값
    const [email, setEmail] = useState();

    // email 성공시 팝업
    const [findId, setfindId] = useState(false);
    // email 실패시 팝업(이메일 형식 체크)
    const [emailError1, setEmailError1] = useState(false);
    // email 실패시 팝업(401)
    const [emailError2, setEmailError2] = useState(false);
    //입력 오류(id)
    const [inputError, setInputError] = useState(false);


    // Password 찾기 API
    const searchPassword = () => {
        // 이메일 형식 체크
        const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

        !regExp.test(email) ? setEmailError1(true) :
            axios.put("/api" + "/company/forget/password", {
                cpEmail: email,
                cpLoginId: id
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
                    } else if (code === "003") {
                        setInputError(true);
                        //alert('入力情報に問題があります。')
                    } else if (code === "102") {
                        alert('処理中に問題が発生しました。')
                    } else if (code === "102") {
                        alert('メールの送信に失敗しました。 もう一度確認をお願いします。')
                    }
                })()
            });
    };

    return (
        <>
            <div className="find-wrap flex flex-col items-center">
                <img src={BigLogo} alt="" className="big-logo" />
                <div className="find-tit">
                    パスワード探し
                </div>
                <div className="find-subtit">
                    会員登録をする時、登録したID及びメールアドレスを入力してください。
                </div>
                <div className="find-email flex flex-col gap-4">
                    <input id="regular-form-1" type="text" className="h-48 form-control" placeholder="IDを入力してください。" onChange={(e) => setId(e.target.value)} />
                    <input id="regular-form-1" type="text" className="h-48 form-control" placeholder="メールアドレスを入力してください。" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="find-btn">
                    <button className="btn btn-pending h-48" onClick={() => { searchPassword() }}>
                        臨時パスワード発行
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
                        入力したメールアドレスに臨時パスワードを送りました。
                        <br />メールを確認してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-pending"
                            onClick={() => {
                                setfindId(false);
                                navigate('/');
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
                    {/* <div className="modal-subtit">
                        メールアドレスの形式で入力してください。
                    </div> */}
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
                    {/* <div className="modal-subtit">
                        該当情報が見つかりません。
                    </div> */}
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

            {/* 입력 정보 문제*/}
            <Modal
                show={inputError}
                onHidden={() => {
                    setInputError(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">入力情報を確認してください。</div>
                    {/* <div className="modal-subtit">
                        入力した情報に問題があります。
                        <br />メールを確認してください。
                    </div> */}
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-pending"
                            onClick={() => {
                                setInputError(false);
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

export default FindPwd;
