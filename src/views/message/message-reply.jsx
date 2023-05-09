import {ClassicEditor,} from "@/base-components";
import {useState} from "react";

// 메세지함 답장 모바일
import MessageReplyM from './message-reply-mobile';

function MessageReply() {
    const [editorData, setEditorData] = useState();
return (
<>
    <div className="message-reception overflow-hidden hidden lg:block">
        <div className="box-type-default p-5">
            <h2 className="mr-auto pb-3 border-b w-full">
                <span className="text-slate-400 text-sm inline-block w-16">受信者</span>
                <span className="text-primary text-sm">SONY ENTERTAINMENT</span>
            </h2>
            <div id="reply-title" className="text-base mr-auto pt-3 pb-3 border-b w-full">
                <input className=" "type="text" placeholder="제목"/>
            </div>
            <div className="into-y list-top items-center pt-5">
                <ClassicEditor
                    value={editorData}
                    onChange={setEditorData}
                />
                <div className="flex gap-2 flex-center pt-10">
                    <button type="button" className="btn btn-outline-primary w-full md:w-24">内容保存</button>
                    <button type="button" className="btn btn-primary w-full md:w-24">送信</button>
                </div>
            </div>
        </div>
    </div>
    
    {/* 메세지 답장 모바일 */}
    <MessageReplyM/>
</>
);
}

export default MessageReply;