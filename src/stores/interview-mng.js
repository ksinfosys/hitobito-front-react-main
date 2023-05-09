import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const interviewMng = atom({
  key: "interviewMng",
  default: {
    statusFlagText: "状態",
    statusFlag: 0,
    orderDate: 0,
  },
  effects_UNSTABLE: [ persistAtom ],
});

export { interviewMng };
