import React, { useEffect, useRef, useState } from 'react';
import ResumeMobile from '../../components/resume-mobile/resume-mobile';
import MobileBottom from '../../components/mobileBottom/mobile-bottom';

import CameraPhoto from "@/assets/images/camera.svg";
import Search from "@/assets/images/search.svg";
import blueX from "@/assets/images/blue-x.svg";
import attachIcon from "@/assets/images/attach-icon.svg";
import blacksmallX from "@/assets/images/black-small-x.svg";
import Download from "@/assets/images/download-icon.svg";
import Xbutton from "@/assets/images/x_button.svg";
import SelectBox from "./desktop-items/SelectBox";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import CareerWrite from "./desktop-items/CareerWrite";
import { useRecoilState } from "recoil";
// import { mobileStatus } from "../../stores/mobile-status";
import { Lucide, Modal, ModalBody, ModalFooter, ModalHeader } from "@/base-components";
import DepthSplit from "../../../util/DepthSplit";
import ModalEvent from "./ModalEvent";
import $ from "jquery";

const ResumeRegist = () => {
  // const [selectPop, setselectPop] = useState(false);
  // const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const categoryRef = useRef(null);
  const skillNameRef = useRef(null)

  const [year, setYear] = useState(0)
  const [image, setImage] = useState([])
  const [career, setCareer] = useState([{ process: [] },])
  const [skillItem, setSkillItem] = useState({
    temp: {},
    arr: [],
  })
  const [depthMenu, setDepthMenu] = useState({
    hopeCareer: {
      depth: 0,
      depth_first: '目標 1',
      depth_seconds: '目標 2',
    },
    jobType: {
      depth: 0,
      depth_first: '職種 1',
      depth_seconds: '職種 2',
    },
    businessType: {
      depth: 0,
      depth_first: '業種 1',
      depth_seconds: '業種 2',
    },
  })

  const [data, setListData] = useState()
  const [skillList, setSkillList] = useState({
    category: [],
    skillName: [],
    origin: [],
  })
  const [body, setBody] = useState({
    country: '',
    userAge: '',
    education: '',
    userGender: '',
    career: '',
    businessType: '',
    jobType: '',
    residentialArea: '',
    hopeCareer: '',
    hopeIncome: '',
    projectName: [],
    projectPeriod: [],
    projectRole: [],
    projectProcess: [],
    skillCode: [],
    careerCode: [],
    schoolName: '',
    majorName: '',
    phoneNumber: '',
    userEmail: '',
    additionalComment: '',
    phoneNumberFlag: '1',
    userEmailFlag: '1',
  })
  const [rsFilePhoto, setRsFilePhoto] = useState([])
  const [fileNames, setFileNames] = useState([])
  const [rsFileDocument, setRsFileDocument] = useState([])
  const [hopeCareerModal, setHopeCareerModal] = useState(false);
  const [jopTypeModal, setJobTypeModal] = useState(false);
  const [businessTypeModal, setBusinessTypeModal] = useState(false);
  const [hopeOptionSelectFail, setHopeOptionSelectFail] = useState(false);
  const [jobOptionSelectFail, setJobOptionSelectFail] = useState(false);
  const [businessOptionSelectFail, setBusinessOptionSelectFail] = useState(false);

  // 簡単な自己紹介 200자이상 fail
  const [infoLimitFail, setInfoLimitFail] = useState(false);

  const handleAgeCalculator = () => new Date().getFullYear() - year + '歳'
  const [index, setIndex] = useState(0);

  // body 데이터 수정
  const handleSelectChangeEvent = (e) => {
    const key = e.target.id.replaceAll(' dropdown-button-dark-example1', '').replaceAll(' product-status-active', '')
    let value
    if (key === 'phoneNumberFlag' || key === 'userEmailFlag') {
      value = body[key] === '1' ? '0' : '1'
    } else {
      value = e.target.value
    }
    if (key === 'userAge') setYear(parseInt(e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text.toString()))

    if (key === 'skillCode') {
      setBody(prevState => {
        return {
          ...body,
          skillCode: [...prevState.skillCode, e.target.value]
        }
      })
    } else {
      setBody({
        ...body,
        [key]: value
      })
    }
  }
  const handleCheckText = (e) => {
    const key = e.target.id.replaceAll(' regular-form-1', '')
    const value = e.target.value
    /*console.log(e.target)
    console.log(value)*/

    const emailCheck = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/
    const phoneCheck = /^([0-9]{3})-?([0-9]{3,4})-?([0-9]{4})$/

    if (e.target.value !== '') {
      if (key === 'userEmail' && !emailCheck.test(value)) {
        // setResumeLabel("入力形式:abc@test.com.に合わせてください。");
        // setResumeAlert(true); 
        $(".email-error-text").css("display","block");
        $(".email-error-text").text("入力形式:abc@test.com.に合わせてください。");
        e.target.value = ''
        setBody({
          ...body,
          [key]: ''
        })
        setEmailError(true);
        return false
      } else if (key === 'userEmailSelect' && emailCheck.test(value)) {
        $(".email-error-text").css("display","none");
      }
      if (key === 'phoneNumber' && !phoneCheck.test(value)) {
        // setResumeLabel("電話番号の形式を確認してください。");
        // setResumeAlert(true); 
        $(".phone-error-text").css("display","block");
        $(".phone-error-text").text("電話番号の形式を確認してください。");
        e.target.value = ''
        setBody({
          ...body,
          [key]: ''
        })
        setPhoneError(ture);
        return false
      } else if (key === 'phoneNumberSelect' && phoneCheck.test(value)) {
        $(".phone-error-text").css("display","none");
      }
    }
  }
  // 연락처 하이픈 추가
  const handlePhone = (e) => {
    let newValue = e.target.value;
    newValue = newValue.replace(/-/g, ''); // 입력값에서 하이픈 제거

    e.target.value = newValue.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{4})(\d{4})$/, `$1-$2-$3`);

  };
  // input 데이터 수정
  const handleInputTextChangeEvent = (e) => {
    const key = e.target.id.replaceAll(' regular-form-1', '')
    const value = e.target.value
    if (value.length >= 201) {
      setInfoLimitFail(true)
    }
    setBody({
      ...body,
      [key]: value
    })

  }

  //이미지 업로드
  const handleChangeImage = async (e, index) => {
    const file = e.target.files
    if (rsFilePhoto.length >= 5 || file.length + rsFilePhoto.length > 5) {
      setResumeLabel("5個まで登録できます。");
      setResumeAlert(true); 
      return false
    }

    for (let i = 0; i < file.length; i++) {
      const reader = new FileReader()
      reader.readAsDataURL(file[i])
      reader.onload = (res) => setImage(prevState => [...prevState, res.target.result])
      setRsFilePhoto(prevItem => [...prevItem, file[i]])
    }
  };
  const handleDeleteImage = (index) => {
    const newImages = [...image];
    const tempForm = [...rsFilePhoto]
    newImages.splice(index, 1);
    tempForm.splice(index, 1)
    setImage(newImages);
    setRsFilePhoto([...tempForm])
  };
  const previewItem = (<div className='image_item01'>
    <input
      id={`profileImg0`}
      type={'file'}
      multiple
      onChange={(e) => handleChangeImage(e, 0)}
    />
    <label className={'custom-input-label'} htmlFor={`profileImg0`}>
      <img src={CameraPhoto} alt='' />
    </label>
  </div>);

  //커리어 부분
  const handleCareerChangeAndProcess = (e, index, tempArr, roleValue) => {
    const processTemp = [...career]
    const roleTemp = [...body.projectRole]
    const strArr = []
    processTemp[index].process = tempArr;
    processTemp.map((item, key) => {
      strArr[key] = item.process.toString()
    })

    roleTemp[index] = roleValue
    setBody({
      ...body,
      projectRole: roleTemp,
      projectProcess: strArr
    })
  }

  const [resumeCareerDelIndex, setResumeCareerDelIndex] = useState();
  const handleAddBtn = (e, index) => {
    //console.log("body:::",body)
    // console.log(idx)
    if (index === 0) {
      setCareer(prevState => [...prevState, { process: [] }]);
      setIndex(index + 1);
      
    } else {
      const tempArr = [...career]
      const tempBody = {...body}

        if (index < tempBody.projectName.length|| 
          index < tempBody.projectPeriod.length||
          index < tempBody.projectRole.length||
          index < tempBody.projectProcess.length) {
          setResumeCareerDel(true);
          setResumeCareerDelIndex(index);
        }else {
          tempArr.splice(index, 1)
          tempBody.projectName.splice(index, 1)
          tempBody.projectPeriod.splice(index, 1)
          tempBody.projectRole.splice(index, 1)
          tempBody.projectProcess.splice(index, 1)

        setCareer(tempArr)
        setBody({...tempBody})
        setIndex(index-1)
      }
    }
  }

  const crwProjectRef = useRef(null);

    useEffect(() => {
    if (crwProjectRef.current && index !== 0) {
      crwProjectRef.current.focus();
    }
  }, [index]);

  // useEffect(() => {
  //   if($(".projectName_"+index) && index != 0){
  //     $(".projectName_"+index).focus();
  //   }
  // }, [index])

  const handleCareerChange = (e, index) => {
    const id = e.target.id.replaceAll(' dropdown-button-dark-example1', '')
    // console.log("id:::",id)
    // console.log("e.target.value:::",e.target.value)
    const tempArr = [...body[id]]
    tempArr[index] = id === 'projectPeriod' ? parseInt(e.target.value) : e.target.value
    setBody({...body, [id]: tempArr})
  }

  const handlePeriodChange = (index) => {
    const id = 'projectPeriod';
    const tempArr = [...body[id]]
    tempArr[index] = id === 'projectPeriod' ? parseInt($(`.projectPeriod_${index}`).val()) : $(`.projectPeriod_${index}`).val()
    setBody({...body, [id]: tempArr})
  }

  const handleProjectProcessAdd = (e, index) => {
    const temp = [...career]
    if (e.target.checked) {
      temp[index].process.push(e.target.value);
      temp[index].process.sort();
      setCareer(temp)
      projectProcessEvent(temp); 
    } else {
      handleProjectProcessDel(index, e.target.value)
    }
  }
  const handleProjectProcessDelAll = (e, index, flag) => {
    const temp = [...career]
    if (e.target.checked == false) {
      temp[index].process.splice(e.target.value.indexOf())
      temp[index].process.sort();
      setCareer(temp)
      projectProcessEvent(temp)
    } else {
      handleProjectProcessDel(index, e.target.value)
    }
  }
  const handleProjectProcessDel = (index, target) => {
    const temp = [...career]
    let targetCode = "";
    let position = 0;
    if(target.includes("63")){
      position = temp[index].process.indexOf(target)
    }else{
      for(let i = 0; i < data?.projectProcessList.length; i++){
        if(data?.projectProcessList[i].projectProcessName == target){
          targetCode = data?.projectProcessList[i].projectProcess;
        }
      }
      position = temp[index].process.indexOf(targetCode)
    }
    temp[index].process.splice(position, 1)
    temp[index].process.sort();
    setCareer(temp)
    projectProcessEvent(temp)
  }
  const projectProcessEvent = (arr) => {
    let strArr = []
    for (let i = 0; i < arr.length; i++) {
      strArr[i] = arr[i].process.toString()
    }
    setBody({ ...body, projectProcess: [...strArr] })
  }

  //스킬 부분
  const handleUpdateSkill = (e, item) => {
    const key = e.target.id.replaceAll(' regular-form-1', '').replaceAll(' dropdown-button-dark-example1', '')
    let value = ''
    if (!item) {
      value = e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text.toString()
    }

    setSkillItem({
      ...skillItem,
      temp: {
        ...skillItem.temp,
        [key]: item ? item : {
          [key === 'skillCategory' ? key + 'Name' : 'careerYear']: value,
          [key === 'skillCategory' ? key + 'Code' : 'careerCode']: e.target.value
        }
      }
    })
  }

  const handleAddSkills = (e) => {

    if (skillItem.temp.skillCode && skillItem.temp.careerCode) {
      if (skillItem.arr.filter(skill => skill.name === skillItem.temp.skillCode.skillName).length > 0) {
        setResumeLabel("スキルが重複されました。");
        setResumeAlert(true); 
        document.querySelector('.refTarget_select').value = null;
        document.querySelectorAll('.refTarget_radio').forEach(radio => radio.checked = false)
        return
      }
      setBody({
        ...body,
        skillCode: [...body.skillCode, skillItem.temp.skillCode.skill],
        careerCode: [...body.careerCode, skillItem.temp.careerCode.careerCode],
      })
      setSkillItem({
        arr: [...skillItem.arr, {
          cate: skillItem.temp.skillCode.skillCategoryName,
          name: skillItem.temp.skillCode.skillName,
          year: skillItem.temp.careerCode.careerYear
        }],
        temp: {}
      })
      document.querySelector('.refTarget_select').value = null;
      document.querySelectorAll('.refTarget_radio').forEach(radio => radio.checked = false)
    } else {
      setResumeLabel("スキルと経験期間を両方選択してください。");
      setResumeAlert(true); 
    }

  }


  // 파일 업로드 부분
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (rsFileDocument.length + files.length >= 5) {
      setResumeLabel("ファイルは４つまで添付できます。");
      setResumeAlert(true); 
      return false;
    }

    const fileSize = files.map(fs => fs.size);
    if(fileSize>1024*1024*10){
      setResumeLabel("ファイルの容量は10MBを超えることはできません。");
      setResumeAlert(true); 
      return false;
    }

    files.map(file => {
      setRsFileDocument(prevItem => [...prevItem, file])
      setFileNames(prevItem => [...prevItem, file.name])
    })
  };
  const handleDeleteFile = (index) => {
    const updatedNames = [...fileNames];
    const updatedDocument = [...rsFileDocument];

    updatedNames.splice(index, 1);
    updatedDocument.splice(index, 1);

    setFileNames(updatedNames);
    setRsFileDocument(updatedDocument);
  };
  
  const [countryError, setCountryError] = useState(false);
  const [educationError, setEducationError] = useState(false);
  const [schoolNameError, setSchoolNameError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [majorNameError, setMajorNameError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [residentialAreaError, setResidentialAreaError] = useState(false);
  const [hopeIncomeError, setHopeIncomeError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [careerError, setCareerError] = useState(false);
  const [hopeCareerError, setHopeCareerError] = useState(false);
  const [jobTypeError, setJobTypeError] = useState(false);
  const [businessTypeError, setBusinessTypeError] = useState(false);
  const [skillCodeError, setSkillCodeError] = useState(false);
  const [skillCarrerError, setSkillCarrerError] = useState(false);
  
  const educationRef = useRef(null);
  const schoolNameRef = useRef(null);
  const countryRef = useRef(null);
  const userGenderRef = useRef(null);
  const majorNameRef = useRef(null);
  const userAgeRef = useRef(null);
  const residentialAreaRef = useRef(null);
  const hopeIncomeRef = useRef(null);
  const userEmailRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const careerRef = useRef(null);
  const projectRef = useRef(null);
  const skillCodeRef = useRef(null);
  const userEmailClosedRef = useRef(null);
  const phoneNumberClosedRef = useRef(null);
  
  const selectCountryRef = useRef(null);
  const selectEducationRef = useRef(null);
  const selectGenderRef = useRef(null);
  const selectAgeRef = useRef(null);
  const selectResidentialAreaRef = useRef(null);
  const selectHopeIncomeRef = useRef(null);
  const selectCareerRef = useRef(null);
  const selectHopeCareerRef = useRef(null);
  const selectJobTypeRef = useRef(null);
  const selectbusinessTypeRef = useRef(null);

  //이력서 알림 모달
  const [resumeAlert, setResumeAlert] = useState(false);
  const [resumeLabel, setResumeLabel] = useState("");
  const [resumeComplete, setResumeComplete] = useState(false);
  const [resumeFail, setReresumeFail] = useState(false);
  const [resumeCareerDel, setResumeCareerDel] = useState(false);

  
  // 전송
  const handleSubmit = async () => {
    const formData = new FormData()
    const blob = new Blob([JSON.stringify(body)], { type: 'application/json' })
    let errorCount = 0;
    await formData.append('request', blob)
    
    if(skillItem.arr.length == 0){
      // setResumeLabel("スキルを選択してください。");
      // setResumeAlert(true); 
      $(".skillItem-error-text").css("display","block");
      $(".skillItem-error-text").text("スキルを選択してください。");
      skillCodeRef.current.focus();
      setSkillCodeError(true);
      setSkillCarrerError(true)
      errorCount++;
    } else {
      $(".skillItem-error-text").css("display","none");
      setSkillCodeError(false);
      setSkillCarrerError(false)
    }

    const max = $(".project-count").length;
    
      // console.log("career:::",career)
      // console.log("body:::",body)
      // console.log("max:::",max)

    for(let i = 0; i < max; i++){
      if (typeof body.projectPeriod[i] !== "number" || isNaN(body.projectPeriod[i])) {
        // const errorMessage = i === 0 ? "プロジェクト期間を入力してください。" : (i + 1) + "番目のプロジェクト期間を入力してください。";
        // setResumeLabel(errorMessage);
        // setResumeAlert(true); 
        $(".projectPeriod-error-text"+i).css("display","block");
        $(".projectPeriod-error-text"+i).text("プロジェクト期間を入力してください。");
        $(".periodInputGroup_"+i).addClass("period-error");
        if (projectRef.current) {
          projectRef.current.focus();
        }
        errorCount++;
      } else {
        $(".projectPeriod-error-text"+i).css("display","none");
        $(".periodInputGroup_"+i).removeClass("period-error");
      }
    }

    for(let i = 0; i < max; i++){
      if (typeof body.projectRole[i] !== "string" || body.projectRole[i] == "") {
        // const errorMessage = i === 0 ? "プロジェクト役割を入力してください。" : (i + 1) + "番目のプロジェクト役割を入力してください。";
        // setResumeLabel(errorMessage);
        // setResumeAlert(true); 
        $(".projectRole-error-text"+i).css("display","block");
        $(".projectRole-error-text"+i).text("プロジェクト役割を入力してください。");
        $(".projectRole_"+i).addClass("error");
        if (projectRef.current) {
          projectRef.current.focus();
        }
        errorCount++;
      } else {
        $(".projectRole-error-text"+i).css("display","none");
        $(".projectRole_"+i).removeClass("error");
      }
    }

    for(let i = 0; i < max; i++){
      if (typeof body.projectName[i] !== "string" || body.projectName[i] == "") {
        // const errorMessage = i === 0 ? "プロジェクト名を入力してください。" : (i + 1) + "番目のプロジェクト名を入力してください。";
        // setResumeLabel(errorMessage);
        // setResumeAlert(true); 
        $(".projectName-error-text"+i).css("display","block");
        $(".projectName-error-text"+i).text("プロジェクト名を入力してください。");
        $(".projectName_"+i).addClass("error");
        if (projectRef.current) {
          projectRef.current.focus();
        }
        errorCount++;
      } else {
        $(".projectName-error-text"+i).css("display","none");
        $(".projectName_"+i).removeClass("error");
      }
    }

    if (!body.businessType) {
      // setResumeLabel("所属会社の業種を選択してください。");
      // setResumeAlert(true); 
      $(".businessType-error-text").css("display","block");
      $(".businessType-error-text").text("所属会社の業種を選択してください。");
      selectbusinessTypeRef.current.focus();
      setBusinessTypeError(true);
      errorCount++;
    } else {
      $(".businessType-error-text").css("display","none");
      setBusinessTypeError(false);
    }

    if (!body.jobType) {
      // setResumeLabel("現在の職種を選択してください。");
      // setResumeAlert(true); 
      $(".jobType-error-text").css("display","block");
      $(".jobType-error-text").text("現在の職種を選択してください。");
      selectJobTypeRef.current.focus();
      setJobTypeError(true);
      errorCount++;
    } else {
      $(".jobType-error-text").css("display","none");
      setJobTypeError(false);
    }

    if (!body.career) {
      // setResumeLabel("経歴を選択してください。");
      // setResumeAlert(true); 
      $(".career-error-text").css("display","block");
      $(".career-error-text").text("経歴を選択してください。");
      selectCareerRef.current.focus();
      setCareerError(true);
      errorCount++;
    } else {
      $(".career-error-text").css("display","none");
      setCareerError(false);
    }

    if(!body.education){
      // setResumeLabel("学歴を選択してください。");
      // setResumeAlert(true); 
      $(".education-error-text").css("display","block");
      $(".education-error-text").text("学歴を選択してください。");
      selectEducationRef.current.focus();
      setEducationError(true);
      errorCount++;
    } else {
      $(".education-error-text").css("display","none");
      setEducationError(false);
    }
    
    if (!body.userGender) {
      // setResumeLabel("性別を選択してください。");
      // setResumeAlert(true); 
      $(".userGender-error-text").css("display","block");
      $(".userGender-error-text").text("性別を選択してください。");
      selectGenderRef.current.focus();
      setGenderError(true);
      errorCount++;
    } else {
      $(".userGender-error-text").css("display","none");
      setGenderError(false);
    }

    if (!body.hopeCareer) {
      // setResumeLabel("将来の目標を選択してください。");
      // setResumeAlert(true); 
      $(".hopeCareer-error-text").css("display","block");
      $(".hopeCareer-error-text").text("将来の目標を選択してください。");
      selectHopeCareerRef.current.focus();
      setHopeCareerError(true);
      errorCount++;
    } else {
      $(".hopeCareer-error-text").css("display","none");
      setHopeCareerError(false);
    }

    //전화번호 이메일 모두 비 공개시 뜨는 팝업
    if(body.userEmailFlag === '0' && body.phoneNumberFlag === '0'){
      // setResumeLabel("メールアドレスと連絡先電話番号の中で一つは公開してください。");
      // setResumeAlert(true); 
      $(".emailPhoneFlag-error-text").css("display","block");
      $(".emailPhoneFlag-error-text").text("メールアドレスと連絡先電話番号の中で一つは公開してください。");
      userEmailClosedRef.current.focus();
      phoneNumberClosedRef.current.focus();
      errorCount++;
    } else {
      $(".emailPhoneFlag-error-text").css("display","none");
    }

    if (!body.phoneNumber) {
      // setResumeLabel("電話番号を入力してください。");
      // setResumeAlert(true); 
      $(".none-phone-error-text").css("display","block");
      $(".none-phone-error-text").text("電話番号を入力してください。");
      if (phoneNumberRef.current) {
        phoneNumberRef.current.focus();
        setPhoneError(true);
      }
      errorCount++;
    } else {
      $(".none-phone-error-text").css("display","none");
      setPhoneError(false);
    }

    if (!body.userEmail) {
      // setResumeLabel("イーメールを入力してください。");
      // setResumeAlert(true); 
      $(".none-email-error-text").css("display","block");
      $(".none-email-error-text").text("イーメールを入力してください。");
      if (userEmailRef.current) {
        userEmailRef.current.focus();
        setEmailError(true);
      }
      errorCount++;
    } else {
      $(".none-email-error-text").css("display","none");
      setEmailError(false);
    }

    if (!body.hopeIncome) {
      // setResumeLabel("希望年収を選択してください。");
      // setResumeAlert(true); 
      $(".hopeIncome-error-text").css("display","block");
      $(".hopeIncome-error-text").text("希望年収を選択してください。");
      selectHopeIncomeRef.current.focus();
      setHopeIncomeError(true);
      errorCount++;
    } else {
      $(".hopeIncome-error-text").css("display","none");
      setHopeIncomeError(false);
    }

    if (!body.residentialArea) {
      // setResumeLabel("居住地を選択してください。");
      // setResumeAlert(true); 
      $(".residentialArea-error-text").css("display","block");
      $(".residentialArea-error-text").text("居住地を選択してください。");
      selectResidentialAreaRef.current.focus();
      setResidentialAreaError(true);
      errorCount++;
    } else {
      $(".residentialArea-error-text").css("display","none");
      setResidentialAreaError(false);
    }

    if (!body.majorName) {

      // setResumeLabel("学部/学科を入力してください。");
      // setResumeAlert(true); 
      $(".majorNameSelect-error-text").css("display","block");
      $(".majorNameSelect-error-text").text("学部/学科を入力してください。");

      if (majorNameRef.current) {
        majorNameRef.current.focus();
        setMajorNameError(true);
      }
      errorCount++;
    } else {
      $(".majorNameSelect-error-text").css("display","none");
      setMajorNameError(false);
    }

    if (!body.userAge) {
      // setResumeLabel("生年を選択してください。");
      // setResumeAlert(true); 
      $(".userAge-error-text").css("display","block");
      $(".userAge-error-text").text("生年を選択してください。");
      selectAgeRef.current.focus();
      setAgeError(true);
      errorCount++;
    } else {
      $(".userAge-error-text").css("display","none");
      setAgeError(false);
    }

    if (!body.schoolName) {
      // setResumeLabel("最終学校名を入力してください。");
      // setResumeAlert(true); 
      $(".schoolNameSelect-error-text").css("display","block");
      $(".schoolNameSelect-error-text").text("最終学校名を入力してください。");
      if (schoolNameRef.current) {
        schoolNameRef.current.focus();
        setSchoolNameError(true);
      }
      errorCount++;
    } else {
      $(".schoolNameSelect-error-text").css("display","none");
      setSchoolNameError(false);
    }

    if (!body.userGender) {
      // setResumeLabel("性別を選択してください。");
      // setResumeAlert(true); 
      $(".userGender-error-text").css("display","block");
      $(".userGender-error-text").text("性別を選択してください。");
      selectGenderRef.current.focus();
      setGenderError(true);
      errorCount++;
    } else {
      $(".userGender-error-text").css("display","none");
      setGenderError(false);
    }
    
    if(!body.education){
      // setResumeLabel("学歴を選択してください。");
      // setResumeAlert(true); 
      $(".education-error-text").css("display","block");
      $(".education-error-text").text("学歴を選択してください。");
      selectEducationRef.current.focus();
      setEducationError(true);
      errorCount++;
    } else {
      $(".education-error-text").css("display","none");
      setEducationError(false);
    }
  
    if (!body.country) {
      // setResumeLabel("国籍を選択してください。");
      // setResumeAlert(true); 
      $(".country-error-text").css("display","block");
      $(".country-error-text").text("国籍を選択してください。");
      selectCountryRef.current.focus();
      setCountryError(true);
      errorCount++;
    } else {
      $(".country-error-text").css("display","none");
      setCountryError(false);
    }
 
    rsFileDocument.length > 0 ? rsFileDocument.map(item => formData.append('rsFileDocument', item)) : formData.append('rsFileDocument', new File([], 'photo.jpg'))
    rsFilePhoto.length > 0 ? rsFilePhoto.map(item => formData.append('rsFilePhoto', item)) : formData.append('rsFilePhoto', new File([], 'document.pdf'))

    if(errorCount !== 0){
      return false;
    }

    //서버로 보내기
    axios.post('/api/resume/reg',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data;',
          accessToken: getCookie('accessToken').toString(),
          lastLoginTime: getCookie('lastLoginTime').toString()
        },
      }).then((res) => {
      if (res.data.resultCode === '200') {
          setResumeComplete(true);
      } else {
          setReresumeFail(true);
      } 
    })
      .catch((res) => console.log(res))

  }


  // 데이터 리스트 불러오기
  useEffect(() => {
    axios.get('/api/resume/reg', {
      withCredentials: true,
      headers: {
        accessToken: getCookie('accessToken'),
        lastLoginTime: getCookie('lastLoginTime'),
      }
    }).then((res) => {
      // console.log(res.data.result)
      setListData(res.data.result)
      setSkillList({
        ...skillList,
        category: Array.from(new Set(res.data.result.skillList.map(item => item.skillCategory))),
        origin: res.data.result.skillList
      })
      setMultipleSkills({
        ...multipleSkills,
        category: Array.from(new Set(res.data.result.skillList.map(item => item.skillCategory))),
        origin: res.data.result.skillList
      })
      // console.log(Array.from(new Set(res.data.result.skillList.map(item => item.skillCategory))))
      // setMobileStatus({
      //   ...mobile,
      //   api: res.data.result,
      //   businessDepthMenu: DepthSplit(mobile, 'businessDepthMenu', res.data.result.businessTypeList, 'businessType'),
      //   jobDepthMenu: DepthSplit(mobile, 'jobDepthMenu', res.data.result.jobTypeList, 'jobType'),
      //   hopeCareerDepthMenu: DepthSplit(mobile, 'hopeCareerDepthMenu', res.data.result.hopeCareerList, 'hopeCareer'),
      // })
    })
  }, [])

  const [modalFlag, setModalFlag] = useState({
    main: false,
    goal: false,
    occupation: false,
    business: false,
  })

  const [skillPlusModal, setskillPlusModal] = useState();


  const [multipleSkills, setMultipleSkills] = useState({
    category: [],
    skillName: [],
    origin: [],
    selector: {
      arr: []
    },
  })

  const handleUpdateMultipleSkill = (e, item) => {
    const value = item ? item : e.target.value
    const key = e.target.id.replace(' dropdown-button-dark-example1', '')

    setMultipleSkills({
      ...multipleSkills,
      selector: {
        ...multipleSkills.selector,
        [key]: value
      }
    })
  }

  const handleAddMultipleSkill = (e) => {
    const selector = multipleSkills.selector
    let flag = false
    if (selector.skillCode && selector.careerCode) {
      selector.arr.map(item => {
        if (item.name === selector.skillCode.skill) {
          flag = true
        }
      })
      if (flag) {
        setResumeLabel("スキルが重複されました。");
        setResumeAlert(true); 
        return 0
      }
      const tempSelector = selector.arr

      tempSelector.push({
        name: selector.skillCode.skill,
        year: selector.careerCode
      })

      document.querySelectorAll('#skillCode').forEach(item => {
        item.checked = false
      })

      setMultipleSkills({
        ...multipleSkills,
        selector: {
          arr: [...tempSelector]
        }
      })
    }
  }


  const handleChangeSKillList = () => {
    const skillArr = skillItem.arr
    const multipleSelectArr = multipleSkills.selector.arr
    const tempBodyCareer = [...body?.careerCode]
    const tempBodySkill = [...body?.skillCode]

    multipleSelectArr.map((multi, mKey) => {
      const multiName = multipleSkills.origin.filter(skill => skill.skill === multi.name)[0]?.skillName
      const multiYear = data.skillCareerList.filter(career => career.skillCareer === multi.year)[0]?.skillCareerName
      let passKey = -1
      skillArr.map((skill, key) => {
        if (skill.name === multiName) {
          passKey = mKey
          skillArr[key] = {
            name: multiName,
            year: multiYear
          }
          tempBodySkill[key] = multi.name
          tempBodyCareer[key] = multi.year
        }
      })

      if (passKey !== mKey) {
        skillArr.push({
          name: multiName,
          year: multiYear
        })
      }

      // console.log(tempBodySkill.indexOf(multi.name))
      // if (tempBodySkill.indexOf(multi.name) === -1) {
      //   tempBodySkill.push(multi.name)
      // }
      // if (tempBodyCareer.indexOf(multi.year) === -1) {
      //   tempBodyCareer.push(multi.year)
      // }

      if (tempBodySkill.indexOf(multi.name) === -1) {
        tempBodySkill.push(multi.name)
        tempBodyCareer.push(multi.year)
      }



      setSkillList({
        ...skillList,
        arr: [...skillArr]
      })
      setBody({
        ...body,
        careerCode: [...tempBodyCareer],
        skillCode: [...tempBodySkill]
      })
    })
    
    // console.log(body)
  }

  const hopeCareer1 = () => {
    let hopeCareerList1 = [];

    for(let i = 0; i < data.hopeCareerList.length; i++){
      if(Number(data.hopeCareerList[i].hopeCareer) % 10 == 0){
        hopeCareerList1.push(data.hopeCareerList[i]);
      }
    }
    $('.hopeCareerOneDeps').empty();
    $('.hopeCareerOneDeps').append("<option disabled selected value={'DEFAULT'}> 選択してください。</option>");
    for(let i = 0; i < hopeCareerList1.length; i++){
      var option = $("<option value='"+ hopeCareerList1[i].hopeCareer +"'>"+ hopeCareerList1[i].hopeCareerName +"</option>");
      $('.hopeCareerOneDeps').append(option);
    }
  }

  const hopeCareer2 = (e) => {
    let hopeCareerList2 = [];
    let hopeCareerOneDepsVal = "";
    let hopeCareerListVal = "";

    for(let i = 0; i < data.hopeCareerList.length; i++){
      hopeCareerOneDepsVal = e.target.value.toString();
      hopeCareerListVal = (data.hopeCareerList[i].hopeCareer).toString();

      if(hopeCareerOneDepsVal.substring(0,4) == hopeCareerListVal.substring(0,4)){
        if(Number(data.hopeCareerList[i].hopeCareer) % 10 != 0){
          hopeCareerList2.push(data.hopeCareerList[i]);
        }
      }
    }

    $('.hopeCareer').empty();
    $('.hopeCareer').append("<option disabled selected value={'DEFAULT'}> 選択してください。</option>");

    for(let i = 0 ; i < hopeCareerList2.length; i++){
      var option = $("<option value='"+ hopeCareerList2[i].hopeCareer +"'>"+ hopeCareerList2[i].hopeCareerName +"</option>");
      $('.hopeCareer').append(option);
    }
  }

  const jobType1 = () => {
    let jobTypeList1 = [];

    for(let i = 0; i < data.jobTypeList.length; i++){
      if(Number(data.jobTypeList[i].jobType) % 10 == 0){
        jobTypeList1.push(data.jobTypeList[i]);
      }
    }
    
    $('.jobTypeOneDeps').empty();
    $('.jobTypeOneDeps').append("<option disabled selected value={'DEFAULT'}> 選択してください。</option>");
    for(let i = 0; i < jobTypeList1.length; i++){
      var option = $("<option value='"+ jobTypeList1[i].jobType +"'>"+ jobTypeList1[i].jobTypeName +"</option>");
      $('.jobTypeOneDeps').append(option);
    }
  }

  const jobType2 = (e) => {
    let jobTypeList2 = [];
    let jobTypeOneDepsVal = "";
    let jobTypeListVal = "";
    let getJobType = document.getElementById('jobType dropdown-button-dark-example1');
    //console.log("가져온 데이터 스트링 확인: "+e.target.value.toString())

    if(e.target.value.toString() === "57000"){
      getJobType.disabled = true;
      ModalEvent('jobType').secondDepth(e, depthMenu, setDepthMenu, body, setBody)
    }
    else getJobType.disabled = false;

    for(let i = 0; i < data.jobTypeList.length; i++){
      jobTypeOneDepsVal = e.target.value.toString(); //선택한 값 
      jobTypeListVal = (data.jobTypeList[i].jobType).toString(); // 리스트에서 가져온 애들

      if(jobTypeOneDepsVal.substring(0,4) == jobTypeListVal.substring(0,4)){
        if(Number(data.jobTypeList[i].jobType) % 10 != 0){
          jobTypeList2.push(data.jobTypeList[i]);
        }
      }
    }

    $('.jobType').empty();
    $('.jobType').append("<option disabled selected value={'DEFAULT'}> 選択してください。</option>");

    for(let i = 0 ; i < jobTypeList2.length; i++){
      var option = $("<option value='"+ jobTypeList2[i].jobType +"'>"+ jobTypeList2[i].jobTypeName +"</option>");
      $('.jobType').append(option);
    }
  }

  const businessType1 = () => {
    let businessTypeList1 = [];

    for(let i = 0; i < data.businessTypeList.length; i++){
      if(Number(data.businessTypeList[i].businessType) % 10 == 0){
        businessTypeList1.push(data.businessTypeList[i]);
      }
    }
    
    $('.businessTypeOneDeps').empty();
    $('.businessTypeOneDeps').append("<option disabled selected value={'DEFAULT'}> 選択してください。</option>");
    for(let i = 0; i < businessTypeList1.length; i++){
      var option = $("<option value='"+ businessTypeList1[i].businessType +"'>"+ businessTypeList1[i].businessTypeName +"</option>");
      $('.businessTypeOneDeps').append(option);
    }
  }

  const businessType2 = (e) => {
    let businessTypeList2 = [];
    let businessTypeOneDepsVal = "";
    let businessTypeListVal = "";
    let getBusinessType = document.getElementById('businessType dropdown-button-dark-example1');
    //console.log(e.target.value.toString());

    if(e.target.value.toString() === "56000"){
      getBusinessType.disabled = true;
      ModalEvent('businessType').secondDepth(e, depthMenu, setDepthMenu, body, setBody)
    }
    else getBusinessType.disabled = false;

    for(let i = 0; i < data.businessTypeList.length; i++){
      businessTypeOneDepsVal = e.target.value.toString();
      businessTypeListVal = (data.businessTypeList[i].businessType).toString();

      if(businessTypeOneDepsVal.substring(0,4) == businessTypeListVal.substring(0,4)){
        if(Number(data.businessTypeList[i].businessType) % 10 != 0){
          businessTypeList2.push(data.businessTypeList[i]);
        }
      }
    }

    $('.businessType').empty();
    $('.businessType').append("<option disabled selected value={'DEFAULT'}> 選択してください。</option>");

    for(let i = 0 ; i < businessTypeList2.length; i++){
      var option = $("<option value='"+ businessTypeList2[i].businessType +"'>"+ businessTypeList2[i].businessTypeName +"</option>");
      $('.businessType').append(option);
    }
  }

  const [ grab, setGrab ] = useState(null)

  const _onDragOver = e => {
    e.preventDefault();
  }

  const _onDragStart = e => {
    setGrab(e.target);
    e.target.classList.add("grabbing");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target);
  }

  const _onDragEnd = e => {
    e.target.classList.remove("grabbing");
    e.dataTransfer.dropEffect = "move";
  }

  const _onDrop = e => {
    let grabPosition = Number(grab.dataset.position);
    let targetPosition = Number(e.target.dataset.position);

    let newImages = [ ...image ];
    let tempForm = [...rsFilePhoto];
    newImages[grabPosition] = newImages.splice(targetPosition, 1, newImages[grabPosition])[0];
    tempForm[grabPosition] = tempForm.splice(targetPosition, 1, tempForm[grabPosition])[0];

    document.querySelector(".profileImg_0 > .dragText").innerText = '代表のイメージ'; 

    setImage(newImages);
    setRsFilePhoto([...tempForm]);
  }

  return <>
    <div className='resume-mng '>
      <div className='box-type-default hidden lg:block'>
        <div className='p-5 border-b border-slate-200/60 text-sm'>
          履歴書登録
        </div>
        <div className='resume-regist-cont'>
          <ul className='flex gap-3 items-center'>
            {
              image.length === 0 ? previewItem : image.map((item, index) => (
                <li className={`image_item resume_image_item bg-slate-50 text-center profileImg_${index}`}
                  key={index}
                  data-position={index}
                  onDragOver={_onDragOver}
                  onDragStart={_onDragStart}
                  onDragEnd={_onDragEnd}
                  onDrop={_onDrop}
                  draggable
                >
                  <input
                    id={`profileImg${index}`}
                    type={'file'}
                    multiple
                    onChange={(e) => handleChangeImage(e, index)}
                  />
                  <label className={`custom-input-label resume_image`} htmlFor={`profileImg${index}`}>
                    <img src={item} alt='' className='resume_image' />
                  </label>
                  {image[index] && (
                    <button onClick={() => handleDeleteImage(index)}>
                      <img src={Xbutton} alt='삭제' className='resume_image' />
                    </button>
                  )}
                  <span className='dragText'>{index == 0 ? '代表のイメージ' : '◀ ドラッグ'}</span>
                </li>
              ))
            }
          </ul>

          <div className='camera-subtit3'>
            * 最大5枚 JPG、PNG、GIF形式で登録可能です。
          </div>
          <div className='camera-subtit4'>
            * 最初のイメージが代表のイメージとなります。
          </div>

          <div className='form-flex-box flex space-between items-start'>
            <div className='box-item flex flex-col'>
              <div className='form-tit'  tabIndex={0} ref={selectCountryRef} >国籍 <span>*</span></div>
              <SelectBox id={'country'} data={data && data.countryList} className={countryError ? 'error' : ''} 
              onChange={(e) => {
                handleSelectChangeEvent(e);
                if (countryError) {
                  setCountryError(false);
                }
              }}
              defaultValue={body.country} 
              ref={countryRef}/>
              <div className='country-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
            <div className='box-item flex flex-col'>
              <div className='form-tit' tabIndex={0} ref={selectEducationRef}>学歴 <span>*</span></div>
              <SelectBox id={'education'} data={data && data.educationList} className={educationError ? 'error' : ''} 
              onChange={(e) => {
                handleSelectChangeEvent(e);
                if (educationError) {
                  setEducationError(false);
                }
              }}
              defaultValue={body.education} 
              ref={educationRef}/>
              <div className='education-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
          </div>
          <div className='form-flex-box flex space-between items-start'>
            <div className='box-item flex flex-col'>
              <div className='form-tit' tabIndex={0} ref={selectGenderRef}>性別 <span>*</span></div>
              <SelectBox id={'userGender'} data={data && data.userGenderList} className={genderError ? 'error' : ''} 
              onChange={(e) => {
                handleSelectChangeEvent(e);
                if (genderError) {
                  setGenderError(false);
                }
              }}
              defaultValue={body.userGender} 
              ref={userGenderRef}/>
              <div className='userGender-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
            <div className='box-item flex flex-col'>
              <div className='form-tit'>最終学校名 <span>*</span></div>
              <input id='schoolName regular-form-1' type='text' className={schoolNameError ? 'form-control error' : 'form-control'} placeholder='最終学校名入力' ref={schoolNameRef}
                maxLength={200}
                onChange={(e) => {
                  handleInputTextChangeEvent(e);
                  if (schoolNameError) {
                    setSchoolNameError(false);
                  }
                }} 
                />
              <div className='schoolNameSelect-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
          </div>
          <div className='form-flex-box flex space-between items-start'>
            <div className='box-item flex flex-col'>
              <div className='form-tit' tabIndex={0} ref={selectAgeRef}>生年 <span>*</span></div>
              <div className='flex items-center gap-2'>
                <SelectBox id={'userAge'} data={data && data.userAgeList} className={ageError ? 'error' : ''} 
                onChange={(e) => {
                  handleSelectChangeEvent(e);
                  if (ageError) {
                    setAgeError(false);
                  }
                }}
                defaultValue={body.userAge} 
                ref={userAgeRef}/>
                <div
                  className='btn btn-sm btn-ouline-secondary w-40 btn-age'>{body && body.userAge ? handleAgeCalculator() : '0歳'}</div>
              </div>
              <div className='userAge-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
            <div className='box-item flex flex-col'>
              <div className='form-tit'>学部/学科 <span>*</span></div>
              <input id='majorName regular-form-1' type='text' className={majorNameError ? 'form-control error' : 'form-control'} placeholder='学部/学科入力' ref={majorNameRef}
              maxLength={200}
              onChange={(e) => {
                handleInputTextChangeEvent(e);
                if (majorNameError) {
                  setMajorNameError(false);
                }
              }}  
              />
              <div className='majorNameSelect-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
          </div>
          <div className='form-flex-box flex space-between items-start'>
            <div className='box-item flex flex-col'>
              <div className='form-tit' tabIndex={0} ref={selectResidentialAreaRef}>居住地 <span>*</span></div>
              <SelectBox id={'residentialArea'} data={data && data.residentialAreaList}
                className={residentialAreaError ? 'error' : ''}
                onChange={(e) => {
                  handleSelectChangeEvent(e);
                  if (residentialAreaError) {
                    setResidentialAreaError(false);
                  }
                }}
                defaultValue={body.residentialArea}
                ref={residentialAreaRef}
              />
              <div className='residentialArea-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
            <div className='box-item flex flex-col'>
              <div className='form-tit' tabIndex={0} ref={selectHopeIncomeRef}>希望年収 <span>*</span></div>
              <SelectBox id={'hopeIncome'} data={data && data.hopeIncomeList} className={hopeIncomeError ? 'error' : ''} 
              onChange={(e) => {
                handleSelectChangeEvent(e);
                if (hopeIncomeError) {
                  setHopeIncomeError(false);
                }
              }}
              defaultValue={body.hopeIncome} 
              ref={hopeIncomeRef}/>
              <div className='hopeIncome-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
          </div>
          <div className='form-flex-box flex space-between items-start'>
            <div className='box-item flex flex-col'>
              <div className='form-tit'>メールアドレス <span>*</span></div>
              <div className='flex items-center gap-2'>
                <input id='userEmail regular-form-1' type='text' autocomplete="email" className={emailError ? 'form-control error' : 'form-control'} placeholder='イーメール入力'
                  maxLength={100}
                  onChange={(e) => {
                    handleInputTextChangeEvent(e);
                    if (emailError) {
                      setEmailError(false);
                    }
                  }}  
                  onBlur={handleCheckText}
                  ref={userEmailRef}
                />
                <div className='form-check form-switch flex gap-2'>
                  <div className='switch-tit shrink-0 w50'>{body.userEmailFlag === '0' ? '非公開' : '公開'}</div>
                  <input
                    id='userEmailFlag product-status-active'
                    className='form-check-input toggle-input'
                    ref={userEmailClosedRef}
                    type='checkbox'
                    onChange={handleSelectChangeEvent}
                    checked={body.userEmailFlag === '1'}
                  />
                </div>
              </div>
              <div className='email-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
              <div className='none-email-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
            <div className='box-item flex flex-col'>
              <div className='form-tit'>連絡先 <span>*</span></div>
              <div className='flex items-center gap-2'>
                <input id='phoneNumber regular-form-1' type='text' className={phoneError ? 'form-control error' : 'form-control'}
                  placeholder='-なしで数字だけ入力してください。' 
                  maxLength={13}
                  onChange={(e) => {
                    handlePhone(e);
                    handleInputTextChangeEvent(e);
                    if (phoneError) {
                      setPhoneError(false);
                    }
                  }}  
                  onBlur={handleCheckText}
                  ref={phoneNumberRef}
                />
                <div className='form-check form-switch flex gap-2'>
                  <div className='switch-tit shrink-0 w50'>{body.phoneNumberFlag === '0' ? '非公開' : '公開'}</div>
                  <input
                    id='phoneNumberFlag product-status-active'
                    className='form-check-input toggle-input'
                    ref ={phoneNumberClosedRef}
                    type='checkbox'
                    onChange={handleSelectChangeEvent}
                    checked={body.phoneNumberFlag === '1'}
                  />
                </div>
              </div>
              <div className='phone-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
              <div className='none-phone-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
          </div>
          <div className='emailPhoneFlag-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
          </div>
          <div className='divider' />

          <div className="form-flex-box flex space-between items-start">
            <div className="box-item2 flex flex-col">
              <div className="form-tit" tabIndex={0} ref={selectHopeCareerRef}>将来の目標<span>*</span></div>
              <button className= {hopeCareerError ? 'btn btn-primary flex-start selectButton error' : 'btn btn-primary flex-start selectButton'}
                onClick={() => {
                  $('.hopeCareer').empty();
                  $('.hopeCareer').append("<option disabled selected value={'DEFAULT'}> 選択してください。</option>");
                  hopeCareer1(),
                  setHopeCareerModal(true),
                  setModalFlag({ ...modalFlag, main: true, goal: true})
                  if (hopeCareerError) {
                    setHopeCareerError(false);
                  }
                }}
              >{depthMenu.hopeCareer.depth_first} {'\u00a0\u00a0\u00a0➡\u00a0\u00a0\u00a0\u00a0' + depthMenu.hopeCareer.depth_seconds}</button>
              <div className='hopeCareer-error-text' style={{display:"none",color:"red",fontSize:"12px"}}></div>
            </div>
          </div>

          <div className='form-flex-box flex space-between items-start'>
            <div className='box-item flex flex-col'>
              <div className='form-tit' tabIndex={0} ref={selectCareerRef}>経歴 <span>*</span></div>
              <SelectBox id={'career'} data={data && data.careerList} className={careerError ? 'form-control error' : 'form-control'} 
              onChange={(e) => {
                handleSelectChangeEvent(e);
                if (careerError) {
                  setCareerError(false);
                }
              }}
              defaultValue={body.career} 
              ref={careerRef} />
              <div className='career-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
            <div className="box-item flex flex-col">
              <div className="form-tit" tabIndex={0} ref={selectJobTypeRef}>現在の職種 <span>*</span></div>
              <button className={jobTypeError ? 'btn btn-primary selectButton error' : 'btn btn-primary selectButton'}
                onClick={() => {
                  $('.jobType').empty();
                  $('.jobType').append("<option disabled selected value={'DEFAULT'}> 選択してください。</option>");
                  jobType1(),
                  setJobTypeModal(true),
                  setModalFlag({ ...modalFlag, main: true, occupation: true })
                  if (jobTypeError) {
                    setJobTypeError(false);
                  }
                }}
              >
                {depthMenu.jobType.depth_first} {
                depthMenu.jobType.depth_first === 'なし'? '' : '\u00a0\u00a0\u00a0➡\u00a0\u00a0\u00a0\u00a0' + depthMenu.jobType.depth_seconds}
              </button>
              <div className='jobType-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
            <div className="box-item flex flex-col">
              <div className="form-tit" tabIndex={0} ref={selectbusinessTypeRef}>所属会社の業種 <span>*</span></div>
              <button className={businessTypeError ? 'btn btn-primary selectButton error' : 'btn btn-primary selectButton' }
                onClick={() => {
                  $('.businessType').empty();
                  $('.businessType').append("<option disabled selected value={'DEFAULT'}> 選択してください。</option>");
                  businessType1(),
                  setBusinessTypeModal(true),
                  setModalFlag({ ...modalFlag, main: true, business: true })
                  if (businessTypeError) {
                    setBusinessTypeError(false);
                  }
                }}
              >
                {depthMenu.businessType.depth_first} {
                depthMenu.businessType.depth_first === 'なし'? '' : '\u00a0\u00a0\u00a0➡\u00a0\u00a0\u00a0\u00a0'+ depthMenu.businessType.depth_seconds}
              </button>
              <div className='businessType-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
              
              </div>
            </div>
          </div>

          <div className='divider'/>

          <div tabIndex={0} ref={projectRef}>
          {/* 主要経歴 */
            career.map((career, key) => {
              return <CareerWrite
                key={key}
                index={key}
                addState={key === 0}
                data={data}
                body={body}
                handleAddBtn={handleAddBtn}
                projectRoleList={data?.projectRoleList}
                projectProcessDefault={data?.projectProcessDefault}
                projectProcessList={data?.projectProcessList}
                handleCareerChange={handleCareerChange}
                handleProjectProcessChange={handleProjectProcessAdd}
                handleProjectProcessDelAll={handleProjectProcessDelAll}
                handleProjectProcessDel={handleProjectProcessDel}
                handleCareerChangeAndProcess={handleCareerChangeAndProcess}
                name={body.projectName[key]}
                processRole={body.projectRole[key]}
                period={body.projectPeriod[key]}
                process_re={body.projectProcess[key] ? body.projectProcess[key] : []}
                handlePeriodChange={handlePeriodChange}
              />
            })
          }
          </div>
          <div className='divider' />

          {/* 나의 스킬 */}
          <div className='flex-box2-tit flex space-between mt-16'> 
            <div className='box2-tit'>私のスキル <span> *</span></div> 
            <div className='flex justify-content-end mr-5'>
              <div className='justify-content-end mr-2'>
               <p className='blue-tit mt-0 mr-5'>拡張検索をクリックして、</p>
               <p className='blue-tit mt-0'>複数のスキルを一度に登録できます。</p>
              </div>
              <button className="btn btn-primary items-center shrink-0 w-30 pl-5 pr-5 btn-age" onClick={() => {
                  setskillPlusModal(true);
                }}>拡張検索</button>
            </div>
          </div>
          <div className="flex-box2-cont form-flex-box">
            <div className="form-flex-box flex space-between items-start">
              <div className="box-item flex flex-col">
                <div className="form-tit">スキル検索</div>
                <div className='relative text-slate-500'>
                  <input
                    type='text'
                    className= {skillCodeError ? 'form-control pr-10 error' : 'form-control pr-10'}
                    autocomplete="off"
                    placeholder='検索'
                    ref={skillCodeRef}
                    onChange={(e) => {
                      if (e.target.value !== '') {
                        setSkillList({
                          ...skillList,
                          skillName: [...skillList.origin.filter(item => item.skillName.toUpperCase().includes(e.target.value.toUpperCase()))]
                        })
                      } else {
                        setSkillList({
                          ...skillList,
                          skillName: []
                        })
                      }
                      if (skillCodeError) {
                        setSkillCodeError(false);
                      }
                    }}
                  />
                  <button className='w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0'>
                    <img src={Search} alt='' />
                  </button>
                </div>
              </div>
              <div className='box-item flex flex-col'>
                <div className='form-tit'>経験期間</div>
                <div className='flex items-center gap-2'>
                  <SelectBox className={skillCarrerError ? 'refTarget_select error' : 'refTarget_select' } id={'careerCode'} data={data && data.skillCareerList}
                    onChange={(e) => {
                      handleUpdateSkill(e);
                      if (skillCarrerError) {
                        setSkillCarrerError(false);
                      }
                    }}
                    defaultValue={skillItem.temp?.careerCode?.careerCode} />
                </div>
              </div>
            </div>
            <div className='skillItem-error-text' style={{display:"none",color:"red",fontSize:"12px"}}>
                  
            </div>
            <div>
            検索ボックスに、言語名、フレームワーク名、DB名などの頭文字を入力し、
            </div>
            <div>
            表示されたリストから選択してください。
            </div>
            <div className="flex items-center flex-row-reverse mt-4 mb-4">
                <button
                  className="btn btn-outline-primary w-auto"
                  onClick={handleAddSkills}
                >
                  <img className='mr-2' src="/src/assets/images/add-btn.svg" alt=""/>
                  スキル追加
                </button>
            </div>
            <div className='skil_list'>
              <div className="list-group list-over">
                {
                  skillList && skillList.skillName.map((skill, key) => {
                    return <div key={key} className='list-group-item'>
                      <label className='checkbox-btn w-18 flex item-center'>
                        <input id={'skillCode'} name='group' className='form-check-input chg2 refTarget_radio'
                          type='radio' onChange={(e) => handleUpdateSkill(e, skill)} />
                        <span>{skill.skillCategoryName} | {skill.skillName}</span>
                      </label>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
          <div className='blue-tit'>
            既に登録されているスキルリスト
          </div>
          <div className='blue-btn-wrap flex gap-2 items-center'>
            { 
              skillItem.arr.map((item, key) => {
                return (
                  <div className='blue-btn new-skillist' key={key}>
                    <span className="skilllist-langu blue-line pr-2 inline-block">
                      {skillList.origin.filter(skill => skill.skillName === item.name)[0]?.skillCategoryName}
                    </span>
                    <span className="pr-2 inline-block">{item.name}</span>
                    <span>{item.year}</span>
                    <button className='blue-x-btn'
                      onClick={(e) => {
                        const tempArr = [...skillItem.arr.filter(it => it.name !== item.name)]
                        const tempSkillCode = []
                        const tempYearCode = []
                        setSkillItem({
                          ...skillItem.temp,
                          arr: [...tempArr]
                        })
                        console.log(tempArr);
                        tempArr.map((skill) => {
                          const code = skillList.origin.filter( origin => origin.skillName === skill.name)[0]?.skill
                          const year = data.skillCareerList.filter(career => career.skillCareerName === skill.year)[0]?.skillCareer
                          tempSkillCode.push(code)
                          tempYearCode.push(year)
                        })
                        //console.log("스킬코드의 "+tempSkillCode.length);
                        //console.log("근무연수의 "+tempYearCode.length);
                        setBody({
                          ...body,
                          //skillCodeSelect: [...tempSkillCode],
                          //careerCodeSelect: [...tempYearCode]
                          skillCode: [...tempSkillCode],
                          careerCode: [...tempYearCode]
                        })
                      }}>
                      <img src={blueX} alt='' />
                    </button>
                  </div>
                )
              })
            }
          </div>

          <div className='divider' />

          {/* 簡単な自己紹介 */}
          <div className='flex-box2-tit flex space-between mt-16'>
            <div className='box2-tit'>自己紹介</div>
            <div className='text-slate-400'>{body.additionalComment === "" ? "0" : body.additionalComment.length} / 200字</div>
          </div>
          <div className='flex-box2-cont textarea_style'>
            <textarea name='' id='additionalComment' cols='' rows='10' className='w-full resize-none'
              maxLength={200} placeholder='自由に自己紹介をしてください。' onChange={handleInputTextChangeEvent} />
          </div>

          <div className='attach-wrap flex'>
            <div className='attach-tit-wrap flex items-center'>
              <div className='filebox attach-tit flex items-center'>
                <label htmlFor='file' className='flex items-center cursor-pointer'>
                  ファイル添付
                  <input type='file' id='file' onChange={handleFileUpload} multiple />
                  <img src={attachIcon} alt='' className='ml-2' />
                </label>
              </div>
            </div>
          </div>
          <div className='attach-wrap flex'>
            <div className='blue-btn-wrap flex flex-col attach-cont-wrap'>
              {fileNames.map((name, index) => (
                <div className='blue-btn attach-cont-item flex items-center space-between' style={{backgroundColor: '#EDF5FF'}}  key={index}>
                  <input className='upload-name mr-2 attach-cont-tit'style={{backgroundColor: '#EDF5FF'}}  value={name} placeholder='' readOnly />
                  <button className='attach-cont-btn' onClick={() => handleDeleteFile(index)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className='download-btn flex'>
            <button className='btn btn-outline-primary flex items-center h48' onClick={() => window.open('https://hitobito-net.com/api/files/sample.pdf')}>
              サンプル·ダウンロード
              <img src={Download} alt='' />
            </button>
            <button className='btn btn-primary flex items-center h48' onClick={handleSubmit}>
              この内容で履歴書を登録する
            </button>
          </div>
          <div className='blue-tit'>
            作成が難しいですか？ サンプルをダウンロードしてみてください。
          </div>
        </div>
      </div>

      {
        <Modal
          backdrop="static"
          show={hopeCareerModal}
          onHidden={() => {
            setHopeCareerModal(false)
          }}
        >
          <ModalHeader>
            <h2 className="font-medium text-base mr-auto">
              将来の目標
            </h2>
          </ModalHeader>
          <ModalBody className="p-10 text-center">
            <div className='flex items-center gap-3'>
              <select id={'hopeCareerOneDeps dropdown-button-dark-example1'}
                      className={`hopeCareerOneDeps form-select flex items-center space-between`}
                      onChange={(e) => {
                        depthMenu.hopeCareer.depth_seconds = "";
                        hopeCareer2(e),
                        ModalEvent('hopeCareer').oneDepth(e, depthMenu, setDepthMenu)
                      }}
                      >
                <option disabled selected value={'DEFAULT'}> 選択してください。</option>
              </select>
              <select id={'hopeCareer dropdown-button-dark-example1'}
                      className={`hopeCareer form-select flex items-center space-between`}
                      onChange={(e) => {
                          ModalEvent('hopeCareer').secondDepth(e, depthMenu, setDepthMenu, body, setBody)
                        }}
                      >
                <option disabled selected value={'DEFAULT'}> 選択してください。</option>
              </select>
            </div>

          </ModalBody>
          <ModalFooter>
            <div className="sel-btn-wrap flex-row-reverse gap-2">
              <button className='btn btn-outline-secondary'
                onClick={() => {setHopeCareerModal(false)}}
              >
                閉じる
              </button>
              <button className="btn btn-primary" onClick={() => {
                let getHopeCareer2 = document.getElementById('hopeCareer dropdown-button-dark-example1').value
                console.log(getHopeCareer2);
                if(getHopeCareer2 === "{'DEFAULT'}"){
                  setHopeOptionSelectFail(true);
                  return false;
                }
                setHopeCareerModal(false)
              }}
              disabled={!body.hopeCareer}
              >
                確定
              </button>
            </div>
          </ModalFooter>
        </Modal>
      }
      {
        <Modal
          backdrop="static"
          show={jopTypeModal}
          onHidden={() => {
            setJobTypeModal(false)
          }}
        >
          <ModalHeader>
            <h2 className="font-medium text-base mr-auto">
              現在の職種
            </h2>
          </ModalHeader>
          <ModalBody className="p-10 text-center">
            <div className='flex items-center gap-3'>
              <select id={'jobTypeOneDeps dropdown-button-dark-example1'}
                      className={`jobTypeOneDeps form-select flex items-center space-between`}
                      onChange={(e) => {
                        depthMenu.jobType.depth_seconds = "";
                        jobType2(e),
                        ModalEvent('jobType').oneDepth(e, depthMenu, setDepthMenu)
                      }}
                      >
                <option disabled selected value={'DEFAULT'}> 選択してください。</option>
              </select>
              <select id={'jobType dropdown-button-dark-example1'}
                      disabled={false}
                      className={`jobType form-select flex items-center space-between`}
                      onChange={(e) => {
                          ModalEvent('jobType').secondDepth(e, depthMenu, setDepthMenu, body, setBody)
                        }}
                      >
                <option disabled selected value={'DEFAULT'}> 選択してください。</option>
              </select>
            </div>

          </ModalBody>
          <ModalFooter>
            <div className="sel-btn-wrap flex-row-reverse gap-2">
              <button className='btn btn-outline-secondary'
                onClick={() => {setJobTypeModal(false)}}
              >
                閉じる
              </button>
              <button className="btn btn-primary"
                onClick={() => {
                  let getJobType1 = document.getElementById('jobTypeOneDeps dropdown-button-dark-example1').value
                  let getJobType2 = document.getElementById('jobType dropdown-button-dark-example1').value
                  console.log(getJobType1);
                  console.log(getJobType2);
                  if(getJobType1 !== '57000' && getJobType2 === "{'DEFAULT'}"){
                    setJobOptionSelectFail(true);
                    return false;
                  }
                  else if(getJobType1 === '57000' && getJobType2 === "{'DEFAULT'}"){
                    getJobType2 = '57000';
                    setJobTypeModal(false);
                    return true;
                  }
                  setJobTypeModal(false)
                }}
                disabled={!body.jobType}>
                確定
              </button>
            </div>
          </ModalFooter>
        </Modal>
      }
      {
        <Modal
          backdrop="static"
          show={businessTypeModal}
          onHidden={() => {
            setBusinessTypeModal(false)
          }}
        >
          <ModalHeader>
            <h2 className="font-medium text-base mr-auto">
              所属会社の業種
            </h2>
          </ModalHeader>
          <ModalBody className="p-10 text-center">
            <div className='flex items-center gap-3'>
              <select id={'businessTypeOneDeps dropdown-button-dark-example1'}
                      className={`businessTypeOneDeps form-select flex items-center space-between`}
                      onChange={(e) => {
                        depthMenu.businessType.depth_seconds = "";
                        businessType2(e),
                        ModalEvent('businessType').oneDepth(e, depthMenu, setDepthMenu)
                      }}
                      >
                <option disabled selected value={'DEFAULT'}> 選択してください。</option>
              </select>
              <select id={'businessType dropdown-button-dark-example1'}
                      disabled={false}
                      className={`businessType form-select flex items-center space-between`}
                      onChange={(e) => {
                          ModalEvent('businessType').secondDepth(e, depthMenu, setDepthMenu, body, setBody)
                        }}
                      >
                <option disabled selected value={'DEFAULT'}> 選択してください。</option>
              </select>
            </div>

          </ModalBody>
          <ModalFooter>
            <div className="sel-btn-wrap flex-row-reverse gap-2">
              <button className='btn btn-outline-secondary'
                onClick={() => {setBusinessTypeModal(false)}}
              >
                閉じる
              </button>
              <button className="btn btn-primary" onClick={() => {
                let businessType1 = document.getElementById('businessTypeOneDeps dropdown-button-dark-example1').value
                let businessType2 = document.getElementById('businessType dropdown-button-dark-example1').value
                console.log(businessType1);
                console.log(businessType2);
                if(businessType1 !== '56000' && businessType2 === "{'DEFAULT'}"){
                  setBusinessOptionSelectFail(true);
                  return false;
                }else if(businessType1 === '56000' && businessType2 === "{'DEFAULT'}"){
                  businessType2 = '56000';
                  setBusinessTypeModal(false);
                  return true;
                }
                setBusinessTypeModal(false)
              }}
              disabled={!body.businessType}>
                確定
              </button>
            </div>
          </ModalFooter>
        </Modal>
      }
      <div className="mo-resume-mng">
        <ResumeMobile data={data} progress="progress-bar  w-1/5 bg-green" />
      </div>
    </div>
    <MobileBottom />

    {/* 簡単な自己紹介 200자이상 실패 */}
    <Modal
      show={infoLimitFail}
      onHidden={() => {
        setInfoLimitFail(false);
      }}
    >
      <ModalBody className="p-10 text-center">
        <div className="modal-tit mb-5">
        自己紹介は200字まで入力可能です。
        </div>
        {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
        <div className="flex flex-end gap-3">
          <a
            className="btn btn-primary"
            onClick={() => {
              setInfoLimitFail(false);
            }}
          >
            確認
          </a>
        </div>
      </ModalBody>
    </Modal>


    {/* 스킬검색 모달*/}
    <Modal className="skill-search-modal"
      backdrop="static"
      show={skillPlusModal}
      onHidden={() => {
        setskillPlusModal(false);
      }}
    >
      <ModalHeader>
        <div className="flex space-between items-center w-full">
          <h2 className="modal-tit">
            スキル検索
          </h2>
          <button className="" onClick={() => {
            setskillPlusModal(false);
          }}>
            <Lucide icon="X" className="w-4 h-4" />
          </button>
        </div>
      </ModalHeader>
      <ModalBody className="p-10 text-center">
        <div className="flex gap-4 modal-blue-bg items-start">
          <div className="mb-5 flex flex-col gap-2 items-start">
            <div className='form-tit'>カテゴリ</div>
            <select
              className="form-select w-full"
              id={'skillCategory'}
              ref={categoryRef}
              onChange={(e) => {
                setMultipleSkills({
                  ...multipleSkills,
                  skillName: [
                    ...skillList.origin
                      .filter(item => item.skillName.toUpperCase().includes(skillNameRef.current.value.toUpperCase()))
                      .filter(item => item.skillCategory === e.target.value)
                  ]
                })
              }}
            >
              {
                multipleSkills.category.map(item => {
                  return <option value={item}>{multipleSkills.origin.filter(skill => skill.skillCategory === item)[0].skillCategoryName}</option>
                })
              }
            </select>
          </div>
          <div className="">
            <div className="flex gap-2">
              <div className="flex flex-col gap-2 items-start w-full">
                <div className='form-tit'>スキル検索</div>
                <div className='relative text-slate-500 w-full'>
                  <input
                    type='text'
                    autocomplete="off"
                    className='form-control'
                    placeholder='検索'
                    ref={skillNameRef}
                    onChange={(e) => {
                      if (e.target.value !== '') {
                        setMultipleSkills({
                          ...multipleSkills,
                          skillName: [
                            ...multipleSkills.origin
                              .filter(item => item.skillName.toUpperCase().includes(e.target.value.toUpperCase()))
                              .filter(item => item.skillCategory === categoryRef.current.value)
                          ]
                        })
                      } else {
                        setMultipleSkills({
                          ...multipleSkills,
                          skillName: []
                        })
                      }
                    }}
                  />
                  <button className='w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0'>
                    <img src={Search} alt='' />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-start"  style={{width: 300 +'px'}}>
                <div className='form-tit'>経歴期間</div>
                <SelectBox className={'refTarget_select'} id={'careerCode'} data={data && data.skillCareerList}
                  onChange={handleUpdateMultipleSkill} defaultValue={multipleSkills.selector?.careerCode} />
              </div>
            </div>
            <div className='skil_list mt-4'>
              <div className="list-group list-over">
                {
                  multipleSkills && multipleSkills.skillName.map((skill, key) => {
                    return <div key={key} className='list-group-item'>
                      <label className='checkbox-btn w-18 flex item-center'>
                        <input id={'skillCode'} name='group' className='form-check-input chg2 refTarget_radio'
                          type='radio' onChange={(e) => handleUpdateMultipleSkill(e, skill)} />
                        <span>{skill.skillCategoryName} | {skill.skillName}</span>
                      </label>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
          {/* <div class="blue-btn-wrap flex gap-2 items-center">
            {
              multipleSkills.selector.arr.map((item, key) => {
                return (
                  <div key={key} className='blue-btn'>
                    <span className="skilllist-langu blue-line pr-2 inline-block">
                      {multipleSkills.origin.filter(skill => skill.skill === item.name)[0]?.skillCategoryName}
                    </span>
                    <span className="pr-2 inline-block">{
                      multipleSkills.origin.filter(skill => skill.skill === item.name)[0]?.skillName
                    }</span>
                    <span>{data.skillCareerList.filter(career => career.skillCareer === item.year)[0]?.skillCareerName}</span>
                    <button className='blue-x-btn'
                      onClick={(e) => {
                        const tempArr = [...multipleSkills.selector.arr.filter(it => it.name !== item.name)]
                        setMultipleSkills({
                          ...multipleSkills,
                          selector: {
                            ...multipleSkills.selector,
                            arr: [...tempArr]
                          }
                        })
                      }}>
                      <img src={blueX} alt='' />
                    </button>
                  </div>
                )
              })
            }
          </div> */}
        </div>
        <div className="w-full text-left mt-4 text-slate-500">* カテゴリー選択後、スキルを検索し経歴を入力してください。</div>
          <div class="blue-btn-wrap flex gap-2 items-center">
            {
              multipleSkills.selector.arr.map((item, key) => {
                //console.log("아이템: "+item.value+", 키: "+key);
                return (
                  <div key={key} className='blue-btn' id="sInputvalue">
                    <span className="skilllist-langu blue-line pr-2 inline-block" id="sInputvalue2">
                      {multipleSkills.origin.filter(skill => skill.skill === item.name)[0]?.skillCategoryName}
                    </span>
                    <span className="pr-2 inline-block">{
                      multipleSkills.origin.filter(skill => skill.skill === item.name)[0]?.skillName
                    }</span>
                    <span>{data.skillCareerList.filter(career => career.skillCareer === item.year)[0]?.skillCareerName}</span>
                    <button className='blue-x-btn'
                      onClick={(e) => {
                        const tempArr = [...multipleSkills.selector.arr.filter(it => it.name !== item.name)]
                        setMultipleSkills({
                          ...multipleSkills,
                          selector: {
                            ...multipleSkills.selector,
                            arr: [...tempArr]
                          }
                        })
                        //console.log("삭제 창에서 값: "+$("#sInputvalue").html());//삭제하는 순간에는 있는 것으로 판단하기 때문에
                        //console.log("삭제 창에서 값2: "+$("#sInputvalue2").html());
                        //console.log("아이템"+item);
                        //console.log("키"+key);
                        //console.log(multipleSkills.selector.arr.length)
                        if(multipleSkills.selector.arr.length === 1){
                          $("#registbtn").css({'cursor': 'not-allowed','pointerEvents':'none','color':'#808386', 'backgroundColor': '#E4E7EA', 'border': 'none'});
                        }

                      }}>
                      <img src={blueX} alt='' />
                    </button>
                  </div>
                )
              })
            }
          </div>
        {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
        <div className="flex flex-end gap-3 mt-16">
          <button
            className="btn btn-outline-primary w-auto"
            onClick={(e) => {
              e.preventDefault(); 
              if(!multipleSkills.selector.careerCode || !multipleSkills.selector.skillCode){
                setResumeLabel("スキルと経験期間を両方選択してください。");
                setResumeAlert(true); 
                skillCodeRef.current.focus();
                return false;
              }
              handleAddMultipleSkill(e)
              //console.log($("#sInputvalue").html()); 
              //console.log(multipleSkills.selector.arr.length);
              if(multipleSkills.selector.arr.length >0){//배열의 길이가 있다면 
                $("#registbtn").removeAttr("style");
              } else 
                $("#registbtn").css({'cursor': 'not-allowed','pointerEvents':'none','color':'#808386', 'backgroundColor': '#E4E7EA', 'border': 'none'});
            }}
          >
            <img className='mr-2' src="/src/assets/images/add-btn.svg" alt=""/>
            スキル追加
          </button>
          <button id="registbtn"
            className="btn btn-primary"
            style={{cursor: 'not-allowed', pointerEvents: 'none', color: '#808386', backgroundColor: '#E4E7EA', border: 'none'}}
            onClick={(e) => {
              e.preventDefault(); 
              if(multipleSkills.selector.arr.length == 0){
                setResumeLabel("スキルを追加してから登録してください。");
                setResumeAlert(true); 
                skillCodeRef.current.focus();
                return false;
              }
              handleChangeSKillList()
              skillNameRef.current.value = ''
              setMultipleSkills({
                ...multipleSkills,
                skillName: [],
                selector: {
                  arr: []
                },
              })
              setskillPlusModal(false);
            }}
          >
            登録
          </button>
        </div>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>

    {/* 이력서 알림 모달창*/}
    <Modal
        show={resumeAlert}
        onHidden={() => {
          setResumeAlert(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            {resumeLabel}
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={(event) => {
                event.preventDefault(); 
                setResumeAlert(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

          {/* 이력서 작성 성공 모달*/}
    <Modal
        backdrop="static"
        show={resumeComplete}
        onHidden={() => {
          setResumeComplete(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            履歴書を登録しました。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setResumeComplete(false);
                window.location.href = '/';
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 장래 목표 미 선택시 생성 모달*/}        
      <Modal
        show={hopeOptionSelectFail}
        onHidden={() => {
          setHopeOptionSelectFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
          将来の目標を選択してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setHopeOptionSelectFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 현재직종 미 선택시 생성 모달*/}        
      <Modal
        show={jobOptionSelectFail}
        onHidden={() => {
          setJobOptionSelectFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
          現在の職種を選択してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setJobOptionSelectFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 소속회사 업종 미 선택시 생성 모달*/}        
      <Modal
        show={businessOptionSelectFail}
        onHidden={() => {
          setBusinessOptionSelectFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
          所属会社の業種を選択してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setBusinessOptionSelectFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

        {/* 이력서 수정 실패 모달*/}        
        <Modal
        show={resumeFail}
        onHidden={() => {
          setReresumeFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit mb-5">
            入力情報に問題があります。入力内容を確認してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                setReresumeFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      <Modal
          show={resumeCareerDel}
          onHidden={() => {
            setResumeCareerDel(false);
            setResumeCareerDelConfirmed(false);
          }}
      >
          <ModalBody className="p-10 text-center">
              <div className="modal-subtit">
                  選択した経歴を削除しますか？
              </div>
              <div className="flex flex-end gap-3">
                  <a
                      className="btn btn-primary"
                      onClick={() => {
                        const tempArr = [...career];
                        const tempBody = { ...body };
                        tempArr.splice(resumeCareerDelIndex, 1);
                        tempBody.projectName.splice(resumeCareerDelIndex, 1);
                        tempBody.projectPeriod.splice(resumeCareerDelIndex, 1);
                        tempBody.projectRole.splice(resumeCareerDelIndex, 1);
                        tempBody.projectProcess.splice(resumeCareerDelIndex, 1);
              
                        setCareer(tempArr);
                        setBody({ ...tempBody });
                        setIndex(index - 1);
              
                        setResumeCareerDel(false);
                      }}
                  >
                      はい
                  </a>
                  <a
                      className="btn btn-outline-secondary"
                      onClick={() => {
                          setResumeCareerDel(false);
                      }}
                  >
                      いいえ
                  </a>
              </div>
          </ModalBody>
      </Modal>
  </>
};
export default ResumeRegist;
