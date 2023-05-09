import {useRecoilState} from "recoil";
import {mobileStatus} from "../../stores/mobile-status";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {getCookie} from "../../utils/cookie";

const MobileBottom2 = (props) => {

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [isProjectState, setProjectState] = useState(false)
  const navigate = useNavigate()

  const prevPage = () => {
    let url = '/resume-regist'
    if(parseInt(mobile.progress) > 2) url += `-mo${parseInt(mobile.progress) - 1}`

    setMobileStatus({
      ...mobile,
      progress : parseInt(mobile.progress) - 1
    })
    navigate(url)
  }
  const nextPage = () => {
    let flag = false;

    switch (mobile.progress) {
      case 2:
        if(mobile.userAge) flag = true
        break;
      case 3:
        if(mobile.education) flag = true
        break;
      case 4:
        if(mobile.schoolName && mobile.majorName) flag = true
        break;
      case 5:
        if(mobile.userGender) flag = true
        break;
      case 6:
        if(mobile.career) flag = true
        break;
      case 7:
        if(mobile.businessType) flag = true
        break;
      case 8:
        if(mobile.jobType) flag = true
        break;
      case 9:
        if(mobile.residentialArea) flag = true
        break;
      case 10:
        if(mobile.hopeCareer) flag = true
        break;
      case 11:
        if(mobile.hopeIncome) flag = true
        break;
      case 12:
        if(mobile.phoneNumber && mobile.userEmail){
          if(mobile.phoneNumberFlag || mobile.userEmailFlag){
            flag = true
          }else{
            alert('핸드폰번호 or 이메일 둘 중 하나는 공개여야 합니다.')
          }
        }
        break;
      case 13:
        if(
          mobile.projectName[0] &&
          mobile.projectPeriod[0] >= 0 &&
          mobile.projectRole[0]
        ){
          flag = true
        }
        break;
      case 14:
        if(mobile.tempSkillItem) flag = true
        break;
      case 15:
        //if(mobile.hopeIncome) flag = true
        break;
      default:
        flag = false
        break
    }


    if(flag) {
      const url = '/resume-regist' + `-mo${parseInt(mobile.progress) + 1}`
      setMobileStatus({
        ...mobile,
        progress : parseInt(mobile.progress) + 1
      })
      navigate(url)
    }
  }

  const skipPage = () => {
    const url = '/resume-regist' + `-mo${parseInt(mobile.progress) + 1}`
    setMobileStatus({
      ...mobile,
      progress : parseInt(mobile.progress) + 1
    })
    navigate(url)
  }



  /* ************************* 이력서 등록 시작 ************************* */
  console.log(mobile)
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
    phoneNumberFlag: '0',
    userEmailFlag: '0',
  });

  useEffect(() => {
    setBody({
      country: mobile.country,
      userAge: mobile.userAge,
      education: mobile.education,
      userGender: mobile.userGender,
      career: mobile.career,
      businessType: mobile.businessType,
      jobType: mobile.jobType,
      residentialArea: mobile.residentialArea,
      hopeCareer: mobile.hopeCareer,
      hopeIncome: mobile.hopeIncome,
      projectName: mobile.projectName,
      projectPeriod: mobile.projectPeriod,
      projectRole: mobile.projectRole,
      projectProcess: mobile.projectProcess,
      skillCode: mobile.skillCode,
      careerCode: mobile.careerCode,
      schoolName: mobile.schoolName,
      majorName: mobile.majorName,
      phoneNumber: mobile.phoneNumber,
      userEmail: mobile.userEmail,
      additionalComment: mobile.additionalComment,
      phoneNumberFlag: mobile.phoneNumberFlag,
      userEmailFlag: mobile.userEmailFlag,
    })
  }, [mobile])

  // 전송
  const handleSubmit = async () => {
    const formData = new FormData()
    const blob = new Blob([JSON.stringify(body)], {type: 'application/json'});

    await formData.append('request', blob)

    props.rsFileDocument && props.rsFileDocument.length > 0 ? props.rsFileDocument.map(item => formData.append('rsFileDocument', item)) : formData.append('rsFileDocument', new File([], 'photo.jpg'))
    props.rsFilePhoto && props.rsFilePhoto.length > 0 ? props.rsFilePhoto.map(item => formData.append('rsFilePhoto', item)) : formData.append('rsFilePhoto', new File([], 'document.pdf'))

    /*console.log(formData.get('request'))
    console.log(formData.get('rsFilePhoto'))
    console.log(formData.get('rsFileDocument'))*/

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
      console.log(res)
      setMobileStatus({
        ...mobile,
        progress : 1
      })
      window.location.href = '/';
    })
      .catch((res) => console.log(res))
  }
  /* ************************* 이력서 등록 끝 ************************* */

  useEffect(() => {
    if(mobile.progress === 13){
      console.log(mobile.projectName)
      if(
        mobile?.projectName[0]?.length > 0 &&
        mobile.projectPeriod[0] >= 0 &&
        mobile?.projectRole[0]?.length > 0 &&
        mobile?.projectProcess[0]?.length > 0
      ){
        setProjectState(true)
      }else{
        setProjectState(false)
      }
    }
  },[mobile])

  return (
    <>
      <div className="mobile-bottom">
        <div className="bottom-btn flex items-center gap-2 ">
          <button className="btn btn-outline-primary w-36" onClick={prevPage}>戻る</button>
          {
            mobile.progress !== 15 ? (
              mobile.progress === 13 ?
              !isProjectState ?
                <button className="btn btn-primary w-full full-button" onClick={skipPage}>건너뛰기</button> :
                <button className="btn btn-primary w-full full-button" onClick={nextPage}>決定して次へ</button> :
              <button className="btn btn-primary w-full full-button" onClick={nextPage}>決定して次へ</button>
            ) : (
              <button className="btn btn-primary w-full full-button" onClick={handleSubmit}>이력서 등록</button>
            )
          }
        </div>
      </div>
    </>
  );
};
export default MobileBottom2;
