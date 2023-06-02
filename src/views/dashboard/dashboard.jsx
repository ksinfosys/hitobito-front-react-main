import { Lucide, Modal, ModalBody, ModalHeader } from "@/base-components";
import { useEffect, useState } from "react";
import DashboardList from "../../components/dashboard-cont-list/dashboard-list";
import DashboardMobile from "../../components/dashboard-mobile/dashboard-mobile";

import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { useRecoilState } from "recoil";
import { userInfo } from "../../stores/user-info";

import Pagination from "../../components/pagination";
import ServiceFetch from "../../../util/ServiceFetch";
import { isMobile } from "react-device-detect";
import { filter, throttle } from "lodash";

const Dashboard = () => {

  /* ********** 공통으로 사용되는 State 시작 ********** */
  const [infoStatus, setInfoStatus] = useState(false);
  const [failModal, setFailModal] = useState(false);
  /* ********** 공통으로 사용되는 State 끝 ********** */

  /* ********** 면접제의확인 List API 시작 ********** */
  // 면접제의 리스트 State
  const [cpList, setCpList] = useState([])
  const [reginfo, setReginfo] = useState({})
  // 페이지 네비게이션
  const [pgnInfo, setPgnInfo] = useState({});
  const [currentPageIdx, setCurrentPageIdx] = useState(1);
  // 전체 체크 박스 상태체크
  const [allCheckState, setAllCheckState] = useState(false);
  const [idx, setIdx] = useState([]);
  // 모달
  const [listFailModal01, setListFailModal01] = useState(false);
  const [listFailModal02, setListFailModal02] = useState(false);
  // 면접제의확인 List API
  const getList = () => {
    ServiceFetch('/interview/list', 'post', {
      curPage: currentPageIdx,
    }).then(res => {
      res.resultCode === '200' ? (
        setCpList(res.result.iList),
        setReginfo(res.result.regiInfoDto),
        setPgnInfo(res.result.pageItem)
      ) : res.resultCode === '231' ? (
        setListFailModal02(true)
      ) : (
        setFailModal(true)
      )
    }).catch(e => {
      console.log(e);
    })
  };
  /* ********** 면접제의확인 List API 끝 ********** */

  /* ********** 면접제의확인 승낙 관련 Accept API 시작 ********** */
  // 면접제의확인 승낙 모달 케이스
  const [acceptCheck, setAcceptCheck] = useState(false);
  const [acceptSuccess, setAcceptSuccess] = useState(false);
  const [accept713, setAccept713] = useState(false);
  const [accept714, setAccept714] = useState(false);
  const [accept706, setAccept706] = useState(false);
  // 면접제의확인 승낙 API
  const accept = () => {
    ServiceFetch('/interview/accept', 'put', {
      requestList: idx,
    }).then(res => {
      setAcceptCheck(false);
      setIdx([]);
      const { resultCode } = res;
      resultCode === "200" ? (
        setAcceptSuccess(true),
        setInfoStatus(!infoStatus)
      ) : resultCode === "713" ? setAccept713(true) :
        resultCode === "714" ? setAccept714(true) :
          resultCode === "706" ? setAccept706(true) : setFailModal(true);

    }).catch(e => {
      console.log(e);
    })
  };
  /* ********** 면접제의확인 승낙 관련 Accept API 끝 ********** */

  /* ********** 면접제의 거부 Reject API 시작 ********** */
  // 면접제의 거부 모달 케이스
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectSuccessModal, setRejectSuccessModal] = useState(false);
  const [rejectFailModal, setRejectFailModal] = useState(false);
  // reject State
  const [rejectState, setRejectState] = useState({});

  // 면접제의 거부 API
  const reject = () => {
    ServiceFetch('/interview/reject', 'put', rejectState
    ).then(res => {
      res.resultCode === '200' ? (
        setRejectSuccessModal(true)
      ) : res.resultCode === '707' ? (
        setRejectFailModal(true)
      ) : (
        setFailModal(true)
      )
    }).catch(e => {
      console.log(e);
    })
  };
  /* ********** 면접제의확인 승낙 관련 Accept API 끝 ********** */

  /* ********** 신고리스트 API 시작 ********** */
  // 신고 모달
  const [reportRequestModal, setreportRequestModal] = useState(false);
  const [reportReasonList, setReportReasonList] = useState([]);
  const [reportRequestModal1, setreportRequestModal1] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportModal02, setReportModal02] = useState(false);
  // userInfo
  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);
  // 신고 대상자
  const [declarationUser, setDeclarationUser] = useState([]);
  const [declarationUserRj, setDeclarationUserRj] = useState([]);
  
  const reportGet = () => {
      axios.get('/api/report/list', {
          headers: {
              accessToken: getCookie("accessToken"),
              lastLoginTime: getCookie("lastLoginTime"),
          },
          withCredentials: true,
      }).then((response) => {
          setReportReasonList(response.data.result.reportReasonList)
      }).catch((error) => {
          console.error(error);
      });
  };
  useEffect(() => {
      reportGet()
  }, [])
  // 신고 데이터
  const [declaration, setDeclaration] = useState({});
  // 신고 체크 모달
  const [reportCheckModal, setReportCheckModal] = useState(false);
  // 신고하기 API
  const reportSubmit = () => {
      !declaration.reportReasonCode ? setReportCheckModal(true) :
      declaration.reportReasonCode !== '14' ? (
          ServiceFetch("/report/jobseeker", "post", declaration
          ).then((res) => {
              setreportRequestModal1(false);
              setReportModal(true);
              setDeclaration({ ...declaration, reportReasonContent: "" })
          }).catch((e) => {
              console.log(e);
          })
          )
          : !declaration.reportReasonContent ? setReportModal02(true) : (
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

  /* ********** 신고리스트 API 끝 ********** */


  /* ********** 면접제의확인 List API Mobile 시작 ********** */
  // 면접제의확인 List API Mobile
  // 면접제의 리스트 State Mobile
  // const [cpListMob, setCpListMob] = useState([
  //       {
  //                 rqIdx: 3364,
  //                 cpUserId: "C0000882",
  //                 cpUserName: "相模ゴム工業株式会社",
  //                 srchId: "S0003364",
  //                 rqSendDatetime: "2023-01-22T00:17:53.640+00:00",
  //                 rqLimitDatetime: "2023-01-23T00:17:53.640+00:00",
  //                 rqStatus: "20102",
  //                 pointStatus: "21102",
  //                 checkTodayOrNotForDeadLine:true,
  //                 rqLimitDatetimeToString: "2023-01-23 9:17 午前",
  //                 rqSendDatetimeToString: "01/22/2023",
  //                 progressBarValue: "1600.00",
  //                 representFlag: []
  //             },
  //             {
  //                 rqIdx: 3666,
  //                 cpUserId: "C0003396",
  //                 cpUserName: "nrsuvim",
  //                 srchId: "S0003666",
  //                 rqSendDatetime: "2023-01-22T05:19:53.640+00:00",
  //                 rqLimitDatetime: "2023-01-23T05:19:53.640+00:00",
  //                 rqStatus: "20102",
  //                 pointStatus: "21103",
  //                 checkTodayOrNotForDeadLine: false,
  //                 rqLimitDatetimeToString: "2023-01-23 2:19 午後",
  //                 rqSendDatetimeToString: "01/22/2023",
  //                 progressBarValue: "1600.00",
  //                 representFlag: [
  //                     "ageName"
  //                 ]
  //             },
  //             {
  //                 rqIdx: 2315,
  //                 cpUserId: "C0001120",
  //                 cpUserName: "ヒーハイスト株式会社",
  //                 srchId: "S0002315",
  //                 rqSendDatetime: "2023-01-21T06:48:53.640+00:00",
  //                 rqLimitDatetime: "2023-01-23T06:48:53.640+00:00",
  //                 rqStatus: "20102",
  //                 pointStatus: "21105",
  //                 checkTodayOrNotForDeadLine: false,
  //                 rqLimitDatetimeToString: "2023-01-23 3:48 午後",
  //                 rqSendDatetimeToString: "01/21/2023",
  //                 progressBarValue: "850.00",
  //                 representFlag: [
  //                     "ageName"
  //                 ]
  //             },
  //             {
  //                 rqIdx: 1169,
  //                 cpUserId: "C0001787",
  //                 cpUserName: "株式会社ハマキョウレックス",
  //                 srchId: "S0001169",
  //                 rqSendDatetime: "2023-01-20T11:42:53.640+00:00",
  //                 rqLimitDatetime: "2023-01-23T11:42:53.640+00:00",
  //                 rqStatus: "20102",
  //                 pointStatus: "21106",
  //                 checkTodayOrNotForDeadLine: false,
  //                 rqLimitDatetimeToString: "2023-01-23 8:42 午後",
  //                 rqSendDatetimeToString: "01/20/2023",
  //                 progressBarValue: "600.00",
  //                 representFlag: [
  //                     "projectProcessNameArr0",
  //                     "careerName"
  //                 ]
  //             },
  //             {
  //                 rqIdx: 2885,
  //                 cpUserId: "C0004787",
  //                 cpUserName: "izlojnk",
  //                 srchId: "S0002885",
  //                 rqSendDatetime: "2023-01-21T16:18:53.640+00:00",
  //                 rqLimitDatetime: "2023-01-23T16:18:53.640+00:00",
  //                 rqStatus: "20102",
  //                 pointStatus: "21107",
  //                 checkTodayOrNotForDeadLine: false,
  //                 rqLimitDatetimeToString: "2023-01-24 1:18 午前",
  //                 rqSendDatetimeToString: "01/22/2023",
  //                 progressBarValue: "800.00",
  //                 representFlag: [
  //                     "ageName",
  //                     "careerName"
  //                 ]
  //             },
  //             {
  //                 rqIdx: 4331,
  //                 cpUserId: "C0001842",
  //                 cpUserName: "三菱倉庫株式会社",
  //                 srchId: "S0004331",
  //                 rqSendDatetime: "2023-01-22T16:24:53.640+00:00",
  //                 rqLimitDatetime: "2023-01-23T16:24:53.640+00:00",
  //                 rqStatus: "20101",
  //                 pointStatus: "21102",
  //                 checkTodayOrNotForDeadLine: false,
  //                 rqLimitDatetimeToString: "2023-01-24 1:24 午前",
  //                 rqSendDatetimeToString: "01/23/2023",
  //                 progressBarValue: "1500.00",
  //                 representFlag: [
  //                     "hopeIncomeName",
  //                     "ageName"
  //                 ]
  //             },
  //             {
  //                 rqIdx: 3824,
  //                 cpUserId: "C0001575",
  //                 cpUserName: "株式会社スクロール",
  //                 srchId: "S0003824",
  //                 rqSendDatetime: "2023-01-22T07:57:53.640+00:00",
  //                 rqLimitDatetime: "2023-01-24T07:57:53.640+00:00",
  //                 rqStatus: "20102",
  //                 pointStatus: "21102",
  //                 checkTodayOrNotForDeadLine: false,
  //                 rqLimitDatetimeToString: "2023-01-24 4:57 午後",
  //                 rqSendDatetimeToString: "01/22/2023",
  //                 progressBarValue: "800.00",
  //                 representFlag: []
  //             },
  //             {
  //                 rqIdx: 4577,
  //                 cpUserId: "C0002691",
  //                 cpUserName: "wulu_c_",
  //                 srchId: "S0004577",
  //                 rqSendDatetime: "2023-01-22T20:30:53.640+00:00",
  //                 rqLimitDatetime: "2023-01-24T20:30:53.640+00:00",
  //                 rqStatus: "20102",
  //                 pointStatus: "21102",
  //                 checkTodayOrNotForDeadLine: false,
  //                 rqLimitDatetimeToString: "2023-01-25 5:30 午前",
  //                 rqSendDatetimeToString: "01/23/2023",
  //                 progressBarValue: "750.00",
  //                 representFlag: []
  //             },
  //             {
  //                 rqIdx: 5244,
  //                 cpUserId: "C0004785",
  //                 cpUserName: "zbltkry",
  //                 srchId: "S0005244",
  //                 rqSendDatetime: "2023-01-23T07:37:53.640+00:00",
  //                 rqLimitDatetime: "2023-01-26T07:37:53.640+00:00",
  //                 rqStatus: "20102",
  //                 pointStatus: "21102",
  //                 checkTodayOrNotForDeadLine: false,
  //                 rqLimitDatetimeToString: "2023-01-26 4:37 午後",
  //                 rqSendDatetimeToString: "01/23/2023",
  //                 progressBarValue: "500.00",
  //                 representFlag: [
  //                     "ageName"
  //                 ]
  //             },
  //             {
  //                 rqIdx: 5361,
  //                 cpUserId: "C0004009",
  //                 cpUserName: "llnegsb",
  //                 srchId: "S0005361",
  //                 rqSendDatetime: "2023-01-23T09:34:53.640+00:00",
  //                 rqLimitDatetime: "2023-01-26T09:34:53.640+00:00",
  //                 rqStatus: "20102",
  //                 pointStatus: "21102",
  //                 checkTodayOrNotForDeadLine: false,
  //                 rqLimitDatetimeToString: "2023-01-26 6:34 午後",
  //                 rqSendDatetimeToString: "01/23/2023",
  //                 progressBarValue: "500.00",
  //                 representFlag: [
  //                     "ageName"
  //                 ]
  //             }
  // ])
  const [cpListMob, setCpListMob] = useState([])
  const [reginfoMob, setReginfoMob] = useState([])

  const getListMob = () => {
    ServiceFetch('/app/interview/list', 'post', {
    }).then(res => {
      res.resultCode === '200' ? (
        setCpListMob(res.result.iList),
        setReginfoMob(res.result.regiInfoDto)
      ) : res.resultCode === '231' ? (
        setListFailModal02(true)
      ) : res.resultCode === '723' ? (
        setListFailModal01(true)
      ) : (
        setFailModal(true)
      )
    }).catch(e => {
      console.log(e);
    })
  };
  /* ********** 면접제의확인 List API Mobile 끝 ********** */

  // 모바일 프로그레스바 색 정하기
  const handleProgressClassNameMob = (checkTodayOrNotForDeadLine) => {
    if (checkTodayOrNotForDeadLine) {
      // 오늘이거나 값이 1600이상일때
      return 'bg-danger'
    } else {
      return 'bg-green'
    }
  }

  // 초기 방 진입시 리스트 데이터 가져오기.
  useEffect(() => {
    !isMobile ? getList() : getListMob();
    setAllCheckState(false)
    setIdx([])
  }, [currentPageIdx, infoStatus]);

  /* ********** 스크롤 구현 시작 ********** */
  const handleScroll = throttle(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    // console.log(scrollTop, scrollHeight)
    if (scrollTop + clientHeight >= scrollHeight) {
      isMobile && console.log(1);
    }
  }, 300);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  /* ********** 스크롤 구현 끝 ********** */

  const acceptCloseModal = () => {
    setAcceptCheck(false);
    setDeclarationUser([]);
  };

  const acceptNoCloseModal = () => {
    setIdx([]); 
    setAllCheckState(false); 
    setAcceptCheck(false); 
    setDeclarationUser([]);
  };

  const rejectCloseModal = () => {
    setRejectModal(false);
    setDeclarationUserRj([]);
  };

  const rejectNoCloseModal = () => {
    setRejectState({})
    setAllCheckState(false); 
    setRejectModal(false);
    setDeclarationUserRj([]);
  };

  return (
    <>
      <div className="dashboard">
        <div className="box-type-default hidden lg:block">
          <div className="dashboard-top p-5 border-b border-slate-200/60 text-sm">
            面談依頼リスト
          </div>
          <div className="dashboard-cont">
            <div className="flex items-center dashboard-cont-tit">
              <div className="form-check w-24">
                <input
                  id="vertical-form-3"
                  className="form-check-input"
                  type="checkbox"
                  checked={allCheckState}
                  onChange={() => setAllCheckState(!allCheckState)}
                />
                <label className="form-check-label" htmlFor="vertical-form-3">
                  一括選択
                </label>
              </div>
              <div className="dashboard-tit-list ml-auto flex flex-center w-full">
                LIST
              </div>
            </div>
            {
              cpList?.length > 0 ? cpList.map((item, key) => {
                return (
                  <DashboardList
                    key={key}
                    index={key}
                    item={item}
                    info={reginfo}
                    allCheckState={allCheckState}
                    idx={idx}
                    setIdx={setIdx}
                    setAcceptCheck={setAcceptCheck}
                    setRejectModal={setRejectModal}
                    rejectState={rejectState}
                    setRejectState={setRejectState}
                    infoStatus={infoStatus}
                    setInfoStatus={setInfoStatus}
                    declaration={declaration}
                    setDeclaration={setDeclaration}
                    setDeclarationUser={setDeclarationUser}
                    setDeclarationUserRj={setDeclarationUserRj}
                    setreportRequestModal1={setreportRequestModal1}
                  />
                )
              }) : (
                <div className="dashboard-cont-cont flex flex-center">
                  履歴が存在しません。
                </div>
              )
            }
            <div className="all-btn-wrap flex">
              <button className="btn btn-sm btn-primary" onClick={() => {
                setAcceptCheck(true);
                }}>依頼を承諾</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setRejectModal(true)}>
                依頼を拒否
              </button>
            </div>
          </div>
        </div>
        <div className="mobile-dashboard lg:hidden">
          <div className="mobile-top-btn-box flex items-center space-between">
            <div className="flex gap-2">
              <button className="btn btn-sm btn-primary" onClick={() => setAcceptCheck(true)}>
                依頼を承諾
              </button>
              <button className="btn btn-sm btn-skyblue">依頼を拒否</button>
              <button className="btn btn-sm btn-outline-secondary">削除</button>
            </div>
            <div className="check-btn-wrap">
              <div className="check-all">
                <input
                  id="all1"
                  className="form-check-input"
                  type="checkbox"
                  checked={allCheckState}
                  onChange={() => setAllCheckState(!allCheckState)}
                />
                <label className="form-check-label" htmlFor="all1">
                  allCheck
                </label>
              </div>
            </div>
          </div>
          {
            cpListMob?.length > 0 ? (
              cpListMob.map((item, index) => {
                return (
                  <DashboardMobile
                    key={index}
                    index={index}
                    item={item}
                    info={reginfoMob}
                    progress={`progress-bar ${handleProgressClassNameMob(item.checkTodayOrNotForDeadLine)}`}
                    checkid={item.rqIdx}
                    allCheckState={allCheckState}
                    idx={idx}
                    setIdx={setIdx}
                    setAcceptCheck={setAcceptCheck}
                    setRejectModal={setRejectModal}
                    rejectState={rejectState}
                    setRejectState={setRejectState}
                    infoStatus={infoStatus}
                    setInfoStatus={setInfoStatus}
                  />
                )
              })
            ) : (
              // 데이터 없을시
              <div className="dashboard-cont-cont flex flex-center">
                履歴が存在しません。
              </div>
            )
          }

        </div>
        {
          cpList?.length > 0 &&
          <Pagination
            pgnInfo={pgnInfo}
            currentPageIdx={currentPageIdx}
            setCurrentPageIdx={setCurrentPageIdx}
          />
        }
      </div>

      {/* ****************** 신고 모달 시작 ****************** */}
      <Modal
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
                      通報の対象者 : {declarationUser}
                  </div>
                  <div className="modal-subtit2">
                      通報者 : {userInfoV.userNickName}
                  </div>
              </div>
              <div className="report-radio-wrap mt-4">
                  {
                      reportReasonList?.length > 0 && reportReasonList.map((report, index) => {
                          console.log()
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
                                        if(e.target.value === "14"){
                                          inputarea.disabled = false;
                                        }else if(e.target.value !== "14"){
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
                  placeholder="通の報理由を具体的に記入してください。"
                  disabled
                  onChange={(e) => setDeclaration({ ...declaration, reportReasonContent: e.target.value })}
              ></textarea>
              <div className="flex flex-end mt-4">
                  <a
                      href="#"
                      className="btn btn-primary btn-report"
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
      </Modal>
      {/* 신고 체크 모달 */}
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
                      className="btn btn-primary"
                      onClick={() => {
                          setReportModal02(false);
                      }}
                  >
                      確認
                  </a>
              </div>
          </ModalBody>
      </Modal>
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
                      className="btn btn-primary"
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
                      href="#"
                      className="btn btn-primary"
                      onClick={() => {
                          setReportModal(false);
                      }}
                  >
                      確認
                  </a>
              </div>
          </ModalBody>
      </Modal>
      <Modal className="report-request-modal"
          show={reportRequestModal}
          onHidden={() => {
              setreportRequestModal(false);
          }}
      >
          <ModalBody className="p-10 text-center">
              <div className="modal-tit">通報が完了しました。</div>
              <div className="modal-subtit">
                  正常に通報を受け付けました。
                  処理が完了するまで少々お待ちください。
              </div>
              <div className="flex flex-end gap-3">
                  <a
                      href="#"
                      className="btn btn-primary"
                      onClick={() => {
                          setreportRequestModal(false);
                          setreportRequestModal1(false);
                      }}
                  >
                      確認
                  </a>
              </div>
          </ModalBody>
      </Modal>
      {/* ****************** 신고 모달 끝 ****************** */}

      {/* ****************** 면접제의 리스트 API 모달 시작 ****************** */}
      <Modal
        show={listFailModal01}
        onHidden={() => { setListFailModal01(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">要請失敗</div>
          <div className="modal-subtit">
            面談依頼の履歴がありません。
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-primary"
              onClick={() => { setListFailModal01(false); }}
            >確認</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        show={listFailModal02}
        onHidden={() => { setListFailModal02(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">要請失敗</div>
          <div className="modal-subtit">
            利用停止中です。 メニューを選択するには制限があります。 <br />
            いつでも利用を再開することは可能です。
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-primary"
              onClick={() => { setListFailModal02(false); }}
            >確認</a>
          </div>
        </ModalBody>
      </Modal>
      {/* ****************** 면접제의확인 리스트 API 모달 끝 ****************** */}

      {/* ****************** 면담제의확인 Accept API 모달 시작 ****************** */}
      <Modal
        show={acceptCheck}
        onHidden={acceptCloseModal}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">面談承諾</div>
          {declarationUser.length === 1 ?
          <div className="modal-subtit">
            選択した企業 
            <strong>'{declarationUser}'</strong>社の
            <br/>
            面談依頼を承諾しますか？
          </div>
          : declarationUser.length === 0 ?
          <div className="modal-subtit">
            1つ以上の面談を選択してください。
          </div>     
          :
          <div className="modal-subtit">
            選択した<strong>複数の企業</strong>面談依頼を承諾しますか？
          </div>     
          } 
          {declarationUser.length === 1  ?
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-primary"
              onClick={accept}
            >面談承諾</a>
            <a
              className="btn btn-outline-secondary"
              onClick={acceptNoCloseModal}
            >いいえ</a>
          </div>
          : declarationUser.length === 0 ?
          <div className="flex flex-end gap-3">
          <a className="btn btn-primary" onClick={acceptNoCloseModal}>確認</a>
          </div>
          :
          <div className="flex flex-end gap-3">
          <a
            className="btn btn-primary"
            onClick={accept}
          >面談承諾</a>
          <a
            className="btn btn-outline-secondary"
            onClick={acceptNoCloseModal}
          >いいえ</a>
          </div>
          }
        </ModalBody>
      </Modal>
      <Modal
        show={acceptSuccess}
        onHidden={() => { setAcceptSuccess(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">承認完了</div>
          <div className="modal-subtit">
            面談を承認しました。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-primary" onClick={() => setAcceptSuccess(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        show={accept713}
        onHidden={() => { setAccept713(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">承認失敗</div>
          <div className="modal-subtit">
            1つ以上の面談を選択してください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-primary" onClick={() => setAccept713(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        show={accept714}
        onHidden={() => { setAccept714(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">承認失敗</div>
          <div className="modal-subtit">
            面談の承認期限が過ぎました。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-primary" onClick={() => setAccept714(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        show={accept706}
        onHidden={() => { setAccept706(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">承認失敗</div>
          <div className="modal-subtit">
            面談の承認に失敗しました。もう一度試してください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-primary" onClick={() => setAccept706(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>
      {/* ****************** 면담제의확인 Accept API 모달 끝 ****************** */}

      {/* ****************** 면접제의 거부 Reject API 모달 시작 ****************** */}
      <Modal
        show={rejectModal}
        onHidden={rejectCloseModal}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">面談可否</div>
          {declarationUserRj.length === 0 ?
          <div className="modal-subtit">
            1つ以上の面談を選択してください。
          </div>
          :
          <div className="modal-subtit">
            面談を拒否しますか？
          </div>          
          }
          {declarationUserRj.length === 0 ?
          <div className="flex flex-end gap-3">
          <a className="btn btn-primary" onClick={rejectNoCloseModal}>確認</a>
          </div>
          :
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-primary"
              onClick={() => { reject(); setRejectModal(false); }}
            >はい</a>
            <a
              className="btn btn-outline-secondary"
              onClick={rejectNoCloseModal}
            >いいえ</a>
          </div>
          }
        </ModalBody>
      </Modal>
      <Modal
        show={rejectSuccessModal}
        onHidden={() => { setRejectSuccessModal(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">面談拒否成功</div>
          <div className="modal-subtit">
            面談の拒否に成功しました。
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-primary"
              onClick={() => { 
                setRejectSuccessModal(false)
                , window.location.reload() 
              }}
            >確認</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        show={rejectFailModal}
        onHidden={() => { setRejectFailModal(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">面談拒否失敗</div>
          <div className="modal-subtit">
            面談の拒否に失敗しました。もう一度試してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-primary"
              onClick={() => { setRejectFailModal(false) }}
            >確認</a>
          </div>
        </ModalBody>
      </Modal>
      {/* ****************** 면접제의확인 Accept API 모달 끝 ****************** */}

      {/* 공통 실패 모달 */}
      <Modal
        className="point-request-modal"
        show={failModal}
        onHidden={() => { setFailModal(false) }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">問題発生</div>
          <div className="modal-subtit">
            処理中に問題が発生しました。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => { setFailModal(false) }}
            >確認</a>
          </div>
        </ModalBody>
      </Modal>

    </>
  );
};
export default Dashboard;
