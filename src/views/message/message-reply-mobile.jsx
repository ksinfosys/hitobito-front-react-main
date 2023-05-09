import {ClassicEditor,} from "@/base-components";
import axios from "axios";
import {useEffect, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";

function MessageReplyM() {
    const [editorData, setEditorData] = useState();
    const [msgInfo, setMsgInfo] = useState({});
    const [msgTit, setMsgTit] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const sendBtnOnClick = () => {
        axios.post("/api/msg/reply", {
            receiveUserId: msgInfo.receiveUserId,
            msgTitle: msgTit,
            msgContents: editorData,
            msgIdx: msgInfo.msgIdx
            }, {
                withCredentials: true,
                headers: {
                    accessToken: getCookie("accessToken"),
                    lastLoginTime: getCookie("lastLoginTime"),
                }
            }).then(response => {
                const code = response.data.resultCode;
                code === '200' ? (() => {
                    alert("답장 전송이 완료되었습니다.")
                    navigate(-1);
                })() : console.log("fetching error:::", response);
            })
    }

    useEffect(() => {
        console.log("reply location.state:::", location.state)
        setMsgInfo(location.state);
    }, [])
    
return (
<>
    <div className="message-reception overflow-hidden lg:hidden">
        <div className="box-type-default p-5">
            <h2 className="mr-auto pb-3 border-b w-full">
                <span className="text-slate-400 text-sm inline-block w-16">受信者</span>
                <span className="text-primary text-sm">{msgInfo.nickname}</span>
            </h2>
            <div id="reply-title" className="text-base mr-auto pt-3 pb-3 border-b w-full">
                <input className=" "type="text" placeholder="제목" onChange={(e) => {setMsgTit(e.target.value)}} />
            </div>
            <div className="into-y list-top items-center pt-5">
                <ClassicEditor
                    value={editorData}
                    onChange={setEditorData}
                />
                <div className="flex gap-2 flex-center pt-10">
                    <button type="button" className="btn btn-outline-primary w-full md:w-24">内容保存</button>
                    <button
                        type="button"
                        className="btn btn-primary w-full md:w-24"
                        onClick={sendBtnOnClick}
                    >送信</button>
                </div>
            </div>
        </div>
    </div>
</>
);
}

export default MessageReplyM;