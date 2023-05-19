import { Lucide, Modal, ModalBody } from "@/base-components";
import { throttle } from "lodash";
import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../../components/pagination";
import { getCookie } from "../../utils/cookie";
import { useDidMountEffect } from "../../utils/customHooks";
import {
  getGiftCardDate,
  getUsrPntLstCgnTm,
  regexUserPoint,
} from "../../utils/utils";
import PcPagination from "../../components/pcPagination";

function GiftcardRecord() {
  const handleClick2 = () => {
    setIsActive3((current) => !current);
    setIsActive2((current) => !current);
  };
  const [nicknameChangeModal, nicknameChange] = useState(false);

  const [pgnInfo, setPgnInfo] = useState({});
  const [currentPageIdx, setCurrentPageIdx] = useState(1);

  const [result, setResult] = useState({});
  const [moResult, setMoResult] = useState([]);
  // 데이터의 페이지가 끝인지 아닌지를 알려주는 상수
  const [lastAgcFlag, setLastAgcFlag] = useState(false);
  // 데이터의 마지막 아이템
  const [lastDataIdx, setLastDataIdx] = useState(null);
  // api 통신횟수
  const [curPage, setCurPage] = useState(null);

  const [deviceFlag, setDeviceFlag] = useState("");

  const [isFirstRenderMob, setIsFirstRenderMob] = useState(true);

  // S: 인피니티 스크롤 구현 함수
  const handleScroll = throttle(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      !lastAgcFlag ? moGetAmazonList() : void 0;
    }
  }, 300);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  // E: 인피니티 스크롤 구현 함수

  useEffect(() => {
    getAmazonList();
  }, []);

  useEffect(() => {
    if (deviceFlag === "mo") {
      moGetAmazonList();
    }
  }, [deviceFlag]);

  // useEffect(() => {
  //   moGetAmazonList(lastDataIdx);
  // }, [lastDataIdx])

  const getAmazonList = () => {
    axios
      .post(
        "/api/agc/find",
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
      .then((response) => {
        // response넣기
        // console.log(response)
        response.data.resultCode === "200"
          ? (() => {
            const {
              data: { result },
            } = response;
            setResult(result);
            setPgnInfo(result.pageItem);
          })()
          : console.log("fetching error:::", response);
      });
  };

  useDidMountEffect(() => {
    getAmazonList();
  }, [currentPageIdx]);

  useDidMountEffect(() => {
    moGetAmazonList(); //최초 진입시 2회 api 통신
  }, [isFirstRenderMob]);

  function handleResize() {
    if (window.innerWidth > 1024) {
      setDeviceFlag("pc");
    } else {
      setDeviceFlag("mo");
    }
  }

  useEffect(() => {
    // 컴포넌트가 마운트 될 때 초기 실행
    handleResize();

    // 창의 크기가 변경 될 때마다 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const moGetAmazonList = () => {
    let params =
      curPage === null
        ? {}
        : {
          page: curPage,
        };
    axios
      .post("/api/app/agc/find", params, {
        withCredentials: true,
        headers: {
          accessToken: getCookie("accessToken"),
          lastLoginTime: getCookie("lastLoginTime"),
        },
      })
      .then((response) => {
        // response넣기
        console.log("mo Response", response);
        const {
          data: {
            result: { fegcList },
          },
        } = response;
        response.data.resultCode === "200"
          ? (() => {
            setMoResult((prevList) => [...prevList, ...fegcList]);
            setLastAgcFlag(response.data.result.lastAgcFlag);
            setCurPage(response.data.result.page);
            setIsFirstRenderMob(false);
          })()
          : console.log("fetching error:::", response);
      });
  };

  return (
    <>
      <div id="nickname">
        <ul className="col-span-12 flex border-b-2 w/3 mobile_block">
          <li>
            <button type="button" class="p-2 tab-btn w-full">
              <a href="/point-detail">ポイント確認交換</a>
            </button>
          </li>
          <li>
            <button type="button" class="p-2 tab-btn w-full">
              <a href="/giftcard-regist">ギフトカード登録</a>
            </button>
          </li>
          <li>
            <button type="button" class="p-2 tab-btn w-full tab-active">
              <a href="/giftcard-record">ギフト交換履歴</a>
            </button>
          </li>
        </ul>
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-lg font-bold lg:text-sm lg:font-normal">
            Amazonギフトカード登録
          </div>
          <div className="cont-wrap p-2 lg:p-5">
            <div className="mt-5 mb-5">
              <div className="flex flex-col sm:flex-row space-between lg:items-center p-3 lg:p-0">
                <div className="font-bold font-xl">
                  {result?.nickname}様のAmazonギフトカード交換履歴
                </div>
                <button
                  type="button"
                  className="btn btn-primary w-72 mt-2 sm:mt-0"
                >
                  Amazonに登録
                </button>
              </div>

              {/* 테이블 10줄 */}
              <div className="mt-8">
                <table className="table mt-5 pc">
                  <thead className="table-light text-center">
                    <tr>
                      <th className="whitespace-nowrap text-sm">NO</th>
                      <th className="whitespace-nowrap text-sm">
                        Amazon ギフトカード シリアル番号
                      </th>
                      <th className="whitespace-nowrap text-sm">交換日</th>
                      <th className="whitespace-nowrap text-sm">有効期間</th>
                      <th className="whitespace-nowrap text-sm">
                        ギフトカードの金額
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {result?.fegcList ? (
                      result.fegcList.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{item.no}</td>
                            <td>{item.gcClaimCode}</td>
                            <td className="text-slate-500">
                              {getGiftCardDate(item.gcExchangeOcrDatetime)}
                            </td>
                            <td>
                              {getGiftCardDate(item.gcExchangeExpDatetime)}
                            </td>
                            <td className="font-bold">
                              ¥{regexUserPoint(item.gcExchangeAmount)}
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
                {/* 모바일 테이블 */}
                <table className="table mt-5 mo">
                  <thead className="table-light text-center">
                    <tr>
                      <th className="whitespace-nowrap text-sm"> シリアル番号</th>
                      <th className="whitespace-nowrap text-sm">交換日</th>
                      <th className="whitespace-nowrap text-sm">有効期間</th>
                      <th className="whitespace-nowrap text-sm">
                        ギフトカードの金額
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {moResult ? (
                      moResult.map((item, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{item.gcClaimCode}</td>
                            <td className="text-slate-500">
                              {getGiftCardDate(item.gcExchangeOcrDatetime)}
                            </td>
                            <td>
                              {getGiftCardDate(item.gcExchangeExpDatetime)}
                            </td>
                            <td className="font-bold">
                              ¥{regexUserPoint(item.gcExchangeAmount)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4}>履歴が存在しません。</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <PcPagination
          pgnInfo={pgnInfo}
          currentPageIdx={currentPageIdx}
          setCurrentPageIdx={setCurrentPageIdx}
        />
      </div>
      {/* 닉네임 변경 확인 */}
      <Modal
        show={nicknameChangeModal}
        onHidden={() => {
          nicknameChange(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">ニックネーム変更</div>
          <div className="modal-subtit">ニックネームの変更を完了しました。</div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                nicknameChange(false);
                handleClick2(true);
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

export default GiftcardRecord;
