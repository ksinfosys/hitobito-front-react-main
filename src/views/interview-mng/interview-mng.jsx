import { Lucide, Modal, ModalBody, ModalHeader, ClassicEditor, ModalFooter } from "@/base-components";
import React, { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import moment from "moment";
import Search from "@/assets/images/search.svg";

import UserBlank from "@/assets/images/user-blank.png";
import FileDown from "@/assets/images/file-down.svg";

import Pagination from "../../components/pagination";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import ServiceFetch from "../../../util/ServiceFetch";
import { userInfo } from "../../stores/user-info";
import { interviewMng } from "../../stores/interview-mng";
import { regexUserPoint } from "../../utils/utils"

// 드롭다운 컴포넌트 추가
import DropdownSelect from './select-component';
import TableArrow from "@/assets/images/table-arrow.svg";

const InterviewMng = () => {
    const [informModal, setinformModal] = useState(false);
    const [informModal2, setinformModal2] = useState(false);

    // 실패시 공통 모달
    const [modalFail, setModalFail] = useState(false);
    const [modalTmpLoadFail, setModalTmpLoadFail] = useState(false);

    // 레코일에 저장된 State
    const [userInfoV, setUserInfoV] = useRecoilState(userInfo);
    const [interview, setInterview] = useRecoilState(interviewMng);

    // ListState
    const [listState, setListState] = useState([]);
    // Pagenation
    const [pgnInfo, setPgnInfo] = useState({});
    const [currentPageIdx, setCurrentPageIdx] = useState(1);
    // Search
    const [searchValue, setSearchValue] = useState();
    const [searchStatus, setSearchStatus] = useState(false);
    // Search Submit
    const searchSubmit = () => {
        setSearchStatus((prev) => !prev);
        getList();
    };

    // 메세지 모달
    const [messageReplyModal, setMessageReply] = useState(false);
    // 메세지 유저 아이디
    const [messageSendId, setMessageSendId] = useState();
    // 메세지 타이틀
    const [messageTitle, setMessageTitle] = useState("");
    // 메세지 에디터
    const [editorData, setEditorData] = useState();
    // 메세지 성공 모달
    const [msgSuccess, setMsgSuccess] = useState(false);
    // 메세지 전송 실패
    const [msgSendFail, setMsgSendFail] = useState(false);
    // 메세지 임시 저장
    const [msgSaveSuccess, setSaveMsgSuccess] = useState(false);
    const [msgSaveFail01, setSaveMsgFail01] = useState(false);
    const [msgSaveFail02, setSaveMsgFail02] = useState(false);
    const [msgSaveModal, setMsgSaveModal] = useState(false);

    // 신고 모달
    const [reportRequestModal1, setreportRequestModal1] = useState(false);
    const [reportCheckModal, setReportCheckModal] = useState(false);
    const [reportModal, setReportModal] = useState(false);
    const [reportModal02, setReportModal02] = useState(false);
    // 신고 데이터
    const [declaration, setDeclaration] = useState({});
    // 신고 대상자
    const [declarationUser, setDeclarationUser] = useState();
    // 신고 list 
    const [reportReasonList, setReportReasonList] = useState([]);

    // getList API
    const getList = () => {
        ServiceFetch("/reqmag/list", "post", {
            curPage: currentPageIdx,
            statusFlag: interview.statusFlag,
            orderDate: interview.orderDate,
            searchKeyword: searchValue,
        }).then((res) => {
            res.resultCode === '200' ? (
                Array.isArray(res.result.reqList) ? setListState(res.result.reqList) : setListState([]),
                setPgnInfo(res.result.pageItem)
            ) : (
                console.log(1)
            )
        }).catch((e) => {
            console.log(e);
        })
    };

    // 나이 계산
    const year = moment().format('YYYY');
    // 상세보기 모달 유저 정보
    const [userDetailInfo, setUserDetailInfo] = useState();
    // getDetail API
    const getDetail = (rqIdx, jsUserId) => {
        axios.post("/api" + "/reqmag/resume", {
            rqIdx: rqIdx,
            jsUserId: jsUserId,
        }, {
            withCredentials: true,
            headers: {
                accessToken: getCookie("accessToken"),
                lastLoginTime: getCookie("lastLoginTime"),
            },
        }).then((response) => {
            const code = response.data.resultCode;
            const result = response.data.result;
            code === "200" ? (() => {
                // console.log(result)
                setUserDetailInfo(result);
                result.detailFlag ? setinformModal2(true) : setinformModal(true);
            })() : console.log("fetching error:::", response);
        });
    };

    // 면접실시확인 모달
    const [modalState01, setModalState01] = useState(false);
    const [acceptModalSuccess, setAcceptModalSuccess] = useState(false);
    const [acceptModalFail, setAcceptModalFail] = useState(false);
    const [rqIdx, setRqIdx] = useState();
    const [userId, setUserId] = useState();
    // accept API
    const accept = () => {
        setModalState01(false);
        ServiceFetch("/reqmag/accept", "put", {
            rqIdx: rqIdx,
            userId: userId,
        }).then((res) => {
            // console.log(res)
            res.resultCode === '200' ? (
                setAcceptModalSuccess(true),
                getList()
            ) : res.resultCode === '716' ? (
                setAcceptModalFail(true)
            ) : (
                setModalFail(true)
            )
        }).catch((e) => {
            console.log(e);
        });
    };
    const handleSubmit = (rqIdx, userId) => {
        setRqIdx(rqIdx);
        setUserId(userId);
        setModalState01(true);
    }


    // 신고 리스트 가져오기 API
    const reportGet = () => {
        axios.get('/api/report/list', {
            headers: {
                accessToken: getCookie("accessToken"),
                lastLoginTime: getCookie("lastLoginTime"),
            },
            withCredentials: true,
        }).then((response) => {
            let reportReasonList = response.data.result.reportReasonList;
            let temp = reportReasonList[0];
            reportReasonList.splice(0,1);
            reportReasonList.push(temp);
            
            setReportReasonList(reportReasonList)
        }).catch((error) => {
            console.error(error);
        });
    };

    // console.log(declaration)

    // 신고하기 API
    const reportSubmit = () => {
        !declaration.reportReasonCode ? setReportCheckModal(true) :
            declaration.reportReasonCode !== '00' ? (
                ServiceFetch("/report/company", "post", declaration
                ).then((res) => {
                    setreportRequestModal1(false);
                    setReportModal(true);
                    setDeclaration({ ...declaration, reportReasonCode: "", reportReasonContent: "" });
                }).catch((e) => {
                    console.log(e);
                })
            ) : !declaration.reportReasonContent ? setReportModal02(true) : (
                ServiceFetch("/report/company", "post", declaration
                ).then((res) => {
                    setreportRequestModal1(false);
                    setReportModal(true);
                    setDeclaration({ ...declaration, reportReasonCode: "", reportReasonContent: "" });
                }).catch((e) => {
                    console.log(e);
                })
            )
    };

    // msg API
    const [isSending, setIsSending] = useState(false);
    const [msgSubjectFail, setMsgSubjectFail] = useState(false);
    const [msgContentsFail, setMsgContentsFail] = useState(false);
    // 답장 글자 수 초과시 모달 출력
    useEffect(() => {
        messageTitle.length >= 201 && setMsgSubjectFail(true);
        editorData && editorData.replace(/<[^>]*>|&nbsp;/g, '').trim().length >= 3001 && setMsgContentsFail(true);
    }, [messageTitle, editorData])
    const msgSubmit = () => {
        if (messageTitle.length >= 201) {
            setMsgSubjectFail(true)
        } else if (editorData && editorData.replace(/<[^>]*>|&nbsp;/g, '').trim().length >= 3001) {
            setMsgContentsFail(true)
        } else {
            if (isSending) return; // 전송 중인 경우 중복 전송 방지
            setIsSending(true); // 전송 시작
            ServiceFetch("/msg/reply", "post", {
                receiveUserId: messageSendId,
                msgTitle: messageTitle,
                msgContents: editorData,
                msgIdx: 0
            }).then((res) => {
                res.resultCode === '200' ? (
                    setMessageReply(false),
                    setMsgSuccess(true),
                    setMessageTitle(""),
                    setEditorData("")
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

    // メッセージの内容保存
    const msgSaveSubmit = () => {
        ServiceFetch("/msg/tmpsave", "post", {
            msgContents: editorData,
            msgTitle: messageTitle
        }).then((res) => {
            res.resultCode === '200' ? (
                setSaveMsgSuccess(true)
            ) : res.resultCode === '301' || res.resultCode === '302' ? (
                setSaveMsgFail01(true)
            ) : (
                setSaveMsgFail01(true)
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
            ) : response.data.resultCode === '303' ? (
                setModalTmpLoadFail(true)
            ) : (
                setModalFail(true)
            )
        }).catch((error) => {
            console.error(error);
        });
    };

    // 최초 방 진입 시 list 가져오기
    useEffect(() => {
        getList();
    }, [currentPageIdx, searchStatus, interview]);



    const handleSelect01 = (option, id) => {
        setInterview({ ...interview, statusFlagText: option, statusFlag: id })
    };

    const handleSelect02 = () => {
        setInterview({ ...interview, orderDate: interview.orderDate === 1 ? 0 : 1 })
    };

    const rotateStyle = {
        transform: interview.orderDate ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.1s ease-in-out",
    };

    return (
        <>
            <div className="dashboard orange">
                <div className="box-type-default">
                    <div className="dashboard-top p-5 border-b border-slate-200/60 text-sm">
                        面接依頼現況
                    </div>
                    <div className="list-top flex flex-end items-center mt-10 mb-5 px-5">
                        <div className="flex gap-4">
                            <select className="form-select w-32 arrow_none" onMouseDown={(e) => e.preventDefault()}>
                                <option value="0">ニックネーム</option>
                            </select>
                            <div className="search-box relative text-slate-500">
                                <input
                                    type="text"
                                    className="form-control pr-10"
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="検索ワードを入力"
                                    onKeyDown={(e) => {
                                        if (e.code === "Enter") {
                                            if(searchValue){
                                            searchSubmit();
                                            }
                                        }
                                        return;
                                    }}
                                />
                                <button
                                    className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                                    onClick={searchSubmit}
                                    disabled={!searchValue}
                                >
                                    <img src={Search} alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-cont pb-12">
                        {/* 테이블 10줄 */}
                        <div className="mt-8">
                            <table className="table mt-5 tdth_height tb_table">
                                <thead className="table-light text-center">
                                    <tr className="tb-1">
                                        <th className="whitespace-nowrap text-sm border-tb0">NO</th>
                                        <th className="whitespace-nowrap text-sm flex flex-center items-center border-tb0">
                                            依頼対象
                                        </th>
                                        <th className="whitespace-nowrap text-sm border-tb0">
                                            {/* 드롭다운 퍼블 */}
                                            <DropdownSelect
                                                options={['全体', '依頼中', '承諾', '拒否', '返却']}
                                                defaultOption={interview.statusFlagText}
                                                onSelect={handleSelect01}
                                            />
                                        </th>
                                        <th className="whitespace-nowrap text-sm border-tb0">
                                            <div className="flex flex-center items-center">
                                                依頼日時
                                                <button onClick={() => { handleSelect02() }}>
                                                    <img src={TableArrow} alt="" style={rotateStyle} />
                                                </button>
                                            </div>
                                        </th>
                                        <th className="whitespace-nowrap text-sm flex flex-center items-center border-tb0">
                                            依頼期限
                                        </th>
                                        <th className="whitespace-nowrap text-sm border-tb0">確認日時</th>
                                        <th className="whitespace-nowrap text-sm border-tb0" style={{width: 135 + 'px'}}>ポイント状態</th>
                                        <th className="whitespace-nowrap text-sm th-blank border-tb0">
                                            <div className="flex gap-2 interview-mng-button-wrap">
                                                <div>
                                                    面談実施確認
                                                </div>
                                                <div>
                                                    メッセージ作成
                                                </div>
                                                <div>
                                                    通報
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {listState?.length > 0 ? (
                                        listState.map((data, index) => {
                                            // console.log(listState)
                                            return (
                                                <tr
                                                    key={index}
                                                    className={data.requestPointStatus !== "21105" ? "complete" : ""}
                                                >
                                                    <td>{data.rowNum}</td>
                                                    <td><button type="button" onClick={() => { getDetail(data.rqIdx, data.rqReceiveUserId) }}>{data.nickname}</button> </td>
                                                    <td className="shrink-0 w-24">
                                                        {
                                                            data.rqStatus === "20101" ? "依頼中" :
                                                                data.rqStatus === "20102" ? "承諾" :
                                                                    data.rqStatus === "20103" ? "拒否" : "返却"
                                                        }
                                                    </td>
                                                    <td>
                                                        {moment(data.rqSendDatetime).format("YY.MM.DD HH:mm")}
                                                    </td>
                                                    <td>
                                                        {moment(data.rqLimitDatetime).format("YY.MM.DD HH:mm")}
                                                    </td>
                                                    <td>
                                                        {moment(data.rqConfirmDatetime).format("YY.MM.DD HH:mm")}
                                                    </td>
                                                    <td className="table-br-tab">
                                                        {data.pointCngType === "20301" ? "+" : regexUserPoint(data.pointCngAmount) == "0" ? "" : "-"}{regexUserPoint(data.pointCngAmount)}<br/>
                                                        {data.requestPointStatus}
                                                        {console.log(data)}
                                                    </td>
                                                    <td className="pdrl-ad">
                                                        <div>
                                                            {
                                                                data.pointAcceptFlag
                                                                ?
                                                                <button
                                                                    className="btn btn-sm btn-business"
                                                                    onClick={() => data.pointAcceptFlag && handleSubmit(data.rqIdx, data.rqReceiveUserId)}>
                                                                    面接実施確認
                                                                </button>
                                                                :
                                                                (!data.pointAcceptFlag && data.rqStatus !== "20102") || (data.requestPointStatus === "(承諾)") 
                                                                ?
                                                                ""
                                                                :
                                                                <button
                                                                    className="btn btn-sm btn-gray-business" disabled={true}>
                                                                    面接実施確認
                                                                </button>
                                                            }
                                                            {
                                                                data.rqStatus === "20102" && data.requestPointStatus !== "(承諾)"
                                                                ?
                                                                <button
                                                                    className="btn btn-sm btn-business ml-2 btn-message-write"
                                                                    onClick={() => {
                                                                        setMessageSendId(data.rqReceiveUserId)
                                                                        setDeclarationUser(data.nickname)
                                                                        data.rqStatus === "20102" && setMessageReply(true)
                                                                    }}>
                                                                    メッセージ作成
                                                                </button>
                                                                :
                                                                (!data.pointAcceptFlag && data.rqStatus !== "20102") || (data.requestPointStatus === "(承諾)") 
                                                                ?
                                                                ""
                                                                :
                                                                <button
                                                                    className="btn btn-sm btn-gray-business ml-2 btn-message-write" disabled={true}>
                                                                    メッセージ作成
                                                                </button>
                                                            }                                                        
                                                            {
                                                                data.rqStatus === "20102" && data.requestPointStatus !== "(承諾)"
                                                                ?
                                                                <button
                                                                    className="btn btn-sm btn-business ml-2"
                                                                    onClick={() => {                                                                
                                                                        data.rqStatus === "20102" && setreportRequestModal1(true)
                                                                        reportGet()
                                                                        setDeclarationUser(data.nickname)
                                                                        setDeclaration({ ...declaration, reportTargetId: data.rqReceiveUserId })
                                                                    }}>
                                                                    通報
                                                                </button>
                                                                :
                                                                (!data.pointAcceptFlag && data.rqStatus !== "20102") || (data.requestPointStatus === "(承諾)")
                                                                ?
                                                                ""
                                                                :
                                                                <button
                                                                    className="btn btn-sm btn-gray-business ml-2" disabled={true}>
                                                                    通報
                                                                </button>
                                                            }
                                                        </div>




                                                        {/* <button
                                                            className={
                                                                data.pointAcceptFlag
                                                                    ? "btn btn-sm btn-business"
                                                                    : "btn btn-sm btn-gray-business" 
                                                            }
                                                            onClick={() => data.pointAcceptFlag && handleSubmit(data.rqIdx, data.rqReceiveUserId)}
                                                        >
                                                            面接実施確認
                                                        </button>
                                                        <button
                                                            className={
                                                                data.rqStatus === "20102"
                                                                    ? "btn btn-sm btn-business ml-2 btn-message-write"
                                                                    : "btn btn-sm btn-gray-business ml-2 btn-message-write"
                                                            }
                                                            onClick={() => {
                                                                setMessageSendId(data.rqReceiveUserId)
                                                                setDeclarationUser(data.nickname)
                                                                data.rqStatus === "20102" && setMessageReply(true)
                                                            }}
                                                        >
                                                            メッセージ作成
                                                        </button>
                                                        <button
                                                            className={
                                                                data.rqStatus === "20102"
                                                                    ? "btn btn-sm btn-business ml-2"
                                                                    : "btn btn-sm btn-gray-business ml-2"
                                                            }                                                            
                                                            onClick={() => {                                                                
                                                                data.rqStatus === "20102" && setreportRequestModal1(true)
                                                                reportGet()
                                                                setDeclarationUser(data.nickname)
                                                                setDeclaration({ ...declaration, reportTargetId: data.rqReceiveUserId })
                                                            }}
                                                        >
                                                            通報
                                                        </button> */}




                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={8}>履歴が存在しません。</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {
                    listState?.length > 0 &&
                    <Pagination
                        pgnInfo={pgnInfo}
                        currentPageIdx={currentPageIdx}
                        setCurrentPageIdx={setCurrentPageIdx}
                    />
                }
            </div>

            {/* 신고 모달 */}
            <Modal backdrop="static"
                show={reportRequestModal1}
                onHidden={() => {
                    setreportRequestModal1(false);
                    setDeclaration({ ...declaration, reportReasonCode: "", reportReasonContent: "" });
                }}
            >
                <ModalHeader>
                    <div className="flex space-between items-center w-full">
                        <h2 className="modal-tit">
                            通報
                        </h2>
                        <button
                            onClick={() => {
                                setreportRequestModal1(false);
                                setDeclaration({ ...declaration, reportReasonCode: "", reportReasonContent: "" });
                            }}
                        >
                            <Lucide icon="X" className="w-4 h-4" />
                        </button>
                    </div>
                </ModalHeader>
                <ModalBody >
                    <div className="flex gap-5">
                        <div className="modal-subtit2">
                            通報対象 : {declarationUser}
                        </div>
                        <div className="modal-subtit2">
                            通報者 : {userInfoV.cpUserName}
                        </div>
                    </div>
                    <div className="report-radio-wrap mt-4">
                        {
                            reportReasonList?.length > 0 && reportReasonList.map((report, index) => {
                                return (
                                    <div className="form-check mt-2" key={index}>
                                        <input
                                            id={`radio-switch-${index}`}
                                            className="form-check-input"
                                            name="report-radio"
                                            type="radio"
                                            value={report.reportReasonCode}
                                            checked={declaration.reportReasonCode === report.reportReasonCode}
                                            onChange={(e) => {
                                                let inputarea = document.getElementById('inputarea');
                                                if(e.target.value === "00"){
                                                    inputarea.disabled = false;
                                                }else if(e.target.value !== "00"){
                                                    inputarea.disabled = true;
                                                    declaration.reportReasonContent = "";
                                                    inputarea.value = "";
                                                }
                                                setDeclaration({ ...declaration, reportReasonCode: e.target.value })}}
                                        />
                                        <label className="form-check-label" htmlFor={`radio-switch-${index}`}>
                                            {report.reportReason}
                                        </label>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <textarea
                        id = "inputarea"
                        className="form-control mt-4 h-20 resize-none"
                        rows="1"
                        placeholder="通報の理由を具体的に記入してください。"
                        disabled
                        //value={declaration.reportReasonContent}
                        onChange={(e) => setDeclaration({ ...declaration, reportReasonContent: e.target.value })}
                    ></textarea>
                    <div className="flex flex-end mt-4">
                        <a
                            className="btn btn-business btn-report"
                            onClick={() => {
                                reportSubmit();
                                let inputarea = document.getElementById('inputarea');
                                inputarea.value = "";
                            }}
                        >
                            通報
                        </a>
                    </div>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </Modal>
            {/* 신고 체크 모달 */}
            <Modal
                show={reportCheckModal}
                onHidden={() => {
                    setReportCheckModal(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">通報の理由を選択してください。</div>
                    {/* <div className="modal-subtit">
                        通報の理由を選択してください。
                    </div> */}
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-business"
                            onClick={() => {
                                setReportCheckModal(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 신고 성공 */}
            <Modal
                show={reportModal}
                onHidden={() => {
                    setReportModal(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">通報の送信が完了しました。</div>
                    {/* <div className="modal-subtit">
                        通報の送信が完了しました。
                    </div> */}
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-business"
                            onClick={() => {
                                setReportModal(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 신고 안내 모달 */}
            <Modal
                show={reportModal02}
                onHidden={() => {
                    setReportModal02(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">通報の内容を作成してください。</div>
                    <div className="modal-subtit">
                        その他を選択した場合は通報の内容を入力してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-business"
                            onClick={() => {
                                setReportModal02(false);
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
                onHidden={() => { setMessageReply(false); setMessageTitle(""); setEditorData(""); }}>
                <a onClick={() => { setMessageReply(false); setMessageTitle(""); setEditorData(""); }} className="absolute right-0 top-0 mt-3 mr-3">
                    <Lucide icon="X" className="w-5 h-5 text-slate-400" />
                </a>
                <ModalHeader className="flex-col p-5">
                    <h2 className="font-bold text-base mr-auto pb-3 border-b w-full">
                        <span className="text-slate-400 font-normal mr-2 block md:inline-block w-24">受信者</span>
                        {declarationUser}
                    </h2>
                    <div id="reply-title" className="font-normal text-base mr-auto pt-3 w-full">
                        <span className="text-slate-400 font-normal mr-2 block md:inline-block w-24">タイトル</span>
                        <span className="relative">
                            <input className="" value={messageTitle} type="text" placeholder="タイトルを入力してください。" onChange={(e) => setMessageTitle(e.target.value)} />
                            <span className="limit-wrap text-slate-400">
                                <span className="text-slate-400">{messageTitle.length}</span><span className="word-limit text-slate-400">/200</span>
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
                                onClick={msgSaveSubmit}
                                onKeyDown={(e) => {
                                    if (e.code === "Enter") {
                                        e.preventDefault();
                                        setSaveMsgSuccess(false);
                                    }
                                    return;
                                }}
                            >内容保存</button>
                            <button
                                type="button"
                                className="btn btn-sm btn-business w-140"
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
                        <button type="button" className="btn btn-sm btn-business w-24" onClick={msgSubmit}>送信</button>
                    </div>
                </ModalFooter>
            </Modal>

            {/* 메세지 전송 성고 */}
            <Modal
                show={msgSuccess}
                onHidden={() => {
                    setMsgSuccess(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">メッセージを送信しました。</div>
                    {/* <div className="modal-subtit">
                        メッセージを送信しました。
                    </div> */}
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-business"
                            onClick={() => {
                                setMsgSuccess(false);
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
                            className="btn btn-business"
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
                            className="btn btn-business"
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
                            className="btn btn-business"
                            onClick={() => {
                                setSaveMsgFail01(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                show={msgSaveFail02}
                onHidden={() => {
                    setSaveMsgFail02(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">保存に失敗</div>
                    <div className="modal-subtit">
                        処理中に問題が発生しました。 <br />
                        もう一度確認してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-business"
                            onClick={() => {
                                setSaveMsgFail02(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>


            {/* 구직자 간단 정보 모달 */}
            <Modal className="em-info-modal"
                show={informModal}
                onHidden={() => {
                    setinformModal(false);
                }}
            >
                <ModalHeader>
                    <div className="flex space-between items-center w-full">
                        <h2 className="modal-tit">
                            {userDetailInfo && userDetailInfo.resume.nickname}
                        </h2>
                        <button className="" onClick={() => setinformModal(false)}>
                            <Lucide icon="X" className="w-4 h-4" />
                        </button>
                    </div>
                </ModalHeader>
                <ModalBody >

                    <div className="flex gap-5 items-center space-between">
                        <div className="info-top-box flex gap-5 items-center">
                            <div className="modal-subtit1">
                                国籍
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.country}
                            </div>
                        </div>
                        <div className="info-top-box box2 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                誕生年
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.userAge}年 <span className="blue">{year - Number(userDetailInfo && userDetailInfo.resume.userAge)}歳</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-5 items-center space-between">
                        <div className="info-top-box flex gap-5 items-center">
                            <div className="modal-subtit1">
                                性別
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.userGender}
                            </div>
                        </div>
                        <div className="info-top-box box2 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                居住地
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.residentialArea}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-5 space-between items-start mt-3">
                        <div className="info-top-box flex gap-5 items-center">
                            <div className="modal-subtit1">
                                学歴
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.education}
                            </div>
                        </div>
                        <div className="info-top-box box2 flex flex-col">
                            <div className="col-box flex gap-5">

                                <div className="modal-subtit1">
                                    最終学校名
                                </div>
                                <div className="modal-subtit2">
                                    {userDetailInfo && userDetailInfo.resume.schoolName}
                                </div>
                            </div>
                            <div className="col-box flex gap-5">
                                <div className="modal-subtit1">
                                    専攻
                                </div>
                                <div className="modal-subtit2">
                                    {userDetailInfo && userDetailInfo.resume.majorName}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="current-box flex flex-col gap-2">
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                現在の職種
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.jobType}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                所属会社の業種
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.businessType}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                経歴
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.career}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                希望年収
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.hopeIncome}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-start">
                            <div className="modal-subtit1">
                                将来の目標
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.hopeCareer}
                            </div>
                        </div>
                    </div>
                    <div className="main-curr">
                        <div className="main-curr-tit">
                            主要経歴
                        </div>
                        <div className="main-curr-cont flex flex-col gap-5">
                            {
                                userDetailInfo && userDetailInfo.resumeProjectList?.length > 0 ? userDetailInfo.resumeProjectList.map((project, index) => {
                                    const process = project.projectProcess.split(',');
                                    return (
                                        <div className="main-curr-box flex flex-col gap-2" key={index}>
                                            <div className="col-box flex gap-5">
                                                <div className="modal-subtit1">
                                                    プロジェクト名
                                                </div>
                                                <div className="modal-subtit2">
                                                    {project.projectName}
                                                </div>
                                            </div>
                                            <div className="flex gap-5 items-center space-between">
                                                <div className="info-top-box flex gap-5 items-center">
                                                    <div className="modal-subtit1">
                                                        役割
                                                    </div>
                                                    <div className="modal-subtit2">
                                                        {project.projectRole}
                                                    </div>
                                                </div>
                                                <div className="info-top-box flex gap-5 items-center">
                                                    <div className="modal-subtit1">
                                                        期間
                                                    </div>
                                                    <div className="modal-subtit2">
                                                        {project.projectPeriod} カ月
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="charge-btm">
                                                <div className="flex gap-5">
                                                    <div className="charge-btm-tit">担当工程</div>
                                                    <div className="charge-btm-cont flex gap-2">
                                                        {
                                                            process != '' && process?.length > 0 && process.map((item, index) => {
                                                                return (
                                                                    <div className="btn-lang" key={index}>{item}</div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <div className="main-curr-box flex flex-col gap-2">
                                        経歴がありません。
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="skill-box">
                        <div className="charge-btm">
                            <div className="flex gap-5">
                                <div className="charge-btm-tit">スキル</div>
                                <div className="charge-btm-cont flex gap-2">
                                    {
                                        userDetailInfo && userDetailInfo?.resumeSkillList.length > 0 ? userDetailInfo.resumeSkillList.map((skill, index) => {
                                            return (
                                                <div className="btn-lang" key={index}>
                                                    {skill.skillName}<span>{skill.career}</span>
                                                </div>
                                            )
                                        }) : (
                                            <div className="btn-lang">
                                                スキルがありません。
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="introduce">
                        <div className="int-tit">
                            簡単な自己紹介
                        </div>
                        {
                            userDetailInfo && userDetailInfo.resume.additionalComment ? (
                                <div className="int-cont">
                                    {userDetailInfo.resume.additionalComment}
                                </div>
                            ) : (
                                <div className="int-cont">
                                    「簡単な自己紹介」がありません。
                                </div>
                            )
                        }
                    </div>
                </ModalBody>
            </Modal>
            {/* 구직자 상세 정보 모달 */}
            <Modal className="em-info-modal"
                show={informModal2}
                onHidden={() => {
                    setinformModal2(false);
                }}
            >
                <ModalHeader>
                    <div className="flex space-between items-center w-full">
                        <h2 className="modal-tit">
                            {userDetailInfo && userDetailInfo.resume.nickname}
                        </h2>
                        <button className="" onClick={() => setinformModal2(false)}>
                            <Lucide icon="X" className="w-4 h-4" />
                        </button>
                    </div>
                </ModalHeader>
                <ModalBody >
                    <div className="user-img-wrap flex justify-center mb-8">
                        {
                            userDetailInfo && userDetailInfo.photoFile ?
                                <img src={`https://hitobito-net.com/api${userDetailInfo.photoFile.fileURL}`} alt={userDetailInfo.photoFile.fileName} style={{ width: '100px', height: 'auto' }}/> :
                                <img src={UserBlank} alt="noImage" />
                        }
                    </div>
                    <div className="flex gap-5 items-center space-between">
                        <div className="info-top-box flex gap-5 items-center">
                            <div className="modal-subtit1">
                                国籍
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.country}
                            </div>
                        </div>
                        <div className="info-top-box box2 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                誕生年
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.userAge}年 <span className="blue">{year - Number(userDetailInfo && userDetailInfo.resume.userAge)}歳</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-5 items-center space-between">
                        <div className="info-top-box flex gap-5 items-center">
                            <div className="modal-subtit1">
                                性別
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.userGender}
                            </div>
                        </div>
                        <div className="info-top-box box2 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                居住地
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.residentialArea}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-5 space-between items-start mt-3">
                        <div className="info-top-box flex gap-5 items-center">
                            <div className="modal-subtit1">
                                学歴
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.education}
                            </div>
                        </div>
                        <div className="info-top-box box2 flex flex-col">
                            <div className="col-box flex gap-5">

                                <div className="modal-subtit1">
                                    最終学校名
                                </div>
                                <div className="modal-subtit2">
                                    {userDetailInfo && userDetailInfo.resume.schoolName}
                                </div>
                            </div>
                            <div className="col-box flex gap-5">
                                <div className="modal-subtit1">
                                    専攻
                                </div>
                                <div className="modal-subtit2">
                                    {userDetailInfo && userDetailInfo.resume.majorName}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="current-box flex flex-col gap-2">
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                現在の職種
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.jobType}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                所属会社の業種
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.businessType}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                経歴
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.career}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                希望年収
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.hopeIncome}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-start">
                            <div className="modal-subtit1">
                                将来の目標
                            </div>
                            <div className="modal-subtit2">
                                {userDetailInfo && userDetailInfo.resume.hopeCareer}
                            </div>
                        </div>
                        {
                            userDetailInfo && userDetailInfo.resume.userEmail && (
                                <div className="info-top-box box3 flex gap-5 items-start">
                                    <div className="modal-subtit1">
                                        イーメール
                                    </div>
                                    <div className="modal-subtit2">
                                        {userDetailInfo.resume.userEmail}
                                    </div>
                                </div>
                            )
                        }
                        {
                            userDetailInfo && userDetailInfo.resume.phoneNumber && (
                                <div className="info-top-box box3 flex gap-5 items-start">
                                    <div className="modal-subtit1">
                                        連絡先
                                    </div>
                                    <div className="modal-subtit2">
                                        {userDetailInfo.resume.phoneNumber}
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    <div className="main-curr">
                        <div className="main-curr-tit">
                            主要経歴
                        </div>
                        <div className="main-curr-cont flex flex-col gap-5">
                            {
                                userDetailInfo && userDetailInfo.resumeProjectList?.length > 0 ? userDetailInfo.resumeProjectList.map((project, index) => {
                                    const process = project.projectProcess.split(',');
                                    return (
                                        <div className="main-curr-box flex flex-col gap-2" key={index}>
                                            <div className="col-box flex gap-5">
                                                <div className="modal-subtit1">
                                                    プロジェクト名
                                                </div>
                                                <div className="modal-subtit2">
                                                    {project.projectName}
                                                </div>
                                            </div>
                                            <div className="flex gap-5 items-center space-between">
                                                <div className="info-top-box flex gap-5 items-center">
                                                    <div className="modal-subtit1">
                                                        役割
                                                    </div>
                                                    <div className="modal-subtit2">
                                                        {project.projectRole}
                                                    </div>
                                                </div>
                                                <div className="info-top-box flex gap-5 items-center">
                                                    <div className="modal-subtit1">
                                                        期間
                                                    </div>
                                                    <div className="modal-subtit2">
                                                        {project.projectPeriod} カ月
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="charge-btm">
                                                <div className="flex gap-5">
                                                    <div className="charge-btm-tit">担当工程</div>
                                                    <div className="charge-btm-cont flex gap-2">
                                                        {
                                                            process != '' && process?.length > 0 && process.map((item, index) => {
                                                                return (
                                                                    <div className="btn-lang" key={index}>{item}</div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <div className="main-curr-box flex flex-col gap-2">
                                        経歴がありません。
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="skill-box">
                        <div className="charge-btm">
                            <div className="flex gap-5">
                                <div className="charge-btm-tit">スキル</div>
                                <div className="charge-btm-cont flex gap-2">
                                    {
                                        userDetailInfo && userDetailInfo?.resumeSkillList.length > 0 ? userDetailInfo.resumeSkillList.map((skill, index) => {
                                            return (
                                                <div className="btn-lang" key={index}>
                                                    {skill.skillName}<span>{skill.career}</span>
                                                </div>
                                            )
                                        }) : (
                                            <div className="btn-lang">
                                                スキルがありません。
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="introduce">
                        <div className="int-tit">
                            簡単な自己紹介
                        </div>
                        {
                            userDetailInfo && userDetailInfo.resume.additionalComment ? (
                                <div className="int-cont">
                                    {userDetailInfo.resume.additionalComment}
                                </div>
                            ) : (
                                <div className="int-cont">
                                    「簡単な自己紹介」がありません。
                                </div>
                            )
                        }
                    </div>
                    <div className="flex flex-col attach-cont-wrap my-4">
                        <div className="attach-tit-wrap flex items-center gap-2 flex-shrink-0">
                            <div className="attach-tit">
                                <strong>添付ファイル</strong>
                            </div>
                        </div>
                        <hr/>
                            {
                                userDetailInfo && userDetailInfo.attachedfilelist?.length > 0 ? userDetailInfo.attachedfilelist.map((file, index) => {
                                    return (
                                        <div className="attach-cont-item flex items-center space-between gap-2" key={index}>
                                            <div className="upload-name-2 attach-cont-tit upload-name">
                                                {file.fileName}
                                            </div>
                                            <button onClick={() => window.open(`https://hitobito-net.com/api${file.fileURL}`)} className="attach-cont-btn flex-shrink-0">
                                                <img src={FileDown} alt="" />
                                            </button>
                                        </div>
                                    )
                                }) : (
                                    <div className="attach-cont-item flex items-center space-between">
                                        <div className="attach-cont-tit">
                                           登録されたファイルがありません。
                                        </div>
                                        <button className="attach-cont-btn">
                                            <img src={FileDown} alt="" />
                                        </button>
                                    </div>
                                )
                            }                       
                    </div>
                </ModalBody>
            </Modal>

            {/* ************ 면접실시확인 모달 ************ */}
            <Modal
                show={modalState01}
                onHidden={() => {
                    setModalState01(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">面接実施確認</div>
                    <div className="modal-subtit">
                        面接を実施しましたか？
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-pending"
                            onClick={accept}
                        >
                            はい
                        </a>
                        <a
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setModalState01(false);
                            }}
                        >
                            いいえ
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
                            className="btn btn-business"
                            onClick={() => {
                                setMsgSendFail(false);
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
                            className="btn btn-business"
                            onClick={() => {
                                setModalFail(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 임시저장 불러오기 실패모달 */}
            <Modal
                show={modalTmpLoadFail}
                onHidden={() => {
                    setModalTmpLoadFail(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">要請失敗</div>
                    <div className="modal-subtit">
                        臨時保存されたメッセージがありません。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-business"
                            onClick={() => {
                                setModalTmpLoadFail(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 면접실시 모달 */}
            <Modal
                show={acceptModalSuccess}
                onHidden={() => {
                    setAcceptModalSuccess(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">面接実施確認</div>
                    <div className="modal-subtit">
                        面談の実施を確認しました。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-business"
                            onClick={() => {
                                setAcceptModalSuccess(false);
                            }}
                        >
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                show={acceptModalFail}
                onHidden={() => {
                    setAcceptModalFail(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">面談の実施に失敗</div>
                    <div className="modal-subtit">
                        ポイント支給の承認に失敗しました。<br />
                        もう一度試してください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-business"
                            onClick={() => {
                                setAcceptModalFail(false);
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
};
export default InterviewMng;
