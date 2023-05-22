import {
    Lucide,
    Modal,
    ModalBody,
    ModalHeader,
} from "@/base-components";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { replaceSlashToHypen, todayReplaceSlashToHypen } from "../../utils/utils";
import ServiceFetch from "../../../util/ServiceFetch";
import Xicon from "@/assets/images/x_ic.svg"


const DashboardList = (props) => {

    const [isActive2, setIsActive2] = useState(false);

    /* ********* 공통 실패 모달 시작 ********* */
    const [failModal, setFailModal] = useState(false);
    /* ********* 공통 실패 모달 끝 ********* */

    /* ********* 체크 박스 상태 시작 ********* */
    const requestText = 'requestMap' + props.index;
    const [checkState, setCheckState] = useState(false);
    const handleCheckChange = (id) => {
        const updatedCheckState = !checkState;
        setCheckState(updatedCheckState);
        if (updatedCheckState && !props.idx.includes(id)) {
            props.setIdx([...props.idx, id]);
        } else if (!updatedCheckState && props.idx.includes(id)) {
            props.setIdx(props.idx.filter((value) => value !== id));
        }
        if (updatedCheckState && !props.rejectState[requestText]) {
            props.setRejectState({
                ...props.rejectState, [requestText]: {
                    rqIdx: props.item.rqIdx,
                    cpUserId: props.item.cpUserId,
                    cpPointIdx: props.item.cpPointIdx,
                }
            })
        } else if (!updatedCheckState && props.rejectState[requestText]) {
            const updatedRejectState = { ...props.rejectState };
            delete updatedRejectState[requestText];
            props.setRejectState(updatedRejectState);
        }
    }

    useEffect(() => {
        if(props.allCheckState && props.item.rqStatus == "20101"){
            setCheckState(true),
            props.setIdx((prev) => [...prev, props.item.rqIdx]),
            props.setRejectState((prevState) => ({
                ...prevState,
                ...props.rejectState, [requestText]: {
                    rqIdx: props.item.rqIdx,
                    cpUserId: props.item.cpUserId,
                    cpPointIdx: props.item.cpPointIdx,
                }
            })
    )}
        else if(!props.allCheckState && props.item.rqStatus == "20101") {
            setCheckState(false),
            props.setIdx([]),
            props.setRejectState({})
        }
    }, [props.allCheckState])
    
    // 거절 Evnet
    const handleReject = () => {
        const requestText = 'requestMap' + props.index;
        props.setRejectState({
            ...props.rejectState, [requestText]: {
                rqIdx: props.item.rqIdx,
                cpUserId: props.item.cpUserId,
                cpPointIdx: props.item.cpPointIdx,
            }
        })
        props.setRejectModal(true);
    }
    /* ********* 체크 박스 상태 끝 ********* */

    /* ********** 면접제의 승낙취소 API 시작 ********** */
    const [cancelModal, setCancelModal] = useState(false);
    const [cancelSuccessModal, setCancelSuccessModal] = useState(false);
    const acceptCancel = () => {
        ServiceFetch('/interview/accept/cancel', 'put', {
            rqIdx: props.item.rqIdx,
        }).then(res => {
            res.resultCode === '200' ? (
                setCancelModal(false),
                setCancelSuccessModal(true),
                props.setInfoStatus(!props.infoStatus)
            ) : res.resultCode === '713' ? (
                setFailModal(true)
            ) : (
                setFailModal(true)
            )
        }).catch(e => {
            console.log(e);
        })
    };
    const handleAcceptCancel = () => {
        setCancelModal(true);
    };
    /* ********** 면접제의 승낙취소 API 끝 ********** */

    /* ********** 포인트지급요청 API 시작 ********** */
    const [pointRequestModal, setpointRequestModal] = useState(false);
    const [pointRequestSuccessModal, setpointRequestSuccessModal] = useState(false);
    const [pointRequestFailModal, setpointRequestFailModal] = useState(false);
    const pointRequest = () => {
        ServiceFetch('/interview/request', 'put', {
            rqIdx: props.item.rqIdx,
        }).then(res => {
            res.resultCode === '200' ? (
                setpointRequestModal(false),
                setpointRequestSuccessModal(true),
                props.setInfoStatus(!props.infoStatus)
            ) : res.resultCode === '715' ? (
                setpointRequestFailModal(true)
            ) : (
                setFailModal(true)
            )
        }).catch(e => {
            console.log(e);
        })
    };
    /* ********** 포인트지급요청 API 끝 ********** */

    /* ********** 면접제의 삭제 API 시작 ********** */
    //삭제 컨펌 모달
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteSuccessModal, setDeleteSuccessModal] = useState(false);
    const remove = () => {
        ServiceFetch('/interview/accept/remove', 'put', {
            rqIdx: props.item.rqIdx,
        }).then(res => {
            res.resultCode === '200' ? (
                setDeleteModal(false),
                setDeleteSuccessModal(true),
                props.setInfoStatus(!props.infoStatus)
            ) : res.resultCode === '713' ? (
                setFailModal(true)
            ) : (
                setFailModal(true)
            )
        }).catch(e => {
            console.log(e);
        })
    };
    /* ********** 면접제의 삭제 API 끝 ********** */

    //면접의뢰 기업정보 확인 모달
    const [companyInfo, setcompanyInfo] = useState(false);
    // 면접의뢰 기업정보 확인 모달의 정보
    const [cpInfoData, setCpInfoData] = useState({})
    // 기업정보 상세정보가 없습니다
    const [companyInfoFail, setCompanyInfoFail] = useState(false);

    const buttonList = props.item.representFlag.map((name, index) => {
        if (name.includes('skillCodeNameArr')) {
            const infoKey = name.substring(16);
            const infoValue = props.info.skillCodeNameArr[infoKey];
            return (
                <button className="btn btn-lang" key={index}>{infoValue}</button>
            );
        }
        if(name.includes('projectProcessNameArr')){
            const infoKey = name.substring(21);
            const infoValue = props.info.projectProcessNameArr[infoKey];
            return (
                <button className="btn btn-lang" key={index}>{infoValue}</button>
            );
        }
        if(name.includes('projectRoleNameArr')){
            const infoKey = name.substring(18);
            const infoValue = props.info.projectRoleNameArr[infoKey];
            return (
                <button className="btn btn-lang" key={index}>{infoValue}</button>
            );
        }
        return props.info ? <button className="btn btn-lang" key={index}>{props.info[name]}</button> : null
    })

    const getCpInfo = (rqIdx) => {
        axios
            .post("/api/interview/cpinfo", {
                rqIdx: rqIdx
            },
                {
                    withCredentials: true,
                    headers: {
                        accessToken: getCookie("accessToken"),
                        lastLoginTime: getCookie("lastLoginTime"),
                    },
                })
            .then(response => {
                const {
                    data: { result: { companyInfo } },
                } = response;
                response.data.resultCode === "200"
                    ? (() => {
                        // 문자열로 내려오는 파일을 가공후 배열로 변환
                        const fileString = companyInfo.cpFileUrl;
                        const fileArray = fileString.split(",");
                        setCpInfoData(() => ({
                            ...companyInfo,
                            cpFileUrl: fileArray,
                            cpLogo: response.data.result.cpLogoUrl
                        }))
                        setcompanyInfo(true)
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

    // 프로그레스바 색 정하기
    const handleProgressClassName = () => {
        if (props.item.checkTodayOrNotForDeadLine) {
            // 오늘이거나 값이 1600이상일때
            return 'bg-red'
        } else {
            return 'bg-green'
        }
    }

    // 검색 조건 arrow 버튼 클릭 이벤트
    const [btnActive, setBtnActive] = useState(false);
    const handleClick = () => {
        setBtnActive(!btnActive);
    };

    return (
        <>
            <div className="dashboard-cont-cont flex flex-col">
                {/* 퍼블 | 삭제버튼 추가 */}
                <div className="x_icon_style">
                    <a href="#?"
                        onClick={() => {
                            setDeleteModal(true);
                        }}
                    >
                        <img src={Xicon} alt="" />
                    </a>
                </div>
                <div className="cont-top flex space-between">
                    <div className="dash-cont-cont1 flex items-center">
                        <div className="form-check dash-cont1-tit">
                            <input
                                type="checkbox"
                                className= {props.item.rqStatus == "20101" ? "form-check-input" : "form-check-input visibility-hidden"}
                                checked={checkState}
                                onChange={() => handleCheckChange(props.item.rqIdx)}
                            />
                            <label className="form-check-label" htmlFor="vertical-form-4">
                                <span
                                    onClick={() => {
                                        getCpInfo(props.item.rqIdx)
                                    }}
                                >{props.item.cpUserName}</span>
                            </label>
                        </div>
                        <div className="dash-cont1-tit">
                            <button type="button">
                                面接提案
                            </button>
                        </div>
                    </div>
                    <div>
                        <div className="dash-cont-cont2 flex flex-col items-end">
                            <div className="progress-bar-tit">
                                {
                                    props.item.checkTodayOrNotForDeadLine ? (
                                        // 오늘이라는 flag가 내려오는 경우
                                        todayReplaceSlashToHypen(props.item.rqLimitDatetimeToString)
                                    ) : (
                                        // 오늘이 아닌경우
                                        replaceSlashToHypen(props.item.rqLimitDatetimeToString)
                                    )
                                }
                            </div>
                            <div className="progress">
                                {/*<div className={props.progress} role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>*/}
                                <progress className={`progress-bar ${handleProgressClassName()}`} value={parseInt(props.item.progressBarValue)} max={100} />
                                {/* 'progress-bar bg-red' */}

                            </div>
                        </div>
                    </div>

                    <div className="dash-cont-cont3 flex">
                        {
                            props.item.pointStatus === '21102' ? (
                                props.item.rqStatus === '20102' ? (
                                    <>
                                        <button className="btn btn-sm btn-primary btn-auto" onClick={() => {
                                            setpointRequestModal(true);
                                        }}>ポイント支給要請</button>
                                        <button className="btn btn-sm btn-gray-type1" onClick={handleAcceptCancel}>
                                            承諾取消
                                        </button>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={() => {
                                            props.setreportRequestModal1(true);
                                            props.setDeclaration({...props.declaration, reportTargetId: props.item.cpUserId})
                                            props.setDeclarationUser(props.item.cpUserName)
                                        }}>通報</button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => {
                                                props.setIdx([props.item.rqIdx]);
                                                props.setAcceptCheck(true);
                                            }}
                                        >承諾</button>
                                        <button className="btn btn-sm btn-outline-secondary" onClick={handleReject}>
                                            拒否
                                        </button>
                                    </>
                                )
                            ) : props.item.pointStatus === '21103' ? (
                                <button className="btn btn-sm btn-gray-type1 w-auto">
                                    ポイント返却完了
                                </button>
                            ) : props.item.pointStatus === '21105' ? (
                                <button className="btn btn-sm btn-gray-type1 w-auto">
                                    ポイント支給待ち
                                </button>
                            ) : props.item.pointStatus === '21106' ? (
                                <button className="btn btn-long btn-outline-secondary" onClick={() => {window.location.assign("/point-detail")}}>ポイント支給完了</button>
                            ) : (
                                <button className="btn btn-sm btn-gray-type1 w-auto">
                                    支払い拒否
                                </button>
                            )
                        }
                    </div>
                </div>
                <div className="cont-btm">
                    <div className={btnActive ? "cont-btm-btn active" : "cont-btm-btn"}>
                        {buttonList}
                    </div>
                    <div className={btnActive ? "cont-btm-arrow active" : "cont-btm-arrow"} onClick={handleClick}>
                        <button type="button">
                            <Lucide icon="ChevronDown" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 면접의뢰 기업정보 확인  PC */}
            {console.log(cpInfoData)}
            {
                cpInfoData && <Modal className="point-request-modal"
                    show={companyInfo}
                    onHidden={() => {
                        setcompanyInfo(false);
                    }}
                    size="modal-lg"
                >
                    <ModalBody className="p-10 text-center">
                        <div className="modal-subtit">
                        <div className="half-div">
                            <div className="modal-tit half-div-left">企業情報</div>
                            <div><a href="#"
                                    className="half-div-right"
                                    onClick={() => {setcompanyInfo(false);}}><img src={Xicon} alt="" /></a></div>
                        </div>
                            <div className="flex items-center gap-3 border-b pb-3 half-div-next">
                                <div className="btn btn-secondary dashboard-logo-wrap">
                                    {console.log()}
                                    {
                                        cpInfoData.cpLogo ? (
                                            <img src={`https://hitobito-net.com/api${cpInfoData.cpLogo}`} alt="company logo" />
                                        ) : (
                                            <img src={`https://hitobito-net.com/api/files/logo/default_logo`} alt="company logo" />
                                        )
                                    }
                                </div>
                                <div>{cpInfoData.companyName}</div>
                            </div>
                            <div className="mt-3">
                                <table className="table">
                                    <tbody>
                                        <tr>
                                            <td>所在地</td>
                                            <td>{cpInfoData.headOfficeRegion}</td>
                                        </tr>
                                        <tr>
                                            <td>業種</td>
                                            <td>{cpInfoData.businessType}</td>
                                        </tr>
                                        <tr>
                                            <td>必要経験年数</td>
                                            <td>{cpInfoData.requiredCareer}</td>
                                        </tr>
                                        <tr>
                                            <td>必要スキル</td>
                                            <td>{cpInfoData.requiredSkill}</td>
                                        </tr>
                                        <tr>
                                            <td>予想年収</td>
                                            <td>{cpInfoData.income}</td>
                                        </tr>
                                        <tr>
                                            <td>ホームページ</td>
                                            <td>{cpInfoData.homepage}</td>
                                        </tr>
                                        <tr>
                                            <td>求人情報</td>
                                            <td>{cpInfoData.cpAd}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            {/* 이미지영역 */}
                            {/* <div className="flex items-center gap-2 mt-5 cp-info-modal flex-wrap">
                                {
                                    cpInfoData?.cpFileUrl?.map((v, i) => {
                                        return (
                                            <div key={i}>
                                                <img src={`https://hitobito-net.com/api${v}`} alt="company image" />
                                            </div>
                                        )
                                    })
                                }
                            </div> */}
                        </div>
                    </ModalBody>
                </Modal>
            }

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
                onHidden={() => { setCancelModal(false) }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">面談承認取消</div>
                    <div className="modal-subtit">
                        面談の承諾を取り消しますか？
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-primary"
                            onClick={() => { acceptCancel() }}
                        >はい</a>
                        <a
                            href="#"
                            className="btn btn-outline-secondary"
                            onClick={() => { setCancelModal(false) }}
                        >いいえ</a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 면접제의 승낙취소 성공 모달 */}
            <Modal
                className="point-request-modal"
                show={cancelSuccessModal}
                onHidden={() => { setCancelSuccessModal(false) }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">面談承認取消</div>
                    <div className="modal-subtit">
                        成功的に取り消されました。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            className="btn btn-primary"
                            onClick={() => { setCancelSuccessModal(false) }}
                        >確認</a>
                    </div>
                </ModalBody>
            </Modal>

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

            {/* 포인트 지급요청 모달 */}
            <Modal
                className="point-request-modal"
                show={pointRequestModal}
                onHidden={() => {
                    setpointRequestModal(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">ポイント支給要請</div>
                    <div className="modal-subtit">
                        談の実施後にポイント支給の要請ができます。<br />
                        支給が遅れる場合には企業にメッセージしてください。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={pointRequest}
                        >確認</a>
                        <a
                            href="#"
                            className="btn btn-outline-secondary"
                            onClick={() => { setpointRequestModal(false) }}
                        >キャンセル</a>
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
                            onClick={() => { setpointRequestSuccessModal(false) }}
                        >確認</a>
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
                    <div className="modal-subtit">
                        ポイント支給要請の対象が存在しません。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => { setpointRequestFailModal(false) }}
                        >確認</a>
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
                        既に承認を完了した依頼を削除するとポイント支給の申請ができません<br />
                        削除してもいいですか？
                    </div>
                    <div className="flex flex-end gap-3">
                        <button
                            href="#"
                            className="btn btn-primary"
                            onClick={() => { remove() }}
                        >はい</button>
                        <button
                            href="#"
                            className="btn btn-secondary"
                            onClick={() => { setDeleteModal(false); }}
                        >いいえ</button>
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
                    <div className="modal-subtit">
                        成功的に削除されました。
                    </div>
                    <div className="flex flex-end gap-3">
                        <button
                            href="#"
                            className="btn btn-primary"
                            onClick={() => { setDeleteSuccessModal(false) }}
                        >確認</button>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};
export default DashboardList;
