import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const userSession = atom({
  key: "userSession",
  default: {
    refreshToken: "",
    userType: "",
    permissions: [],
  },
  effects_UNSTABLE: [ persistAtom ],
});

export { userSession };