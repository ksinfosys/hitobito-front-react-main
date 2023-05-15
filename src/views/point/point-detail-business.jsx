import { Lucide, Modal, ModalBody, ModalHeader } from "@/base-components";
import { useEffect, useRef, useState } from "react";
import $ from "jquery";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { regexUserHypenJoinDate, regexUserPoint } from "../../utils/utils";
import Pagination from "../../components/pagination";
import { useDidMountEffect } from "../../utils/customHooks";
import { useRecoilState } from "recoil";
import { userInfo } from "../../stores/user-info";

// FIX: 배포후에 바꾸어야할것
// 결제완료시에 200떨어지면서 recoil 다시 세팅하는게 오류가남
// historyBalance가 내려오지않는 문제.

function PointDetailBusiness() {

  // userInfo
  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);

  const [PointPaymentModal, setPointPaymentModal] = useState(false);

  const [pgnInfo, setPgnInfo] = useState({});
  const [currentPageIdx, setCurrentPageIdx] = useState(1);

  // 직접입력 인풋 열리는 flag
  const [directPayFlag, setDirectPayFlag] = useState(false);
  const [directPay, setDirectPay] = useState("");

  // priceId에 넘겨줄 상태
  const [priceFlag, setPriceFlag] = useState(0);

  // 결제중일때 결제금액 disabled
  const [isPmntPending, setIsPmntPending] = useState(false);

  // {/* 결제 아이디 호출에 실패 */}
  const [idResponseFail, setIdResponseFail] = useState(false);
  // {/* 결제 최대 금액 초과 */}
  const [maxPriceFail, setMaxPriceFail] = useState(false);
  // {/* 포인트는 1000포인트 단위 */}
  const [pointUnitFail, setPointUnitFail] = useState(false);
  // 직접입력 포인트 없음
  const [pointNullFail, setPointNullFail] = useState(false);
  // 30만엔 넘어가면 나오는 모달
  const [pointLimitFail, setPointLimitFail] = useState(false);
  // 음수 모달
  const [negativeNumberFail, setNegativeNumberFail] = useState(false);

  // 직접입력 인풋
  const directPayRef = useRef(null);

  // 최종 결제 금액
  const [taxPrice, setTaxPrice] = useState("0");

  // 한계 포인트
  const [limitFlag, setLimitFlag] = useState(false);

  const [sessionId, setSessionId] = useState("");

  // 결제 성공 플래그
  const [sucessFlag, setSucessFlag] = useState(false);

  const [dataResult, setDataResult] = useState({});
  const [paymentList, setPaymentList] = useState({});

  // 결제 체크 안할시 나오는 모달
  const [paymentProcessFail, setPaymentProcessFail] = useState(false);
  // 약관 동의 안할시 나오는 모달
  const [policyProcessFail, setPolicyProcessFail] = useState(false);

  // 동의, 비동의 체크
  const [agreeFlag, setAgreeFlag] = useState(false);

  const handleValueChange = e => {
    console.log(e.keyCode)
    let value = e.currentTarget.value.split(",").join("");
    setDirectPay(value);
    if (isNaN(value)) {
      setTaxPrice("0");
    } else {
      let numberPrice = Math.floor(value * 1.1);
      setTaxPrice(regexUserPoint(numberPrice.toString()));
    }
  };

  useEffect(() => {
    getRecentPointList();
  }, []);

  const getRecentPointList = () => {
    axios
      .post(
        "/api/point/payment",
        {
          curPage: currentPageIdx,
        },
        {
          withCredentials: true,
          headers: {
            accessToken: getCookie("accessToken"),
            lastLoginTime: getCookie("lastLoginTime"),
          },
        }
      )
      .then(response => {
        const {
          data: { result },
        } = response;
        console.log(response);
        response.data.resultCode === "200"
          ? (() => {
            setDataResult(result);
            setPaymentList(result.paymentList);
            setPgnInfo(result.pageItem);
            setUserInfoV(prev => ({
              ...prev,
              historyBalance: result.currentBalance
            }))
          })()
          : console.log("fetching error:::", response);
      });
  };

  useDidMountEffect(() => {
    getRecentPointList();
  }, [currentPageIdx]);

  // ** checkout API
  const getPointCheckout = () => {
    axios
      .post(
        "/api/point/checkout",
        {
          quantity: directPay ? directPay : null,
          priceId: priceFlag,
        },
        {
          withCredentials: true,
          headers: {
            accessToken: getCookie("accessToken"),
            lastLoginTime: getCookie("lastLoginTime"),
          },
        }
      )
      .then(response => {
        console.log(response);
        switch (response.data.resultCode) {
          case "200":
            console.log(response.data.result.sessionUrl);
            setSessionId(response.data.result.sessionId);
            localStorage.setItem("sessionId", response.data.result.sessionId);
            setIsPmntPending(true);
            window.open(response.data.result.sessionUrl, "_blank");
            // console.log(response.data.result.sessionId)
            break;
          case "605":
            setIdResponseFail(true);
            break;
          case "612":
            setMaxPriceFail(true);
            break;
          case "614":
            setPointUnitFail(true);
            break;
          case "615":
            setPointNullFail(true);
          default:
            break;
        }
      });
  };

  // // ** checkout 성공했을 때
  // const getSucessResult = () => {
  //   axios
  //     .post(
  //       `/api/stripe/checkout/success/${sessionId}`,
  //       {},
  //       {
  //         withCredentials: true,
  //         headers: {
  //           accessToken: getCookie("accessToken"),
  //           lastLoginTime: getCookie("lastLoginTime"),
  //         },
  //       }
  //     )
  //     .then(response => {
  //       console.log(response)
  //       setSucessData(response.data);
  //       setUserInfoV(prev => ({
  //         ...prev,
  //         historyBalance: response.data.result.historyBalance
  //       }))
  //       window.reload();
  //     })
  //     .catch(error => {
  //       console.log(error)
  //     });
  // };


  // 이용약관

  const [termShow, setTermShow] = useState(false);

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

  return (
    <>
      <div className="point-detail-business">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-sm">
            ポイント購入
          </div>
          <div className="cont-wrap p-5">
            <div className="mt-5">
              <div className="">
                <ul className="flex space-between items-center gap-2 p-3 bg-lo">
                  {dataResult.today && (
                    <li>{regexUserHypenJoinDate(dataResult.today)} 現在</li>
                  )}
                  {dataResult.companyName && (
                    <li className="text-light font-bold text-lg w-59per text-right">
                      {dataResult.companyName}様の現在使用可能なポイントは
                    </li>
                  )}
                  {userInfoV.historyBalance ? (
                    <li className="text-pending font-bold text-2xl">
                      {/* {regexUserPoint(dataResult.currentBalance)}P */}
                      {regexUserPoint(userInfoV.historyBalance)}円
                    </li>
                  ) : (
                    <li className="text-pending font-bold text-2xl">
                      0円
                    </li>
                  )
                  }

                  <li>
                    <button
                      className="btn btn-sm btn-pending"
                      onClick={() => {
                        setPointPaymentModal(true);
                      }}
                    >
                      ポイントを購入する
                    </button>
                  </li>
                </ul>
              </div>
              {/* 테이블 10줄 */}
              <div className="mt-8">
                <p>最近購入したポイントの状況</p>
                <table className="table mt-5">
                  <thead className="table-light text-center">
                    <tr>
                      <th className="whitespace-nowrap text-sm w-10">NO</th>
                      <th className="whitespace-nowrap text-sm">
                        ポイント購入日
                      </th>
                      <th className="whitespace-nowrap text-sm">決済方法</th>
                      <th className="whitespace-nowrap text-sm">購入ポイント</th>
                      <th className="whitespace-nowrap text-sm">
                        決済金額（税込み）
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {paymentList?.length > 0 ? (
                      paymentList.map((point, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{point.rowNumber}</td>
                            <td className="text-slate-400">
                              {regexUserHypenJoinDate(point.chargeDate)}
                            </td>
                            {/* FIX: 신용카드 / 3399 형식에서 신용카드로만 내려옴 */}
                            <td>{point.paymentMethod}</td>
                            <td className="font-bold">
                              {regexUserPoint(point.chargePoint)}円
                            </td>
                            <td className="text-light font-bold">

                              {regexUserPoint(Math.floor(point.paymentAmount * 1.1))}円
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5}>履歴が存在しません。</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <Pagination
          pgnInfo={pgnInfo}
          currentPageIdx={currentPageIdx}
          setCurrentPageIdx={setCurrentPageIdx}
        />
      </div>

      {/* 포인트 구매하기 */}
      <Modal
        size="modal-lg"
        backdrop="static"
        show={PointPaymentModal}
        onHidden={() => {
          setPointPaymentModal(false);
        }}
      >
        <a
          onClick={() => {
            setPointPaymentModal(false);
            setIsPmntPending(false);
          }}
          className="absolute right-0 top-0 mt-3 mr-3"
          href="#"
        >
          <Lucide icon="X" className="w-5 h-5 text-slate-400" onClick={() => {
            setPointPaymentModal(!PointPaymentModal);
            setIsPmntPending(false);
            setAgreeOpen(false);
            setPriceFlag(0);
            setAgreeFlag(0);
            setTaxPrice("0")
            setDirectPay("")
          }} />
        </a>
        <ModalHeader className="flex-col p-5">
          <h2 className="font-bold text-base mr-auto">ポイント決済</h2>
        </ModalHeader>
        <ModalBody className="p-5 plan-pay-modal business-modal">
          <div id="detail-cont">
            {isPmntPending ? (
              <div className="modal-subtit">
                決済が終わったら確認ボタンをクリック、
                <br/>
                もしくはページを切り替えてください。
              </div>
            ) : (
              <>
                <div className="form-check p-2 border">
                  <input
                    id="1-pay"
                    className="form-check-input"
                    type="radio"
                    name="pay_button"
                    value="horizontal-radio-daniel-craig"
                    checked={taxPrice === "11,000"}
                    onChange={() => {
                      setDirectPayFlag(false);
                      setPriceFlag(1);
                      setTaxPrice("11,000");
                    }}
                    onClick={() => {
                      setDirectPayFlag(false);
                      setPriceFlag(1);
                      setTaxPrice("11,000");
                      setDirectPay("")
                    }}
                  />
                  <label
                    className="form-check-label text-sm w-full"
                    htmlFor="1-pay"
                  >
                    10,000ポイント
                  </label>
                </div>
                <div className="form-check p-2 border mt-2">
                  <input
                    id="3-pay"
                    className="form-check-input"
                    type="radio"
                    name="pay_button"
                    value="horizontal-radio-daniel-craig"
                    checked={taxPrice === "33,000"}
                    onChange={() => {
                      setDirectPayFlag(false);
                      setPriceFlag(2);
                      setTaxPrice("33,000");
                    }}
                    onClick={() => {
                      setDirectPayFlag(false);
                      setPriceFlag(2);
                      setTaxPrice("33,000");
                      setDirectPay("")
                    }}
                  />
                  <label
                    className="form-check-label text-sm w-full"
                    htmlFor="3-pay"
                  >
                    30,000ポイント
                  </label>
                </div>
                <div className="form-check p-2 border mt-2">
                  <input
                    id="5-pay"
                    className="form-check-input"
                    type="radio"
                    name="pay_button"
                    value="horizontal-radio-daniel-craig"
                    checked={taxPrice === "55,000"}
                    onChange={() => {
                      setDirectPayFlag(false);
                      setPriceFlag(3);
                      setTaxPrice("55,000");
                    }}
                    onClick={() => {
                      setDirectPayFlag(false);
                      setPriceFlag(3);
                      setTaxPrice("55,000");
                      setDirectPay("")
                    }}
                  />
                  <label
                    className="form-check-label text-sm w-full"
                    htmlFor="5-pay"
                  >
                    50,000ポイント
                  </label>
                </div>
                <div className="form-check p-2 border mt-2">
                  <input
                    id="10-pay"
                    className="form-check-input"
                    type="radio"
                    name="pay_button"
                    value="horizontal-radio-daniel-craig"
                    checked={taxPrice === "110,000"}
                    onChange={() => {
                      setDirectPayFlag(false);
                      setPriceFlag(4);
                      setTaxPrice("110,000");
                    }}
                    onClick={() => {
                      setDirectPayFlag(false);
                      setPriceFlag(4);
                      setTaxPrice("110,000");
                      setDirectPay("")
                    }}
                  />
                  <label
                    className="form-check-label text-sm w-full"
                    htmlFor="10-pay"
                  >
                    100,000ポイント
                  </label>
                </div>
                <div className="form-check p-2 border mt-2">
                  <input
                    id="input-pay"
                    className="form-check-input"
                    type="radio"
                    name="pay_button"
                    value="direct"
                    checked={priceFlag === 5}
                    onChange={() => {
                      setDirectPayFlag(true);
                      setPriceFlag(5);
                      setTaxPrice(0);
                    }}
                    onClick={() => {
                      setDirectPayFlag(true);
                      setPriceFlag(5);
                      setTaxPrice(0);
                    }}
                  />
                  <label
                    className="form-check-label text-sm w-full"
                    htmlFor="input-pay"
                  >
                    直接入力
                    <span className="text-pending ml-2">(1000ポイント 単位)</span>
                  </label>
                </div>
                {directPayFlag && priceFlag === 5 && (
                  <input
                    ref={directPayRef}
                    type="text"
                    id="direct-pay"
                    className="form-check p-2 mt-2 w-full"
                    placeholder="最大 300,000ポイント"
                    value={regexUserPoint(directPay.split(",").join(""))}
                    onKeyUp={(e) => {
                      if (e.keyCode === 189) {
                        setNegativeNumberFail(true)
                      }
                    }}
                    onChange={handleValueChange}
                  />
                )}
            <ul className="flex space-between items-center p-3 bg-lo mt-2">
              <li className="font-bold text-lg text-right">
                決済金額（税込み）
              </li>
              <li className="text-pending font-bold text-2xl">￥{taxPrice}</li>
            </ul>
            </>     
            )}

          </div>
          {
            !isPmntPending && (
              <div className="w-full">
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
            )
          }
          <div id="detail-modal-btn" className="flex justify-end pt-5">
            <div>
              {sessionId.length > 0 ? (
                <button
                  type="button"
                  className="btn btn-sm btn-pending w-24 mr-2"
                  onClick={() => {
                    // getSucessResult();
                    setPointPaymentModal(!PointPaymentModal);
                    setPriceFlag(0);
                    setAgreeFlag(0);
                    setTaxPrice("0");
                    setDirectPay("");
                    window.location.reload();
                  }}
                >
                  決済完了
                </button>
              ) : (
                <button
                  type="button"
                  className={`btn btn-sm w-24 mr-2 ${priceFlag !== 0 && agreeFlag ? "btn-pending" : "btn-grey-pending"}`}
                  onClick={() => {
                    //   setPointPaymentModal(!PointPaymentModal);
                    setPointLimitFail(false);
                    if (Number(taxPrice.split(",").join("")) >= 300000) {
                      setPointLimitFail(true);
                    } else if (priceFlag === 0) {
                      setPaymentProcessFail(true);
                    } else if (agreeFlag === false) {
                      setPolicyProcessFail(true)
                    } else if (priceFlag === 5) {
                      // 직접입력시
                      getPointCheckout(priceFlag, directPay);
                    } else if (priceFlag !== 0) {
                      getPointCheckout(priceFlag);
                    } else {

                    }
                  }}
                >
                  次へ             </button>
              )}
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary w-24"
                onClick={() => {
                  setPointPaymentModal(!PointPaymentModal);
                  setIsPmntPending(false);
                  setAgreeOpen(false);
                  setPriceFlag(0);
                  setAgreeFlag(0);
                  setTaxPrice("0")
                  setDirectPay("")
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {/* 최대입력 포인트 초과 */}
      <Modal
        show={pointLimitFail}
        onHidden={() => {
          setPointLimitFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">購入金額超過</div>
          <div className="modal-subtit">最大30万円まで購入できます</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setPointLimitFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 결제 아이디 호출에 실패 */}
      <Modal
        show={idResponseFail}
        onHidden={() => {
          setIdResponseFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">決済ID呼び出しに失敗しました。</div>
          <div className="modal-subtit">再度ためしてください</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setIdResponseFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 직접입력 포인트 없음 */}
      <Modal
        show={pointNullFail}
        onHidden={() => {
          setPointNullFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">購入するポイントを入力してください</div>
          <div className="modal-subtit">購入するポイントを入力してください</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setPointNullFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 결제 최대금액 초과 */}
      <Modal
        show={maxPriceFail}
        onHidden={() => {
          setMaxPriceFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">決済最大額を超えました。</div>
          <div className="modal-subtit">
            1,000,000ポイント以下を入力してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setMaxPriceFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 결제 포인트 단위 실패 */}
      <Modal
        show={pointUnitFail}
        onHidden={() => {
          setPointUnitFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">決済に失敗しました。</div>
          <div className="modal-subtit">
            ポイントは1000ポイント単位で入力してください
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setPointUnitFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 결제 성공, 실패 */}
      <Modal
        show={sucessFlag}
        onHidden={() => {
          setSucessFlag(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          {/* <div className="modal-subtit">
            ポイントは1000ポイント単位で入力してください
          </div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setSucessFlag(false);
                setPointPaymentModal(false);
                setIsPmntPending(false);
                setPriceFlag(0);
                setDirectPayFlag(false);
                setSessionId("");
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
        onHidden={() => {
          setPaymentProcessFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">결제 방법을 선택해주세요</div>
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
        onHidden={() => {
          setPolicyProcessFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">약관을 동의해주세요</div>
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

      {/* 음수 모달 */}
      <Modal
        show={negativeNumberFail}
        onHidden={() => {
          setNegativeNumberFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">w</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-business"
              onClick={() => {
                setNegativeNumberFail(false)
                setDirectPay("")
                directPayRef.current.focus()
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

export default PointDetailBusiness;
