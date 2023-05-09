import { Lucide, Modal, ModalBody } from "@/base-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import Pagination from "../../components/pagination";
import { userInfo } from "../../stores/user-info";
import { getCookie } from "../../utils/cookie";
import { useDidMountEffect } from "../../utils/customHooks";
import { regexUserHypenJoinDate, regexUserJoinDate, regexUserPoint, replaceToPointFormat } from "../../utils/utils";

function PointDetail() {
  const navigate = useNavigate();

  // S : 에러

  // Front

  // 500엔단위 실패
  const [pointFail, setPointFail] = useState(false);
  // 이용가능한 포인트 초과
  const [limitFail, setLimitFail] = useState(false);
  // 반각 숫자만 입력
  const [numberFail, setNumberFail] = useState(false);

  // back

  // 기프트카드 생성 실패
  const [gcCardfail, setGcCardFail] = useState(false);
  // 0이하의 숫자 입력 불가
  const [minusNumberfail, setMinusNumberFail] = useState(false);
  // 포인트 범위 초과
  const [errorLimitfail, setErrorLimitFail] = useState(false);
  // Id생성 실패
  const [createIdfail, setCreateIdFail] = useState(false);
  // 카드의 등록 실패
  const [registCardfail, setRegistCardFail] = useState(false);

  // E : 에러

  const [result, setResult] = useState({});

  //   기프트 카드로 교환할 포인트
  const [amount, setAmount] = useState(0);
  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);

  console.log("result::", result)

  useEffect(() => {
    getGiftPointList();
  }, []);

  const getGiftPointList = () => {
    axios
      .get("/api/point/exchange", {
        withCredentials: true,
        headers: {
          accessToken: getCookie("accessToken"),
          lastLoginTime: getCookie("lastLoginTime"),
        },
      })
      .then((response) => {
        // response넣기
        console.log(response);
        const {
          data: { result },
        } = response;
        response.data.resultCode === "200"
          ? (() => {
              setResult(result);
              setUserInfoV(prev => ({
                ...prev,
                historyBalance : result.currentPoint
              }))
            })()
          : console.log("fetching error:::", response);
      });
  };

  const exchangePoint = () => {
    axios
      .post(
        "/api/point/exchange",
        {
          amount,
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
        const {
          data: { result },
        } = response;
        console.log(response);
        (() => {
          switch (response.data.resultCode) {
            case "200":
              navigate("/giftcard-regist", {
                state: {
                  agc: {
                    amount: response.data.result.agc.amount,
                    gcClaimCode: response.data.result.agc.gcClaimCode,
                  },
                  historyBalance: response.data.result.agc.historyBalance,
                },
              });
              // FIXME: 포인트 있는경우 확인 필요.
              setUserInfoV(prev => ({
                ...prev,
                historyBalance: historyBalance - response.data.result.agc.historyBalance,
              }))
              break;
            case "602":
              // 602에러시
              // setGcCardFail(true);
              break;
            case "606":
              setMinusNumberFail(true);
              break;
            case "605":
              setErrorLimitFail(true);
              break;
            case "601":
              setCreateIdFail(true);
              break;
            case "603":
              setRegistCardFail(true);
              break;
          }
        })();
        // response.data.resultCode === "200"
        //   ? (() => {
        //       console.log(response);
        //     })()
        //   : console.log("fetching error:::", response);
      });
  };

  return (
    <>
      <div id="point-detail">
        <ul className="col-span-12 flex border-b-2 w/3 mobile_block">
          <li>
            <button type="button" class="p-2 tab-btn tab-active w-full">
              <a href="/point-detail">ポイント確認交換</a>
            </button>
          </li>
          <li>
            <button type="button" class="p-2 tab-btn w-full">
              <a href="/giftcard-regist">ギフトカード登録</a>
            </button>
          </li>
          <li>
            <button type="button" class="p-2 tab-btn w-full">
              <a href="/giftcard-record">ギフト交換履歴</a>
            </button>
          </li>
        </ul>
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-lg font-bold lg:text-sm lg:font-normal">
          ポイント確認/交換
          </div>
          <div className="cont-wrap p-5">
            <div className="mt-5">
              <div className="">
                <ul className="relative flex flex-col lg:flex-row space-between items-center sm:gap-2 p-3 bg-lb">
                  <li className="absolute -top-6 right-0 lg:relative lg:top-0 text-sm lg:text-normal text-slate-400 shrink-0">
                    {result.today &&
                      regexUserHypenJoinDate(result.today) + "現在"}
                  </li>
                  <li className="w-full">
                    <div className="flex lg:justify-end justify-center  items-center">
                      <div className="text-dark font-bold lg:text-lg lg:w-3/5 text-left lg:text-right mr-12">{result?.nickname}様の現在使用できるポイントは</div>
                      <div className="text-primary font-bold lg:text-2xl">{result.currentPoint && regexUserPoint(result.currentPoint)}P</div>
                    </div>
                  </li>
                </ul>
                <ul className="relative flex flex-col lg:flex-row space-between items-center gap-2 p-3 bg-lb mt-12 lg:mt-4">
                  <li className="expect-point-date absolute -top-6 right-0 lg:relative lg:top-0 text-sm lg:text-normal text-slate-400">
                    {result.expectedDate &&
                      regexUserHypenJoinDate(result.expectedDate) }
                  </li>
                  <li  className="w-full">
                    <div className="flex lg:justify-end justify-center  items-center">
                      <div className="text-dark font-bold lg:text-lg lg:w-3/5 text-left lg:text-right mr-12">
                        {result?.nickname}様の {result.expectedDate && replaceToPointFormat(result.expectedDate)} 積立予定ポイントは
                      </div>
                      <div className="text-primary font-bold lg:text-2xl">
                        {result.expectedPoint && regexUserPoint(result.expectedPoint)}P
                      </div>
                    </div>   
                  </li>
                </ul>
                <div className="flex flex-end flex-col lg:flex-row gap-5 mt-5">
                  <p>交換するポイントを入力してください。</p>
                  <div className="flex gap-5 space-between">
                    <div className="point-input border-b-2">
                      <input
                        type="text"
                        placeholder="0000"
                        className="w-24"
                        onChange={(e) => {
                          setAmount(e.currentTarget.value);
                        }}
                      />
                      <span className="font-bold ml-2">P</span>
                    </div>
                    <button
                      className="btn btn-sm btn-primary w-24 mr-2"
                      onClick={() => {
                        if (amount % 500 !== 0) {
                          setPointFail(true);
                          return;
                        } else if (amount % 500 === 0) {
                          exchangePoint();
                        } else {
                          alert("");
                        }
                      }}
                    >
                      交換する
                    </button>
                  </div>
                </div>
              </div>
              {/* 테이블 10줄
              <div className="mt-8">
                <p className="font-bold lg:font-normal">적립예정</p>
                <table className="table mt-5 pc">
                  <thead className="table-light text-center">
                    <tr>
                      <th className="whitespace-nowrap text-sm">날짜</th>
                      <th className="whitespace-nowrap text-sm">적립 예정일</th>
                      <th className="whitespace-nowrap text-sm">적립 포인트</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr>
                      <td className="text-slate-400">2023-01-02</td>
                      <td>2월 1일 적립예정 포인트는</td>
                      <td className="text-primary font-bold">1,500p</td>
                    </tr>
                  </tbody>
                </table>
                {/* 모바일 테이블 /}
                <table className="table mt-5 mo">
                  <tbody className="text-center">
                    <tr>
                      <td className="text-slate-400">23-01-02</td>
                      <td>2월 1일 적립예정 포인트는</td>
                      <td className="text-primary font-bold">1,500p</td>
                    </tr>
                    <tr>
                      <td className="text-slate-400">23-01-02</td>
                      <td>2월 1일 적립예정 포인트는</td>
                      <td className="text-primary font-bold">1,500p</td>
                    </tr>
                    <tr>
                      <td className="text-slate-400">23-01-02</td>
                      <td>2월 1일 적립예정 포인트는</td>
                      <td className="text-primary font-bold">1,500p</td>
                    </tr>
                    <tr>
                      <td className="text-slate-400">23-01-02</td>
                      <td>2월 1일 적립예정 포인트는</td>
                      <td className="text-primary font-bold">1,500p</td>
                    </tr>
                    <tr>
                      <td className="text-slate-400">23-01-02</td>
                      <td>2월 1일 적립예정 포인트는</td>
                      <td className="text-primary font-bold">1,500p</td>
                    </tr>
                    <tr>
                      <td className="text-slate-400">23-01-02</td>
                      <td>2월 1일 적립예정 포인트는</td>
                      <td className="text-primary font-bold">1,500p</td>
                    </tr>
                    <tr>
                      <td className="text-slate-400">23-01-02</td>
                      <td>2월 1일 적립예정 포인트는</td>
                      <td className="text-primary font-bold">1,500p</td>
                    </tr>
                    <tr>
                      <td className="text-slate-400">23-01-02</td>
                      <td>2월 1일 적립예정 포인트는</td>
                      <td className="text-primary font-bold">1,500p</td>
                    </tr>
                    <tr>
                      <td className="text-slate-400">23-01-02</td>
                      <td>2월 1일 적립예정 포인트는</td>
                      <td className="text-primary font-bold">1,500p</td>
                    </tr>
                    <tr>
                      <td className="text-slate-400">23-01-02</td>
                      <td>2월 1일 적립예정 포인트는</td>
                      <td className="text-primary font-bold">1,500p</td>
                    </tr>
                  </tbody>
                </table>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* 500포인트 단위 실패 */}
      <Modal
        show={pointFail}
        onHidden={() => {
          setPointFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            Amazonのギフト券への交換は５００ポイント単位で<br />お願いします。
          </div>
          {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setPointFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 입력한 포인트 초과 실패 */}
      <Modal
        show={limitFail}
        onHidden={() => {
          setLimitFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            入力したポイント数が利用可能ポイント数を超えています。
          </div>
          {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setLimitFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 숫자만 입력가능 실패 */}
      <Modal
        show={numberFail}
        onHidden={() => {
          setNumberFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            交換は半角の数字のみ入力可能です。
          </div>
          {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setNumberFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 기프트 카드 생성 실패 */}
      <Modal
        show={gcCardfail}
        onHidden={() => {
          setGcCardFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            ギフトカード生成に失敗しました。再度ためしてください。
          </div>
          {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setGcCardFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 0이하의 숫자 입력 불가 실패 */}
      <Modal
        show={minusNumberfail}
        onHidden={() => {
          setMinusNumberFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            0以下の数字は入力することが出来ません。<br />再度お試しください。
          </div>
          {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setMinusNumberFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 포인트 범위 초과 */}
      <Modal
        show={errorLimitfail}
        onHidden={() => {
          setErrorLimitFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            使用可能ポイントを超えています。使用可能な範囲での数字を入力してください。
          </div>
          {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setErrorLimitFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* Id생성 실패 */}
      <Modal
        show={createIdfail}
        onHidden={() => {
          setCreateIdFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            ID生成に失敗しました。再度ためしてください。
          </div>
          {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setCreateIdFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 카드의 등록 실패 */}
      <Modal
        show={registCardfail}
        onHidden={() => {
          setRegistCardFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            生成されたカードの登録に失敗しました。管理者にお問い合わせください。
          </div>
          {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setRegistCardFail(false);
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

export default PointDetail;
