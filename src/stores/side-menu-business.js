import { Children } from "react";
import { atom } from "recoil";

const sideMenu = atom({
    key: "sideMenuBusiness",
    default: {
        menu: [
            {
                pathname: "/business",
                title: "求職者検索",
            },
            {
                pathname: "/interview-mng",
                title: "面接依頼管理",
            },
            {
                pathname: "/corp-mng",
                title: "企業情報管理",
            },
            {
                pathname: "/point-detail-business",
                title: "ポイント購入",
            },
            {
                pathname: "/use-plan",
                title: "利用プラン設定",
            },
            {
                pathname: "/message-reception",
                title: "メッセージ箱",
                subMenu: [
                    {
                        pathname: "/message-reception-business",
                        title: "受信メッセージ箱",
                    },
                    {
                        pathname: "/message-sent-business",
                        title: "送信メッセージ箱",
                    },
                    {
                        pathname: "/message-box-business",
                        title: "保管箱",
                    },
                ],
            },
            {
                pathname: "/point-use-record",
                title: "ポイント利用履歴",
            },
            {
                pathname: "/password-change",
                title: "パスワード変更",
            },
            {
              pathname: "/withdraw-business",
              title: "会員退会",
          },
            // {
            //     pathname: "",
            //     title: "ログアウト",
            // },
        ],
    },
});

export { sideMenu };


// {
//   pathname: "/suspension-business",
//   title: "이용정지 / 탈퇴",
//   subMenu: [
//       {
//           pathname: "/suspension-business",
//           title: "이용정지",
//       },
//       {
//           pathname: "/withdraw-business",
//           title: "회원탈퇴",
//       },
//   ],
// },
