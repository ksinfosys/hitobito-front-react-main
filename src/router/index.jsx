import {useRoutes} from "react-router-dom";
import SideMenu from "../layouts/side-menu/Main";
import SideBusinessMenu from "../layouts/side-business-menu/Main";
import TopMenu from "../layouts/top-menu/Main";
import IntroTopMenu from "../layouts/Intro-top-menu/Main";
import Login from "../views/login/login";
import FindId from "../views/login/find-id";
import FindIdResult from "../views/login/find-id-result";
import FindPwd from "../views/login/find-pwd";
import TempPwd from "../views/login/temp-pwd";
import PwdChange from "../views/login/pwd-change";
import Signup from "../views/sign-up/signup";
import SignupEmployee from "../views/sign-up/signup-employee";
import SignupEmployeeTerm from "../views/sign-up/signup-employee-term";
import SignupEmployeeTermBusiness from "../views/sign-up/signup-employee-term-business";
import KakaoAuthCallback from "../views/login/kakao-auth-callback"

import Intro from "../views/Intro/intro";
import Dashboard from "../views/dashboard/dashboard";
import PointDetail from "../views/point/point-detail";
import GiftcardRegist from "../views/point/giftcard-regist";
import GiftcarRecord from "../views/point/giftcard-record";
import Nickname from "../views/nickname/nickname";
import Suspension from "../views/membership/suspension";
import Withdraw from "../views/membership/withdraw";
import MessageReception from "../views/message/message-reception";
import MessageSent from "../views/message/message-sent";
import MessageBox from "../views/message/message-box";
import MessageDetail from "../views/message/message-detail";
import MessageReply from "../views/message/message-reply";

import ResumeChange from "../views/resume-mng/resume-change";
import UserGuideEmployee from "../views/sign-up/user-guide-employee";

// 모바일 ------------------------------------------------------------
import ResumeRegistMo2 from "../views/resume-mng/resume-regist-mo2";
import ResumeRegistMo3 from "../views/resume-mng/resume-regist-mo3";
import ResumeRegistMo4 from "../views/resume-mng/resume-regist-mo4";
import ResumeRegistMo5 from "../views/resume-mng/resume-regist-mo5";
import ResumeRegistMo6 from "../views/resume-mng/resume-regist-mo6";
import ResumeRegistMo7 from "../views/resume-mng/resume-regist-mo7";
import ResumeRegistMo8 from "../views/resume-mng/resume-regist-mo8";
import ResumeRegistMo9 from "../views/resume-mng/resume-regist-mo9";
import ResumeRegistMo10 from "../views/resume-mng/resume-regist-mo10";
import ResumeRegistMo11 from "../views/resume-mng/resume-regist-mo11";
import ResumeRegistMo12 from "../views/resume-mng/resume-regist-mo12";
import ResumeRegistMo13 from "../views/resume-mng/resume-regist-mo13";
import ResumeRegistMo14 from "../views/resume-mng/resume-regist-mo14";
import ResumeRegistMo15 from "../views/resume-mng/resume-regist-mo15";

// 모바일 -------------------------------------------------------------
// 기업
import DashboardBusiness from "../views/dashboard-business/dashboard-business";
import PointUseRecord from "../views/point-use-record/point-use-record";
import PasswordChange from "../views/password-change/password-change";
import InterviewMng from "../views/interview-mng/interview-mng";
import CorpInfoMng from "../views/corp-info-mng/corp-info-mng";
import SuspensionBusiness from "../views/membership/suspension-business";
import PointDetailBusiness from "../views/point/point-detail-business";
import UsePlan from "../views/use-plan/use-plan";
import MessageReceptionBusiness from "../views/message/message-reception-business";
import MessageSentBusiness from "../views/message/message-sent-business";
import MessageBoxBusiness from "../views/message/message-box-business";
import WithdrawBusiness from "../views/membership/withdraw-business";
import UserGuideBusiness from "../views/sign-up/user-guide-business";
import SignUpBusiness from "../views/sign-up/signup-business";

import {getCookie} from "../utils/cookie";
import {useRecoilState} from "recoil";
import {userInfo} from "../stores/user-info";
import Resume from "../views/resume-mng/Resume";
import Success from "../views/use-plan/Success";
import Canceled from "../views/use-plan/Canceled";
import PaymentSuccess from "../views/point/Success";
import PaymentCanceled from "../views/point/Canceled";
import AppleAuthCallback from "../views/login/apple-auth-callback";
import PlanDetail from "../views/use-plan/plan-detail";

