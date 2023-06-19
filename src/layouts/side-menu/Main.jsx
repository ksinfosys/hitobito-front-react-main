import { Transition } from "react-transition-group";
import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { helper as $h } from "@/utils";
import { sideMenu as useSideMenuStore } from "@/stores/side-menu";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { enter, leave, linkTo, nestedMenu } from "./index";
import ServiceFetch from "../../../util/ServiceFetch";
import {
  Dropdown,
  DropdownContent,
  DropdownMenu,
  DropdownToggle,
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
} from "@/base-components";
import logoUrl from "@/assets/images/logo.svg";
import UserIcon from "@/assets/images/user.svg";
import Hamburger from "@/assets/images/hamburger-icon.svg";
import Question from "@/assets/images/question-icon.svg";
import noti from "@/assets/images/noti-icon.svg";
import ModalX from "@/assets/images/modal-x-button.svg";
import classnames from "classnames";
import SideMenuTooltip from "@/components/side-menu-tooltip/Main";
import IsLogin from "../../components/menu-component/IsLogin";
import { delCookie, getCookie } from "../../utils/cookie";
import axios from "axios";
import { userInfo } from "../../stores/user-info";
import { useLiff } from "react-liff";
import NewAlarm from "@/assets/images/new-al.svg";
import { userCount } from "../../stores/search-count";
import QuestionImg from "@/assets/images/question-icon.svg";

