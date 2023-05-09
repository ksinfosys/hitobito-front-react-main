import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const userCount = atom({
  key: "userCount",
  default: {
    searchCount: 0,
    interviewCount: 0,
  },
  effects_UNSTABLE: [ persistAtom ],
});

export { userCount };
