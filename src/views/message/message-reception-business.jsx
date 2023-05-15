import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ClassicEditor,
  ModalFooter
} from "@/base-components";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import Pagination from "../../components/pagination";
import Search from "@/assets/images/search.svg";
import MessageBoxList01 from "./message-box-list01";
import ServiceFetch from "../../../util/ServiceFetch";
import { useRecoilState } from "recoil";

function MessageReceptionBusiness() {
  const [disable, setDisable] = React.useState(false);
  /* ******** 모달 ******** */
  const [msgModal, setMsgModal] = useState(false);
  const [messageSaveModal, setMessageSaveModal] = useState(false);
  const [messageDeleteModal, setMessageDeleteModal] = useState(false);
  const [messageReplyModal, setMessageReply] = useState(false);
  const [messageReplyFail, setMessageReplyFail] = useState(false);
  const [msgSendSuccess, setMsgSendSuccess] = useState(false);
  const [msgSendFail, setMsgSendFail] = useState(false);
  const [msgSaveSuccess01, setMsgSaveSuccess01] = useState(false);
  const [msgdeleteSuccess, setMsgdeleteSuccess] = useState(false);
  const [msgCheckModal, setMsgCheckModal] = useState(false);
  const [messageReplyCheckFail, setMessageReplyCheckFail] = useState(false);
  // 전체 체크박스
  const [allCheckbox, setAllCheckbox] = useState(false);
  const handleAllCheck = () => {
    setAllCheckbox(!allCheckbox);
  };
  // 메세지 리스트 데이터
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

  // 수신 메세지 가져오기
  const getReceptionMsg = () => {
    ServiceFetch("/msg/msgbox", "post", {
      curPage: currentPageIdx,
    }).then((res) => {
      res.resultCode === "200" ? (
        setMessageList(res.result && res.result.msgList),
        setPgnInfo(res.result && res.result.pageItem)
      ) : res.resultCode === "301" ? (
        setModalFail(true)
      ) : setModalFail(true);
    }).catch((e) => {
      console.log(e);
    });
  };

  // 메세지 검색
  const getMsgSearch = () => {
    ServiceFetch("/msg/msgbox/search", "post", {
      keyword: searchValue,
      curPage: currentPageIdx,
      searchCondition: searchCategory,
    }).then((res) => {
      res.resultCode === "200" ? (
        res.result === null ? setMessageList([]) : setMessageList(res.result.msgList),
        res.result === null ? setPgnInfo({}) : setPgnInfo(res.result.pageItem),
        setMsgState(true)
      ) : res.resultCode === "301" ? (
        setModalFail(true)
      ) : setModalFail(true);
    }).catch((e) => {
      console.log(e);
    });
  };

  // 메세지 삭제
  const handleMsgDelete = () => {
    ServiceFetch("/msg/delete", "put", {
      msgIdxes: msgIdxes,
    }).then((res) => {
      res.resultCode === "200" ? (
        setMessageDeleteModal(false),
        setMessageList(res.result.msgList),
        setPgnInfo(res.result.pageItem),
        setMsgIdxes([]),
        setMsgdeleteSuccess(true)
      ) : res.resultCode === "301" ? (
        setModalFail(true)
      ) : setModalFail(true);
    }).catch((e) => {
      console.log(e);
    });
  };

  // 메세지 저장하기
  const msgSavePut = () => {
    setMsgModal(false);
    ServiceFetch("/msg/save", "put", {
      msgIdxes: msgIdxes,
    }).then((res) => {
      res.resultCode === "200" ? (
        setMessageSaveModal(false),
        setMessageList(res.result.msgList),
        setPgnInfo(res.result.pageItem),
        setMsgIdxes([]),
        setMsgSaveSuccess01(true),
        setAllCheckbox(false)
      ) : res.resultCode === "301" ? (
        setModalFail(true)
      ) : setModalFail(true);
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
        receiveUserId: receptionState.sendUserId ? receptionState.sendUserId : msgData[0].sendUserId,
        msgTitle: msgSendTitle,
        msgContents: editorData,
        msgIdx: receptionState.msgIdx ? receptionState.msgIdx : msgIdxes[0]
      }).then((res) => {
        res.resultCode === "200" ? (
          setMsgSendSuccess(true),
          setMessageReply(false),
          setEditorData(""),
          setMsgSendTitle(""),
          msgState ? getMsgSearch() : getReceptionMsg()
        ) : res.resultCode === "301" ? (
          setModalFail(true)
        ) : res.resultCode === "302" ? (
          setMsgSendFail(true)
        ) : setModalFail(true);
      }).catch((e) => {
        console.log(e);
      }).finally(() => {
        setIsSending(false); // 전송 완료
      });
    }
  };

  // 메세지 검색 이벤트
  const handleSearch = () => {
    currentPageIdx === 1
      ? getMsgSearch()
      : (setCurrentPageIdx(1), setMsgState(true));
  };

  // メッセージの内容保存
  const msgSaveSubmit = () => {
    ServiceFetch("/msg/tmpsave", "post", {
      msgContents: editorData,
    }).then((res) => {
      res.resultCode === "200" ? (
        setSaveMsgSuccess(true),
        localStorage.setItem("msgSendTitle", msgSendTitle)
      ) : res.resultCode === "302" ? (
        setSaveMsgFail01(true)
      ) : (
        setModalFail(true)
      );
    }).catch((e) => {
      console.log(e);
    });
  };
  // メッセージの内容保存 불러오기
  const msgSaveGet = () => {
    axios.get("/api/msg/tmpload", {
      headers: {
        accessToken: getCookie("accessToken"),
        lastLoginTime: getCookie("lastLoginTime"),
      },
      withCredentials: true,
    }).then((response) => {
      response.data.resultCode === "200" ? (
        setMsgSaveModal(true),
        setEditorData(response.data.result.templateContents ? response.data.result.templateContents : ""),
        setMsgSendTitle(localStorage.getItem("msgSendTitle"))
      ) : setModalFail(true);
    }).catch((error) => {
      console.error(error);
    });
  };

  // 초기 방 진입시 메시지 데이터 가져오기
  useEffect(() => {
    msgState ? getMsgSearch() : getReceptionMsg();
    setAllCheckbox(false);
  }, [currentPageIdx]);

  return (
    <>
      <div id="business" className="message-reception-business">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-sm">
            メッセージ箱
          </div>
          <div className="p-5">
            <div className="flex border-b-2 ">
              <button type="button" className="p-2 tab-btn tab-active">
                <Link to="/message-reception-business">受信メッセージ</Link>
              </button>
              <button type="button" className="p-2 tab-btn">
                <Link to="/message-sent-business">送信メッセージ</Link>
              </button>
              <button type="button" className="p-2 tab-btn">
                <Link to="/message-box-business">保管メッセージ</Link>
              </button>
            </div>

            <div className="mt-5">
              <div className="flex space-between">
                <div className="flex items-center gap-2">
                  <select
                    className="form-select w-32 lg:w-36 shrink-0"
                    onChange={(e) => setSearchCategory(e.target.value)}
                  >
                    <option value="20601">送信者</option>
                    <option value="20602">タイトル/内容</option>
                  </select>
                  <div className="search block">
                    <input
                      className="form-input form-control cu-search w-72 pr-12"
                      type="text"
                      placeholder="検索ワードを入力してください。"
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.code === "Enter") {
                          handleSearch();
                        }
                        return;
                      }}
                    />
                    <button
                      className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0"
                      onClick={handleSearch}
                    >
                      <img src={Search} alt="" />
                    </button>
                  </div>
                </div>
                  {
                    (messageList == null) || (messageList?.length == 0)
                    ? 
                    <div>
                      <button
                        className="btn btn-sm btn-pending w-24 mr-2" disabled={true}>
                        返信
                      </button>
                      <button
                        className="btn btn-sm btn-outline-pending w-24 mr-2" disabled={true}>
                        保管
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary w-24" disabled={true}>
                        削除
                      </button>
                    </div>
                    :
                    <div>
                      <button
                        className="btn btn-sm btn-pending w-24 mr-2"
                        onClick={() => {
                          msgIdxes.length < 1 ? setMessageReplyCheckFail(true) :
                            msgIdxes.length > 1 ? setMessageReplyFail(true) :
                              setMessageReply(true);
                        }}
                      >
                        返信
                      </button>
                      <button
                        className="btn btn-sm btn-outline-pending w-24 mr-2"
                        onClick={() => {
                          msgIdxes.length > 0
                            ? setMessageSaveModal(true)
                            : setMsgCheckModal(true);
                        }}
                      >
                        保管
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary w-24"
                        onClick={() => {
                          msgIdxes.length > 0
                            ? setMessageDeleteModal(true)
                            : setMsgCheckModal(true);
                        }}
                      >
                        削除
                      </button>
                    </div>
                  }
              </div>
              {/* 테이블 10줄 */}
              <table className="table mt-5">
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
                    <th className="whitespace-nowrap">送信者</th>
                    <th className="whitespace-nowrap">タイトル</th>
                    <th className="whitespace-nowrap">受信時間</th>
                    <th className="whitespace-nowrap">返信</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {messageList?.length > 0 ? (
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
                          msgData={msgData}
                          setMsgData={setMsgData}
                        />
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5}>表示できるメッセージがありません。</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {
          messageList && (
            <Pagination
              pgnInfo={pgnInfo}
              currentPageIdx={currentPageIdx}
              setCurrentPageIdx={setCurrentPageIdx}
            />
          )
        }
      </div>

      {/* ***************** 모달 시작 ***************** */}
      {/* ********* 메시지 보관 ********* */}
      <Modal
        backdrop="static"
        show={messageSaveModal}
        onHidden={() => {
          setMessageSaveModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">メッセージを保管します。</div>
          <div className="modal-subtit">
            選択されたメッセージを保存しました。
            <br />
            保存メッセージに移動されました。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-pending"
              onClick={() => msgSavePut()}
            >
              確認
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                setMessageSaveModal(false);
                setAllCheckbox(false);
              }}
            >
              キャンセル
            </a>
          </div>
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
              className="btn btn-business"
              onClick={() => {
                setMsgSaveSuccess01(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* ********* 메시지 삭제 ********* */}
      <Modal
        show={messageDeleteModal}
        onHidden={() => {
          setMessageDeleteModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">メッセージを削除しますか？</div>
          <div className="modal-subtit">
            削除されたメッセージは復元できません。
            <br />
            削除前に慎重に考えてください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-pending"
              onClick={() => handleMsgDelete()}
            >
              確認
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                setMessageDeleteModal(false);
                setAllCheckbox(false);
              }}
            >
              キャンセル
            </a>
          </div>
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
          <div className="modal-subtit">メッセージが削除されました。</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setMsgdeleteSuccess(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* ********* 메시지 내용 ********* */}
      <Modal
        size="modal-lg"
        backdrop="static"
        show={msgModal}
        onHidden={() => {
          setMsgModal(false);
        }}
      >
        <a
          onClick={() => {
            setReceptionState({});
            setMsgModal(false);
          }}
          className="absolute right-0 top-0 mt-3 mr-3"
          href="#"
        >
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
            <span className="text-slate-400 font-normal mr-2 inline-block w-24">
              送信者
            </span>
            {receptionState.nickname}
          </div>
        </ModalHeader>
        <ModalBody className="p-5">
          <div id="detail-cont" className="border-b pb-5 message_area">
            <div
              dangerouslySetInnerHTML={{ __html: receptionState.msgContents }}
            />
          </div>
          <div id="detail-modal-btn" className="flex gap-2 space-between pt-5">
            <button
              type="button"
              onClick={() => {
                setMsgIdxes([...msgIdxes, receptionState.msgIdx]);
                setMessageSaveModal(true);
              }}
              className="btn btn-sm btn-outline-pending w-24"
            >
              保管
            </button>
            <button
              type="button"
              onClick={() => {
                setMessageReply(true);
                setMsgModal(false);
              }}
              className="btn btn-sm btn-pending w-24"
            >
              返信
            </button>
          </div>
        </ModalBody>
      </Modal>

      {/* ********* 답장 ********* */}
      <Modal
        size="modal-lg"
        backdrop="static"
        show={messageReplyModal}
        onHidden={() => {
          setMessageReply(false);
          setEditorData("");
          setMsgSendTitle("");
        }}
      >
        <a
          onClick={() => {
            setMessageReply(false);
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
            <span className="text-slate-400 font-normal mr-2 inline-block w-24">
              受信者
            </span>
            {receptionState.nickname ? receptionState.nickname : msgData[0] && msgData[0].nickname}
          </h2>
          <div
            id="reply-title"
            className="font-normal text-base mr-auto pt-3 w-full"
          >
            <span className="text-slate-400 font-normal mr-2 inline-block w-24">
              タイトル
            </span>
            <span className="relative">
              <input
                type="text"
                placeholder="タイトルを入力してください。"
                value={msgSendTitle}
                onChange={(e) => setMsgSendTitle(e.target.value)}
              />
              <span className="limit-wrap text-slate-400">
                <span className="text-slate-400">{msgSendTitle.length}</span><span className="word-limit text-slate-400">/200</span>
              </span>
            </span>
          </div>
        </ModalHeader>
        <ModalBody className="p-5">
          <div id="detail-cont" className="border-b pb-5">
            <ClassicEditor value={editorData} onChange={setEditorData} />
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
              >
                内容保存
              </button>
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
              >
                内容を呼び出す
              </button>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-pending w-24"
              onClick={msgSend}
            >
              送信
            </button>
          </div>
        </ModalFooter>
      </Modal >
      {/* 메세지 전송 성공 모달 */}
      <Modal Modal
        show={msgSendSuccess}
        onHidden={() => {
          setMsgSendSuccess(false);
        }
        }
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">送信成功</div>
          <div className="modal-subtit">
            メッセージを送信しました。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setMsgSendSuccess(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal >
      {/* 메세지 전송 실패 모달 */}
      < Modal
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
              className="btn btn-business"
              onClick={() => {
                setMsgSendFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal >

      {/* メッセージの内容保存 성공 */}
      < Modal
        show={msgSaveSuccess}
        onHidden={() => {
          setSaveMsgSuccess(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">メッセージの内容保存</div>
          <div className="modal-subtit">メッセージの内容を保存しました。</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setSaveMsgSuccess(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal >
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
              href="#"
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
      {/* 체크 인지 모달 */}
      <Modal
        show={messageReplyFail}
        onHidden={() => {
          setMessageReplyFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">選択確認</div>
          <div className="modal-subtit">メッセージを１つだけ選択してください。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-business"
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
              className="btn btn-business"
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
          <div className="modal-subtit">メッセージを１つ以上選択してください。</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
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
      {/* ***************** 모달 끝 ***************** */}
    </>
  );
}

export default MessageReceptionBusiness;