function Router() {
  const token = getCookie("accessToken");
  // const token = testToken;
  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);

  // 유저타입 체크
  const isSeeker = userInfoV.userType === 1;

  const routes = !token
    ? [

      // intro
      {
        path: "/intro",
        element: <IntroTopMenu/>,
        children: [
          {
            path: "/intro",
            element: <Intro/>,
          },
        ],
      },
      // 로그인
      {
        path: "/",
        element: <TopMenu/>,
        children: [
          {
            path: "/",
            element: <Login/>,
          },
        ],
      },
      // 카카오 redirect url
      {
        path: "/kakao-auth-callback",
        element: <KakaoAuthCallback/>,
      },
      // apple redirect url
      {
        path: "/apple-auth-callback",
        element: <AppleAuthCallback/>,
      },
      //아이디찾기
      {
        path: "/find-id",
        element: <TopMenu/>,
        children: [
          {
            path: "/find-id",
            element: <FindId/>,
          },
        ],
      },
      //아이디찾기결과
      {
        path: "/find-result",
        element: <TopMenu/>,
        children: [
          {
            path: "/find-result",
            element: <FindIdResult/>,
          },
        ],
      },
      //비밀번호 찾기
      {
        path: "/find-pwd",
        element: <TopMenu/>,
        children: [
          {
            path: "/find-pwd",
            element: <FindPwd/>,
          },
        ],
      },
      //회원가입
      {
        path: "/signup",
        element: <TopMenu/>,
        children: [
          {
            path: "/signup",
            element: <Signup/>,
          },
        ],
      },
      //구직자 회원가입 선택
      {
        path: "/signup-em",
        element: <TopMenu/>,
        children: [
          {
            path: "/signup-em",
            element: <SignupEmployee/>,
          },
        ],
      },

      //회사 이용규약
      {
        path: "/signup-em-term-business",
        element: <TopMenu/>,
        children: [
          {
            path: "/signup-em-term-business",
            element: <SignupEmployeeTermBusiness/>,
          },
        ],
      },
      // 구직 - 회원가입
      {
        path: "/signup-business",
        element: <TopMenu/>,
        children: [
          {
            path: "/signup-business",
            element: <SignUpBusiness/>,
          },
        ],
      },
      // 이용가이드
      {
        path: "/user-guide-business",
        element: <TopMenu/>,
        children: [
          {
            path: "/user-guide-business",
            element: <UserGuideBusiness/>,
          },
        ],
      },
    ]
    :
    isSeeker
      ? [
        {
          path: "/",
          element: <SideMenu/>,
          children: [
            // 면접 제의 확인
            {
              path: "/",
              element: <Dashboard/>,
            },
            // 이력서 등록
            {
              path: "/resume-regist",
              element: <Resume/>,
            },

            // 이력서등록 모바일
            {
              path: "/resume-regist-mo2",
              element: <ResumeRegistMo2/>,
            },
            {
              path: "/resume-regist-mo3",
              element: <ResumeRegistMo3/>,
            },
            {
              path: "/resume-regist-mo4",
              element: <ResumeRegistMo4/>,
            },
            {
              path: "/resume-regist-mo5",
              element: <ResumeRegistMo5/>,
            },
            {
              path: "/resume-regist-mo6",
              element: <ResumeRegistMo6/>,
            },
            {
              path: "/resume-regist-mo7",
              element: <ResumeRegistMo7/>,
            },
            {
              path: "/resume-regist-mo8",
              element: <ResumeRegistMo8/>,
            },
            {
              path: "/resume-regist-mo9",
              element: <ResumeRegistMo9/>,
            },
            {
              path: "/resume-regist-mo10",
              element: <ResumeRegistMo10/>,
            },
            {
              path: "/resume-regist-mo11",
              element: <ResumeRegistMo11/>,
            },
            {
              path: "/resume-regist-mo12",
              element: <ResumeRegistMo12/>,
            },
            {
              path: "/resume-regist-mo13",
              element: <ResumeRegistMo13/>,
            },
            {
              path: "/resume-regist-mo14",
              element: <ResumeRegistMo14/>,
            },
            {
              path: "/resume-regist-mo15",
              element: <ResumeRegistMo15/>,
            },

            //이력서 변경
            {
              path: "resume-change",
              element: <ResumeChange/>,
            },
            //포인트 관리
            {
              path: "point-detail",
              element: <PointDetail/>,
            },
            {
              path: "giftcard-regist",
              element: <GiftcardRegist/>,
            },
            {
              path: "giftcard-record",
              element: <GiftcarRecord/>,
            },
            //닉네임 변경
            {
              path: "nickname",
              element: <Nickname/>,
            },

            //이용정지/회원탈퇴
            {
              path: "suspension",
              element: <Suspension/>,
            },
            {
              path: "withdraw",
              element: <Withdraw/>,
            },
            //메세지함
            {
              path: "message-reception",
              element: <MessageReception/>,
            },
            {
              path: "message-sent",
              element: <MessageSent/>,
            },
            {
              path: "message-box",
              element: <MessageBox/>,
            },
            {
              path: "message-detail",
              element: <MessageDetail/>,
            },
            {
              path: "message-reply",
              element: <MessageReply/>,
            },       
          ],
        },
        //구직자 이용규약
        {
          path: "/signup-em-term",
          element: <TopMenu/>,
          children: [
            {
              path: "/signup-em-term",
              element: <SignupEmployeeTerm/>,
            },
          ],
        },
        // 이용가이드
        {
          path: "/user-guide-employee",
          element: <TopMenu/>,
          children: [
            {
              path: "/user-guide-employee",
              element: <UserGuideEmployee/>,
            },
          ],
        },
      ]
      : [
        // 기업 이용가이드
        {
          path: "/user-guide-business",
          element: <TopMenu/>,
          children: [
            {
              path: "/user-guide-business",
              element: <UserGuideBusiness/>,
            },
          ],
        },

        //이용규약
        {
          path: "/plan-detail",
          element: <TopMenu/>,
          children:[
            {
              path: "/plan-detail",
              element: <PlanDetail/>,
            }
          ]          
        },

        
        //기업 화면
        {
          path: "/",
          element: <SideBusinessMenu/>,
          children: [
            {
              path: "/",
              element: <DashboardBusiness/>,
            },
            // 구직자검색
            {
              path: "/business",
              element: <DashboardBusiness/>,
            },
            // 면접의뢰 관리
            {
              path: "/interview-mng",
              element: <InterviewMng/>,
            },
            // 기업정보 관리
            {
              path: "/corp-mng",
              element: <CorpInfoMng/>,
            },
            // 이용정지 / 탈퇴
            {
              path: "/suspension-business",
              element: <SuspensionBusiness/>,
            },
            //포인트 구입
            {
              path: "point-detail-business",
              element: <PointDetailBusiness/>,
            },
            {
              path: "/withdraw-business",
              element: <WithdrawBusiness/>,
            },
            // 이용플랜설정
            {
              path: "use-plan",
              element: <UsePlan/>,
              children: [
                {path: "success", element: <Success/>},
                {path: "canceled", element: <Canceled/>},
              ]
            },
            

            {
              path: 'payment',
              children: [
                {path: "success", element: <PaymentSuccess/>},
                {path: "canceled", element: <PaymentCanceled/>},
              ]
            },
            //메세지함
            {
              path: "message-reception-business",
              element: <MessageReceptionBusiness/>,
            },
            {
              path: "message-sent-business",
              element: <MessageSentBusiness/>,
            },
            {
              path: "message-box-business",
              element: <MessageBoxBusiness/>,
            },
            // 포인트이용이력
            {
              path: "/point-use-record",
              element: <PointUseRecord/>,
            },
            // 비밀번호 변경
            {
              path: "/password-change",
              element: <PasswordChange/>,
            },
            //비밀번호 변경하기
            //임시 비밀번호 발급
            {
              path: "/temp-pwd",
              element: <TopMenu/>,
              children: [
                {
                  path: "/temp-pwd",
                  element: <TempPwd/>,
                },
              ],
            },
          ],
        },
        {
          path: "/pwd-change",
          element: <TopMenu/>,
          children: [
            {
              path: "/pwd-change",
              element: <PwdChange/>,
            }
          ]
        },

      ];

  return useRoutes(routes);
}

export default Router;
