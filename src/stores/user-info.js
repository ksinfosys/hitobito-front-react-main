import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const userInfo = atom({
  key: "userInfo",
  default: {
    // 0 - 초기 , 1 - 유저, 2 - 기업
    userType: 0,
    userNickName: "",
    cpUserName: "",
    historyBalance: 0,
  },
  effects_UNSTABLE: [ persistAtom ],
});

export { userInfo };
