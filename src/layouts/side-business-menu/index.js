import dom from "@left4code/tw-starter/dist/js/dom";

// Setup side menu
const findActiveMenu = (subMenu2, location) => {
  let match = false;
  subMenu2.forEach((item) => {
    if (
      ((location.forceActiveMenu !== undefined &&
        item.pathname === location.forceActiveMenu) ||
        (location.forceActiveMenu === undefined &&
          item.pathname === location.pathname)) &&
      !item.ignore
    ) {
      match = true;
    } else if (!match && item.subMenu2) {
      match = findActiveMenu(item.subMenu2, location);
    }
  });
  return match;
};

const nestedMenu = (menu, location) => {
  menu.forEach((item, key) => {
    if(item.subMenu2!=null){
      if (typeof item !== "string") {
        let menuItem = menu[key];
        menuItem.active =
          ((location.forceActiveMenu !== undefined &&
            item.pathname === location.forceActiveMenu) ||
            (location.forceActiveMenu === undefined &&
              item.pathname === location.pathname) ||
            (item.subMenu2 && findActiveMenu(item.subMenu2, location))) &&
          !item.ignore;
  
        if (item.subMenu2) {
          
          menuItem = {
            ...item,
            ...nestedMenu(item.subMenu2, location),
          };
        }
      }
    }else{
      if (typeof item !== "string") {
        let menuItem = menu[key];
        menuItem.active =
          ((location.forceActiveMenu !== undefined &&
            item.pathname === location.forceActiveMenu) ||
            (location.forceActiveMenu === undefined &&
              item.pathname === location.pathname) ||
            (item.subMenu && findActiveMenu(item.subMenu, location))) &&
          !item.ignore;
  
        if (item.subMenu) {
          menuItem.activeDropdown = findActiveMenu(item.subMenu, location);
          menuItem = {
            ...item,
            ...nestedMenu(item.subMenu, location),
          };
        }
      }
    }
  });

  return menu;
};

const linkTo = (menu, navigate) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown;
  } else {
    navigate(menu.pathname);
  }
};

const enter = (el, done) => {
  dom(el).slideDown(300);
};

const leave = (el, done) => {
  dom(el).slideUp(300);
};

export { nestedMenu, linkTo, enter, leave };
