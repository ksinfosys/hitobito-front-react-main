import { Transition } from "react-transition-group";
import { useState, useEffect } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";
import { helper as $h } from "@/utils";
import { sideMenu as useSideMenuStore } from "@/stores/side-menu-business";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { linkTo, nestedMenu, enter, leave } from "./index";
import {
  Lucide,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Litepicker,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,
  DropdownItem,
  DropdownHeader,
  DropdownDivider,
} from "@/base-components";
import logoUrl from "@/assets/images/logo.svg";
import NewAlarm from "@/assets/images/new-al.svg";
import UserIcon from "@/assets/images/user.svg";
import classnames from "classnames";
import SideMenuTooltip from "@/components/side-menu-tooltip/Main";
import { userInfo } from "../../stores/user-info";
import axios from "axios";
import { delCookie, getCookie } from "../../utils/cookie";
import ServiceFetch from "../../../util/ServiceFetch";
import CheckToken from "../../../util/CheckToken";
import { regexUserPoint } from "../../utils/utils";
import { userCount } from "../../stores/search-count";

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState([]);
  const sideMenuStore = useRecoilValue(useSideMenuStore);
  const ishome = useMatch("/");
  const sideMenu = () => nestedMenu($h.toRaw(sideMenuStore.menu), location);
  const [modifyModal, setModifyModal] = useState(false);
  const [password, setPassword] = useState(false);
  const [notifiModal, setNotifiModal] = useState(false);
  const [notifyrange, setNotifyrange] = useState("");
  const [dashboardModal, setDashboardModal] = useState(false);

  const [notiList, setNotiList] = useState([]);
  const [unreadNotiCnt, setUnreadNotiCnt] = useState(0);
  const [notiShowAllFlag, setNotiShowAllFlag] = useState(false);
  const [notiSttMsg, setNotiSttMsg] = useState("");

  useEffect(() => {
    dom("body").removeClass("error-page").removeClass("login").addClass("main");
    setFormattedMenu(sideMenu());
  }, [sideMenuStore, location.pathname]);

  //사이드메뉴
  const [sidesMenu, setSidesMenu] = useState(false);

  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);
  const [userCountV, setUserCountV] = useRecoilState(userCount);
  const [dataResult, setDataResult] = useState({});
  // console.log(dataResult);

  const [logoutError, setLogoutError] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);


  const resetInfoV = useResetRecoilState(userInfo);

  const config = {
    withCredentials: true,
    headers: {
      accessToken: getCookie("accessToken"),
      lastLoginTime: getCookie("lastLoginTime"),
    },
  };

  // console.log(userInfoV)
  const logOut = () => {
    resetInfoV();
    ServiceFetch("/company/logout", "post", {}).then(res => {
      CheckToken(res, navigate);
      delCookie("accessToken");
      delCookie("lastLoginTime");
    });
    /*axios
      .post(
        "/api" + "/company/logout",
        {},
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
          data: { resultCode },
        } = response;
        resultCode === "200"
          ? (() => {
            delCookie("accessToken");
            delCookie("lastLoginTime");
            navigate("/");
          })()
          : (() => { })(setLogoutModal(false), setLogoutError(true));
      });*/
  };

  useEffect(() => {
    axios.get("/api" + "/notification/list", { ...config }).then(response => {
      const {
        data: { resultCode, resultMessage, result },
      } = response;
      resultCode === "200"
        ? (() => {
          setNotiList(result.notificationList);
          setUnreadNotiCnt(result.unreadCount);
        })()
        : (() => {
          setNotiSttMsg(resultMessage);
        })();
    });
  }, []);

  const notiReadAll = () => {
    axios
      .put("/api" + "/notification/readall", {}, { ...config })
      .then(response => {
        response === "200" ? (() => { })() : (() => { })();
      });
  };

  const notiDelAll = () => {
    axios
      .put("/api" + "/notification/deleteall", {}, { ...config })
      .then(response => {
        response === "200"
          ? (() => {
            setNotiList([]);
          })()
          : (() => { })();
      });
  };

  const goNotiTypePage = (notiType, notiId) => {
    axios
      .put(
        "/api" + "/notification/read",
        { notificationId: notiId },
        { ...config }
      )
      .then(response => {
        console.log(response);
        response.data.resultCode === "200"
          ? (() => {
            let path = "/";
            switch (notiType) {
              case "1": //메세지
                path = "/message-reception-business";
                break;
              case "2":
              case "3": //면담의뢰
                path = "/interview-mng";
                break;
              default:
                break;
            }
            navigate(path);
          })()
          : (() => {
            console.error("res error", response);
          })();
      });
  };

  // 현재 포인트 체크
  const getRecentPointList = () => {
    axios
      .post(
        "/api/point/payment",
        {},
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
        // console.log(response.data.result);
        response.data.resultCode === "200"
          ? (() => {
            setUserInfoV(prev => ({
              ...prev,
              historyBalance: response.data.result.currentBalance,
            }));
          })()
          : console.log("fetching error:::", response);
      });
  };

  useEffect(() => {
    getRecentPointList();
  }, []);

  return (
    <div className="business">
      <div>
        <div className="top_header">
          <div className="flex justify-between items-center top_header-inner">
            <div className="flex items-center">
              <Link to="/business">
                <img src={logoUrl} alt="" />
              </Link>
            </div>

            <div className="flex items-center topLink_menu gap-2">
              <div className="flex items-center topuser-menu">
                <div className="topuser-item">{userInfoV.cpUserName}</div>
                <div className="topuser-item">
                  {regexUserPoint(userInfoV.historyBalance)}P
                </div>
              </div>
              <Dropdown className="new-alarm-icon-btn">
                <DropdownToggle tag="div" role="button" className="">
                  <img src={NewAlarm} alt="" />
                  <div className="number-noti">{unreadNotiCnt}</div>
                </DropdownToggle>
                <DropdownMenu className="notification-content pt-2 orange">
                  <DropdownContent
                    tag="div"
                    className="notification-content__box"
                  >
                    <div className="noti-tit-wrap border-b border-slate-200/60 flex space-between items-center pb-4">
                      <div className="noti-tit">お知らせ</div>
                      <div className="noti-tit-cont flex gap-2">
                        <button
                          className="btn btn-sm btn-blue-type1"
                          onClick={notiReadAll}
                        >
                          すべて既読
                        </button>
                        <button
                          className="btn btn-sm btn-blue-type2"
                          onClick={notiDelAll}
                        >
                          すべて削除
                        </button>
                      </div>
                    </div>
                    <div className="noti-cont-wrap max-h-[482px] overflow-auto">
                      {notiList.length > 0 ? (
                        notiList.map((noti, index) => {
                          return notiShowAllFlag || index < 5 ? (
                            <div
                              className="noti-cont-box flex items-center space-between"
                              key={index}
                              onClick={() => {
                                goNotiTypePage(
                                  noti.notType,
                                  noti.notificationId
                                );
                              }}
                            >
                              <div
                                className={`noti-cont-cont ${noti.readFlag === "1" ? "opacity-50" : ""
                                  }`}
                              >
                                <button className="flex flex-col items-start flex-start">
                                  <div className="noti-cont-tit">
                                    {noti.title}
                                  </div>
                                  <div className="noti-cont-subtit">
                                    {noti.message}
                                  </div>
                                  <div className="noti-cont-date">
                                    {noti.datetime}
                                  </div>
                                </button>
                              </div>
                              <div className="noti-cont-btn">
                                <button
                                  onClick={e => {
                                    e.stopPropagation();
                                    axios
                                      .put(
                                        "/api" + "/notification/deleteone",
                                        { notificationId: noti.notificationId },
                                        { ...config }
                                      )
                                      .then(response => {
                                        const {
                                          data: { resultCode },
                                        } = response;
                                        resultCode === "200"
                                          ? (() => {
                                            let tempNotiList = [...notiList];
                                            tempNotiList.splice(index, 1);
                                            setNotiList(tempNotiList);
                                          })()
                                          : (() => { })();
                                      });
                                  }}
                                >
                                  <Lucide icon="X" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            void 0
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="noti-btm">
                      {notiSttMsg != "" ? (
                        <div className="flex flex-center mb-8">
                          {notiSttMsg}
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="flex flex-center mb-2">
                        最近30日以内のお知らせのみ確認できます。
                      </div>
                      <button
                        className="btn btn-sm btn-primary w-full btn-seeall"
                        onClick={() => {
                          setNotiShowAllFlag(!notiShowAllFlag);
                        }}
                      >
                        {!notiShowAllFlag ? "すべて確認" : "최근 5건 보기"}
                      </button>
                    </div>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
              <button className="orange-noti-user">
                <img src={UserIcon} alt="" />
                {
                  <div className="number-noti blue">{userCountV.searchCount}</div>
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 정보변경 팝업 */}
      <Modal
        size="modal-lg"
        show={modifyModal}
        onHidden={() => {
          setModifyModal(false);
        }}
      >
        <ModalHeader>
          <h2 className="font-medium text-base mr-auto">情報変更</h2>
          <button
            className="btn btn-rounded-secondary hidden sm:flex p-1"
            onClick={() => {
              setModifyModal(false);
            }}
          >
            <Lucide icon="X" className="w-4 h-4" />
          </button>
        </ModalHeader>
        <ModalBody className="gap-4 gap-y-3">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td className="bg-slate-100 w-40">ID</td>
                <td>A0000</td>
              </tr>

              {password ? (
                <>
                  <tr>
                    <td className="bg-slate-100 w-40">
                      <label htmlFor="horizontal-form-4" className="">
                        現在パスワード
                      </label>
                    </td>
                    <td>
                      <input
                        id="horizontal-form-4"
                        type="password"
                        className="form-control"
                        placeholder=""
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-slate-100 w-40">
                      <label htmlFor="horizontal-form-5" className="">
                        新規パスワード
                      </label>
                    </td>
                    <td>
                      <input
                        id="horizontal-form-5"
                        type="password"
                        className="form-control"
                        placeholder=""
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-slate-100 w-40">
                      <label htmlFor="horizontal-form-6" className="">
                        パスワード再入力
                      </label>
                    </td>
                    <td>
                      <input
                        id="horizontal-form-6"
                        type="password"
                        className="form-control"
                        placeholder=""
                      />
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td className="bg-slate-100 w-40">新規パスワード</td>
                  <td>
                    <button
                      onClick={() => {
                        setPassword(true);
                      }}
                      className="btn btn-sm btn-secondary w-24 mr-1"
                    >
                      비밀번호 재설정
                    </button>
                  </td>
                </tr>
              )}
              <tr>
                <td className="bg-slate-100 w-40">
                  <label htmlFor="horizontal-form-1" className="">
                    이름
                  </label>
                </td>
                <td>
                  <input
                    id="horizontal-form-1"
                    type="text"
                    className="form-control"
                    placeholder="이름을 입력해주세요"
                  />
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 w-40">
                  <label htmlFor="horizontal-form-2" className="">
                    휴대폰번호
                  </label>
                </td>
                <td>
                  <input
                    id="horizontal-form-2"
                    type="text"
                    className="form-control"
                    placeholder="휴대폰번호를 입력해주세요"
                  />
                </td>
              </tr>
              <tr>
                <td className="bg-slate-100 w-40">
                  <label htmlFor="horizontal-form-3" className="">
                    이메일
                  </label>
                </td>
                <td>
                  <input
                    id="horizontal-form-3"
                    type="text"
                    className="form-control"
                    placeholder="이메일을 입력해주세요"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            onClick={() => {
              setModifyModal(false);
            }}
            className="btn btn-outline-secondary w-20 mr-1"
          >
            취소
          </button>
          <button type="button" className="btn btn-primary w-20">
            등록
          </button>
        </ModalFooter>
      </Modal>

      {/* 알림현황 팝업 */}
      <Modal
        size="modal-lg"
        show={notifiModal}
        onHidden={() => {
          setNotifiModal(false);
        }}
      >
        <ModalHeader>
          <h2 className="font-medium text-base mr-auto">알림 현황</h2>
          <button
            className="btn btn-rounded-secondary hidden sm:flex p-1"
            onClick={() => {
              setNotifiModal(false);
            }}
          >
            <Lucide icon="X" className="w-4 h-4" />
          </button>
        </ModalHeader>
        <ModalBody className="gap-4 gap-y-3">
          <table className="table table-bordered">
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>
            <tbody>
              <tr>
                <td className="bg-slate-100 text-center">수신일</td>
                <td>
                  <div className="relative w-56 inline-block">
                    <div className="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                      <Lucide icon="Calendar" className="w-4 h-4" />
                    </div>
                    <Litepicker
                      value={notifyrange}
                      onChange={setNotifyrange}
                      options={{
                        autoApply: false,
                        singleMode: false,
                        numberOfColumns: 2,
                        numberOfMonths: 2,
                        showWeekNumbers: true,
                        dropdowns: {
                          minYear: 1990,
                          maxYear: null,
                          months: true,
                          years: true,
                        },
                      }}
                      className="form-control w-56 block mx-auto pl-12"
                    />
                  </div>
                  <button className="btn btn-rounded-dark w-20 mr-1 mb-2 p-1 ml-2">
                    조회
                  </button>
                  <button className="btn btn-rounded btn-dark-soft w-20 mr-1 mb-2 p-1">
                    초기화
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-6 text-red-500">
            1달 전 알림은 확인 여부와 무관하게 삭제됩니다.{" "}
          </p>
          <table className="table table-bordered mt-1">
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>
            <thead className="bg-slate-100 text-center">
              <tr>
                <th>알림일자</th>
                <th>제목</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">2022-03-02</td>
                <td>제목</td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <button type="button" className="btn btn-primary w-20">
            확인
          </button>
        </ModalFooter>
      </Modal>

      {/* 대쉬보드 팝업 */}
      <Modal
        size="modal-lg"
        show={dashboardModal}
        onHidden={() => {
          setDashboardModal(false);
        }}
      >
        <ModalHeader>
          <h2 className="font-medium text-base mr-auto">대시보드 편집</h2>
          <button
            className="btn btn-rounded-secondary hidden sm:flex p-1"
            onClick={() => {
              setDashboardModal(false);
            }}
          >
            <Lucide icon="X" className="w-4 h-4" />
          </button>
        </ModalHeader>
        <ModalBody className="gap-4 gap-y-3">
          <p className="font-bold">
            현재 <span className="text-red-500">7</span>개 설정 중
          </p>
          <table className="table table-bordered mt-3">
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>
            <thead className="text-center bg-slate-100">
              <tr>
                <th>
                  <input
                    id="checkbox-switch-1"
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </th>
                <th>구분</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">
                  <input
                    id="checkbox-switch-1"
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>일일 예약 현황</td>
              </tr>
              <tr>
                <td className="text-center">
                  <input
                    id="checkbox-switch-1"
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>당일 예약 목록</td>
              </tr>
              <tr>
                <td className="text-center">
                  <input
                    id="checkbox-switch-1"
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>1:1문의 답변대기 목록</td>
              </tr>
              <tr>
                <td className="text-center">
                  <input
                    id="checkbox-switch-1"
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>최근 일주일 상담 현황</td>
              </tr>
              <tr>
                <td className="text-center">
                  <input
                    id="checkbox-switch-1"
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>알림 현황</td>
              </tr>
              <tr>
                <td className="text-center">
                  <input
                    id="checkbox-switch-1"
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>최근 일주일 예약 현황</td>
              </tr>
              <tr>
                <td className="text-center">
                  <input
                    id="checkbox-switch-1"
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </td>
                <td>최근 일주일 예약 추이</td>
              </tr>
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            onClick={() => {
              setDashboardModal(false);
            }}
            className="btn btn-outline-secondary w-20 mr-1"
          >
            취소
          </button>
          <button type="button" className="btn btn-primary w-20">
            확인
          </button>
        </ModalFooter>
      </Modal>

      <div className="main-content flex mt-0">
        {/* BEGIN: Side Menu */}
        <nav
          className={
            sidesMenu ? "side-nav on shrink-0 tr" : "side-nav shrink-0 tr"
          }
        >
          <ul>
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu, menuKey) =>
              menu == "devider" ? (
                <li
                  className="side-nav__devider my-6"
                  key={menu + menuKey}
                ></li>
              ) : (
                <li key={menu + menuKey}>
                  <SideMenuTooltip
                    tag="a"
                    content={menu.title}
                    href={menu.subMenu ? "#" : menu.pathname}
                    className={classnames({
                      "side-menu": true,
                      "side-menu--active": menu.active,
                      "side-menu--open": menu.activeDropdown,
                    })}
                    onClick={event => {
                      event.preventDefault();
                      linkTo(menu, navigate);
                      setFormattedMenu($h.toRaw(formattedMenu));
                    }}
                  >
                    {/* <div className="side-menu__icon">
                                            <Lucide icon={menu.icon} />
                                        </div> */}
                    <div className="side-menu__title">
                      {menu.title}
                      {menu.subMenu && (
                        <div
                          className={classnames({
                            "side-menu__sub-icon": true,
                            "transform rotate-180": menu.activeDropdown,
                          })}
                        >
                          <Lucide icon="ChevronDown" />
                        </div>
                      )}
                    </div>
                  </SideMenuTooltip>
                  {/* BEGIN: Second Child */}
                  {menu.subMenu && (
                    <Transition
                      in={menu.activeDropdown}
                      onEnter={enter}
                      onExit={leave}
                      timeout={300}
                    >
                      <ul
                        className={classnames({
                          "side-menu__sub-open": menu.activeDropdown,
                        })}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
                          <li key={subMenuKey}>
                            <SideMenuTooltip
                              tag="a"
                              content={subMenu.title}
                              href={subMenu.subMenu ? "#" : subMenu.pathname}
                              className={classnames({
                                "side-menu": true,
                                "side-menu--active": subMenu.active,
                              })}
                              onClick={event => {
                                event.preventDefault();
                                linkTo(subMenu, navigate);
                                setFormattedMenu($h.toRaw(formattedMenu));
                              }}
                            >
                              {/* <div className={sidesMenu ? "side-menu__icon" : "side-menu__icon ml-3"}>
                                                                <Lucide icon={menu.icon} className="w-5 h-5" />
                                                            </div> */}
                              <div className="side-menu__title">
                                {subMenu.title}
                                {subMenu.subMenu && (
                                  <div
                                    className={classnames({
                                      "side-menu__sub-icon": true,
                                      "transform rotate-180":
                                        subMenu.activeDropdown,
                                    })}
                                  >
                                    <Lucide icon="ChevronDown" />
                                  </div>
                                )}
                              </div>
                            </SideMenuTooltip>
                            {/* BEGIN: Third Child */}
                            {subMenu.subMenu && (
                              <Transition
                                in={subMenu.activeDropdown}
                                onEnter={enter}
                                onExit={leave}
                                timeout={300}
                              >
                                <ul
                                  className={classnames({
                                    "side-menu__sub-open":
                                      subMenu.activeDropdown,
                                  })}
                                >
                                  {subMenu.subMenu.map(
                                    (lastSubMenu, lastSubMenuKey) => (
                                      <li key={lastSubMenuKey}>
                                        <SideMenuTooltip
                                          tag="a"
                                          content={lastSubMenu.title}
                                          href={
                                            lastSubMenu.subMenu
                                              ? "#"
                                              : lastSubMenu.pathname
                                          }
                                          className={classnames({
                                            "side-menu": true,
                                            "side-menu--active":
                                              lastSubMenu.active,
                                          })}
                                          onClick={event => {
                                            event.preventDefault();
                                            linkTo(lastSubMenu, navigate);
                                          }}
                                        >
                                          <div className="side-menu__icon">
                                            <Lucide icon="Zap" />
                                          </div>
                                          <div className="side-menu__title">
                                            {lastSubMenu.title}
                                          </div>
                                        </SideMenuTooltip>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </Transition>
                            )}
                            {/* END: Third Child */}
                          </li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                  {/* END: Second Child */}
                </li>
              )
            )}
            {/* END: First Child */}
            <li>
              <SideMenuTooltip
                tag="a"
                content="ログアウト"
                className="side-menu cursor-pointer"
                onClick={event => {
                  event.preventDefault();
                  setLogoutModal(true);
                }}
              >
                <div className="side-menu__title">ログアウト</div>
              </SideMenuTooltip>
            </li>
          </ul>

          <div className="side-ad-box flex flex-col gap-1">
            <div className="flex items-center flex-center box">
              <Link to="">
                <img src="/images/ad-1.png" alt="" />
              </Link>
            </div>
            <div className="flex items-center flex-center box">
              <Link to="">
                <img src="/images/ad-2.png" alt="" />
              </Link>
            </div>
            <div className="flex items-center flex-center box">
              <Link to="">
                <img src="/images/ad-3.png" alt="" />
              </Link>
            </div>
          </div>
        </nav>
        {/* END: Side Menu */}

        {/* S: Logout Modal */}
        <Modal
          show={logoutModal}
          onHidden={() => {
            setLogoutModal(false);
          }}
        >
          <ModalBody className="p-10 text-center">
            <div className="modal-tit">hitobitoからログアウトしますか?</div>
            {/* <div className="modal-subtit">もう一度ご確認お願いします。</div> */}
            <div className="modal-subtit"></div>
            <div className="flex flex-end gap-3">
              <a
                href="#"
                className="btn btn-business"
                onClick={() => {
                  logOut();
                }}
              >
                はい
              </a>
              <a
                href="#"
                className="btn"
                onClick={() => {
                  setLogoutModal(false);
                }}
              >
                いいえ
              </a>
            </div>
          </ModalBody>
        </Modal>
        {/* E: Logout Modal */}

        {/* S: Logout Error */}
        <Modal
          show={logoutError}
          onHidden={() => {
            setLogoutError(false);
          }}
        >
          <ModalBody className="p-10 text-center">
            <div className="modal-tit">ログアウトエラー</div>
            <div className="modal-subtit">
              処理中に問題が発生しました。 管理者にお問い合わせください。
            </div>
            <div className="flex flex-end gap-3">
              <a
                href="#"
                className="btn btn-business"
                onClick={() => {
                  setLogoutError(false);
                }}
              >
                確認
              </a>
            </div>
          </ModalBody>
        </Modal>
        {/* E: Logout Error */}

        {/* BEGIN: Content */}
        <div className="content">
          <Outlet />
        </div>
        {/* END: Content */}
      </div>
    </div>
  );
}

export default Main;
