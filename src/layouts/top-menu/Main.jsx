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
    <div>
      <div>
        <div className="top_header top_header_main">
          <div className="flex justify-between items-center top_header-inner">

            <div className="flex items-center">
              <Link to="/">
                <img src={logoUrl} alt="" />
              </Link>
            </div>

            <IsLogin login={`${token ? null : "N"}`} />
            
          </div>
        </div>
      </div>
      <div className="main-content flex mt-0">
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
