import { Lucide, Modal, ModalBody, ModalHeader } from "@/base-components";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MoArrowDown from "@/assets/images/mo-arrow-down.svg";
import {
  replaceSlashToHypen,
  todayReplaceSlashToHypen,
} from "../../utils/utils";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { useRecoilState } from "recoil";
import ServiceFetch from "../../../util/ServiceFetch";
import { userInfo } from "../../stores/user-info";

const DashboardMobile = (props) => {
  const [isActive2, setIsActive2] = useState(false);

  /* ********* 공통 실패 모달 시작 ********* */
  const [failModal, setFailModal] = useState(false);
  /* ********* 공통 실패 모달 끝 ********* */

  /* ********* 체크 박스 상태 시작 ********* */
  const requestText = "requestMap" + props.index;
  const [checkState, setCheckState] = useState(false);
  const handleCheckChange = (id) => {
    const updatedCheckState = !checkState;
    setCheckState(updatedCheckState);
    if (updatedCheckState && !props.idx.includes(id)) {
      props.setIdx([...props.idx, id]);
      seteBgColor(true);
      setBorderColor(true);
    } else if (!updatedCheckState && props.idx.includes(id)) {
      props.setIdx(props.idx.filter((value) => value !== id));
      seteBgColor(false);
      setBorderColor(false);
    }
    if (updatedCheckState && !props.rejectState[requestText]) {
      props.setRejectState({
        ...props.rejectState,
        [requestText]: {
          rqIdx: props.item.rqIdx,
          cpUserId: props.item.cpUserId,
          cpPointIdx: props.item.cpPointIdx,
        },
      });
    } else if (!updatedCheckState && props.rejectState[requestText]) {
      const updatedRejectState = { ...props.rejectState };
      delete updatedRejectState[requestText];
      props.setRejectState(updatedRejectState);
    }
  };
  useEffect(() => {
    props.allCheckState
      ? (setCheckState(true),
        props.setIdx((prev) => [...prev, props.item.rqIdx]),
        seteBgColor(true),
        setBorderColor(true),
        props.setRejectState({
          ...props.rejectState,
          [requestText]: {
            rqIdx: props.item.rqIdx,
            cpUserId: props.item.cpUserId,
            cpPointIdx: props.item.cpPointIdx,
          },
        }))
      : (setCheckState(false),
        props.setIdx([]),
        seteBgColor(false),
        setBorderColor(false),
        props.setRejectState({}));
  }, [props.allCheckState]);

  // 거절 Evnet
  const handleReject = () => {
    const requestText = "requestMap" + props.index;
    props.setRejectState({
      ...props.rejectState,
      [requestText]: {
        rqIdx: props.item.rqIdx,
        cpUserId: props.item.cpUserId,
        cpPointIdx: props.item.cpPointIdx,
      },
    });
    props.setRejectModal(true);
  };
  /* ********* 체크 박스 상태 끝 ********* */

  /* ********** 면접제의 승낙취소 API 시작 ********** */
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelSuccessModal, setCancelSuccessModal] = useState(false);
  const acceptCancel = () => {
    ServiceFetch("/interview/accept/cancel", "put", {
      rqIdx: props.item.rqIdx,
    })
      .then((res) => {
        res.resultCode === "200"
          ? (setCancelModal(false),
            setCancelSuccessModal(true),
            props.setInfoStatus(!props.infoStatus))
          : res.resultCode === "713"
          ? setFailModal(true)
          : setFailModal(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleAcceptCancel = () => {
    setCancelModal(true);
  };
  /* ********** 면접제의 승낙취소 API 끝 ********** */

  /* ********** 포인트지급요청 API 시작 ********** */
  const [pointRequestModal, setpointRequestModal] = useState(false);
  const [pointRequestSuccessModal, setpointRequestSuccessModal] =
    useState(false);
  const [pointRequestFailModal, setpointRequestFailModal] = useState(false);
  const pointRequest = () => {
    ServiceFetch("/interview/request", "put", {
      rqIdx: props.item.rqIdx,
    })
      .then((res) => {
        res.resultCode === "200"
          ? (setpointRequestModal(false),
            setpointRequestSuccessModal(true),
            props.setInfoStatus(!props.infoStatus))
          : res.resultCode === "715"
          ? setpointRequestFailModal(true)
          : setFailModal(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  /* ********** 포인트지급요청 API 끝 ********** */

  /* ********** 신고리스트 API 시작 ********** */
  // 신고 모달
  const [reportReasonList, setReportReasonList] = useState([]);
  const [reportRequestModal1, setreportRequestModal1] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  // userInfo
  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);
  // 신고 대상자
  const [declarationUser, setDeclarationUser] = useState("");
  const reportGet = () => {
    axios
      .get("/api/report/list", {
        headers: {
          accessToken: getCookie("accessToken"),
          lastLoginTime: getCookie("lastLoginTime"),
        },
        withCredentials: true,
      })
      .then((response) => {
        setReportReasonList(response.data.result.reportReasonList);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    reportGet();
    setDeclarationUser(props.item.cpUserName);
  }, []);
  // 신고 데이터
  const [declaration, setDeclaration] = useState({});
  // 신고 체크 모달
  const [reportCheckModal, setReportCheckModal] = useState(false);
  // 신고하기 API
  const reportSubmit = () => {
    !declaration.reportReasonCode
      ? setReportCheckModal(true)
      : ServiceFetch("/report/jobseeker", "post", declaration)
          .then((res) => {
            setreportRequestModal1(false);
            setReportModal(true);
            setDeclaration({ ...declaration, reportReasonContent: "" });
          })
          .catch((e) => {
            console.log(e);
          });
  };
  /* ********** 신고리스트 API 끝 ********** */

  /* ********** 면접제의 삭제 API 시작 ********** */
  //삭제 컨펌 모달
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
  const remove = () => {
    ServiceFetch("/interview/accept/remove", "put", {
      rqIdx: props.item.rqIdx,
    })
      .then((res) => {
        res.resultCode === "200"
          ? (setDeleteModal(false),
            setDeleteSuccessModal(true),
            props.setInfoStatus(!props.infoStatus))
          : res.resultCode === "713"
          ? setFailModal(true)
          : setFailModal(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  /* ********** 면접제의 삭제 API 끝 ********** */

  const [bgColor, seteBgColor] = useState(false);
  const [borderColor, setBorderColor] = useState(false);

  const [reportRequestModal, setreportRequestModal] = useState(false);

  const buttonList = props.item.representFlag.map((name, index) => {
    const info = props.info;
    //FIXME 배열일 때 다르게 보여주게. ..
    return (
      <button className="btn btn-lang" key={index}>
        {info[name]}{" "}
      </button>
    );
    // return <button className="btn btn-lang" key={index}>{name} </button>
  });

  // 면접의뢰 기업정보 확인 모달 Mob
  const [companyInfoMob, setCompanyInfoMob] = useState(false);

  const [cpInfoDataMob, setCpInfoDataMob] = useState({});

  // S: 에러 모달

  // 기업정보 상세정보가 없습니다
  const [companyInfoFail, setCompanyInfoFail] = useState(false);

  // E: 에러 모달

  const getCpInfoMob = (rqIdx) => {
    console.log(11111);
    axios
      .post(
        "/api/interview/cpinfo",
        {
          rqIdx: rqIdx,
        },
        {
          withCredentials: true,
          headers: {
            accessToken: getCookie("accessToken"),
            lastLoginTime: getCookie("lastLoginTime"),
          },
        }
      )
      .then((response) => {
        console.log(response);
        const {
          data: {
            result: { companyInfo },
          },
        } = response;
        response.data.resultCode === "200"
          ? (() => {
              // 문자열로 내려오는 파일을 가공후 배열로 변환
              const fileString = companyInfo.cpFileUrl;
              const fileArray = fileString.split(",");
              setCpInfoDataMob(() => ({
                ...companyInfo,
                cpFileUrl: fileArray,
              }));
              setCompanyInfoMob(true);
            })()
          : (() => {
              switch (response.data.resultCode) {
                case "709":
                  setCompanyInfoFail(true);
                  break;
                default:
                  break;
              }
            })();
      });
  };

  return (
    <>
      <div className={bgColor ? "compo-bg-gray" : "compo-bg"}>
        <div
          className={
            borderColor
              ? "dashboard-cont-cont flex flex-col mobile checkBorder"
              : "dashboard-cont-cont b_shadow flex flex-col mobile"
          }
        >
          <div className="cont-top flex space-between">
            <div className="dash-cont-cont1 flex items-center">
              <div className="form-check dash-cont1-tit flex gap-2">
                <div className="mochek border border-slate-200 rounded-md shrink-0">
                  <input
                    id={props.checkid}
                    className="form-check-input"
                    type="checkbox"
                    checked={checkState}
                    onChange={() => handleCheckChange(props.item.rqIdx)}
                  />
                  <label
                    className="form-check-label ml-0"
                    htmlFor={props.checkid}
                  ></label>
                </div>
                <p className="ellipsis02 w-16 shrink-0"
                  onClick={() => {
                    getCpInfoMob(props.item.rqIdx);
                  }}
                >
                  {props.item.cpUserName}
                </p>
              </div>
              <div className="dash-cont1-tit shrink-0">
                <button type="button">面接制の</button>
              </div>
            </div>
            <div className="dash-cont-cont2 flex flex-col items-end">
              <div className="progress-bar-tit pb_t shrink-0">
                {props.item.checkTodayOrNotForDeadLine
                  ? // 오늘이라는 flag가 내려오는 경우
                    todayReplaceSlashToHypen(props.item.rqLimitDatetimeToString)
                  : // 오늘이 아닌경우
                    replaceSlashToHypen(props.item.rqLimitDatetimeToString)}
              </div>
              <div className="progress">
                <div
                  className={props.progress}
                  role="progressbar"
                  aria-valuenow="0"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
          <div className="cont-btm">
            <div className="cont-btm-btn">{buttonList}</div>
            <div className="cont-btm-arrow">
              <button type="button">
                <img src={MoArrowDown} alt="" />
              </button>
            </div>
          </div>
          <div className="flex-end">
            <div className="dash-cont-cont3 flex">
              {props.item.pointStatus === "21102" ? (
                props.item.rqStatus === "20102" ? (
                  <>
                    <button
                      className="btn btn-sm btn-primary btn-auto"
                      onClick={() => {
                        setpointRequestModal(true);
                      }}
                    >
                      ポイント支給の要請
                    </button>
                    <button
                      className="btn btn-sm btn-gray-type1"
                      onClick={handleAcceptCancel}
                    >
                      承諾取消
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => {
                        setreportRequestModal1(true);
                      }}
                    >
                      通報
                    </button>
                    {/* 삭제버튼 추가 */}
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setDeleteModal(true);
                      }}
                    >
                      削除
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        props.setIdx([props.item.rqIdx]);
                        props.setAcceptCheck(true);
                      }}
                    >
                      承認
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleReject}
                    >
                      拒否
                    </button>
                  </>
                )
              ) : props.item.pointStatus === "21103" ? (
                <button className="btn btn-sm btn-gray-type1 ">
                  ポイント返却完了
                </button>
              ) : props.item.pointStatus === "21105" ? (
                <button className="btn btn-sm btn-gray-type1 ">
                  ポイント支給待ち
                </button>
              ) : props.item.pointStatus === "21106" ? (
                <button className="btn btn-long btn-outline-secondary">
                  ポイント支給完了
                </button>
              ) : (
                <button className="btn btn-sm btn-gray-type1 ">
                  支払い拒否
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 신고 모달 */}
      <Modal
        show={reportRequestModal1}
        onHidden={() => {
          setreportRequestModal1(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">通報</h2>
            <button className="" onClick={() => setreportRequestModal1(false)}>
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex gap-5">
            <div className="modal-subtit2">
              通報の対象者 : {declarationUser}
            </div>
            <div className="modal-subtit2">
              通報者 : {userInfoV.userNickName}
            </div>
          </div>
          <div className="report-radio-wrap mt-4">
            {reportReasonList?.length > 0 &&
              reportReasonList.map((report, index) => {
                return (
                  <div className="form-check mt-2" key={index}>
                    <input
                      id={`radio-switch-${index}`}
                      className="form-check-input"
                      name="report-radio"
                      type="radio"
                      value={report.reportReasonCode}
                      onChange={(e) =>
                        setDeclaration({
                          ...declaration,
                          reportReasonCode: e.target.value,
                        })
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`radio-switch-${index}`}
                    >
                      {report.reportReason}
                    </label>
                  </div>
                );
              })}
          </div>
          <textarea
            className="form-control mt-4 h-20 resize-none"
            rows="1"
            placeholder="通報の理由を具体的に記入してください。"
            onChange={(e) =>
              setDeclaration({
                ...declaration,
                reportReasonContent: e.target.value,
              })
            }
          ></textarea>
          <div className="flex flex-end mt-4">
            <a
              href="#"
              className="btn btn-primary btn-report"
              onClick={() => {
                reportSubmit();
              }}
            >
              通報
            </a>
          </div>
        </ModalBody>
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
          <div className="modal-subtit">通報の理由を選択してください。</div>
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
          <div className="modal-subtit">通報の送信が完了しました。</div>
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
      <Modal
        className="report-request-modal"
        show={reportRequestModal}
        onHidden={() => {
          setreportRequestModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">通報が完了しました。</div>
          <div className="modal-subtit">
            正常に通報を受け付けました。処理が完了するまで少々お待ちください。
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
          {/* END: Toggle Modal Toggle */}
        </ModalBody>
      </Modal>

      {/* 면접의뢰 기업정보 확인  MO */}
      <Modal
        className="point-request-modal"
        show={companyInfoMob}
        onHidden={() => {
          setCompanyInfoMob(false);
        }}
        size="modal-lg"
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">企業情報</div>
          <div className="modal-subtit h-600">
            <div className="flex items-center gap-3 border-b pb-3">
              <div className="btn btn-secondary">이미지영역</div>
              <div>{props.item.cpUserName}</div>
            </div>
            <div className="mt-3">
              <table className="table">
                <tbody>
                  <tr>
                    <td>勤務地</td>
                    <td>{cpInfoDataMob.headOfficeRegion}</td>
                  </tr>
                  <tr>
                    <td>업종</td>
                    <td>{cpInfoDataMob.businessType}</td>
                  </tr>
                  <tr>
                    <td>必要な経験年数</td>
                    <td>{cpInfoDataMob.requiredCareer}</td>
                  </tr>
                  <tr>
                    <td>必要なスキル</td>
                    <td>{cpInfoDataMob.requiredSkill}</td>
                  </tr>
                  <tr>
                    <td>가능연수입</td>
                    <td>{cpInfoDataMob.income}</td>
                  </tr>
                  <tr>
                    <td>홈페이지</td>
                    <td>{cpInfoDataMob.homepage}</td>
                  </tr>
                  <tr>
                    <td>구인광고</td>
                    <td>{cpInfoDataMob.cpAd}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <Link to="">
              <button className="btn btn-secondary w-300 mt-5">
                Tomodomo 에서 기업정보 확인하기
              </button>
            </Link>
            <div className="flex items-center gap-2 mt-5 cp-info-modal flex-wrap">
              {/* 이미지 영역 */}
              {cpInfoDataMob?.cpFileUrl?.map((v, i) => {
                return (
                  <div key={i}>
                    <img
                      src={`https://hitobito-net.com/api${v}`}
                      alt="company image"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setCompanyInfoMob(false);
              }}
            >
              確認
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                setCompanyInfoMob(false);
              }}
            >
              取消
            </a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        className="report-request-modal"
        show={reportRequestModal}
        onHidden={() => {
          setreportRequestModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">通報が完了しました。</div>
          <div className="modal-subtit">
            正常に通報を受け付けました。処理が完了するまで少々お待ちください。
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

      {/* 해당 회사의 상세정보 실패 */}
      <Modal
        show={companyInfoFail}
        onHidden={() => {
          setCompanyInfoFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            指定した会社の詳細情報はありません。
          </div>
          {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setCompanyInfoFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 면접제의 승낙취소 모달 */}
      <Modal
        className="point-request-modal"
        show={cancelModal}
        onHidden={() => {
          setCancelModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">面談承認取消</div>
          <div className="modal-subtit">面談の承諾を取り消しますか？</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-primary"
              onClick={() => {
                acceptCancel();
              }}
            >
              確認
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                setCancelModal(false);
              }}
            >
              取消
            </a>
          </div>
        </ModalBody>
      </Modal>
      {/* 면접제의 승낙취소 성공 모달 */}
      <Modal
        className="point-request-modal"
        show={cancelSuccessModal}
        onHidden={() => {
          setCancelSuccessModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">面談承認取消</div>
          <div className="modal-subtit">正常に取消が完了しました。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-primary"
              onClick={() => {
                setCancelSuccessModal(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 공통 실패 모달 */}
      <Modal
        className="point-request-modal"
        show={failModal}
        onHidden={() => {
          setFailModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">問題発生</div>
          <div className="modal-subtit">
            処理中に問題が発生しました。 <br />
            管理者にお問い合わせください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setFailModal(false);
              }}
            >
              확인
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 포인트 지급요청 모달 */}
      <Modal
        className="point-request-modal"
        show={pointRequestModal}
        onHidden={() => {
          setpointRequestModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">ポイント支給の要請ㄴ</div>
          <div className="modal-subtit">
            面談の実施後にポイント支給の要請ができます。
            <br />
            支給が遅れる場合には企業にメッセージしてください。
          </div>
          <div className="flex flex-end gap-3">
            <a href="#" className="btn btn-primary" onClick={pointRequest}>
              確認
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                setpointRequestModal(false);
              }}
            >
              取消
            </a>
          </div>
        </ModalBody>
      </Modal>
      {/* 포인트 지급요청 성공 모달 */}
      <Modal
        className="point-request-modal"
        show={pointRequestSuccessModal}
        onHidden={() => {
          setpointRequestSuccessModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">ポイント支給の要請を成功</div>
          <div className="modal-subtit">
            正常にポイント支給の要請を完了しました。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setpointRequestSuccessModal(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>
      {/* 포인트 지급要請失敗 모달 */}
      <Modal
        className="point-request-modal"
        show={pointRequestFailModal}
        onHidden={() => {
          setpointRequestFailModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">ポイント支給の要請を失敗</div>
          <div className="modal-subtit">지급요청 대상이 존재하지 않습니다.</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setpointRequestFailModal(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 삭제 컨펌 */}
      <Modal
        show={deleteModal}
        onHidden={() => {
          setDeleteModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">削除してもいいですか？</div>
          <div className="modal-subtit">
            既に承認を完了した依頼を削除するとポイント支給の申請ができません
            <br />
            削除してもいいですか？
          </div>
          <div className="flex flex-end gap-3">
            <button
              href="#"
              className="btn btn-primary"
              onClick={() => {
                remove();
              }}
            >
              確認
            </button>
            <button
              href="#"
              className="btn btn-secondary"
              onClick={() => {
                setDeleteModal(false);
              }}
            >
              取消
            </button>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        show={deleteSuccessModal}
        onHidden={() => {
          setDeleteSuccessModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">削除成功</div>
          <div className="modal-subtit">正常に削除しました。</div>
          <div className="flex flex-end gap-3">
            <button
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setDeleteSuccessModal(false);
              }}
            >
              確認
            </button>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
export default DashboardMobile;
