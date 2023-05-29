import React, { useState, useEffect } from "react";
import { Lucide, Modal, ModalBody, ModalHeader, ClassicEditor,ModalFooter } from "@/base-components";
import { Link, useNavigate } from 'react-router-dom';
import { throttle } from 'lodash';

import MessageBoxList01 from './message-box-list01';
import Search from "@/assets/images/search.svg";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import Pagination from "../../components/pagination";
import ServiceFetch from "../../../util/ServiceFetch";

// 메세지함 sent 모바일 테이블
import MessageTableSentM from './message-table-sent-mobile';
import { isMobile } from "react-device-detect";
import { getTimeFormatMsg } from "../../utils/utils";
import { useDidMountEffect } from "../../utils/customHooks";

const MessageSent = () => {
    const [disable, setDisable] = React.useState(false);
    const navigate = useNavigate();

    const [msgModal, setMsgModal] = useState(false);
    const [messageSaveModal, setMessageSaveModal] = useState(false);
    const [messageDeleteModal, setMessageDeleteModal] = useState(false);
    const [messageReplyModal, setMessageReplyModal] = useState(false);
    const [messageReplyFail, setMessageReplyFail] = useState(false);
    const [msgSendSuccess, setMsgSendSuccess] = useState(false);
    const [msgSendFail, setMsgSendFail] = useState(false);
    const [msgSaveSuccess01, setMsgSaveSuccess01] = useState(false);
    const [msgdeleteSuccess, setMsgdeleteSuccess] = useState(false);
    const [msgCheckModal, setMsgCheckModal] = useState(false);
    const [messageReplyCheckFail, setMessageReplyCheckFail] = useState(false);

    // 전체 체크박스
    const [allCheckbox, setAllCheckbox] = useState(false);
    const [allCheckboxMob, setAllCheckboxMob] = useState(false);
    const handleAllCheck = () => {
        setAllCheckbox(!allCheckbox)
    };
    // 메세지 데이터
    const [messageList, setMessageList] = useState([]);
    // 페이지 네비게이션
    const [pgnInfo, setPgnInfo] = useState({});
    const [currentPageIdx, setCurrentPageIdx] = useState(1);
    // 체크된 메세지 데이터
    const [receptionState, setReceptionState] = useState({});
    // 메세지 검색
    const [msgState, setMsgState] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [searchCategory, setSearchCategory] = useState("20601");
    // 메세지 삭제
    const [msgIdxes, setMsgIdxes] = useState([]);
    // 메세지 보내기
    const [msgSendTitle, setMsgSendTitle] = useState("");
    const [editorData, setEditorData] = useState();
    // 메세지 전송 상태
    const [isSending, setIsSending] = useState(false);
    // 메세지 임시 저장
    const [msgSaveSuccess, setSaveMsgSuccess] = useState(false);
    const [msgSaveFail01, setSaveMsgFail01] = useState(false);
    const [msgSaveModal, setMsgSaveModal] = useState(false);
    // 실패시 공통 모달
    const [modalFail, setModalFail] = useState(false);
    // 메세지 제목 글자수 제한 모달
    const [msgSubjectFail, setMsgSubjectFail] = useState(false);
    const [msgContentsFail, setMsgContentsFail] = useState(false);
    // 답장 글자 수 초과시 모달 출력
    useEffect(() => {
        msgSendTitle.length >= 201 && setMsgSubjectFail(true);
        editorData && editorData.replace(/<[^>]*>|&nbsp;/g, '').trim().length >= 3001 && setMsgContentsFail(true);
    }, [msgSendTitle, editorData])

    // S : 모바일용 상수
    const [messageListMob, setMessageListMob] = useState([]);
    const [lastMsgFlag, setLastMsgFlag] = useState(false);
    const [currentPageMob, setCurrentPageMob] = useState(null);
    const [curPageMob, setCurPageMob] = useState(null);

    const handleScroll = throttle(() => {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
            (isMobile && !lastMsgFlag) ? msgState ? getMsgSearchMob() : getListMob() : void 0;
        }
    }, 300);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);
    // E : 모바일용 상수

    // 발신 메세지함 가져오기
    const getList = () => {
        ServiceFetch("/msg/sendbox", "post", {
            curPage: currentPageIdx
        }).then((res) => {
            res.resultCode === '200' ? (
                setMessageList(res.result.msgList),
                setPgnInfo(res.result.pageItem)
            ) : res.resultCode === '301' ? (
                setModalFail(true)
            ) : (
                setModalFail(true)
            )
        }).catch((e) => {
            console.log(e);
        });
    };

    // 발신 메세지함 가져오기 모바일
    const getListMob = () => {
        let listParm = currentPageMob === null ? {} : { page: currentPageMob }
        axios.post("/api/app/msg/sendbox", listParm
            , {
                withCredentials: true,
                headers: {
                    accessToken: getCookie("accessToken"),
                    lastLoginTime: getCookie("lastLoginTime"),
                }
            }).then(response => {
                const code = response.data.resultCode;
                const result = response.data.result;
                code === '200' ? (() => {
                    let tempMsgListMob = [...messageListMob, ...result.msgList];
                    setMessageListMob(tempMsgListMob);
                    setLastMsgFlag(result.lastMsgFlag);
                    setCurrentPageMob(result.page)
                })() : console.log("fetching error:::", response);
            })
    };

    // 메세지 검색
    const getMsgSearch = () => {
        ServiceFetch("/msg/sendbox/search", "post", {
            keyword: searchValue,
            curPage: currentPageIdx,
            searchCondition: searchCategory
        }).then((res) => {
            res.resultCode === '200' ? (
                res.result === null ? setMessageList([]) : setMessageList(res.result.msgList),
                res.result === null ? setPgnInfo({}) : setPgnInfo(res.result.pageItem),
                setMsgState(true)
            ) : res.resultCode === '301' ? (
                setModalFail(true)
            ) : (
                setModalFail(true)
            )
        }).catch((e) => {
            console.log(e);
        });
    };

    // 메세지 검색 모바일
    const getMsgSearchMob = () => {
        let parmConfig = {
            keyword: searchValue,
            searchCondition: searchCategory,
        };
        let listParm = curPageMob === null ? parmConfig : {
            ...parmConfig, page: curPageMob
        }
        axios.post("/api/app/msg/sendbox/search", listParm, {
            withCredentials: true,
            headers: {
                accessToken: getCookie("accessToken"),
                lastLoginTime: getCookie("lastLoginTime"),
            }
        }).then(response => {
            const code = response.data.resultCode;
            const result = response.data.result;
            if (code === '200') {
                let orgMsgList = msgState ? messageListMob : [];
                let tempMsgListMob = [...orgMsgList, ...result.msgList];
                if (result === null) {
                    setMessageListMob([])
                    setLastMsgFlag({})
                    setCurPageMob(null)
                } else {
                    setMessageListMob(tempMsgListMob)
                    setLastMsgFlag(result.lastMsgFlag)
                    setCurPageMob(result.page)
                    setMsgState(true);
                    if (result.lastMsgFlag === true) {
                        setCurPageMob(null)
                        setMsgState(false);
                    }
                }
            } else if (code === '005') {
                setMessageListMob([])
            }
        })
    };

    // 메세지 삭제
    const handleMsgDelete = () => {
        ServiceFetch("/msg/delete", "put", {
            msgIdxes: msgIdxes,
        }).then((res) => {
            res.resultCode === '200' ? (
                setMessageDeleteModal(false),
                setMessageList(res.result.msgList),
                setMessageListMob(res.result.msgList),
                setPgnInfo(res.result.pageItem),
                setMsgIdxes([]),
                setMsgdeleteSuccess(true),
                setAllCheckbox(false),
                setAllCheckboxMob(false)
            ) : res.resultCode === '301' ? (
                setModalFail(true)
            ) : (
                setModalFail(true)
            )
        }).catch((e) => {
            console.log(e);
        });
    };

    // 메세지 저장하기
    const msgSave = () => {
        setMsgModal(false);
        ServiceFetch("/msg/save", "put", {
            msgIdxes: msgIdxes,
        }).then((res) => {
            res.resultCode === '200' ? (
                setMessageSaveModal(false),
                setMessageList(res.result.msgList),
                setMessageListMob(res.result.msgList),
                setPgnInfo(res.result.pageItem),
                setMsgIdxes([]),
                setMsgSaveSuccess01(true),
                setAllCheckbox(false),
                setAllCheckboxMob(false)
            ) : res.resultCode === '301' ? (
                setModalFail(true)
            ) : (
                setModalFail(true)
            )
        }).catch((e) => {
            console.log(e);
        });
    };

    // 메세지 보내기
    const [msgData, setMsgData] = useState([]);
    const msgSend = () => {
        if (msgSendTitle.length >= 201) {
            setMsgSubjectFail(true)
        } else if (editorData && editorData.replace(/<[^>]*>|&nbsp;/g, '').trim().length >= 3001) {
            setMsgContentsFail(true)
        } else {
            if (isSending) return; // 전송 중인 경우 중복 전송 방지
            setIsSending(true); // 전송 시작
            setMsgModal(false);
            ServiceFetch("/msg/reply", "post", {
                receiveUserId: receptionState.receiveUserId ? receptionState.receiveUserId : msgData[0].receiveUserId,
                msgTitle: msgSendTitle,
                msgContents: editorData,
                msgIdx: receptionState.msgIdx ? receptionState.msgIdx : msgIdxes[0]
            }).then((res) => {
                res.resultCode === '200' ? (
                    setMessageReplyModal(false),
                    setMsgSendSuccess(true),
                    setEditorData(""),
                    setMsgSendTitle(""),
                    !isMobile ? (msgState ? getMsgSearch() : getList()) : (msgState ? getMsgSearchMob() : getListMob())
                ) : res.resultCode === '301' ? (
                    setModalFail(true)
                ) : res.resultCode === '302' ? (
                    setMsgSendFail(true)
                ) : (
                    setModalFail(true)
                )
            }).catch((e) => {
                console.log(e);
            }).finally(() => {
                setIsSending(false); // 전송 완료
            });
        }
    };

    // 메세지 검색 이벤트
    const handleSearch = () => {
        !isMobile ?
            (currentPageIdx === 1 ? getMsgSearch() : (() => {
                setCurrentPageIdx(1),
                    setMsgState(true)
            })()) : getMsgSearchMob();
    };

    // メッセージの内容保存
    const msgSaveSubmit = () => {
        ServiceFetch("/msg/tmpsave", "post", {
            msgContents: editorData,
            msgTitle: msgSendTitle
        }).then((res) => {
            res.resultCode === '200' ? (
                setSaveMsgSuccess(true)
            ) : res.resultCode === '302' ? (
                setSaveMsgFail01(true)
            ) : (
                setModalFail(true)
            )
        }).catch((e) => {
            console.log(e);
        });
    };
    // メッセージの内容保存 불러오기
    const msgSaveGet = () => {
        axios.get('/api/msg/tmpload', {
            headers: {
                accessToken: getCookie("accessToken"),
                lastLoginTime: getCookie("lastLoginTime"),
            },
            withCredentials: true,
        }).then((response) => {
            response.data.resultCode === '200' ? (
                setMsgSaveModal(true),
                setEditorData(response.data.result.templateContents ? response.data.result.templateContents : ""),
                setMsgSendTitle(response.data.result.templateTitle ? response.data.result.templateTitle : "")
            ) : (
                setModalFail(true)
            )
        }).catch((error) => {
            console.error(error);
        });
    };

    // 초기 방 진입시 list 데이터 가져오기
    useEffect(() => {
        !isMobile ? (msgState ? getMsgSearch() : getList()) : (msgState ? getMsgSearchMob() : getListMob());
        setAllCheckbox(false);
    }, [currentPageIdx]);

    useDidMountEffect(() => {
        msgIdxes.length === messageListMob.length ? setAllCheckboxMob(true) : setAllCheckboxMob(false)
    }, [msgIdxes])

    return (
        <>
            <div className="message-sent">
                <div className="box-type-default">
                    <div className="p-5 border-b border-slate-200/60 text-lg font-bold lg:text-sm lg:font-normal">
                        メッセージ箱
                    </div>
                    <div className="into-y grid grid-cols-12 gap-6 list-top items-center lg:p-5">
                        <ul className="col-span-12 flex border-b-2 w/3">
                            <li>
                                <button type="button" className="p-2 tab-btn w-full">
                                    <Link to="/message-reception">受信メッセージ</Link>
                                </button>
                            </li>
                            <li>
                                <button type="button" className="p-2 tab-btn tab-active w-full">
                                    <Link to="/message-sent">送信メッセージ</Link>
                                </button>
                            </li>
                            <li>
                                <button type="button" className="p-2 tab-btn w-full">
                                    <Link to="/message-box">保管メッセージ</Link>
                                </button>
                            </li>
                        </ul>

                        <div className="col-span-12 relative">
                            {
                                (messageList == null) || (messageList?.length == 0)
                                ?
                                <div className="flex flex-col items-end lg:flex-row itmes-center space-between">
                                    <div className="flex items-center gap-2 w-full lg:w-auto">
                                        <select
                                            className="form-select w-32 lg:w-36 shrink-0"
                                            onChange={(e) => {
                                                setCurPageMob(null);
                                                setSearchCategory(e.target.value)
                                            }}
                                        >
                                            <option value="20601">受信者</option>
                                            <option value="20602">タイトル/内容</option>
                                        </select>
                                        <div className="search search-message block w-full">
                                            <input
                                                type="text"
                                                className="form-input form-control cu-search"
                                                placeholder="検索ワードを入力してください。"
                                                onChange={(e) => {
                                                    setMsgState(false);
                                                    setCurPageMob(null);
                                                    setSearchValue(e.target.value);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.code === "Enter") {
                                                        if(searchValue){
                                                            handleSearch();
                                                        }
                                                    }
                                                    return;
                                                }}
                                            />
                                            <button
                                                className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                                onClick={handleSearch}
                                                disabled={!searchValue}
                                            >
                                                <img src={Search} alt="" />
                                            </button>
                                        </div>
                                    </div>
                                    <ul className="flex gap-2 mt-5 lg:mt-0">
                                        <li>
                                            <input
                                                className="all-check form-check-input btn absolute left-0 block lg:hidden"
                                                type="checkbox"
                                                value="all-check"
                                                checked={allCheckboxMob}
                                                onChange={() => { }}
                                                onClick={(e) => {
                                                    e.target.checked ? (() => {
                                                        setAllCheckboxMob(true);
                                                        let allCbxIdx = [];
                                                        messageListMob.map((msg, index) => {
                                                            allCbxIdx.push(msg.msgIdx)
                                                        })
                                                        setMsgIdxes([...[], ...allCbxIdx]);
                                                    })() : (() => {
                                                        setAllCheckboxMob(false);
                                                        setMsgIdxes([]);
                                                    })();
                                                }} />
                                        </li>
                                        <li>
                                            <button
                                                className="btn btn-sm btn-primary sm:w-24 w-16 hidden lg:inline-block"
                                                disabled={true}
                                            >返信</button>
                                        </li>
                                        
                                        <li>
                                            <button
                                                className="btn btn-sm btn-primary sm:w-24 w-16 lg:hidden"
                                                disabled={true}
                                            >
                                                返信
                                            </button>
                                        </li>
                                        <li><button className="btn btn-sm btn-outline-primary sm:w-24 w-16" disabled={true}>保管</button></li>
                                        <li><button className="btn btn-sm btn-outline-secondary sm:w-24 w-16" disabled={true}>削除</button></li>
                                    </ul>
                                </div>
                                :
                                <div className="flex flex-col items-end lg:flex-row itmes-center space-between">
                                    <div className="flex items-center gap-2 w-full lg:w-auto">
                                        <select
                                            className="form-select w-32 lg:w-36 shrink-0"
                                            onChange={(e) => {
                                                setCurPageMob(null);
                                                setSearchCategory(e.target.value)
                                            }}
                                        >
                                            <option value="20601">受信者</option>
                                            <option value="20602">タイトル/内容</option>
                                        </select>
                                        <div className="search search-message block w-full">
                                            <input
                                                type="text"
                                                className="form-input form-control cu-search"
                                                placeholder="検索ワードを入力してください。"
                                                onChange={(e) => {
                                                    setMsgState(false);
                                                    setCurPageMob(null);
                                                    setSearchValue(e.target.value);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.code === "Enter") {
                                                        if(searchValue){
                                                            handleSearch();
                                                        }
                                                    }
                                                    return;
                                                }}
                                            />
                                            <button
                                                className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                                onClick={handleSearch}
                                                disabled={!searchValue}
                                            >
                                                <img src={Search} alt="" />
                                            </button>
                                        </div>
                                    </div>
                                    <ul className="flex gap-2 mt-5 lg:mt-0">
                                        <li>
                                            <input
                                                className="all-check form-check-input btn absolute left-0 block lg:hidden"
                                                type="checkbox"
                                                value="all-check"
                                                checked={allCheckboxMob}
                                                onChange={() => { }}
                                                onClick={(e) => {
                                                    e.target.checked ? (() => {
                                                        setAllCheckboxMob(true);
                                                        let allCbxIdx = [];
                                                        messageListMob.map((msg, index) => {
                                                            allCbxIdx.push(msg.msgIdx)
                                                        })
                                                        setMsgIdxes([...[], ...allCbxIdx]);
                                                    })() : (() => {
                                                        setAllCheckboxMob(false);
                                                        setMsgIdxes([]);
                                                    })();
                                                }} />
                                        </li>
                                        <li>
                                            <button
                                                className="btn btn-sm btn-primary sm:w-24 w-16 hidden lg:inline-block"
                                                onClick={() => {
                                                    msgIdxes.length < 1 ? setMessageReplyCheckFail(true) :
                                                        msgIdxes.length > 1 ? setMessageReplyFail(true) :
                                                            setMessageReplyModal(true);
                                                }}
                                            >返信</button>
                                        </li>
                                        
                                        <li>
                                            <button
                                                className="btn btn-sm btn-primary sm:w-24 w-16 lg:hidden"
                                                onClick={() => {
                                                    msgIdxes.length === 1 ? (() => {
                                                        let fltrdMsgInfo = messageListMob.filter((element) => element.msgIdx == msgIdxes[0])[0];
                                                        navigate("/message-reply", {
                                                            state: {
                                                                nickname: fltrdMsgInfo.nickname,
                                                                receiveUserId: fltrdMsgInfo.receiveUserId,
                                                                msgIdx: msgIdxes[0]
                                                            }
                                                        })
                                                    })() : alert("メッセージの返信は一件ずつ転送できます。")
                                                }}
                                            >
                                                返信
                                            </button>
                                        </li>
                                        <li><button className="btn btn-sm btn-outline-primary sm:w-24 w-16" onClick={() => { msgIdxes.length > 0 ? setMessageSaveModal(true) : setMsgCheckModal(true); }}>保管</button></li>
                                        <li><button className="btn btn-sm btn-outline-secondary sm:w-24 w-16" onClick={() => { msgIdxes.length > 0 ? setMessageDeleteModal(true) : setMsgCheckModal(true); }}>削除</button></li>
                                    </ul>
                                </div>
                            }
                            {/* 테이블 10줄 */}
                            <div className="overflow-x-auto">
                                <table className="table mt-5 pc">
                                    <thead className="table-light text-center">
                                        <tr>
                                            <th className="whitespace-nowrap">
                                                <input
                                                    checked={allCheckbox}
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    onChange={handleAllCheck}
                                                />
                                            </th>
                                            <th className="whitespace-nowrap">受信者</th>
                                            <th className="whitespace-nowrap">タイトル</th>
                                            <th className="whitespace-nowrap">送信時間</th>
                                            <th className="whitespace-nowrap">再返信</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {
                                            messageList?.length > 0 ? (
                                                messageList.map((msg) => {
                                                    return (
                                                        <MessageBoxList01
                                                            key={msg.msgIdx}
                                                            data={msg}
                                                            id={msg.msgIdx}
                                                            nickname={msg.nickname}
                                                            msgTitle={msg.msgTitle}
                                                            msgSendDate={msg.msgSendDate}
                                                            replyCount={msg.replyCount}
                                                            msgIdxes={msgIdxes}
                                                            setMsgIdxes={setMsgIdxes}
                                                            allCheckbox={allCheckbox}
                                                            setReceptionState={setReceptionState}
                                                            setMsgModal={setMsgModal}
                                                            link={true}
                                                            textInfo={true}
                                                            msgData={msgData}
                                                            setMsgData={setMsgData}
                                                        />
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan={5}>表示できるメッセージがありません。</td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>

                                {/* <MessageTableSentM /> */}

                                {/* 모바일 테이블 */}
                                <ul className="table mt-5 mo">
                                    {messageListMob.length > 0 ? messageListMob.map((msg, index) => {
                                        return (
                                            <Link to={{ pathname: "/message-detail" }}
                                                state={{
                                                    msgIdx: msg.msgIdx,
                                                    use: "R"
                                                }}
                                                key={index}>
                                                <li className="border-b py-3">
                                                    <ul className="flex space-between text-slate-400 mb-3">
                                                        <li>
                                                            <input
                                                                className="form-check-input mr-2"
                                                                type="checkbox"
                                                                value=""
                                                                checked={allCheckboxMob || (msgIdxes.indexOf(msg.msgIdx) != -1)}
                                                                onChange={() => { }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    e.target.checked ? (() => {
                                                                        setMsgIdxes([...msgIdxes, msg.msgIdx])
                                                                    })() : (() => {
                                                                        let tempMsgIdxes = [...msgIdxes];
                                                                        let filteredArr = tempMsgIdxes.filter((element) => element !== msg.msgIdx);
                                                                        setMsgIdxes(filteredArr);
                                                                        setAllCheckboxMob(false)
                                                                    })()
                                                                }}
                                                            />
                                                            <span className="text-sm">{msg.nickname}</span>
                                                        </li>
                                                        <li className="float-left text-sm">{getTimeFormatMsg(msg.msgSendDate)}</li>
                                                    </ul>
                                                    <div>{msg.msgTitle}</div>
                                                </li>
                                            </Link>
                                        )
                                    }) : <div className="text-center mt-8">検索結果はありません</div>}
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>
                {!isMobile && messageList?.length > 0 ?
                    <Pagination
                        pgnInfo={pgnInfo}
                        currentPageIdx={currentPageIdx}
                        setCurrentPageIdx={setCurrentPageIdx}
                    /> : <></>}
            </div>

            {/* 메시지 내용 */}
            <Modal
                size="modal-lg"
                backdrop="static"
                show={msgModal}
                onHidden={() => { setMsgModal(false); }}>
                <a onClick={() => { setMsgModal(false); setReceptionState({}) }} className="absolute right-0 top-0 mt-3 mr-3" href="#">
                    <Lucide icon="X" className="w-5 h-5 text-slate-400" />
                </a>
                <ModalHeader className="flex-col p-5">
                    <h2 className="font-bold text-base mr-auto pb-3 border-b w-full">
                        <div className="flex">
                            <span className="text-slate-400 font-normal mr-2 inline-block w-24 shrink-0">
                                タイトル
                            </span>
                            <div className="w-full break-word pr-10">{receptionState.msgTitle}</div>
                        </div>
                    </h2>
                    <div className="font-bold text-base mr-auto pt-3">
                        <span className="text-slate-400 font-normal mr-2 block md:inline-block w-24">送信者</span>
                        {receptionState.nickname}
                    </div>
                </ModalHeader>
                <ModalBody className="p-5">
                    <div id="detail-cont" className="border-b pb-5 message_area">
                        <div dangerouslySetInnerHTML={{ __html: receptionState.msgContents }} />
                    </div>
                    <div id="detail-modal-btn" className="flex gap-2 space-between pt-5">
                        <button
                            type="button"
                            onClick={() => {
                                setMsgIdxes([...msgIdxes, receptionState.msgIdx])
                                setMessageSaveModal(true);
                            }}
                            className="btn btn-sm btn-outline-primary w-24"
                        >
                            保管
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMessageReplyModal(true);
                                setMsgModal(false);
                            }}
                            className="btn btn-sm btn-primary w-24"
                        >
                            返信
                        </button>
                    </div>
                </ModalBody>
            </Modal>

            {/* 메시지 보관 */}
            <Modal
                backdrop="static"
                show={messageSaveModal}
                onHidden={() => { setMessageSaveModal(false); }}>
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
                            onClick={msgSave}
                        >
                            はい
                        </a>
                        <a
                            href="#"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setMessageSaveModal(!messageSaveModal);
                            }}
                        >
                            いいえ
                        </a>
                    </div>
                    {/* END: Toggle Modal Toggle */}
                </ModalBody>
            </Modal>
            {/* 메세지 저장성공 모달 */}
            <Modal
                show={msgSaveSuccess01}
                onHidden={() => {
                    setMsgSaveSuccess01(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">保管成功</div>
                    <div className="modal-subtit">
                        メッセージが保管されました。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setMsgSaveSuccess01(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>

            {/* 메시지 삭제 */}
            <Modal
                show={messageDeleteModal}
                onHidden={() => {
                    setMessageDeleteModal(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">メッセージを削除しますか？</div>
                    <div className="modal-subtit">
                        削除されたメッセージは復元できません。<br />
                        削除前に慎重に考えてください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={handleMsgDelete}
                        >
                            はい
                        </a>
                        <a
                            href="#"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setMessageDeleteModal(!messageDeleteModal);
                            }}
                        >
                            いいえ
                        </a>
                    </div>
                    {/* END: Toggle Modal Toggle */}
                </ModalBody>
            </Modal>
            {/* 메세지 삭제성공 모달 */}
            <Modal
                show={msgdeleteSuccess}
                onHidden={() => {
                    setMsgdeleteSuccess(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">メッセージ削除</div>
                    <div className="modal-subtit">
                        メッセージが削除されました。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setMsgdeleteSuccess(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>

            {/* 답장 */}
            <Modal
                size="modal-lg"
                backdrop="static"
                show={messageReplyModal}
                onHidden={() => {
                    setMessageReplyModal(false);
                    setEditorData("");
                    setMsgSendTitle("");
                }}
            >
                <a
                    onClick={() => {
                        setMessageReplyModal(false);
                        setEditorData("");
                        setMsgSendTitle("");
                    }}
                    className="absolute right-0 top-0 mt-3 mr-3"
                    href="#"
                >
                    <Lucide icon="X" className="w-5 h-5 text-slate-400" />
                </a>
                <ModalHeader className="flex-col p-5">
                    <h2 className="font-bold text-base mr-auto pb-3 border-b w-full">
                        <span className="text-slate-400 font-normal mr-2 block md:inline-block w-24">受信者</span>
                        {receptionState.nickname ? receptionState.nickname : msgData[0] && msgData[0].nickname}
                    </h2>
                    <div id="reply-title" className="font-normal text-base mr-auto pt-3 w-full">
                        <span className="text-slate-400 font-normal mr-2 block md:inline-block w-24">タイトル</span>
                        <span className="relative">
                            <input value={msgSendTitle} id="inputTittle" type="text" placeholder="タイトルを入力してください。" onChange={(e) => setMsgSendTitle(e.target.value)} />
                            <span className="limit-wrap text-slate-400">
                                <span className="text-slate-400">{msgSendTitle.length}</span><span className="word-limit text-slate-400">/200</span>
                            </span>
                        </span>
                    </div>
                </ModalHeader>
                <ModalBody className="p-5">
                    <div id="detail-cont" className="border-b pb-5">
                        <ClassicEditor
                            value={editorData}
                            onChange={setEditorData}
                        />
                        <span className="limit-wrap-cont text-slate-400">
                            <span className="text-slate-400">{editorData?.replace(/<[^>]*>|&nbsp;/g, '').trim().length}</span><span className="word-limit text-slate-400">/3000</span>
                        </span>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div id="detail-modal-btn" className="flex gap-2 space-between pt-5">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-secondary w-24"
                                onClick={()=> {
                                    let inputTittle = document.getElementById('inputTittle');
                                    if(inputTittle.value === "" || editorData ===""){
                                        setSaveMsgFail01(true);
                                        return false;
                                    }
                                    msgSaveSubmit()
                                }}
                                onKeyDown={(e) => {
                                    if (e.code === "Enter") {
                                        e.preventDefault();
                                        setSaveMsgSuccess(false);
                                    }
                                    return;
                                }}
                            >
                                内容保存
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-primary w-140"
                                onClick={msgSaveGet}
                                onKeyDown={(e) => {
                                    if (e.code === "Enter") {
                                        e.preventDefault();
                                        setMsgSaveModal(false);
                                    }
                                    return;
                                }}
                            >内容を呼び出す</button>
                        </div>
                        <button
                            type="button"
                            className="btn btn-sm btn-primary w-24"
                            onClick={msgSend}
                        >
                            送信
                        </button>
                    </div>
                </ModalFooter>
            </Modal>

            {/* 메세지 전송 성공 모달 */}
            <Modal
                show={msgSendSuccess}
                onHidden={() => {
                    setMsgSendSuccess(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">送信成功</div>
                    <div className="modal-subtit">
                        メッセージを送信しました。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setMsgSendSuccess(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 메세지 전송 실패 모달 */}
            <Modal
                show={msgSendFail}
                onHidden={() => {
                    setMsgSendFail(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">送信に失敗</div>
                    <div className="modal-subtit">
                        メッセージのタイトル又は内容が入力してありません。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setMsgSendFail(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>

            {/* メッセージの内容保存 성공 */}
            <Modal
                show={msgSaveSuccess}
                onHidden={() => {
                    setSaveMsgSuccess(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">メッセージの内容保存</div>
                    <div className="modal-subtit">
                        メッセージの内容を保存しました。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setSaveMsgSuccess(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                show={msgSaveModal}
                onHidden={() => {
                    setMsgSaveModal(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">メッセージの内容保存</div>
                    <div className="modal-subtit">
                        保存した内容を呼び出しました。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setMsgSaveModal(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>

            {/* 保存に失敗 */}
            <Modal
                show={msgSaveFail01}
                onHidden={() => {
                    setSaveMsgFail01(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">保存に失敗</div>
                    <div className="modal-subtit">
                        メッセージの内容を入力してから保存してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setSaveMsgFail01(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 실패 모달 */}
            <Modal
                show={modalFail}
                onHidden={() => {
                    setModalFail(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">要請失敗</div>
                    <div className="modal-subtit">
                        処理中に問題が発生しました。 <br />
                        もう一度確認してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setModalFail(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 체크 인지 모달 */}
            <Modal
                show={messageReplyFail}
                onHidden={() => {
                    setMessageReplyFail(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">選択確認</div>
                    <div className="modal-subtit">
                        メッセージを１つだけ選択してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setMessageReplyFail(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 메세지 답장 체크 인지 모달 */}
            <Modal
                show={messageReplyCheckFail}
                onHidden={() => {
                    setMessageReplyCheckFail(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">選択確認</div>
                    <div className="modal-subtit">メッセージを１つ選択してください。</div>
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-primary"
                            onClick={() => {
                                setMessageReplyCheckFail(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                show={msgCheckModal}
                onHidden={() => {
                    setMsgCheckModal(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">選択確認</div>
                    <div className="modal-subtit">
                        メッセージを１つ以上選択してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setMsgCheckModal(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 메세지 글자수 */}
            <Modal
                show={msgSubjectFail}
                onHidden={() => {
                    setMsgSubjectFail(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">タイトル確認</div>
                    <div className="modal-subtit">
                        タイトルの場合は200文字以上を超えないように入力してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setMsgSubjectFail(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                show={msgContentsFail}
                onHidden={() => {
                    setMsgContentsFail(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">内容確認</div>
                    <div className="modal-subtit">
                        内容の場合は3000文字以上超えないように入力してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setMsgContentsFail(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>

        </>
    );
}

export default MessageSent;