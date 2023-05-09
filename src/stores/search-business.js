import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const searchBusiness = atom({
  key: "searchBusiness",
  default: {},
  effects_UNSTABLE: [ persistAtom ],
});

export { searchBusiness };
