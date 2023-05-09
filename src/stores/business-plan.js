import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const businessPlan = atom({
  key: "business-plan",
  default: {
    isOpen: 0,
    sessionId: '',
  },
  effects_UNSTABLE: [ persistAtom ],
});

export { businessPlan };