function Main() {
  const token = getCookie("accessToken");
  const { error, isLoggedIn, isReady, liff } = useLiff();

  const config = {
    withCredentials: true,
    headers: {
      accessToken: getCookie("accessToken"),
      lastLoginTime: getCookie("lastLoginTime"),
    },
  };

  const [formattedMenu, setFormattedMenu] = useState([]);
  const [buttonSlideOverPreview, setButtonSlideOverPreview] = useState(false);
  const [sidesMenu, setSidesMenu] = useState(false);
  const [logoutError, setLogoutError] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);

  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);
  const [userCountV, setUserCountV] = useRecoilState(userCount);
  const resetInfoV = useResetRecoilState(userInfo);
  const sideMenuStore = useRecoilValue(useSideMenuStore);

  const [notiList, setNotiList] = useState([]);
  const [unreadNotiCnt, setUnreadNotiCnt] = useState(0);
  const [notiShowAllFlag, setNotiShowAllFlag] = useState(false);
  const [notiSttMsg, setNotiSttMsg] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const sideMenu = () => nestedMenu($h.toRaw(sideMenuStore.menu), location);

  const [stopFail, setStopFail] = useState(false);
  const [resignState, setResignState] = useState(false);
  //사이드메뉴
  const logOut = () => {
    if (userInfoV.userType === 1) {
      userLogout();
    } else {
      companyLogout();
    }
  };

  const userLogout = () => {
    axios.put("/api" + "/auth/logout", {}, { ...config }).then((response) => {
      liff.logout()
      resetInfoV();
      logoutResponse(response);
    });
  };

  const companyLogout = () => {
    axios
      .post("/api" + "/company/logout", {}, { ...config })
      .then((response) => {
        resetInfoV();
        logoutResponse(response);
      });
  };

  const logoutResponse = (response) => {
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
  };

  useEffect(() => {
    dom("body").removeClass("error-page").removeClass("login").addClass("main");
    setFormattedMenu(sideMenu());
  }, [sideMenuStore, location.pathname]);

  useEffect(() => {
    axios.get("/api" + "/notification/list", { ...config }).then((response) => {
      const {
        data: { resultCode, resultMessage, result },
      } = response;
      resultMessage === "OK"
        ? (() => {
          console.log(result.notificationList);
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
      .then((response) => {
        console.log(response)
        response.data.resultCode === "200" ? (() => {
          const updatedNotiList = [...notiList];
          updatedNotiList.forEach((noti) => {
            noti.readFlag = "1";
          });
          setNotiReadList(updatedNotiList);
          setUnreadNotiCnt(response.data.result.unreadCount);
        })() : (() => {

        })();
      });
  };

  const notiDelAll = () => {
    axios
      .put("/api" + "/notification/deleteall", {}, { ...config })
      .then((response) => {
        response.data.resultCode === "200"
          ? (() => {
            setNotiList([]);
          })()
          : (() => { })();
      });
  };

  const [notiReadList, setNotiReadList] = useState([]);
  const goNotiTypePage = (notiType, notiId, index) => {
    axios
      .put(
        "/api" + "/notification/read",
        { notificationId: notiId },
        { ...config }
      )
      .then((response) => {
        response.data.resultCode === "200"
          ? (() => {
            let path = "/";
            switch (notiType) {
              case "1": //메세지
                path = "/message-reception";
                break;
              case "2":
              case "3": //면담의뢰
                path = "/";
                break;
              default:
                break;
            }
            navigate(path);
            setUnreadNotiCnt(response.data.result.unreadCount);
            const updatedNotiList = [...notiList];
            updatedNotiList[index].readFlag = "1";
            setNotiReadList(updatedNotiList);
          })()
          : (() => {
            console.error("res error", response);
          })();
      });
  };

  // 드롭다운 스크립트
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  useEffect(() => {
    ServiceFetch('/user/resign', 'get')
      .then((res) => {
        console.log(res.result)
        if(res.result.resignStatus == "2"){
          setResignState(true)
          setStopFail(true)
        }
      })
  }, [])

  return (
    <div>
      <div>
        <div className="top_header lg:px-5">
          <div className="justify-between items-center top_header-inner display-none lg:flex ">
            <div className="flex items-center">
              <Link to="/">
                <img src={logoUrl} alt="" />
              </Link>
            </div>
            <div className="flex items-center topLink_menu gap-1">
              <Link to="/user-guide-employee">
                <img src={QuestionImg} alt="user-guide-employee" />
              </Link>

              <IsLogin login={`${token ? null : "N"}`} />


              <Dropdown className="new-alarm-icon-btn">
                <DropdownToggle tag="div" role="button">
                  <img src={NewAlarm} alt="" />
                  <div className="number-noti">{unreadNotiCnt}</div>
                </DropdownToggle>
                <DropdownMenu className="notification-content pt-2">
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
                          一括既読処理
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
                                  noti.notificationId,
                                  index
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
                              <div className="noti-cont-btn flex-shrink-0">
                                <button className="btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    axios
                                      .put(
                                        "/api" + "/notification/deleteone",
                                        { notificationId: noti.notificationId },
                                        { ...config }
                                      )
                                      .then((response) => {
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
                                  削除
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
                        {!notiShowAllFlag ? "すべて表示" : "最近の5件を見る"}
                      </button>
                    </div>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
              <button className="blue-noti-user noti-user">
                <img src={UserIcon} alt="" />
                {
                  <div className="number-noti blue">{userCountV.interviewCount}</div>
                }
              </button>
            </div>
          </div>
          <div className="lg:hidden flex space-between px-5 items-center">
            <button>
              <img
                src={Hamburger}
                alt=""
                onClick={() => {
                  setButtonSlideOverPreview(true);
                }}
              />
            </button>
            <div className="flex gap-3 items-center">
              {/* <button>
                <img src={Question} alt="" />
              </button> */}
              <div className="mo-top-point">
                P <span>{userInfoV.historyBalance}</span>
              </div>
              {/* 알림 드롭다운 버튼 수정 */}
              <div className="drop_area" ref={ref}>
                <button
                  className="dropdown-toggle"
                  onClick={toggleMenu}
                >
                  <img src={noti} alt="" />
                </button>
                <div className={`dropdown-menu${isOpen ? " show" : ""}`}>
                  <div className="notification-content__box">
                    {/* <div className="flex mb-5">
						<button className="close ml-auto" onClick={() => setIsOpen(false)}>
							<Lucide icon="X" />
						</button>
					</div> */}
                    <div className="noti-tit-wrap border-b border-slate-200/60 flex space-between items-center pb-4">
                      <div className="noti-tit">お知らせ</div>

                      <div className="noti-tit-cont flex gap-2">
                        <button
                          className="btn btn-sm btn-blue-type1"
                          onClick={notiReadAll}
                        >
                          一括既読処理
                        </button>
                        <button
                          className="btn btn-sm btn-blue-type2"
                          onClick={notiDelAll}
                        >
                          すべて削除
                        </button>
                      </div>
                    </div>
                    <div className="noti-cont-wrap max-h-[482px] overflow-auto mt-5">
                      {notiList.length > 0 ? (
                        notiList.map((noti, index) => {
                          return notiShowAllFlag || index < 5 ? (
                            <div
                              className="noti-cont-box flex items-center space-between"
                              key={index}
                              onClick={() => {
                                goNotiTypePage(
                                  noti.notType,
                                  noti.notificationId,
                                  index
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
                              <div className="noti-cont-btn flex-shrink-0">
                                <button className="btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    axios
                                      .put(
                                        "/api" + "/notification/deleteone",
                                        { notificationId: noti.notificationId },
                                        { ...config }
                                      )
                                      .then((response) => {
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
                                  削除
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
                    <div className="noti-btm border-t pt-3">
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
                        {!notiShowAllFlag ? "すべて表示" : "最近の5件を見る"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        backdrop="static"
        slideOver={true}
        show={buttonSlideOverPreview}
        onHidden={() => {
          setButtonSlideOverPreview(false);
        }}
        className="mobile-ham-modal-left"
      >
        <a
          onClick={() => {
            setButtonSlideOverPreview(false);
          }}
          className="absolute top-0 left-auto right-0 mt-4 -ml-12"
          href="#"
        ></a>
        <ModalHeader className="p-5">
          <div className="flex space-between w-full">
            <img src={logoUrl} alt="" className="mo-ham-logo" />
            <button>
              <img
                src={ModalX}
                alt=""
                className="mo-ham-x"
                onClick={() => {
                  setButtonSlideOverPreview(false);
                }}
              />
            </button>
          </div>
        </ModalHeader>
        <ModalBody>
          <ul className="mobile-nav">
            <li>
              <Link
                to="/"
                onClick={() => {
                  setButtonSlideOverPreview(false);
                }}
              >
                面談依頼確認
              </Link>
            </li>
            <li>
              <Link
                to="/message-reception"
                onClick={() => {
                  setButtonSlideOverPreview(false);
                }}
              >
                メッセージ箱
              </Link>
            </li>
            <li>
              <Link
                to="/point-detail"
                onClick={() => {
                  setButtonSlideOverPreview(false);
                }}
              >
                ポイント管理
              </Link>
            </li>
            {/* 포인트 관리 > 탭으로 변경 */}
            {/* <li>
              <Link
                to="/giftcard-regist"
                onClick={() => {
                  setButtonSlideOverPreview(false);
                }}
              >
                Amazonギフトカード登録
              </Link>
            </li>
            <li>
              <Link
                to="/giftcard-record"
                onClick={() => {
                  setButtonSlideOverPreview(false);
                }}
              >
                Amazonギフトカード 교환 이력
              </Link>
            </li> */}

            <li>
              <Link
                to="/resume-regist"
                onClick={() => {
                  setButtonSlideOverPreview(false);
                }}
              >
                履歴書管理
              </Link>
            </li>
            <li>
              <Link
                to=""
                onClick={() => {
                  setButtonSlideOverPreview(false);
                }}
              >
                SNSへの共有
              </Link>
            </li>
          </ul>

          <div className="hamber-bottom-btn">
            <ul className="hamber-bottom-btn-item sm">
              <li>
                <Link
                  to="/nickname"
                  onClick={() => {
                    setButtonSlideOverPreview(false);
                  }}
                >
                  ニックネーム変更
                </Link>
              </li>
              <li>
                <Link
                  to=""
                >
                  利用停止　/　会員脱退
                </Link>
              </li>
              <li>
                <Link
                  onClick={(event) => {
                    event.preventDefault();
                    setLogoutModal(true);
                  }}
                >
                  ログアウト
                </Link>
              </li>
            </ul>
          </div>
        </ModalBody>
      </Modal>

      <div className="main-content flex mt-0">
        {/* BEGIN: Side Menu */}
        <nav
          className={
            sidesMenu ? "side-nav on shrink-0 tr " : "side-nav shrink-0 tr "
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
                    href={resignState ? "#" : menu.subMenu ? "#" : menu.pathname}
                    className={(resignState ? "disabled " : "") + classnames({
                      "side-menu": true,
                      "side-menu--active": menu.active,
                      "side-menu--open": menu.activeDropdown,
                    })}
                    onClick={(event) => {
                      resignState ? (event.preventDefault()) :
                      (event.preventDefault(),
                      linkTo(menu, navigate),
                      setFormattedMenu($h.toRaw(formattedMenu)))
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
                              onClick={(event) => {
                                event.preventDefault(),
                                linkTo(subMenu, navigate),
                                setFormattedMenu($h.toRaw(formattedMenu))
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
                                          onClick={(event) => {
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
                onClick={(event) => {
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
            <div className="modal-tit">ログアウトをしますか？</div>
            <div className="modal-subtit">もう一度ご確認お願いします。</div>
            <div className="flex flex-end gap-3">
              <a
                href="#"
                className="btn btn-primary"
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
            <div className="modal-tit">로그아웃 오류</div>
            <div className="modal-subtit">
              처리중 문제가 발생했습니다. 관리자에게 문의해주세요.
            </div>
            <div className="flex flex-end gap-3">
              <a
                href="#"
                className="btn btn-primary"
                onClick={() => {
                  setLogoutError(false);
                }}
              >
                확인
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

      <Modal
      show={stopFail}
      onHidden={() => {
        setStopFail(false);
      }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">利用停止中です。</div>
          <div className="modal-subtit">
          メニューの選択に制限があります。いつでも利用再開できます。
          </div>
          <div className="flex flex-end gap-3">
          <a
            href="#"
            className="btn btn-primary"
            onClick={() => {
            setStopFail(false);
            }}
          >
            確認
          </a>
          </div>
        </ModalBody>
      </Modal>
    </div> 
  );
}

export default Main;
