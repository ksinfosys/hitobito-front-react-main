import { Lucide, Modal, ModalBody, ModalHeader } from "@/base-components";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { getCookie } from "../../utils/cookie";
import { cancleRegularPayFlag, planCodeToPlanName, regexUserJoinDate } from "../../utils/utils";
import { Outlet } from "react-router-dom";
import {useRecoilState} from "recoil";
import {businessPlan} from "../../stores/business-plan";

const UsePlan = () => {
  const [isActive, setIsActive] = useState(false);
  const [BusinessPlan, setBusinessPlan] = useRecoilState(businessPlan)

  // 결제중일때 결제금액 disabled
  const [isPmntPending, setIsPmntPending] = useState(false);

  const [sessionId, setSessionId] = useState("");

  const [PlanPaymentModal, setPlanPaymentModal] = useState(false);
  const [ChangeConfirmModal, setChangeConfirmModal] = useState(false);

  // 성공결과
  const [sucessData, setSucessData] = useState({});

  // 결제 성공 플래그
  const [sucessFlag, setSucessFlag] = useState(false);

  const getPlanList = () => {
    axios
      .get("/api/plan/list", {
        withCredentials: true,
        headers: {
          accessToken: getCookie("accessToken"),
          lastLoginTime: getCookie("lastLoginTime"),
        },
      })
      .then((response) => {
        console.log(response);
        response.data.resultCode === "200"
          ? (() => {
            setPlanList(response.data.result.planList);
          })()
          : console.log("fetching error:::", response);
      });
  };

  useEffect(() => {
    getPlanList();
  }, []);

  const [planList, setPlanList] = useState({});
  console.log(planList);

  // 동의, 비동의 체크
  const [agreeFlag, setAgreeFlag] = useState(false);

  // 바꿀 플랜코드
  const [isplanCode, setIsPlanCode] = useState("");

  // 바꿀 요금제
  const [isPaymentMethod, setIsPaymentMethod] = useState("");

  // 서브스크립션 호출 실패
  const [subScriptionFail, setSubScriptionFail] = useState(false);
  // 결제에러 실패
  const [payErrorFail, setPayErrorFail] = useState(false);
  // 같은 플랜 실패
  const [samePlanFail, setSamePlanFail] = useState(false);
  // 편의점 결제 대기중 결제
  const [waitPayFail, setWaitPayFail] = useState(false);
  //정기결제 취소 확인
  const [cancelPayment, setcancelPayment] = useState(false);
  //기지급 금액에 대한 환불불가 동의
  const [nonRefundable, setnonRefundable] = useState(false);
  // 정기결제 취소후 안내 모달 상태
  const [cancleRegularState, setCancleRegularState] = useState(false);
  // 정기결제 취소후 안내 모달 데이터
  const [cancleMsg, setCancleMsg] = useState("")
  // 결제 체크 안할시 나오는 모달
  const [paymentProcessFail, setPaymentProcessFail] = useState(false);
  // 약관 동의 안할시 나오는 모달
  const [policyProcessFail, setPolicyProcessFail] = useState(false);

  //결제 팝업
  const [payModal, setPayModal] = useState();

  // ** checkout API
  const getCheckOut = (isplanCode, isPaymentMethod) => {
    // 무료 플랜으로 돌아가는 경우 req요소가 달라집니다.
    if (isplanCode === "P0000") {
      axios
        .post(
          "/api/plan/buy",
          {
            planCode: isplanCode,
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
          switch (response.data.resultCode) {
            case "200":
              setSessionId(response.data.result.sessionId);
              localStorage.setItem("sessionId", response.data.result.sessionId);
              setIsPmntPending(true);
              window.location.href = response.data.result.sessionUrl
              // window.location.reload();
              // window.open(response.data.result.sessionUrl, "_blank");

              break;
            case "608":
              setSubScriptionFail(true);
              break;
            case "611":
              setPayErrorFail(true);
              break;
            case "616":
              setSamePlanFail(true);
              break;
            default:
              break;
          }
        })
        .catch((error) => {
          console.log(error);
          // 500에러가 나도 프리플랜으로는 정상적으로 데이터가 변경되기 때문에
          // 임시로 새로고침.
          window.location.reload();
        });
    } else {
      axios
        .post(
          "/api/plan/buy",
          {
            planCode: isplanCode,
            paymentMethod: isPaymentMethod,
          },
          {
            withCredentials: true,
            headers: {
              accessToken: getCookie("accessToken"),
              lastLoginTime: getCookie("lastLoginTime"),
            },
          }
        )
        .then(async (response) => {
          switch (response.data.resultCode) {
            case "200":
              setSessionId(response.data.result.sessionId);
              localStorage.setItem("sessionId", response.data.result.sessionId);
              setIsPmntPending(true);
              if (isPaymentMethod === "20901") {
                window.location.href = response.data.result.sessionUrl;
              } else {
                window.open(response.data.result.sessionUrl, "_blank");
              }
              setBusinessPlan({
                isOpen: 1,
                sessionId: response.data.result.sessionId
              })
              // await openSessionURL(response.data.result.sessionUrl)
              break;
            case "608":
              setSubScriptionFail(true);
              break;
            case "611":
              setPayErrorFail(true);
              break;
            case "616":
              setSamePlanFail(true);
              break;
            default:
              break;
          }
        });
    }
  };

  const openSessionURL = (url) => {
    axios.get(url)
      .then(res => console.log(res))
  }

  // ** checkout 성공했을 때
  const getSucessResult = () => {
    // console.log(sessionId);
    axios
      .post(
        `/api/stripe/sub/success/${sessionId}`,
        {},
        {
          withCredentials: true,
          headers: {
            accessToken: getCookie("accessToken"),
            lastLoginTime: getCookie("lastLoginTime"),
          },
        }
      )
      .then((response) => {
        setSucessData(response.data);
      })
      .then(() => {
        window.reload();
      });
  };

  // back 정기결제取消
  const cancleRegularPayment = () => {
    axios
      .put(
        "/api/plan/back",
        {},
        {
          withCredentials: true,
          headers: {
            accessToken: getCookie("accessToken"),
            lastLoginTime: getCookie("lastLoginTime"),
          },
        }
      )
      .then((response) => {
        setCancleMsg(response.data.resultMessage);
        setCancleRegularState(true)
      });
  }


  // 약관 스크롤 이벤트
  const termsRef = useRef(null);
  const [agreeOpen, setAgreeOpen] = useState(false);

  const handleScroll = () => {

    const termsEl = termsRef.current;
    const isBottom = Math.ceil(termsEl.scrollTop) + termsEl.clientHeight >= termsEl.scrollHeight;
    if (isBottom) {
      setAgreeOpen(true)
    } else {
      setAgreeOpen(false)
    }
  };

  useEffect(() => {
    const termsEl = termsRef.current;
    termsEl.addEventListener('scroll', handleScroll);
    return () => {
      termsEl.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if(businessPlan.isOpen === 2){
      setBusinessPlan({
        isOpen: 0,
        sessionId: ''
      })
      window.location.reload();
    }
  },[businessPlan.isOpen])

  return (
    <>
      {/* 변경 전 기본 플랜 */}
      <div id="business" className="use-plan">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-sm">
            プラン設定
          </div>
          <div className="pt-10 pb-10 p-5 cont-wrap flex flex-col items-center justify-center">
            <ul className="use-plan-box text-center flex gap-5 w-full mb-10">
              <li className={planList?.planCode === "P0000" ? "active" : null}>
                <ul className="flex flex-col gap-5">
                  <li className="font-bold text-lg">フリープラン</li>
                  <li>
                    <p className="bg-lo text-pending font-bold text-lg p-2">
                      無料/月
                    </p>
                    <p className="text-white text-sm mt-2">(税金別途)</p>
                  </li>
                  <li className="">
                    面接依頼1件につき 20,000Pで、
                    <br />
                    毎月のご利用料金なし
                  </li>
                </ul>
                {planList.planCode === "P0000" ? (
                  <button
                    type="button"
                    className="btn btn-outline-pending bg-white mt-5 w-full"
                  >
                    使用中
                  </button>
                ) : (
                  <button
                    type="button"
                    // 변경하기 눌렀을시 결제모달이 안나와서 선택됨을 알리는 색 변경
                    className={
                      isplanCode === "P0000" && isActive
                        ? "btn btn-outline-pending bg-white mt-5 w-full"
                        : "btn btn--grey-pending mt-5 w-full"
                    }
                    onClick={() => {
                      // setIsPlanCode("P0000");
                      // 프리플랜으로의 변경은 결제모달 필요없음
                      // setIsActive((prev) => !prev);
                      // setPlanPaymentModal(true);
                    }}
                  >
                    変更する
                  </button>
                )}
              </li>
              <li className={planList?.planCode === "P0001" ? "active" : null}>
                <ul className="flex flex-col gap-5">
                  <li className="font-bold text-lg">プランA</li>
                  <li>
                    <p className="bg-lo text-pending font-bold text-lg p-2">
                      15,000円/月
                    </p>
                    <p className="text-warning text-sm mt-2">(税金別途)</p>
                  </li>
                  <li className="">
                    面接依頼1件につき 5,000P로 で,
                    <br />
                    毎月のご利用料金 15,000円
                  </li>
                </ul>
                {planList.planCode === "P0001" ? (
                  <button
                    type="button"
                    className="flex flex-col btn btn-outline-pending bg-white mt-5 w-full"
                    onClick={() => {
                      if (planList.invalidFlag === "8") {
                        setWaitPayFail(true);
                      }
                    }}
                  >
                    {planList.invalidFlag === "8"
                      ? "コンビニ決済待ち"
                      : "使用中"}
                    {planList.invalidFlag !== "8" ? (
                      <div>
                        {regexUserJoinDate(planList.planStartDate)} ~{" "}
                        {regexUserJoinDate(planList.planEndDate)}
                      </div>
                    ) : null}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={
                      planList.planCode === "P0001" || planList?.planEndDate === "21001231"
                        ? "btn btn--grey-pending mt-5 w-full"
                        : "btn btn-pending mt-5 w-full"
                    }
                    onClick={planList?.planEndDate !== "21001231" ? () => {
                      setIsPlanCode("P0001");
                      setPlanPaymentModal(true);
                    } : null}
                  >
                    変更する
                  </button>
                )}
                {
                  (cancleRegularPayFlag(planList.planEndDate) && planList.planCode === "P0001" && planList?.paymentMethod === "20906") && (
                    <button
                      className="btn btn-danger mt-2 w-full"
                      onClick={() => setnonRefundable(true)}
                    >
                      取消
                    </button>
                  )
                }
              </li>
              <li className={planList?.planCode === "P0002" ? "active" : null}>
                <ul className="flex flex-col gap-5">
                  <li className="font-bold text-lg">プランB</li>
                  <li>
                    <p className="bg-lo text-pending font-bold text-lg p-2">
                      30,000円/月
                    </p>
                    <p className="text-warning text-sm mt-2">(税金別途)</p>
                  </li>
                  <li className="">
                    面接依頼1件につき 3,000Pで,
                    <br />
                    毎月のご利用料金 30,000円
                  </li>
                </ul>
                {planList.planCode === "P0002" ? (
                  <button
                    type="button"
                    className="flex flex-col btn btn-outline-pending bg-white mt-5 w-full"
                    onClick={() => {
                      if (planList.invalidFlag === "8") {
                        setWaitPayFail(true);
                      }
                    }}
                  >
                    {planList.invalidFlag === "8"
                      ? "コンビニ決済待ち"
                      : "使用中"}
                    <br />

                    {planList.invalidFlag !== "8" ? (
                      <div>
                        {regexUserJoinDate(planList.planStartDate)} ~{" "}
                        {regexUserJoinDate(planList.planEndDate)}
                      </div>
                    ) : null}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={
                      planList.planCode === "P0002" || planList?.planEndDate === "21001231"
                        ? "btn btn--grey-pending mt-5 w-full"
                        : "btn btn-pending mt-5 w-full"
                    }
                    onClick={planList?.planEndDate !== "21001231" ? () => {
                      setIsPlanCode("P0002");
                      setPlanPaymentModal(true);
                    } : null}
                  >
                    変更する
                  </button>
                )}

                {
                  (cancleRegularPayFlag(planList.planEndDate) && planList.planCode === "P0002" && planList?.paymentMethod === "20906") && (
                    <button
                      className="btn btn-danger mt-2 w-full"
                      onClick={() => setnonRefundable(true)}
                    >
                      取消
                    </button>
                  )
                }
              </li>
            </ul>

          </div>
        </div>
      </div>

      <Outlet />

      {/* 결제하기 */}
      <Modal
        size="modal-lg"
        backdrop="static"
        show={PlanPaymentModal}
        onHidden={() => {
          setPlanPaymentModal(false);
        }}
      >
        <a
          onClick={() => {
            // 현재 플랜코드로 되돌리기
            setIsPlanCode(planList.planCode);
            // 현재 페이먼트메소드로 되돌리기
            setIsPaymentMethod(planList.paymentMethod);
            setPlanPaymentModal(false);
            setAgreeOpen(false)
          }}
          className="absolute right-0 top-0 mt-3 mr-3"
          href="#"
        >
          <Lucide icon="X" className="w-5 h-5 text-slate-400" />
        </a>
        <ModalHeader className="flex-col">
          <h2 className="font-bold text-base mr-auto ">
            プラン決済
          </h2>
        </ModalHeader>
        <ModalBody className="p-5 plan-pay-modal business-modal">
          <div id="detail-cont" className="border-b pb-5">
            <div className="border-b pb-5">
              <p>定期決済</p>
              <div className="form-check p-2 border mt-2">
                <input
                  id="regular-pay"
                  className="form-check-input"
                  type="radio"
                  name="pay_button"
                  value="horizontal-radio-daniel-craig"
                  checked={isPaymentMethod === "20901"}
                  onChange={() => {
                    setIsPaymentMethod("20901");
                    setIsActive(true)
                  }}
                  onClick={() => {
                    setIsPaymentMethod("20901");
                    setIsActive(true)
                  }}
                />
                <label
                  className="form-check-label text-sm w-full"
                  htmlFor="regular-pay"
                >
                  毎月決済（1年連続）
                </label>
              </div>
            </div>
            <div className="pt-5">
              <p>短期決済</p>
              <div className="form-check p-2 border mt-2">
                <input
                  id="2m-pay"
                  className="form-check-input"
                  type="radio"
                  name="pay_button"
                  value="horizontal-radio-daniel-craig"
                  checked={isPaymentMethod === "20902"}
                  onChange={() => {
                    setIsPaymentMethod("20902");
                    setIsActive(true)
                  }}
                  onClick={() => {
                    setIsPaymentMethod("20902");
                    setIsActive(true)
                  }}
                />
                <label
                  className="form-check-label text-sm w-full"
                  htmlFor="2m-pay"
                >
                  2ヶ月決済 <span className="text-pending">(2%割引)</span>
                </label>
              </div>
              <div className="form-check p-2 border mt-2">
                <input
                  id="3m-pay"
                  className="form-check-input"
                  type="radio"
                  name="pay_button"
                  value="horizontal-radio-daniel-craig"
                  checked={isPaymentMethod === "20903"}
                  onChange={() => {
                    setIsPaymentMethod("20903");
                    setIsActive(true)
                  }}
                  onClick={() => {
                    setIsPaymentMethod("20903");
                    setIsActive(true)
                  }}
                />
                <label
                  className="form-check-label text-sm w-full"
                  htmlFor="3m-pay"
                >
                  3か月決済 <span className="text-pending">(4%割引)</span>
                </label>
              </div>
              <div className="form-check p-2 border mt-2">
                <input
                  id="6m-pay"
                  className="form-check-input"
                  type="radio"
                  name="pay_button"
                  value="horizontal-radio-daniel-craig"
                  checked={isPaymentMethod === "20904"}
                  onChange={() => {
                    setIsPaymentMethod("20904");
                    setIsActive(true)
                  }}
                  onClick={() => {
                    setIsPaymentMethod("20904");
                    setIsActive(true)
                  }}
                />

                <label
                  className="form-check-label text-sm w-full"
                  htmlFor="6m-pay"
                >
                  6ヶ月決済 <span className="text-pending">(10%割引)</span>
                </label>
              </div>
            </div>
          </div>
          <div className="border-t w-full">
            <div className="pt-10 pb-3 border-b">
              決済規約に同意{" "}
              <span className="text-sm text-pending ml-2">
                以下の規約を読んでいただいた後に決済が可能です。
              </span>
            </div>
            <div ref={termsRef} className="agree-text text-slate-300 p-2 border-b text-sm" >
              利用規約
              <br />
              この利用規約（以下、「本規約」といいます。）は、ＫＳ情報システム株式会社（以下、「当社」といいます。）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。登録利用者の皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
              <br />
              第1条（適用）
              <br />
              1. 本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。
              <br />
              2. 当社は本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。
              <br />
              3. 本規約の規定が前条の個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。
              <br />
              第２条（利用登録）
              <br />
              1. 本サービスにおいては、登録希望者が本規約に同意の上、当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
              <br />
              2. 当社は、利用登録の申請者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
              <br />
              (1) 利用登録の申請に際して虚偽の事項を届け出た場合
              <br />
              (2) 本規約に違反したことがある者からの申請である場合
              <br />
              (3) その他、当社が利用登録を相当でないと判断した場合
              <br />
              第3条（ユーザーIDおよびパスワードの管理）
              <br />
              1. ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
              <br />
              2. ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に譲渡または貸与し、もしくは第三者と共用することはできません。当社は、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。
              <br />
              3. ユーザーID及びパスワードが第三者によって使用されたことによって生じた損害は、当社に故意又は重大な過失がある場合を除き、当社は一切の責任を負わないものとします。
              <br />
              第4条（利用料金および支払方法）
              <br />
              1. 企業ユーザーは、本サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金を、当社が指定する方法により支払うものとします。
              <br />
              2. ユーザーが利用料金の支払を遅滞した場合には、ユーザーは年14．6％の割合による遅延損害金を支払うものとします。
              <br />
              第5条（禁止事項）
              <br />
              ユーザーは、本サービスの利用にあたり、以下の行為をしてはならない。
              <br />
              1. 法令または公序良俗に違反する行為
              <br />
              2. 犯罪行為に関連する行為
              <br />
              3. 本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為
              <br />
              4. 当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
              <br />
              5. 本サービスによって得られた情報を商業的に利用する行為
              <br />
              6. 当社のサービスの運営を妨害するおそれのある行為
              <br />
              7. 不正アクセスをし、またはこれを試みる行為
              <br />
              8. 他のユーザーに関する個人情報等を収集または蓄積する行為
              <br />
              9. 不正な目的を持って本サービスを利用する行為
              <br />
              10. 本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為
              <br />
              11. 一人の利用者が複数の利用者IDを取得するなどして他のユーザーに成りすます行為
              <br />
              12. 当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為
              <br />
              13. 面識のない異性との出会いを目的とした行為
              <br />
              14. 当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
              <br />
              15. その他、当社が不適切と判断する行為
              <br />
              第6条（本サービスの提供の停止等）
              <br />
              1. 当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
              <br />
              (1) 本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
              <br />
              (2) 地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
              <br />
              (3) コンピュータまたは通信回線等が事故により停止した場合
              <br />
              (4) その他、当社が本サービスの提供が困難と判断した場合
              <br />
              2.当社は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。
              <br />
              第7条（利用制限および登録抹消）
              <br />
              1. 当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
              <br />
              (1) 本規約のいずれかの条項に違反した場合
              <br />
              (2) 登録事項に虚偽の事実があることが判明した場合
              <br />
              (3) 料金等の支払債務の不履行があった場合
              <br />
              (4) 当社からの連絡に対し、一定期間返答がない場合
              <br />
              (5) 本サービスについて、最終の利用から一定期間利用がない場合　（注）期間を明記するか？
              <br />
              (6) その他、当社が本サービスの利用を適当でないと判断した場合
              <br />
              2.当社は、本条に基づき当社が行った行為によりユーザーに生じた損害について、一切の責任を負いません。
              <br />
              第8条（退会）
              <br />
              ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。
              <br />
              第9条（保証の否認および免責事項）
              <br />
              1. 当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
              <br />
              2. 当社は、本サービスに起因してユーザーに生じたあらゆる損害について、当社の故意又は重過失による場合を除き、一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。
              <br />
              3. 当社は、本サービスが全ての情報端末に対応していることを保証するものではなく、本サービスの利用に供する情報端末のＯＳのバージョンアップ等に伴い、本サービスの動作に不具合が生じる可能性があることにつき、ユーザーはあらかじめ了承するものとします。当社は、かかる不具合が生じた場合に当社が行うプログラムの修正等により、当該不具合が解消されることを保証するものではありません。
              <br />
              4. ユーザーは、AppStore、GooglePlay等のサービスストアの利用規約および運用方針の変更等に伴い、本サービスの一部又は全部の利用が制限される可能性があることをあらかじめ了承するものとします。
              <br />
              5. 前項ただし書に定める場合であっても、当社は、当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（当社またはユーザーが損害発生につき予見し、または予見し得た場合を含みます。）について一切の責任を負いません。また、当社の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害の賠償は、ユーザーから当該損害が発生した月に受領した利用料の額を上限とします。
              <br />
              6. ユーザーの行為により、第三者から当社が損害賠償等の請求をされた場合には、ユーザーの費用（弁護士費用）と責任で、これを解決するものとします。当社が、当該第三者に対して、損害賠償金を支払った場合には、ユーザーは、当社に対して当該損害賠償金を含む一切の費用（弁護士費用及び逸失利益を含む）を支払うものとします。
              <br />
              7. 当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません
              <br />
              第10条（サービス内容の変更等）
              <br />
              当社は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。
              <br />
              第11条（利用規約の変更）
              <br />
              1.当社は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。
              <br />
              (1) 本規約の変更がユーザーの一般の利益に適合するとき。
              <br />
              (2) 本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき。
              <br />
              2. 当社はユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨及び変更後の本規約の内容並びにその効力発生時期を通知します。
              <br />
              第12条（個人情報の取扱い）
              <br />
              当社は、本サービスの利用によって取得する個人情報については、当社が別途定める「hitobitoプライバシーポリシー」に従い適切に取り扱うものとします。
              <br />
              第13条（通知または連絡）
              <br />
              ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は、ユーザーから、当社が別途定める方式に従った変更届け出がない限り、現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い、これらは、発信時にユーザーへ到達したものとみなします。
              <br />
              第1４条（広告の掲載について）
              <br />
              ユーザーは、本サービス上にあらゆる広告が含まれる場合があること、当社またはその提携先があらゆる広告を掲載する場合があることを理解しこれを承諾したものとみなします。本サービス上の広告の形態や範囲は、当社によって随時変更されます。
              <br />
              第1５条（当社への連絡方法）
              <br />
              本サービスに関するユーザーの当社へのご連絡・お問い合わせは、本サービスまたは当社が運営するwebサイト内の適宜の場所に設置するお問い合わせフォームからの送信または当社が別途指定する方法により行うものとします。
              <br />
              第1６条（権利義務の譲渡の禁止）
              <br />
              ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。
              <br />
              第1７条（準拠法・裁判管轄）
              <br />
              1. 本規約の解釈にあたっては、日本法を準拠法とします。
              <br />
              2. 本サービスに関して紛争が生じた場合には、当社の本店所在地を管轄する裁判所を専属的合意管轄とします。
              <br />
              ２０２３年４月1日施行
              <br />
            </div>
            <div className="flex space-between pt-3">
              <p>決済規約に同意しますか？</p>
              {
                agreeOpen && (
                  <div className="flex gap-2">
                    <div className="form-check">
                      <input
                        id="agree"
                        className="form-check-input"
                        type="radio"
                        name="agree_button"
                        value="horizontal-radio-daniel-craig"
                        onClick={() => {
                          setAgreeFlag(true);
                        }}
                      />
                      <label className="form-check-label text-sm" htmlFor="agree">
                        同意
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        id="disagree"
                        className="form-check-input"
                        type="radio"
                        name="agree_button"
                        value="horizontal-radio-daniel-craig"
                        onClick={() => {
                          setAgreeFlag(false);
                        }}
                      />
                      <label
                        className="form-check-label text-sm"
                        htmlFor="disagree"
                      >
                        同意しません。
                      </label>
                    </div>
                  </div>
                )
              }
            </div>
          </div>

          <div id="detail-modal-btn" className="flex flex-end gap-2 pt-16 plan_btn">
            <button
              type="button"
              className={`btn btn-sm w-24 ${isActive && agreeFlag ? "btn-pending" : "btn-secondary"}`}
              onClick={() => {
                if (isActive && agreeFlag) {
                  setPlanPaymentModal(false);
                  setChangeConfirmModal(true);
                } else if (!isActive) {
                  setPaymentProcessFail(true)
                } else if (!agreeFlag) {
                  setPolicyProcessFail(true)
                } else {
                  return false;
                }
              }}
            >
              決済する
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary w-24"
              onClick={() => {
                // 현재 플랜코드로 되돌리기
                setIsPlanCode(planList.planCode);
                // 현재 페이먼트메소드로 되돌리기
                setIsPaymentMethod(planList.paymentMethod);
                // 선택 취소
                setIsActive(false);
                setPlanPaymentModal(false);
                setAgreeOpen(false)
              }}
            >
              キャンセル
            </button>
          </div>
        </ModalBody>
      </Modal>

      {/* 변경하기 확인 */}
      <Modal
        show={ChangeConfirmModal}
        backdrop="static"
        onHidden={() => {
          setChangeConfirmModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">プランを変更します。</div>
          <div className="modal-subtit">
            現在利用しているプランは "{planCodeToPlanName(planList.planCode)}"
            です。
            <br />
            変更すると現在使用しているプランは返金せずに取り消します。
            <br />
            本当に変更しますか？
          </div>
          <div className="flex flex-end gap-3">
            {sessionId?.length > 0 ? (
              <a
                href="#"
                className="btn btn-pending"
                onClick={() => {
                  getSucessResult();
                  setSucessFlag(true);
                }}
              >
                決済完了
              </a>
            ) : (
              <>
                <a
                  href="#"
                  className="btn btn-pending"
                  onClick={() => {
                    // setChangeConfirmModal(false);
                    setPayModal(true);
                    getCheckOut(isplanCode, isPaymentMethod);
                  }}
                >
                  確認
                </a>
                <a
                  href="#"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setChangeConfirmModal(!ChangeConfirmModal);
                  }}
                >
                  取消
                </a>
              </>
            )}
          </div>
        </ModalBody>
      </Modal>

      {/* 결제 성공, 실패 */}
      <Modal
        show={sucessFlag}
        backdrop="static"
        onHidden={() => {
          setSucessFlag(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          {sucessData?.resultMessage ? (
            <div className="modal-tit">{sucessData?.resultMessage}</div>
          ) : (
            <div className="modal-tit">決済に失敗しました。</div>
          )}
          {/* <div className="modal-subtit">
            ポイントは1000ポイント単位で入力してください
          </div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setSucessFlag(false);
                setChangeConfirmModal(false);
                setIsPmntPending(false);
                setSessionId("");
                window.location.replace("/use-plan");
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 서브스크립션 아이디 호출에 실패 */}
      <Modal
        show={subScriptionFail}
        backdrop="static"
        onHidden={() => {
          setSubScriptionFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">
            サブスクリプションID呼び出しに失敗しました。
          </div>
          <div className="modal-subtit">管理者に問い合わせしてください。</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setSubScriptionFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 결제 처리 오류 발생 */}
      <Modal
        show={payErrorFail}
        backdrop="static"
        onHidden={() => {
          setPayErrorFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">決済処理のエラーが発生しました。</div>
          <div className="modal-subtit">管理者に問い合わせしてください。</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setPayErrorFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 같은 플랜 에러 발생 */}
      <Modal
        show={samePlanFail}
        backdrop="static"
        onHidden={() => {
          setSamePlanFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">同じプランには変更出来ません。</div>
          <div className="modal-subtit">再度ためしてください。</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setSamePlanFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 편의점 결제 대기중 결제 */}
      <Modal
        show={waitPayFail}
        backdrop="static"
        onHidden={() => {
          setWaitPayFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">只今決済待ちであるプランがあります。</div>
          <div className="modal-subtit">
            決済をキャンセルして他のプランに変更しますか？
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setIsActive(true);
                setWaitPayFail(false);
              }}
            >
              確認
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                setWaitPayFail(false);
              }}
            >
              取消
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 정기 결제 취소 모달 */}
      <Modal
        show={cancelPayment}
        backdrop="static"
        onHidden={() => {
          setcancelPayment(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">定期決済のキャンセル確認</div>
          <div className="modal-subtit">
            定期決済をするプランです。取り消しますか？
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setcancelPayment(false);
                cancleRegularPayment();
              }}
            >
              確認
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                setcancelPayment(false);
              }}
            >
              取消
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 취소시 기지급한 환불 불가 */}
      <Modal
        show={nonRefundable}
        backdrop="static"
        onHidden={() => {
          setnonRefundable(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">支払済みの金額に対する返金不可の同意</div>
          <div className="modal-subtit">
            定期決済をキャンセルする場合には支払済みの金額は返金ができません。それでもキャンセルしますか？
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setcancelPayment(true);
                setnonRefundable(false);
              }}
            >
              確認
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                setnonRefundable(false);
              }}
            >
              取消
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 정기결제 취소 안내메시지 */}
      <Modal
        show={cancleRegularState}
        backdrop="static"
        onHidden={() => {
          setCancleRegularState(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">{cancleMsg}</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setCancleRegularState(false)
                window.location.reload()
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 결제선택 */}
      <Modal
        show={paymentProcessFail}
        backdrop="static"
        onHidden={() => {
          setPaymentProcessFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">決済方法を選択してください。</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setPaymentProcessFail(false)
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 약관동의 */}
      <Modal
        show={policyProcessFail}
        backdrop="static"
        onHidden={() => {
          setPolicyProcessFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">約款に同意をお願いします。</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setPolicyProcessFail(false)
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>


      {/* 결제 모달 */}
      <Modal className="pay-big-modal"
        show={payModal}
        backdrop="static"
        onHidden={() => {
          setPayModal(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">

            </h2>
            <button className="" onClick={() => {
              setPayModal(false);
            }}>
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="p-10 text-center">

        </ModalBody>
      </Modal>
    </>
  );
};

export default UsePlan;
