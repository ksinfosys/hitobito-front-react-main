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
                setBusinessPlan({
                  isOpen: 1,
                  sessionId: response.data.result.sessionId,
                  isOpenWindow: 0
                })
                window.location.href = response.data.result.sessionUrl;
              } else {
                setBusinessPlan({
                  isOpen: 1,
                  sessionId: response.data.result.sessionId,
                  isOpenWindow: 1
                })
                window.open(response.data.result.sessionUrl, "_blank");
              }
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
    if(BusinessPlan.isOpen === 2){
      setBusinessPlan({
        isOpen: 0,
        sessionId: '',
        isOpenWindow: BusinessPlan.isOpenWindow
      })
      if(BusinessPlan.isOpenWindow === 1){
        window.close();
      } else {
        setBusinessPlan({
          isOpen: 0,
          sessionId: '',
          isOpenWindow: 0
        })
        window.location.replace("/use-plan");
      }
    } 
  },[BusinessPlan.isOpen])

  return (
    <>
      {/* 변경 전 기본 플랜 */}
      <div id="business" className="use-plan">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-sm">
            利用プラン設定
          </div>
          {
            planList?.planCode === "P0000"
            ?
            <div className="pt-10 pb-10 p-5 cont-wrap flex flex-col items-center justify-center">
            <ul className="use-plan-box text-center flex gap-5 w-full mb-10">
              <li className={"active"}>
                <ul className="flex flex-col gap-5">
                <li className="font-bold text-lg">フリープラン</li>
                  <li>
                    <li className="">
                      面接依頼1回
                      <br />
                      <p className="font-bold mb-4 mt-2 pointText">20,000ポイント</p>
                    </li>
                    <p className="bg-lo2 text-pending font-bold text-lg p-2">
                      無料/月
                    </p>
                  </li>
                  <li className="">
                    &nbsp;
                  </li>
                </ul>
                <button
                  type="button"
                  className="btn btn-outline-pending bg-white mt-5 w-full disabled"
                >
                  利用中
                </button>
              </li>
              <li className="">
                <ul className="flex flex-col gap-5">
                <li className="font-bold text-lg">プランA</li>
                  <li>
                    <li className="">
                      面接依頼1回
                      <br />
                      <p className="font-bold mb-4 mt-2  pointText">5,000ポイント</p>
                    </li>
                    <p className="bg-lo2 text-pending font-bold text-lg p-2">
                      15,000円/月
                    </p>
                  </li>
                  <li className="">
                    税込み：16,500円/月
                  </li>
                </ul>
                <button
                  type="button"
                  className={"btn btn-pending mt-5 w-full"}
                  onClick={() => {
                    setIsPlanCode("P0001");
                    document.getElementById('planPaymentModalTitle').textContent = 'プランＡ';
                    document.getElementById('payTwoMonth').textContent = '2%割引：(税込)33,000円⇒(税込)32,340円';
                    document.getElementById('payThreeMonth').textContent = '4%割引：(税込)49,500円⇒(税込)47,520円';
                    document.getElementById('paySixMonth').textContent = '10%割引：(税込)99,000円⇒(税込)89,100円';
                    console.log("abdfwe");
                    setPlanPaymentModal(true);

                    
                  }}
                >
                  変更する
                </button>
              </li>
              <li className="">
                <ul className="flex flex-col gap-5">
                <li className="font-bold text-lg">プランB</li>
                  <li>
                    <li className="">
                      面接依頼1回
                      <br />
                      <p className="font-bold mb-4 mt-2  pointText">3,000ポイント</p>
                    </li>
                    <p className="bg-lo2 text-pending font-bold text-lg p-2">
                      30,000円/月
                    </p>
                  </li>
                  <li className="">
                    税込み：33,000円/月
                  </li>
                </ul>
                <button
                  type="button"
                  className={ "btn btn-pending mt-5 w-full"}
                  onClick={() => {
                    setIsPlanCode("P0002");
                    document.getElementById('planPaymentModalTitle').textContent = 'プランＢ';
                    document.getElementById('payTwoMonth').textContent = '2%割引：(税込)66,000円⇒(税込)64,680円';
                    document.getElementById('payThreeMonth').textContent = '4%割引：(税込)99,000円⇒(税込)95,040円';
                    document.getElementById('paySixMonth').textContent = '10%割引：(税込)198,000円⇒(税込)178,200円';
                    setPlanPaymentModal(true);
                    
                  }}
                >
                  変更する
                </button>
              </li>
            </ul>

          </div>
          :
          <div className="pt-10 pb-10 p-5 cont-wrap flex flex-col items-center justify-center">
            <ul className="use-plan-box text-center flex gap-5 w-full mb-10">
              <li className="">
                <ul className="flex flex-col gap-5">
                  <li className="font-bold text-lg">フリープラン</li>
                  <li>
                    <li className="">
                      面接依頼1回
                      <br />
                      <p className="font-bold mb-4 mt-2  pointText">20,000ポイント</p>
                    </li>
                    <p className="bg-lo2 text-pending font-bold text-lg p-2">
                      無料/月
                    </p>
                  </li>
                  <li className="">
                    &nbsp;
                  </li>
                </ul>
                <button
                  type="button"
                  // 변경하기 눌렀을시 결제모달이 안나와서 선택됨을 알리는 색 변경
                  className={"btn btn--grey-pending mt-5 w-full hidbtn"}
                  onClick={() => {
                    // setIsPlanCode("P0000");
                    // 프리플랜으로의 변경은 결제모달 필요없음
                    // setIsActive((prev) => !prev);
                    // setPlanPaymentModal(true);
                  }}
                >
                  変更する
                </button>
              </li>
              <li className={planList?.planCode === "P0001" ? "active" : null}>
                <ul className="flex flex-col gap-5">
                  <li className="font-bold text-lg">プランA</li>
                  <li>
                    <li className="">
                      面接依頼1回
                      <br />
                      <p className="font-bold mb-4 mt-2  pointText">5,000ポイント</p>
                    </li>
                    <p className="bg-lo2 text-pending font-bold text-lg p-2">
                      15,000円/月
                    </p>
                  </li>
                  <li className="">
                    税込み：16,500円/月
                  </li>
                </ul>
                {planList.planCode === "P0001" ? (
                  <button
                    type="button"
                    className="flex flex-col btn btn-outline-pending bg-white mt-5 w-full disabled"
                    onClick={() => {
                      document.getElementById('planPaymentModalTitle').textContent = 'プランＡ';
                      document.getElementById('payTwoMonth').textContent = '2%割引：(税込)33,000円⇒(税込)32,340円';
                      document.getElementById('payThreeMonth').textContent = '4%割引：(税込)49,500円⇒(税込)47,520円';
                      document.getElementById('paySixMonth').textContent = '10%割引：(税込)99,000円⇒(税込)89,100円';
                      if (planList.invalidFlag === "8") {
                        setWaitPayFail(true);
                      }
                    }}
                  >
                    {planList.invalidFlag === "8"
                      ? "コンビニ決済待ち"
                      : "利用中"}
                    {planList.invalidFlag !== "8" ? (
                      <div>
                        {regexUserJoinDate(planList.planEndDate) == "2100/12/31" ? 
                        "定期購読中(" + regexUserJoinDate(planList.planStartDate) + ")" 
                        : 
                        regexUserJoinDate(planList.planStartDate)+ " ~ " + regexUserJoinDate(planList.planEndDate)}
                      </div>
                    ) : null}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={
                      planList.planCode === "P0001" || planList?.planEndDate === "21001231"
                        ? "btn btn--grey-pending mt-5 w-full disabled"
                        : "btn btn-pending mt-5 w-full"
                    }
                    onClick={planList?.planEndDate !== "21001231" ? () => {
                      setIsPlanCode("P0001");
                      document.getElementById('planPaymentModalTitle').textContent = 'プランＡ';
                      document.getElementById('payTwoMonth').textContent = '2%割引：(税込)33,000円⇒(税込)32,340円';
                      document.getElementById('payThreeMonth').textContent = '4%割引：(税込)49,500円⇒(税込)47,520円';
                      document.getElementById('paySixMonth').textContent = '10%割引：(税込)99,000円⇒(税込)89,100円';
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
                    <li className="">
                      面接依頼1回
                      <br />
                      <p className="font-bold mb-4 mt-2  pointText">3,000ポイント</p>
                    </li>
                    <p className="bg-lo2 text-pending font-bold text-lg p-2">
                      30,000円/月
                    </p>
                  </li>
                  <li className="">
                    税込み：33,000円/月
                  </li>
                </ul>
                {planList.planCode === "P0002" ? (
                  
                  <button
                    type="button"
                    className="flex flex-col btn btn-outline-pending bg-white mt-5 w-full disabled"
                    onClick={() => {
                      document.getElementById('planPaymentModalTitle').textContent = 'プランＢ';
                      document.getElementById('payTwoMonth').textContent = '2%割引：(税込)66,000円⇒(税込)64,680円';
                      document.getElementById('payThreeMonth').textContent = '4%割引：(税込)99,000円⇒(税込)95,040円';
                      document.getElementById('paySixMonth').textContent = '10%割引：(税込)198,000円⇒(税込)178,200円';
                      if (planList.invalidFlag === "8") {
                        setWaitPayFail(true);
                      }
                    }}
                  >
                    {planList.invalidFlag === "8"
                      ? "コンビニ決済待ち"
                      : "利用中"}
                    <br />

                    {planList.invalidFlag !== "8" ? (
                      <div>
                      {regexUserJoinDate(planList.planEndDate) == "2100/12/31" ? 
                      "定期購読中(" + regexUserJoinDate(planList.planStartDate) + ")" 
                      : 
                      regexUserJoinDate(planList.planStartDate)+ " ~ " + regexUserJoinDate(planList.planEndDate)}
                      </div>
                    ) : null}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={
                      planList.planCode === "P0002" || planList?.planEndDate === "21001231"
                        ? "btn btn--grey-pending mt-5 w-full disabled"
                        : "btn btn-pending mt-5 w-full"
                    }
                    onClick={planList?.planEndDate !== "21001231" ? () => {
                      setIsPlanCode("P0002");
                      document.getElementById('planPaymentModalTitle').textContent = 'プランＢ';
                      document.getElementById('payTwoMonth').textContent = '2%割引：(税込)66,000円⇒(税込)64,680円';
                      document.getElementById('payThreeMonth').textContent = '4%割引：(税込)99,000円⇒(税込)95,040円';
                      document.getElementById('paySixMonth').textContent = '10%割引：(税込)198,000円⇒(税込)178,200円';
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
          }
          {/* 기존코드 */}
          {/* <div className="pt-10 pb-10 p-5 cont-wrap flex flex-col items-center justify-center">
            <ul className="use-plan-box text-center flex gap-5 w-full mb-10">
              <li className={planList?.planCode === "P0000" ? "active" : null}>
                <ul className="flex flex-col gap-5">
                  <li className="font-bold text-lg">フリープラン</li>
                  <li>
                    <p className="bg-lo2 text-pending font-bold text-lg p-2">
                      無料/月
                    </p>
                    <p className="text-white text-sm mt-2">(税金別途)</p>
                  </li>
                  <li className="">
                    面接依頼1件につき 20,000Pで
                    <br />
                    毎月のご利用料金なし
                  </li>
                </ul>
                {planList.planCode === "P0000" ? (
                  <button
                    type="button"
                    className="btn btn-outline-pending bg-white mt-5 w-full disabled"
                  >
                    利用中
                  </button>
                ) : (
                  <button
                    type="button"
                    // 변경하기 눌렀을시 결제모달이 안나와서 선택됨을 알리는 색 변경
                    className={
                      planList.planCode === "P0000" && isActive
                        ? "btn btn-outline-pending bg-white mt-5 w-full"
                        : "btn btn--grey-pending mt-5 w-full hidbtn"
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
                    <p className="bg-lo2 text-pending font-bold text-lg p-2">
                      15,000円/月
                    </p>
                    <p className="text-warning text-sm mt-2">(税金別途)</p>
                  </li>
                  <li className="">
                    面接依頼1件につき 5,000円で
                    <br />
                    毎月のご利用料金 15,000円
                  </li>
                </ul>
                {planList.planCode === "P0001" ? (
                  <button
                    type="button"
                    className="flex flex-col btn btn-outline-pending bg-white mt-5 w-full disabled"
                    onClick={() => {
                      if (planList.invalidFlag === "8") {
                        setWaitPayFail(true);
                      }
                    }}
                  >
                    {planList.invalidFlag === "8"
                      ? "コンビニ決済待ち"
                      : "利用中"}
                    {planList.invalidFlag !== "8" ? (
                      <div>
                        {regexUserJoinDate(planList.planEndDate) == "2100/12/31" ? 
                        "定期購読中(" + regexUserJoinDate(planList.planStartDate) + ")" 
                        : 
                        regexUserJoinDate(planList.planStartDate)+ " ~ " + regexUserJoinDate(planList.planEndDate)}
                      </div>
                    ) : null}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={
                      planList.planCode === "P0001" || planList?.planEndDate === "21001231"
                        ? "btn btn--grey-pending mt-5 w-full disabled"
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
                    <p className="bg-lo2 text-pending font-bold text-lg p-2">
                      30,000円/月
                    </p>
                    <p className="text-warning text-sm mt-2">(税金別途)</p>
                  </li>
                  <li className="">
                    面接依頼1件につき 3,000Pで
                    <br />
                    毎月のご利用料金 30,000円
                  </li>
                </ul>
                {planList.planCode === "P0002" ? (
                  <button
                    type="button"
                    className="flex flex-col btn btn-outline-pending bg-white mt-5 w-full disabled"
                    onClick={() => {
                      if (planList.invalidFlag === "8") {
                        setWaitPayFail(true);
                      }
                    }}
                  >
                    {planList.invalidFlag === "8"
                      ? "コンビニ決済待ち"
                      : "利用中"}
                    <br />

                    {planList.invalidFlag !== "8" ? (
                      <div>
                      {regexUserJoinDate(planList.planEndDate) == "2100/12/31" ? 
                      "定期購読中(" + regexUserJoinDate(planList.planStartDate) + ")" 
                      : 
                      regexUserJoinDate(planList.planStartDate)+ " ~ " + regexUserJoinDate(planList.planEndDate)}
                      </div>
                    ) : null}
                  </button>
                ) : (
                  <button
                    type="button"
                    className={
                      planList.planCode === "P0002" || planList?.planEndDate === "21001231"
                        ? "btn btn--grey-pending mt-5 w-full disabled"
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

          </div> */}
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
          <h2 className="font-bold text-base mr-auto " id="planPaymentModalTitle"></h2>
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
                  2ヶ月決済 <span className="text-pending" id="payTwoMonth"></span>
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
                  3ヶ月決済 <span className="text-pending" id="payThreeMonth"></span>
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
                  6ヶ月決済 <span className="text-pending" id="paySixMonth"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="border-t w-full">
            <div className="pt-10 pb-3 border-b">    
              決済規約に同意{" "}                                           
            </div>
            {/* <div className="pt-10 pb-3 border-b">
              決済規約に同意{" "}
              <span className="text-sm text-pending ml-2">
                以下の規約を読んでいただいた後に決済が可能です。
              </span>
            </div> */}
            <div ref={termsRef} className="agree-text text-slate-300 p-2 border-b text-sm" >
              <a onClick={() => {window.open('/plan-detail');}} style={{cursor:"pointer"}}>
                ＜決済規約を確認するにはクリック＞
              </a>              
            </div>
            <div className="flex space-between pt-3">
                  <p>決済規約に同意しますか？</p>
                  {
                    (
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

          <div id="detail-modal-btn" className="flex justify-end pt-5">
            <button
              type="button"
              className={`btn btn-sm w-24 mr-2 ${isActive && agreeFlag ? "btn-pending" : "btn-secondary"}`}
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
              次へ
            </button>
            {/* <button
              type="button"
              className="btn btn-sm w-24 mr-2"
              onClick={() => {
                //現在のプランコードに戻す
                setIsPlanCode(planList.planCode);
                //現在のペイメントメソッドに戻す
                setIsPaymentMethod(planList.paymentMethod);
                //選択解除
                setIsActive(false);
                setPlanPaymentModal(false);
                setAgreeOpen(false)
              }}
            >
              キャンセル
            </button> */}
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
            決済が終わったら確認ボタンをクリック、
            <br/>
            もしくはページを切り替えてください。
          </div>
          <div className="flex flex-end gap-3">
            {sessionId?.length > 0 ? (
              <a
                href="#"
                className="btn btn-pending"
                onClick={() => {
                  setSucessFlag(true);
                  setChangeConfirmModal(false);
                  setIsPmntPending(false);
                  setSessionId("");
                  window.location.replace("/use-plan");
                }}
              >
                確認
              </a>
            ) : (
              <>
                <a
                  href="#"
                  className="btn btn-pending"
                  onClick={() => {
                    // setChangeConfirmModal(false);
                    getCheckOut(isplanCode, isPaymentMethod);
                  }}
                >
                  次へ
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
              はい
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                setWaitPayFail(false);
              }}
            >
              いいえ
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
              はい
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                setcancelPayment(false);
              }}
            >
              いいえ
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
              はい
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                setnonRefundable(false);
              }}
            >
              いいえ
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
          <div className="modal-tit">決済規約に同意をお願いします。</div>
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
    </>
  );
};

export default UsePlan;
