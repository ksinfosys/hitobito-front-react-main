import { Lucide } from "@/base-components";
import PointUseChart from "@/components/var-line-chart/Main";
import { useEffect, useState } from "react";

import SonyLogo from "@/assets/images/SONY-logo.svg";
import Pagination from "../../components/pagination";

import axios from "axios";
import { getCookie } from "../../utils/cookie";
import { useDidMountEffect } from "../../utils/customHooks";
import { regexUserPoint } from "../../utils/utils";
import { useRecoilState } from "recoil";
import { userInfo } from "../../stores/user-info";

const PointUseRecord = () => {
  // 현재 달 가지고 오기
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줌
  const currYearMonth = year.toString() + (month < 10 ? "0" + month : month);

  const [pgnInfo, setPgnInfo] = useState({});
  const [currentPageIdx, setCurrentPageIdx] = useState(1);
  const [monthData, setMonthData] = useState([]);
  const [selectValue, setSelectValue] = useState(currYearMonth);

  // userInfo
  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);

  useEffect(() => {
    getPointHistory();
  }, []);

  const [pointHistoryList, setPointHistoryList] = useState({});
  const [pointGraph, setPointGraph] = useState([]);
  const [result, setResult] = useState({});

  // 로고 있는지 없는지
  const [logoFlag, setLogoFlag] = useState(true);
  const [fetchLogo, setFetchLogo] = useState()

  let logoFlagCheck = 0;

  const getPointHistory = () => {
    axios
      .post(
        "/api/point/history",
        {
          curPage: currentPageIdx,
          date: currYearMonth !== selectValue ? selectValue : currYearMonth,
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
        //console.log(result)
        response.data.resultCode === "200"
          ? (() => {
            setResult(result);
            setPointHistoryList(result.pointHistoryList);
            setPgnInfo(result.pageItem);
            setMonthData(result.monthList.reverse());
            if (currentPageIdx === 1) {
              setPointGraph(result.pointHistoryGraph);
            }
          })()
          : console.log("fetching error:::", response);
      });
  };

  useEffect(() => {
    console.log("useEfferct logoflog : ",logoFlag)
  }, [logoFlag])

  const getLogo = () => {
    axios
      .get(`/api/files/logo/${userInfoV.cpUserName}_logo`, {
        withCredentials: true,
        headers: {
          accessToken: getCookie("accessToken"),
          lastLoginTime: getCookie("lastLoginTime"),
        },
      })
      .then(response => {
        console.log("response.statusText(gerLogo) : ",response.statusText)
        response.statusText === "200"
          ? (() => {
            setLogoFlag(true);
            console.log("getlogo true!")
          })()
          : (() => {
            // 로고가 없어 200 상태 이외의것이 나올때
            setLogoFlag(false);
            console.log("getlogo false!")
          })()
        });
  };

  const getBusinessUser = () => {
    axios
      .get("/api/join/modify", {
        withCredentials: true,
        headers: {
          accessToken: getCookie("accessToken"),
          lastLoginTime: getCookie("lastLoginTime"),
        },
      })
      .then(response => {
        const {
          data: { result },
        } = response;
        console.log("response.data.resultCode(getBusinessUser) : ",response.data.resultCode)
        response.data.resultCode === "200"
          ? (() => {
            // 회사 로고
            console.log("result.logoFile(getBusinessUser) : ",result.logoFile)
            if (result.logoFile !== null) {
              getLogo();
              logoFlagCheck++;
              console.log("getBusinessUser true!")
            }else if (result.logoFile === null && logoFlagCheck === 0){
              setLogoFlag(false);
              console.log("getBusinessUser false!")
            }else{
              console.log("logoFilecheck error")
            }
          })()
          : console.log("fetching error:::", response);
      });
  };


  useDidMountEffect(() => {
    getPointHistory();
  }, [currentPageIdx]);

  const initSearch = () => {
    currentPageIdx === 1 ? getPointHistory() : setCurrentPageIdx(1);
  };

  useDidMountEffect(() => {
    initSearch();
  }, [selectValue]);

  useEffect(() => {
    getBusinessUser();
  }, [])

  const defaultLogobg = {
    background: `url(https://hitobito-net.com/api/files/logo/default_logo)no-repeat 50% center / cover`
  }

  const logobg = {
    background: `url(https://hitobito-net.com/api/files/logo/${userInfoV.cpUserName}_logo)no-repeat 50% center / cover`
  }

  return (
    <>
      <div id="point-use-record">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-sm">
            ポイント利用履歴
          </div>
          <div className="cont-wrap p-5">
            <div className="mt-5 mb-5 chart chart-wrap">
              {/* <PointUseChart height={200} data={result?.monthList} dataList={pointGraph} /> */}
              {pointGraph?.length > 0 && (
                <PointUseChart height={200} dataList={pointGraph} />
              )}

              {/* 테이블 10줄 */}
              <div className="mt-10">
                <div className="flex space-between items-center">
                  <div className="flex items-center">
                    {/* FIX: 회사 로고 */}
                    {
                      logoFlag ? (<div className="cp-logo-wrap" style={logobg}></div>) : (<div className="cp-logo-wrap" style={defaultLogobg}></div>)
                    }
                    <span className="ml-2">{result?.companyName}</span>
                  </div>
                  {monthData.length > 0 && (
                    <select
                      className="form-select w-32"
                      onChange={e => {
                        setSelectValue(e.currentTarget.value);
                      }}
                    >
                      {monthData.map((data, idx) => {
                        const formattedStr = data.replace(
                          /^(\d{4})(\d{2})$/,
                          "$1年$2月"
                        );
                        return (
                          <option key={idx} value={data}>
                            {formattedStr}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
                <table className="table mt-5">
                  <thead className="table-light text-center">
                    <tr>
                      <th className="whitespace-nowrap text-sm">
                        ポイント変動時間
                      </th>
                      <th className="whitespace-nowrap text-sm">ポイント変動</th>
                      <th className="whitespace-nowrap text-sm">
                        変動後の残額
                      </th>
                      <th className="whitespace-nowrap text-sm">変動内訳</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {pointHistoryList.length > 0 ? (
                      pointHistoryList.map((item, idx) => {
                        const getSign = type => {
                          switch (type) {
                            case "プラス":
                              return "+";
                            case "マイナス":
                              return "-";
                          }
                        };
                        return (
                          <tr key={idx}>
                            <td>{item.pointOcrDatetime}</td>
                            <td>
                              {getSign(item.pointCngType)}
                              {regexUserPoint(item.pointCngAmount)}P
                            </td>
                            <td>{regexUserPoint(item.historyBalance)}P</td>
                            <td className="text-pending">
                              {item.pointCngReason}
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

        <Pagination
          pgnInfo={pgnInfo}
          currentPageIdx={currentPageIdx}
          setCurrentPageIdx={setCurrentPageIdx}
        />
      </div>
    </>
  );
};

export default PointUseRecord;
