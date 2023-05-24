import {useEffect, useRef, useState} from 'react';
import ResumeMobileChange from '../../components/resume-mobile/resume-mobile-change';

import CameraPhoto from '@/assets/images/camera.svg';
import Search from '@/assets/images/search.svg';
import blueX from '@/assets/images/blue-x.svg';
import attachIcon from '@/assets/images/attach-icon.svg';
import blacksmallX from '@/assets/images/black-small-x.svg';
import Download from '@/assets/images/download-icon.svg';
import Xbutton from '@/assets/images/x_button.svg';
import SelectBox from './desktop-items/SelectBox';
import axios from 'axios';
import {getCookie} from '../../utils/cookie';
import CareerReWrite from "./desktop-items/CareerReWrite";
import ModalEvent from "./ModalEvent";
import DepthSplit from "../../../util/DepthSplit";
import {useRecoilState} from "recoil";
import {mobileStatus} from "../../stores/mobile-status";
import {Lucide, Modal, ModalBody, ModalFooter, ModalHeader} from "@/base-components";
import {useNavigate} from "react-router-dom";
import MobileSelectBox from "./mobile-items/MobileSelectBox";
import $ from "jquery";

const ResumeChange = () => {

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const categoryRef = useRef(null);
  const skillNameRef = useRef(null)

  const navigate = useNavigate()


  const [year, setYear] = useState(0)
  const [infoLimitFail, setInfoLimitFail] = useState(false);
  const [image, setImage] = useState([])
  const [fetchImage, setFetchImage] = useState([])
  const [fetchDocument, setFetchDocument] = useState([])
  const [career, setCareer] = useState([])
  const [skillItem, setSkillItem] = useState({
    temp: {},
    arr: [],
  })
  const [skillList, setSkillList] = useState({
    category: [],
    skillName: [],
    origin: [],
  })
  const [modalFlag, setModalFlag] = useState({
    main: false,
    goal: false,
    occupation: false,
    business: false,
  })
  const [depthMenu, setDepthMenu] = useState({
    hopeCareer: {
      depth: 0,
      depth_first: '',
      depth_seconds: '',
    },
    jobType: {
      depth: 0,
      depth_first: '',
      depth_seconds: '',
    },
    businessType: {
      depth: 0,
      depth_first: '',
      depth_seconds: '',
    },
  })
  const [data, setData] = useState()
  const [body, setBody] = useState({
    countrySelect: '',
    userAgeSelect: '',
    educationSelect: '',
    userGenderSelect: '',
    careerSelect: '',
    businessTypeSelect: '',
    jobTypeSelect: '',
    residentialAreaSelect: '',
    hopeCareerSelect: '',
    hopeIncomeSelect: '',
    projectNameSelect: '',
    projectPeriodSelect: '',
    projectRoleSelect: '',
    projectProcessSelect: '',
    skillCodeSelect: '',
    careerCodeSelect: '',
    schoolNameSelect: '',
    majorNameSelect: '',
    phoneNumberSelect: '',
    userEmailSelect: '',
    additionalCommentSelect: '',
    phoneNumberFlag: '0',
    userEmailFlag: '0',
  })
  const [rsFilePhoto, setRsFilePhoto] = useState([])
  const [fileNames, setFileNames] = useState([])
  const [rsFileDocument, setRsFileDocument] = useState([])
  const handleAgeCalculator = (yearSelect) => new Date().getFullYear() - (parseInt(yearSelect)) + '歳'

  // body 데이터 수정
  const handleSelectChangeEvent = (e) => {
    const key = e.target.id.replaceAll(' dropdown-button-dark-example1', '').replaceAll(' product-status-active', '')
    let value
    if (key === 'phoneNumberFlag' || key === 'userEmailFlag') {
      // console.log(e.target.value)
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
        [key]: value.toString()
      })
    }
  }
  // input 데이터 수정
  const handleInputTextChangeEvent = (e) => {
    const key = e.target.id.replaceAll(' regular-form-1', '')
    const value = e.target.value

    if (value.length >= 201) {
      setInfoLimitFail(true)
      // console.log(value.length)
      value.toString().substr(0, 200);
      // console.log(value.length)
    }

    setBody({
      ...body,
      [key]: value
    })

  }

  const handleCheckText = (e) => {
    const key = e.target.id.replaceAll(' regular-form-1', '')
    const value = e.target.value


    const emailCheck = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/
    const phoneCheck = /^([0-9]{3})-?([0-9]{3,4})-?([0-9]{4})$/


    if (e.target.value !== '') {
      if (key === 'userEmailSelect' && !emailCheck.test(value)) {
        alert('入力形式:abc@test.com.に合わせてください。')
        e.target.value = ''
        setBody({
          ...body,
          [key]: ''
        })
      }
      if (key === 'phoneNumberSelect' && !phoneCheck.test(value)) {
        alert('入力形式:000-0000-0000.に合わせてください。')
        e.target.value = ''
        setBody({
          ...body,
          [key]: ''
        })
      }

      return false
    }

  }
  //이미지 업로드
  const handleChangeImage = async (e, index) => {
    const file = e.target.files
    if (rsFilePhoto.length >= 5 || file.length + rsFilePhoto.length > 5) {
      alert('5個まで登録できます。')
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
      <img src={CameraPhoto} alt=''/>
    </label>
  </div>);


  //커리어 부분
  const handleCareerChangeAndProcess = (e, index, tempArr, roleValue) => {
    const processTemp = [...career]
    const roleTemp = [...body.projectRoleSelect]
    const strArr = []
    processTemp[index].process = [...tempArr];
    console.log(tempArr)
    console.log(processTemp)
    console.log(processTemp[index])
    console.log(processTemp[index].process)
    processTemp.map((item, key) => {
      console.log(item.process)
      strArr[key] = item.process.join()
    })
    roleTemp[index] = roleValue

    console.log(strArr)
    setBody({
      ...body,
      projectRoleSelect: roleTemp,
      projectProcessSelect: strArr
    })
  }

  const handleAddBtn = (e, idx) => {
    // console.log(idx)
    if (idx === 0) {
      setCareer(prevState => [...prevState, {process: []}])
    } else {
      const tempArr = [...career]
      const tempBody = {...body}
      tempArr.splice(idx, 1)

      tempBody.projectNameSelect.splice(idx, 1)
      tempBody.projectPeriodSelect.splice(idx, 1)
      tempBody.projectRoleSelect.splice(idx, 1)
      tempBody.projectProcessSelect.splice(idx, 1)

      setCareer(tempArr)
      setBody({...tempBody})
    }
  }
  const handleCareerChange = (e, idx) => {
    const id = e.target.id.replaceAll(' dropdown-button-dark-example1', '')
    console.log(id)
    const tempArr = [...body[id]]
    tempArr[idx] = id === 'projectPeriodSelect' ? parseInt(e.target.value) : e.target.value
    setBody({...body, [id]: tempArr})
  }
  const handleProjectProcessAdd = (e, idx) => {
    const temp = [...career]
    if (e.target.checked) {
      temp[idx].process.push(e.target.value)
      temp[idx].process.map(item => item.sort)
      projectProcessEvent(temp)
    } else {
      handleProjectProcessDel(idx, e.target.value)
    }
  }
  const handleProjectProcessDel = (idx, target) => {
    const temp = [...career]
    const position = temp[idx].process.indexOf(target)
    temp[idx].process.splice(position, 1)
    projectProcessEvent(temp)
  }
  const projectProcessEvent = (arr) => {
    let strArr = []
    console.log(strArr)
    for (let i = 0; i < arr.length; i++) {
      strArr[i] = arr[i].process.join()
    }
    setBody({...body, projectProcessSelect: [...strArr]})
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
          careerYear: value,
          careerCode: e.target.value
        }
      }
    })
  }
  const handleAddSkills = (e) => {
    if (skillItem.temp.skillCodeSelect && skillItem.temp.careerCodeSelect) {
      if (skillItem.arr.filter(skill => skill.name === skillItem.temp.skillCodeSelect.skillName).length > 0) {
        alert('スキルが重複されました。')
        document.querySelector('.refTarget_select').value = null;
        document.querySelectorAll('.refTarget_radio').forEach(radio => radio.checked = false)
        return
      }
      setBody({
        ...body,
        skillCodeSelect: [...body.skillCodeSelect, skillItem.temp.skillCodeSelect.skill],
        careerCodeSelect: [...body.careerCodeSelect, skillItem.temp.careerCodeSelect.careerCode],
      })
      setSkillItem({
        arr: [...skillItem.arr, {
          cate: skillItem.temp.skillCodeSelect.skillCategoryName,
          name: skillItem.temp.skillCodeSelect.skillName,
          year: skillItem.temp.careerCodeSelect.careerYear
        }],
        temp: {}
      })
      document.querySelector('.refTarget_select').value = null;
      document.querySelectorAll('.refTarget_radio').forEach(radio => radio.checked = false)
    } else {
      //alert('스킬이나 経歴이 선택되지 않았습니다.')
    }

  }

  // 파일 업로드 부분
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (rsFileDocument.length + files.length >= 5) {
      alert("ファイルは５つまで添付できます。")
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

  // 전송
  const handleSubmit = async () => {

    let temp = {}
    Object.entries(body).forEach(obj => {
      temp[obj[0].replaceAll('Select', '')] = obj[1]
    })

    delete temp.userId
    delete temp.businessCategory
    // delete temp.resumeId

    temp.projectProcess = temp.projectProcess.map(item => item.toString())


    const formData = new FormData()
    const blob = new Blob([JSON.stringify(temp)], {type: 'application/json'});
    // await formData.append('request', JSON.stringify(temp))

    await formData.append('request', blob)
    rsFilePhoto.length > 0 ? rsFilePhoto.map(item => formData.append('rsFilePhoto', item)) : formData.append('rsFilePhoto', new File([], 'photo.png'))
    rsFileDocument.length > 0 ? rsFileDocument.map(item => formData.append('rsFileDocument', item)) : formData.append('rsFileDocument', new File([], 'document.pdf'))

    //서버로 보내기
    axios.put('/api/resume/modify',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data;',
          accessToken: getCookie('accessToken').toString(),
          lastLoginTime: getCookie('lastLoginTime').toString()
        },
      }).then((res) => {
      if (res.data.resultCode === '200') {
        alert(res.data.resultMessage)
        window.location.href = '/';
      }
      console.log(res)
    })
      .catch((res) => console.log(res))

  }

  const [isLoading, setLoading] = useState(false)

  const findOneDepth = (code, group) => {
    //group으로 받은 parm array에서 code와 일치하는 child를 가진 1dep 정보 가져오기
    let filterOneDepth = group.filter(dep1 => dep1.child.filter(dep2 => Object.values(dep2).indexOf(code) != -1).length === 1)
    return filterOneDepth[0];
  }


  const [skillPlusModal, setskillPlusModal] = useState();

  // 데이터 리스트 불러오기
  useEffect(() => {
    axios.get('/api/resume/reg', {
      withCredentials: true,
      headers: {
        accessToken: getCookie('accessToken'),
        lastLoginTime: getCookie('lastLoginTime'),
      }
    }).then((res) => {
      let hopeCareerDepthFirst = "";
      let hopeCareerDepthSeconds = "";
      let jobTypeDepthFirst = "";
      let jobTypeDepthSeconds = "";
      let businessTypeDepthFirst = "";
      let businessTypeDepthSeconds = "";

      for(let i = 0; i < res.data.result.hopeCareerList.length; i++){
        if((res.data.result.hopeCareerList[i].hopeCareer).substr(0,4) == (res.data.result.regiInfoDto.hopeCareerSelect).substr(0,4)){
          hopeCareerDepthFirst = res.data.result.hopeCareerList[i].hopeCareerName;
          break;
        }
      }
      for(let i = 0; i < res.data.result.hopeCareerList.length; i++){
        if(res.data.result.hopeCareerList[i].hopeCareer == res.data.result.regiInfoDto.hopeCareerSelect){
          hopeCareerDepthSeconds = res.data.result.hopeCareerList[i].hopeCareerName;
        }
      }

      for(let i = 0; i < res.data.result.jobTypeList.length; i++){
        if((res.data.result.jobTypeList[i].jobType).substr(0,4) == (res.data.result.regiInfoDto.jobTypeSelect).substr(0,4)){
          jobTypeDepthFirst = res.data.result.jobTypeList[i].jobTypeName;
          break;
        }
      }
      for(let i = 0; i < res.data.result.jobTypeList.length; i++){
        if(res.data.result.jobTypeList[i].jobType == res.data.result.regiInfoDto.jobTypeSelect){
          jobTypeDepthSeconds = res.data.result.jobTypeList[i].jobTypeName;
        }
      }

      for(let i = 0; i < res.data.result.businessTypeList.length; i++){
        if((res.data.result.businessTypeList[i].businessType).substr(0,4) == (res.data.result.regiInfoDto.businessTypeSelect).substr(0,4)){
          businessTypeDepthFirst = res.data.result.businessTypeList[i].businessTypeName;
          break;
        }
      }
      for(let i = 0; i < res.data.result.businessTypeList.length; i++){  
        if(res.data.result.businessTypeList[i].businessType == res.data.result.regiInfoDto.businessTypeSelect){
          businessTypeDepthSeconds = res.data.result.businessTypeList[i].businessTypeName;
        }
      }
      
      setDepthMenu({
        hopeCareer: {
          depth: 0,
          depth_first: hopeCareerDepthFirst,
          depth_seconds: hopeCareerDepthSeconds,
        },
        jobType: {
          depth: 0,
          depth_first: jobTypeDepthFirst,
          depth_seconds: jobTypeDepthSeconds,
        },
        businessType: {
          depth: 0,
          depth_first: businessTypeDepthFirst,
          depth_seconds: businessTypeDepthSeconds,
        },
        
      })

      if (res.data.result.regiInfoDto) {
        // console.log(res.data.result.regiInfoDto)
        setData(res.data.result)
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
        setSkillItem({temp: {}, arr: [],})
        setBody({
          ...res.data.result.regiInfoDto,
          skillCodeSelect: res.data.result.regiInfoDto.skillCodeSelect.split(','),
          careerCodeSelect: res.data.result.regiInfoDto.careerCodeSelect.split(','),
          projectNameSelect: res.data.result.regiInfoDto.projectNameSelect.split(','),
          projectRoleSelect: res.data.result.regiInfoDto.projectRoleSelect.split(','),
          projectPeriodSelect: res.data.result.regiInfoDto.projectPeriodSelect.split(',').map(item => parseInt(item)),
          projectProcessSelect: [...res.data.result.regiInfoDto.projectProcessSelect.split(';').map(item => item.split(','))],
        })
        setFetchImage(res.data.result.photofile)
        setFetchDocument(res.data.result.attachedfileList)
        // console.log(res.data.result.attachedfileList)
        // setFileNames(res.data.result.attachedfileList)
        setMobileStatus(prev => {
          return {...prev, api: res.data.result}
        })
        if (mobile) {
          let tempResult = {...res.data.result.regiInfoDto}
          let tempKeys = Object.keys(tempResult);
          for (let i = 0; i < tempKeys.length; i++) {
            if (tempKeys[i].includes('Select')) {
              tempResult[tempKeys[i].replace('Select', '')] = tempResult[tempKeys[i]];
              delete tempResult[tempKeys[i]];
            }
          }

          // console.log(mobile)
          // console.log(res.data.result.regiInfoDto)

          const businessDepthMenu = DepthSplit(mobile, 'businessDepthMenu', 'businessTypeList', 'businessType');
          const jobDepthMenu = DepthSplit(mobile, 'jobDepthMenu', 'jobTypeList', 'jobType');
          const hopeCareerDepthMenu = DepthSplit(mobile, 'hopeCareerDepthMenu', 'hopeCareerList', 'hopeCareer');

          setMobileStatus({
            ...mobile,
            ...tempResult,
            // country: res.data.result.regiInfoDto.countrySelect,

            businessTypeOneDeps: findOneDepth(res.data.result.regiInfoDto.businessTypeSelect, businessDepthMenu).businessType,
            hopeCareerOneDeps: findOneDepth(res.data.result.regiInfoDto.hopeCareerSelect, hopeCareerDepthMenu).hopeCareer,
            jobTypeOneDeps: findOneDepth(res.data.result.regiInfoDto.jobTypeSelect, jobDepthMenu).jobType,

            businessDepthMenu: businessDepthMenu,
            jobDepthMenu: jobDepthMenu,
            hopeCareerDepthMenu: hopeCareerDepthMenu
          })       
        }
      } else {
        alert('등록된 이력서가 없습니다. 이력서를 먼저 등록해주세요.')
        navigate('/resume-regist')
      }
    })
  }, [])

  useEffect(() => {
    /*console.log(body)
    console.log(data)*/

    if (body && data) {
      const temaArr = []
      setLoading(true)
      for (let i = 0; i < body.skillCodeSelect.length; i++) {
        let tempSkillName = ''
        let tempCareer = ''

        for (let j = 0; j < data.skillList.length; j++) {
          if (data.skillList[j].skill === body.skillCodeSelect[i]) {
            tempSkillName = data.skillList[j].skillName
            break;
          }
        }

        for (let j = 0; j < data.skillCareerList.length; j++) {
          if (data.skillCareerList[j].skillCareer === body.careerCodeSelect[i]) {
            tempCareer = data.skillCareerList[j].skillCareerName
            break;
          }
        }

        temaArr.push({name: tempSkillName, year: tempCareer})


        // console.log(skillItem.arr)
      }
      setSkillItem({
        arr: [...temaArr],
        temp: {}
      })
    }
  }, [data])

  useEffect(() => {
    if (body && data) {
      console.log(body)
      if (body.projectProcessSelect) {
        setCareer([])
        console.log(body.projectProcessSelect)
        console.log(body.projectProcessSelect.length)
        let temp = [...career];
        for (let i = 0; i < body.projectProcessSelect.length; i++) {
          temp.push({process: [...body.projectProcessSelect[i]]})
          console.log(temp)
          setCareer(temp)
          //console.log(j, temp)
          projectProcessEvent(temp)
        }
      }
      setImage([])
      setRsFilePhoto([])
      setRsFileDocument([])

      fetchImage?.map((img) => {
        axios.get('/api' + img.rsFileUrl, {
          responseType: 'blob',
          headers: {
            accessToken: getCookie('accessToken').toString(),
            lastLoginTime: getCookie('lastLoginTime').toString()
          }
        }).then(res => {
          const file = new File([res.data], res.rsFileName)
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = (loadResponse) => {
            const imageData = loadResponse.currentTarget.result
            // console.log(imageData)
            setImage(prevState => [...prevState, imageData])
          }
          setRsFilePhoto(prev => [...prev, res.data])
        })
      })

      setFileNames([])
      fetchDocument?.map((document) => {
        //console.log(document)
        axios.get('/api' + document.rsFileUrl, {
          responseType: 'blob',
          headers: {
            accessToken: getCookie('accessToken').toString(),
            lastLoginTime: getCookie('lastLoginTime').toString()
          }
        }).then(res => {
          const file = new File([res.data], document.rsFileName)
          setRsFileDocument(prev => [...prev, file])
          setFileNames(prev => [...prev, document.rsFileName])
        })
      })

    }
  }, [isLoading])


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
    if (selector.skillCode) {
      selector.arr.map(item => {
        if (item.name === selector.skillCode.skill) {
          flag = true
        }
      })
      if (flag) {
        alert('스킬이 중복선택 되었습니다.')
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
    let tempBodyCareer = [...body.careerCodeSelect]
    let tempBodySkill = [...body.skillCodeSelect]

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
        careerCodeSelect: [...tempBodyCareer],
        skillCodeSelect: [...tempBodySkill]
      })
    })

    console.log(body)

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
    {
      isLoading ?
        <div className='resume-mng '>
          <div className='box-type-default hidden lg:block'>
            <div className='p-5 border-b border-slate-200/60 text-sm'>
              履歴書変更
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
                  <div className='form-tit'>国籍 <span>*</span></div>
                  <SelectBox id={'countrySelect'} data={data && data.countryList} onChange={handleSelectChangeEvent}
                             defaultValue={body.countrySelect}/>

                </div>
                <div className='box-item flex flex-col'>
                  <div className='form-tit'>学歴 <span>*</span></div>
                  <SelectBox id={'educationSelect'} data={data && data.educationList} onChange={handleSelectChangeEvent}
                             defaultValue={body.educationSelect}/>
                </div>
              </div>
              <div className='form-flex-box flex space-between items-start'>
                <div className='box-item flex flex-col'>
                  <div className='form-tit'>性別 <span>*</span></div>
                  <MobileSelectBox id={'userGender'} value={body.userGenderSelect} data={data && data.userGenderList}
                                   onChange={handleSelectChangeEvent} disabled={true}/>
                </div>
                <div className='box-item flex flex-col'>
                  <div className='form-tit'>最終学校名 <span>*</span></div>
                  <input id='schoolNameSelect regular-form-1' type='text' className='form-control'
                         placeholder='最終学校名入力'
                         onChange={handleInputTextChangeEvent} value={body.schoolNameSelect}/>
                </div>
              </div>
              <div className='form-flex-box flex space-between items-start'>
                <div className='box-item flex flex-col'>
                  <div className='form-tit'>生年 <span>*</span></div>
                  <div className='flex items-center gap-2'>
                    <MobileSelectBox id={'userGender'} value={body.userAgeSelect} data={data && data.userAgeList}
                                     onChange={handleSelectChangeEvent} disabled={true}/>
                    <div
                      className='btn btn-sm btn-ouline-secondary w-40 btn-age'>{handleAgeCalculator(data.userAgeList.filter(year => year.userAge === body.userAgeSelect)[0].userAgeName)}</div>
                  </div>
                </div>
                <div className='box-item flex flex-col'>
                  <div className='form-tit'>専攻 <span>*</span></div>
                  <input id='majorNameSelect regular-form-1' type='text' className='form-control' placeholder='専攻入力'
                         onChange={handleInputTextChangeEvent} value={body.majorNameSelect}/>
                </div>
              </div>
              <div className='form-flex-box flex space-between items-start'>
                <div className='box-item flex flex-col'>
                  <div className='form-tit'>居住地 <span>*</span></div>
                  <SelectBox id={'residentialAreaSelect'} data={data && data.residentialAreaList}
                             onChange={handleSelectChangeEvent} defaultValue={body.residentialAreaSelect}/>

                </div>
                <div className='box-item flex flex-col'>
                  <div className='form-tit'>希望年収 <span>*</span></div>
                  <SelectBox id={'hopeIncomeSelect'} data={data && data.hopeIncomeList}
                             onChange={handleSelectChangeEvent}
                             defaultValue={body.hopeIncomeSelect}/>
                </div>
              </div>
              <div className='form-flex-box flex space-between items-start'>
                <div className='box-item flex flex-col'>
                  <div className='form-tit'>イーメール <span>*</span></div>
                  <div className='flex items-center gap-2'>
                    <input id='userEmailSelect regular-form-1' type='text' className='form-control'
                           placeholder='イーメール入力'
                           onChange={handleInputTextChangeEvent}
                           onBlur={handleCheckText} value={body.userEmailSelect}/>
                    <div className='form-check form-switch flex gap-2'>
                      <div
                        className='switch-tit shrink-0 w50 text-center'>{body.userEmailFlag === '0' ? '非公開' : '公開'}</div>
                      <input
                        id='userEmailFlag product-status-active'
                        className='form-check-input toggle-input'
                        type='checkbox'
                        onChange={handleSelectChangeEvent}
                        checked={body.userEmailFlag === '1'}
                      />
                    </div>
                  </div>
                </div>
                <div className='box-item flex flex-col'>
                  <div className='form-tit'>連絡先 <span>*</span></div>
                  <div className='flex items-center gap-2'>
                    <input id='phoneNumberSelect regular-form-1' type='text' className='form-control'
                           value={body.phoneNumberSelect}
                           placeholder='入力形式: 000-0000-0000に合わせてください。'
                           onChange={handleInputTextChangeEvent}
                           onBlur={handleCheckText}
                    />
                    <div className='form-check form-switch flex gap-2'>
                      <div
                        className='switch-tit shrink-0 w50 text-center'>{body.phoneNumberFlag === '0' ? '非公開' : '公開'}</div>
                      <input
                        id='phoneNumberFlag product-status-active'
                        className='form-check-input toggle-input'
                        type='checkbox'
                        onChange={handleSelectChangeEvent}
                        checked={body.phoneNumberFlag === '1'}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className='divider'/>

              <div className="form-flex-box flex space-between items-start">
                <div className="box-item2 flex flex-col">
                  <div className="form-tit">将来の目標<span>*</span></div>
                  <button className='btn btn-primary flex-start'
                          onClick={() => {
                            setModalFlag({...modalFlag, main: true, goal: true})
                            //console.log(modalFlag)
                          }}
                  >
                    {/* {isLoading ? data.hopeCareerList.filter(item => item.hopeCareer === (body.hopeCareer ? body.hopeCareer : body.hopeCareerSelect))[0].hopeCareerName : ''} */}
                    {depthMenu.hopeCareer.depth_first} &gt; {depthMenu.hopeCareer.depth_seconds}
                  </button>
                </div>
              </div>

              <div className='form-flex-box flex space-between items-start'>
                <div className='box-item flex flex-col'>
                  <div className='form-tit'>経歴 <span>*</span></div>
                  <SelectBox id={'careerSelect'} data={data && data.careerList} onChange={handleSelectChangeEvent}
                             defaultValue={body.careerSelect}/>
                </div>
                <div className="box-item flex flex-col">
                  <div className="form-tit">現在の職種 <span>*</span></div>
                  <button className='btn btn-primary'
                          onClick={() => {
                            setModalFlag({...modalFlag, main: true, occupation: true})
                          }}
                  >   
                    {/* {isLoading ? data.jobTypeList.filter(item => item.jobType === (body.jobType ? body.jobType : body.jobTypeSelect))[0].jobTypeName : ''} */}
                    {depthMenu.jobType.depth_first} &gt; {depthMenu.jobType.depth_seconds}
                  </button>
                </div>
                <div className="box-item flex flex-col">
                  <div className="form-tit">所属会社の業種 <span>*</span></div>
                  <button className='btn btn-primary'
                          onClick={() => {
                            setModalFlag({...modalFlag, main: true, business: true})
                          }}
                  >
                    {/* {depthMenu.businessType.depth_seconds}
                    {isLoading ? data.businessTypeList.filter(item => item.businessType === (body.businessType ? body.businessType : body.businessTypeSelect))[0].businessTypeName : ''} */}
                    {depthMenu.businessType.depth_first} &gt; {depthMenu.businessType.depth_seconds}
                  </button>
                </div>
              </div>

              <div className='divider'/>
              {
                isLoading && career.map((item, key) => {
                  return <CareerReWrite
                    key={key}
                    index={key}
                    addState={key === 0}
                    handleAddBtn={handleAddBtn}
                    projectRoleList={data?.projectRoleList}
                    projectProcessDefault={data?.projectProcessDefault}
                    projectProcessList={data?.projectProcessList}
                    handleCareerChange={handleCareerChange}
                    handleProjectProcessChange={handleProjectProcessAdd}
                    handleProjectProcessDel={handleProjectProcessDel}
                    handleCareerChangeAndProcess={handleCareerChangeAndProcess}
                    name={body.projectNameSelect[key]}
                    role={body.projectRoleSelect[key]}
                    period={body.projectPeriodSelect[key]}
                    process_re={body.projectProcessSelect[key] ? body.projectProcessSelect[key] : []}
                  />
                })
              }
              <div className='divider'/>

              {/* 나의 스킬 */}
              <div className='flex-box2-tit flex space-between mt-16'>
                <div className='box2-tit'>私のスキル <span> *</span></div>
              </div>
              <div className='flex-box2-cont form-flex-box'>
                <div className='form-flex-box flex space-between items-start'>
                  <div className='box-item flex flex-col'>
                    <div className='form-tit'>スキル検索</div>
                    <div className='relative text-slate-500'>
                      <input
                        type='text'
                        className='form-control pr-10'
                        placeholder='検索'
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
                        }}
                      />
                      <button className='w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0'>
                        <img src={Search} alt=''/>
                      </button>
                    </div>
                  </div>
                  <div className='box-item flex flex-col'>
                    <div className='form-tit'>経歴期間</div>
                    <div className='flex items-center gap-2'>
                      <SelectBox className={'refTarget_select'} id={'careerCodeSelect'}
                                 data={data && data.skillCareerList}
                                 defaultValue={skillItem.temp?.careerCodeSelect?.careerCode}
                                 onChange={handleUpdateSkill}/>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-between mb-4">
                  <button onClick={() => {
                    setskillPlusModal(true);
                  }}>
                    <img src={attachIcon} alt='' className='ml-2'/>
                  </button>
                  <div className='btn btn-sm btn-register w-40 btn-age' onClick={handleAddSkills}>登録</div>
                </div>
                <div className='skil_list'>
                  <div className='list-group list-over'>
                    {
                      skillList && skillList.skillName.map((skill, key) => {
                        return <div key={key} className='list-group-item'>
                          <label className='checkbox-btn w-18'>
                            <input id={'skillCodeSelect'} name='group' className='form-check-input chg2 refTarget_radio'
                                   type='radio' onChange={(e) => handleUpdateSkill(e, skill)}/>
                            <span>{skill.skillCategoryName} | {skill.skillName}</span>
                          </label>
                        </div>
                      })
                    }
                  </div>
                </div>
              </div>
              <div className='blue-tit'>
                登録されたスキルリスト
              </div>
              <div className='blue-btn-wrap flex gap-2 items-center'>
                {
                  skillItem.arr.map((item, key) => {
                    return (
                      <div key={key} className='blue-btn'>
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
                                  console.log(tempArr)
                                  tempArr.map((skill) => {
                                    const code = skillList.origin.filter( origin => origin.skillName === skill.name)[0]?.skill
                                    const year = data.skillCareerList.filter(career => career.skillCareerName === skill.year)[0]?.skillCareer
                                    tempSkillCode.push(code)
                                    tempYearCode.push(year)
                                  })
                                  setBody({
                                    ...body,
                                    skillCodeSelect: [...tempSkillCode],
                                    careerCodeSelect: [...tempYearCode]
                                  })
                                }}>
                          <img src={blueX} alt=''/>
                        </button>
                      </div>
                    )
                  })
                }
              </div>

              <div className='divider'/>

              {/* 簡単な自己紹介 */}
              <div className='flex-box2-tit flex space-between mt-16'>
                <div className='box2-tit'>自己紹介</div>
                <div
                  className='text-slate-400'>{body.additionalCommentSelect === "" ? "0" : body.additionalCommentSelect.length} /
                  200字
                </div>
              </div>
              <div className='flex-box2-cont textarea_style'>
                <textarea name='' id='additionalCommentSelect' cols='' rows='10' className='w-full'
                          maxLength={200}
                          placeholder='自由に自己紹介してください。（200字以内）' onChange={handleInputTextChangeEvent}
                          value={body.additionalCommentSelect}
                />
              </div>

              <div className='attach-wrap flex'>
                <div className='attach-tit-wrap flex items-center'>
                  <div className='filebox attach-tit flex items-center'>
                    <label htmlFor='file' className='flex items-center cursor-pointer'>
                      ファイル添付
                      <input type='file' id='file' onChange={handleFileUpload} multiple={true}/>
                      <img src={attachIcon} alt='' className='ml-2'/>
                    </label>
                  </div>
                </div>
                <div className='flex flex-col attach-cont-wrap'>
                  {fileNames.map((file, index) => {
                    return <div className='attach-cont-item flex items-center space-between' key={index}>
                      <input className='upload-name mr-2 attach-cont-tit' value={file} placeholder='' readOnly/>
                      <button className='attach-cont-btn' onClick={() => handleDeleteFile(index)}>
                        <img src={blacksmallX} alt=''/>
                      </button>
                    </div>
                  })}
                </div>
              </div>

              {/* 기존 소스 */}
              {/* <div className='attach-wrap flex'>
            <div className='attach-tit-wrap flex items-center'>
              <div className='filebox attach-tit flex items-center'>
                <label for='file' className='flex items-center cursor-pointer'>파일첨부
                    <input type='file' id='file'/>
                    <img src={attachIcon} alt='' className='ml-2'/>
                </label>
              </div>

            </div>
            <div className='flex flex-col attach-cont-wrap'>
              <div className='attach-cont-item flex items-center space-between'>
                <input className='upload-name mr-2 attach-cont-tit' value='첨부파일' placeholder='' readOnly/>
                <button className='attach-cont-btn'>
                  <img src={blacksmallX} alt=''/>
                </button>
              </div>
              <div className='attach-cont-item flex items-center space-between'>
                <input className='upload-name mr-2 attach-cont-tit' value='첨부파일' placeholder='' readOnly/>
                <button className='attach-cont-btn'>
                  <img src={blacksmallX} alt=''/>
                </button>
              </div>
            </div>
          </div> */}

              <div className='download-btn flex'>
                <button className='btn btn-outline-primary flex items-center h48'
                        onClick={() => window.open('https://hitobito-net.com/api/files/sample.pdf')}>
                  サンプル·ダウンロード
                  <img src={Download} alt=''/>
                </button>
                <button className='btn btn-primary flex items-center h48' onClick={handleSubmit}>
                  修正
                </button>
              </div>
              <div className='blue-tit'>
                作成が難しいですか？ サンプルをダウンロードしてみてください。
              </div>
            </div>
          </div>


          {
            mobile.businessDepthMenu && mobile.jobDepthMenu && mobile.hopeCareerDepthMenu ? <Modal
              show={modalFlag.main}
              onHidden={() => {
                setModalFlag({
                  main: false,
                  goal: false,
                  occupation: false,
                  business: false,
                })
              }}
            >
              <ModalHeader>
                <h2 className="font-medium text-base mr-auto">
                  {modalFlag.goal ? '将来の目標' : modalFlag.occupation ? '現在の職種' : modalFlag.business ? '所属会社の業種' : ''}
                </h2>
              </ModalHeader>
              <ModalBody className="p-10 text-center">
                <div className='flex items-center gap-3'>
                  <SelectBox
                    className={modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : ''}
                    id={modalFlag.goal ? 'hopeCareerOneDeps' : modalFlag.occupation ? 'jobTypeOneDeps' : modalFlag.business ? 'businessTypeOneDeps' : ''}
                    data={mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : '']}
                    // value={mobile[modalFlag.goal ? 'hopeCareerOneDepth' : modalFlag.occupation ? 'jobTypeOneDepth' : modalFlag.business ? 'businessTypeOneDepth' : '']}
                    defaultValue={
                      mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : '']
                        ?.filter(item => item[modalFlag.goal ? 'hopeCareerName' : modalFlag.occupation ? 'jobTypeName' : modalFlag.business ? 'businessTypeName' : ''] === depthMenu[modalFlag.goal ? 'hopeCareer' : modalFlag.occupation ? 'jobType' : modalFlag.business ? 'businessType' : '']?.depth_first).length > 0 ?
                        mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : '']
                          ?.filter(item => item[modalFlag.goal ? 'hopeCareerName' : modalFlag.occupation ? 'jobTypeName' : modalFlag.business ? 'businessTypeName' : ''] === depthMenu[modalFlag.goal ? 'hopeCareer' : modalFlag.occupation ? 'jobType' : modalFlag.business ? 'businessType' : '']?.depth_first)[0][modalFlag.goal ? 'hopeCareer' : modalFlag.occupation ? 'jobType' : modalFlag.business ? 'businessType' : '']
                        : ''
                    }
                    onChange={(e) => {
                      ModalEvent(modalFlag.goal ? 'hopeCareer' : modalFlag.occupation ? 'jobType' : modalFlag.business ? 'businessType' : '')
                        .oneDepth(e, depthMenu, setDepthMenu, mobile, modalFlag)
                    }}
                  />
                  <SelectBox
                    id={modalFlag.goal ? 'hopeCareer' : modalFlag.occupation ? 'jobType' : modalFlag.business ? 'businessType' : ''}
                    data={
                      mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : 'ap'] && mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : ''].length > 0
                        ? mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : ''][modalFlag.goal ? depthMenu.hopeCareer.depth : modalFlag.occupation ? depthMenu.jobType.depth : modalFlag.business ? depthMenu.businessType.depth : 0]?.child
                        : []
                    }
                    defaultValue={
                      (mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : 'ap'] && mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : ''].length > 0
                        ? mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : ''][modalFlag.goal ? depthMenu.hopeCareer.depth : modalFlag.occupation ? depthMenu.jobType.depth : modalFlag.business ? depthMenu.businessType.depth : 0]?.child
                        : [])
                        ?.filter(item => item[modalFlag.goal ? 'hopeCareerName' : modalFlag.occupation ? 'jobTypeName' : modalFlag.business ? 'businessTypeName' : ''] === depthMenu[modalFlag.goal ? 'hopeCareer' : modalFlag.occupation ? 'jobType' : modalFlag.business ? 'businessType' : '']?.depth_seconds).length > 0 ?
                        (mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : 'ap'] && mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : ''].length > 0
                          ? mobile[modalFlag.goal ? 'hopeCareerDepthMenu' : modalFlag.occupation ? 'jobDepthMenu' : modalFlag.business ? 'businessDepthMenu' : ''][modalFlag.goal ? depthMenu.hopeCareer.depth : modalFlag.occupation ? depthMenu.jobType.depth : modalFlag.business ? depthMenu.businessType.depth : 0]?.child
                          : [])
                          ?.filter(item => item[modalFlag.goal ? 'hopeCareerName' : modalFlag.occupation ? 'jobTypeName' : modalFlag.business ? 'businessTypeName' : ''] === depthMenu[modalFlag.goal ? 'hopeCareer' : modalFlag.occupation ? 'jobType' : modalFlag.business ? 'businessType' : '']?.depth_seconds)[0][modalFlag.goal ? 'hopeCareer' : modalFlag.occupation ? 'jobType' : modalFlag.business ? 'businessType' : '']
                        : null
                    }
                    onChange={(e) => {
                      ModalEvent(modalFlag.goal ? 'hopeCareer' : modalFlag.occupation ? 'jobType' : modalFlag.business ? 'businessType' : '')
                        .secondDepth(e, depthMenu, setDepthMenu, body, setBody)
                    }}
                  />
                </div>

              </ModalBody>
              <ModalFooter>
                <div className="sel-btn-wrap flex justify-center gap-2">
                  <button className="btn btn-outline-secondary"
                          onClick={() => {
                            setModalFlag({
                              main: false,
                              goal: false,
                              occupation: false,
                              business: false,
                            })
                          }}
                  >
                    キャンセル
                  </button>
                  <button className="btn btn-primary" onClick={() => {
                    setModalFlag({
                      main: false,
                      goal: false,
                      occupation: false,
                      business: false,
                    })
                  }}>
                    登録
                  </button>
                </div>
              </ModalFooter>
            </Modal> : null


          }


          <div className='mo-resume-mng'>
            <ResumeMobileChange/>
          </div>
        </div>
        : null
    }
    {/* 이력서 변경에는 모바일 버튼 없음 */}
    {/* <MobileBottom/> */}

    {/* 簡単な自己紹介 200자이상 실패 */}
    <Modal
      show={infoLimitFail}
      onHidden={() => {
        setInfoLimitFail(false);
      }}
    >
      <ModalBody className="p-10 text-center">
        <div className="modal-tit mb-5">
          200文字まで入力できます。
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
            <Lucide icon="X" className="w-4 h-4"/>
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
                  return <option
                    value={item}>{multipleSkills.origin.filter(skill => skill.skillCategory === item)[0].skillCategoryName}</option>
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
                    <img src={Search} alt=''/>
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-start ">
                <div className='form-tit'>経歴期間</div>
                <SelectBox className={'refTarget_select w-40'} id={'careerCode'} data={data && data.skillCareerList}
                           onChange={handleUpdateMultipleSkill} defaultValue={multipleSkills.selector?.careerCode}/>
              </div>
            </div>
            <div className='skil_list mt-4'>
              <div className="list-group list-over">
                {
                  multipleSkills && multipleSkills.skillName.map((skill, key) => {
                    return <div key={key} className='list-group-item'>
                      <label className='checkbox-btn w-18 flex item-center'>
                        <input id={'skillCode'} name='group' className='form-check-input chg2 refTarget_radio'
                               type='radio' onChange={(e) => handleUpdateMultipleSkill(e, skill)}/>
                        <span>{skill.skillCategoryName} | {skill.skillName}</span>
                      </label>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
          <div class="blue-btn-wrap flex gap-2 items-center">
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
                      <img src={blueX} alt=''/>
                    </button>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className="w-full text-left mt-4 text-slate-500">* カテゴリー選択後、スキルを検索し経歴を入力してください。</div>
        {/* <div className="modal-subtit">管理者に問い合わせしてください。</div> */}
        <div className="flex flex-end gap-3 mt-16">
          <a
            className="btn btn-outline-primary w-auto"
            onClick={(e) => {
              handleAddMultipleSkill(e)
            }}
          >
            <img className='mr-2' src="/src/assets/images/add-btn.svg" alt=""/>
            スキル追加
          </a>
          <a
            className="btn btn-primary"
            onClick={(e) => {
              // setskillPlusModal(false);
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
          </a>
        </div>
      </ModalBody>
    </Modal>
  </>
};
export default ResumeChange;
