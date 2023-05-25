import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

const mobileStatus = atom({
  key: "mobile-status"
  // ,
  // default: {
  //   progress: 1,
  //   country:'',
  //   userAge:'',
  //   education:'',
  //   userGender:'',
  //   career:'',

  //   mobileBusinessDeptIdx: 0,
  //   businessTypeOneDeps:'',
  //   businessDepthMenu:[],
  //   businessType:'',

  //   mobileJobDeptIdx: 0,
  //   jobTypeOneDeps:'',
  //   jobDepthMenu:[],
  //   jobType:'',

  //   residentialArea:'',

  //   mobileHopeCareerDeptIdx: 0,
  //   hopeCareerOneDeps:'',
  //   hopeCareerDepthMenu:[],
  //   hopeCareer:'',

  //   hopeIncome:'',

  //   projectName:[],
  //   projectPeriod:[],
  //   projectRole:[],
  //   projectProcess:[],
  //   skillCode:[],
  //   careerCode:[],
  //   schoolName:'',
  //   majorName:'',
  //   phoneNumber:'',
  //   userEmail:'',
  //   additionalComment:'',
  //   phoneNumberFlag:0,
  //   userEmailFlag:0,
  //   rsFilePhoto:'',
  //   rsFileDocument:'',
  // },
  // effects_UNSTABLE: [ persistAtom ],
});

export { mobileStatus };
