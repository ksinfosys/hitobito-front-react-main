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
                      {dataResult.companyName}様の現在使用可能なポイント数は
                    </li>
                  )}
                  {userInfoV.historyBalance ? (
                    <li className="text-pending font-bold text-2xl text-lg">
                      {/* {regexUserPoint(dataResult.currentBalance)}P */}
                      {regexUserPoint(userInfoV.historyBalance)}ポイント
                    </li>
                  ) : (
                    <li className="text-pending font-bold text-2xl">
                      0ポイント
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
                      <th className="whitespace-nowrap text-sm">購入ポイント数</th>
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
                            <td>
                              {point.paymentMethod == "短期決済カード" ? "クレジット決済" : "コンビニ決済"}
                            </td>
                            <td className="font-bold">
                              {regexUserPoint(point.chargePoint)}P
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
            setAgreeOpen(false);
          }}
          className="absolute right-0 top-0 mt-3 mr-3"
          href="#"
        >
          <Lucide icon="X" className="w-5 h-5 text-slate-400" />
        </a>
        <ModalHeader className="flex-col">
          <h2 className="font-bold text-base mr-auto">ポイント購入</h2>
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
                  ＜決済規約＞
                  <br />
                  本決済規約（以下、「本規約」といいます。）は、KS情報システム株式会社（以下、「当社」といいます。）が提供するアプリ「hitobito」（以下、「本アプリ」といいます。）の企業側における決済行為に関する規定です。本規約にご同意いただくことで、本アプリの決済機能を利用することができます。本アプリの利用にあたっては、本規約をよくお読みいただき、ご理解いただいた上でご利用ください。
                  <br />
                  <p></p>
                  <br />
                  ポイント購入に関する決済
                  <br />
                  1.1 ポイントは、本アプリ内の面談依頼機能を利用するために必要なものです。ポイントは購入することで取得され、ポイントの有効期限は設定されておりません。
                  <br />
                  1.2 ポイントの購入には、以下の決済方法が利用できます。
                  <br />
                  1.2.1 クレジット決済：クレジットカード情報を使用しての決済が可能です。
                  <br />
                  1.2.2 コンビニ決済：指定されたコンビニエンスストアでの支払いが可能です。
                  <br />
                  1.3 ポイントの購入後、一度購入したポイントは返金や換金ができません。ご注意ください。
                  <br />
                  <p></p>
                  <br />
                  有料プランに伴う利用料の支払い
                  <br />
                  2.1 本アプリには有料プランが設定されており、有料プランの利用には一定の利用料が発生します。
                  <br />
                  2.2 有料プランの利用料は、以下の決済方法を利用して支払うことができます。
                  <br />
                  2.2.1 クレジット決済：クレジットカード情報を使用しての決済が可能です。
                  <br />
                  2.2.2 コンビニ決済：指定されたコンビニエンスストアでの支払いが可能です。
                  <br />
                  2.3 支払済の利用料については、一度支払った利用料の払い戻しはできません。ご注意ください。
                  <br />
                  <p></p>
                  <br />
                  ポイント残高と未使用の利用料に関する取扱い
                  <br />
                  3.1 退会時にポイント残高や未使用の利用料があっても、返金や換金は一切行われません。ご了承ください。
                  <br />
                  決済代行会社の利用規約
                  <br />
                  4.1 当社は、決済処理を行うために、決済代行会社を利用しています。決済代行会社の利用規約は、本アプリの利用規約とは別に適用されます。決済代行会社の利用規約には、決済手続き、個人情報の取り扱い、セキュリティ対策などに関する規定が含まれています。本アプリの決済機能を利用する際には、決済代行会社の利用規約にもご留意いただく必要があります。
                  <br />
                  クレジット情報の取り扱い
                  <br />
                  5.1 当社は、クレジット決済において利用されるクレジットカード情報を一切保持しません。クレジットカード情報は、決済代行会社を通じて直接処理されます。当社はクレジットカード情報の安全性を確保するために、適切な技術的対策を講じますが、クレジットカード情報の管理については決済代行会社の利用規約が適用されます。
                  <br />
                  <p></p>
                  <br />
                  免責事項
                  <br />
                  6.1 当社は、決済機能の提供に際して合理的な注意を払い、安全性を確保するために努力しますが、以下の場合において生じた損害について一切の責任を負いません。
                  <br />
                  6.1.1 システム障害や通信回線の不具合による決済処理の遅延、中断、失敗等の問題。
                  <br />
                  6.1.2 本アプリの利用者が不正行為を行った場合や第三者による不正アクセスなどによって生じた損害。
                  <br />
                  6.1.3 決済代行会社による決済処理や個人情報の取り扱いに関する問題。
                  <br />
                  <p></p>
                  <br />
                  利用規約の変更
                  <br />
                  7.1 当社は、必要に応じて本決済規約を変更することがあります。変更後の利用規約は、本アプリ上での掲示または通知により公表されます。変更後の利用規約にご同意いただくことで、引き続き本アプリの決済機能を利用することができます。
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
                  className={`btn btn-sm w-24 mr-2 ${priceFlag !== 0 && agreeFlag ? "btn-pending" : "btn-secondary"}`}
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
                  次へ</button>
              )}
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
          {/* <div className="modal-subtit">購入するポイントを入力してください</div> */}
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
