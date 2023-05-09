import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const msgSave = atom({
  key: "msgSave",
  default: {
    msgSaveState: false,
  },
  effects_UNSTABLE: [ persistAtom ],
});

export { msgSave };
