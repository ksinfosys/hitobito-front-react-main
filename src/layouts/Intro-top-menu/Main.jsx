import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { helper as $h } from "@/utils";
import { topMenu as useTopMenuStore } from "@/stores/top-menu";
import { faker as $f } from "@/utils";
import * as $_ from "lodash";
import { useRecoilValue } from "recoil";
import { linkTo, nestedMenu } from "@/layouts/side-menu";
import {
  Lucide,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownContent,

} from "@/base-components";
import logoUrl from "@/assets/images/logo.svg";
import UserIcon from "@/assets/images/user.svg";
import IsLogin from "../../components/menu-component/IsLogin";
import { getCookie } from "../../utils/cookie";
import Hamburger from "@/assets/images/hamburger-icon.svg";
import Question from "@/assets/images/question-icon.svg";



function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState([]);
  // const sideMenuStore = useRecoilValue(useSideMenuStore);
  // const ishome = useMatch("/");
  const sideMenu = () => nestedMenu($h.toRaw(sideMenuStore.menu), location);
  const [modifyModal, setModifyModal] = useState(false);
  const [password, setPassword] = useState(false);
  const [notifiModal, setNotifiModal] = useState(false);
  const [notifyrange, setNotifyrange] = useState("");
  const [dashboardModal, setDashboardModal] = useState(false);

  // useEffect(() => {
  //     dom("body").removeClass("error-page").removeClass("login").addClass("main");
  //     setFormattedMenu(sideMenu());
  // }, [sideMenuStore, location.pathname]);

  const token = getCookie("accessToken");

  //사이드메뉴
  const [sidesMenu, setSidesMenu] = useState(false);

  return (
    <div className="intro-outer">
      <div>
        <div className="top_header intro-main">
          <div className="flex justify-between items-center top_header-inner display-none lg:flex">

            <div className="flex items-center">
              <Link to="/">
                <img src={logoUrl} alt="" />
              </Link>
            </div>

            <div className="flex items-center">
              <IsLogin login={`${token ? null : "N"}`} />
              <Link to="/signup" className="intro-signup-link pl-4 ml-4">회원가입</Link>
            </div>
          </div>
          <div className="mobile-top-intro lg:hidden flex space-between px-5 items-center">
            <Link to="/" className="logo-mo">
              <img src={logoUrl} alt="" />
            </Link>
            <div className="flex gap-3 items-center">
              <button>
                <img src="/images/my-mobile.svg" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="intro-content flex mt-0">
        {/* BEGIN: Content */}
        <Outlet />
        {/* END: Content */}
      </div>
      <footer className="main-footer">
        <div className="main-footer-inner">
          <Link to="/">
            <img src={logoUrl} alt="" />
          </Link>
          <div className="footer-right">
            <div className="flex items-center gap-2">
              <Link to="">개인정보처리방침</Link>
              <Link to="">사이트이용약관</Link>
              <Link to="">사이트맵</Link>
            </div>
            <div className="line-flex">
              <div>
                회사명
              </div>
              <div>
                대표이사 : OOOO
              </div>
              <div>
                주소 : OOOOOOOOOOOOOOO
              </div>
            </div>
            <div className="line-flex">
              <div>
                TEL : 0000-0000-0000
              </div>
              <div>
                FAX : 0000-0000-0000
              </div>
              <div>
                E-mail : helpdesk@hitobito.co.jp
              </div>
            </div>
            <div>
              Copyright 2023. HITOBITO All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      <div className="mobile-menu-bottom">
        <div className="mobile-menu-bottom-inner">
          <ul className="menu-mo-list">
            <li>
              <Link to="" className="mo-list-item">
                <img src="/images/home-icon.svg" alt="" />
                <div>홈</div>
              </Link>
            </li>
            <li>
              <Link to="" className="mo-list-item">
                <img src="/images/plus-mo-icon.svg" alt="" />
              </Link>
            </li>
            <li>
              <Link to="" className="mo-list-item">
                <img src="/images/menu-mo-icon.svg" alt="" />
              </Link>
            </li>
            <li>
              <Link to="" className="mo-list-item">
                <img src="/images/company-mo-icon.svg" alt="" />
                <div>회사소개</div>
              </Link>
            </li>
            <li>
              <Link to="" className="mo-list-item">
                <img src="/images/more-mo-icon.svg" alt="" />
                <div>더보기</div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Main;
