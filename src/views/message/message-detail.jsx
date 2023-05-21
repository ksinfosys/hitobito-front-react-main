import { Modal, ModalBody, } from "@/base-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCookie } from "../../utils/cookie";

const MessageDetail = () => {
    const [messageSaveModal, setMessageSave] = useState(false);
    const [msgInfo, setMsgInfo] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const [receiverId, setReceiverId] = useState("");

    useEffect(() => {
        console.log("location.state:::", location.state)
        axios.put("/api/msg/read", {
            msgIdx: location.state.msgIdx,
        }, {
            withCredentials: true,
            headers: {
                accessToken: getCookie("accessToken"),
                lastLoginTime: getCookie("lastLoginTime"),
            }
        }).then(response => {
            const code = response.data.resultCode;
            const result = response.data.result;
            code === '200' ? (() => {
                console.log("result:::", result)
                location.state.use === "R" ? setReceiverId(result.msgReadInfo.receiveUserId) : setReceiverId(result.msgReadInfo.sendUserId);
                setMsgInfo(result.msgReadInfo);
            })() : console.log("fetching error:::", response);
        })
    }, [])

    const msgSave = () => {
        let msgIdx = [];
        msgIdx.push(location.state.msgIdx);
        axios.put('api/msg/save', {
            msgIdxes: msgIdx
        }, {
            withCredentials: true,
            headers: {
                accessToken: getCookie("accessToken"),
                lastLoginTime: getCookie("lastLoginTime"),
            },
        }).then((response) => {
            const code = response.data.resultCode;
            code === "200" ? (() => {
                navigate(-2);
                alert("메세지를 보관 완료처리 하였습니다.");
            })() : console.log("fetching error:::", response);
        });
    }
    return (
        <>
            <div className="message-reception overflow-hidden">
                <div className="box-type-default p-5">
                    <div className="text-sm mr-auto text-primary pb-3">{msgInfo.nickname}</div>
                    <h2 className="font-bold text-base mr-auto pb-3 border-b w-full">{msgInfo.msgTitle}</h2>
                    <div className="into-y list-top items-center pt-5">
                        <div className="border-b pb-5" dangerouslySetInnerHTML={{ __html: msgInfo.msgContents }}></div>
                        <ul className="flex gap-2 flex-center pt-10">
                            <li className="w-full md:w-24">
                                <Link
                                    to="/message-reply"
                                    state={{
                                        nickname: msgInfo.nickname,
                                        receiveUserId: receiverId,
                                        msgIdx: msgInfo.msgIdx
                                    }}
                                >
                                    <button type="button" className="btn btn-primary w-full">返信</button>
                                </Link>
                            </li>
                            <li className="w-full md:w-24">
                                <button type="button" onClick={() => { setMessageSave(true); }} className="btn btn-outline-primary w-full">보관</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {/* 메시지 보관 */}
            <Modal
                backdrop="static"
                show={messageSaveModal}
                onHidden={() => { setMessageSave(false); }}>
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">メッセージを保管しますか？</div>
                    <div className="modal-subtit">
                        選択されたメッセージを保管します。<br />
                        メッセージは「保管メッセージ」に移動されます。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                msgSave();
                                setMessageSave(false);
                            }}
                        >
                            はい
                        </a>
                        <a
                            href="#"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setMessageSave(!messageSaveModal);
                            }}
                        >
                            いいえ
                        </a>
                    </div>
                    {/* END: Toggle Modal Toggle */}
                </ModalBody>
            </Modal>
        </>
    );
}

export default MessageDetail;