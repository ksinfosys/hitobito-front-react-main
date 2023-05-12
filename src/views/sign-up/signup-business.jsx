import { useState, useEffect, useRef } from "react";
import { } from "@/base-components";
import { Link, useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { Modal, ModalBody } from "@/base-components";

import CameraPhoto from "@/assets/images/camera.png";
import SelectArrow from "@/assets/images/select-arrow.svg";
import checkIcon from "@/assets/images/check-icon.svg";
import attachIcon from "@/assets/images/attach-icon.svg";
import blacksmallX from "@/assets/images/black-small-x.svg";
import Download from "@/assets/images/download-icon.svg";
import Xbutton from "@/assets/images/x_button.svg";
// ServiceFetch
import axios from "axios";
import { regexUserPoint } from "../../utils/utils";


function SignUpBusiness() {

  // navigate
  const navigate = useNavigate();

  // 모달
  const [modal01, setModal01] = useState(false);
  const [modal02, setModal02] = useState(false);
  const [modal03, setModal03] = useState(false);
  const [modal04, setModal04] = useState(false);
  const [modal05, setModal05] = useState(false);
  const [modal06, setModal06] = useState(false);
  const [modal07, setModal07] = useState(false);
  const [modal08, setModal08] = useState(false);
  const [modal09, setModal09] = useState(false);
  const [modal10, setModal10] = useState(false);
  const [modal11, setModal11] = useState(false);
  const [modal12, setModal12] = useState(false);
  const [modal13, setModal13] = useState(false);
  const [modal14, setModal14] = useState(false);
  const [modal15, setModal15] = useState(false);
  const [modal16, setModal16] = useState(false);

  const [emailCodeNull, setEmailCodeNull] = useState(false);
  const [emailCheckModal, setEmailCheckModal] = useState(false);

  /* S: 유효성 검사 모달 상태 */
  // 기업명
  const [regCompanyName, setRegCompanyName] = useState(false);
  // 회사 홈페이지
  const [regUrl, setRegUrl] = useState(false);
  // 연락처, 사원수
  const [regNumber, setRegNumber] = useState(false);
  // 매출 
  const [regPrice, setRegPrice] = useState(false);
  // 파일 형식 안맞음
  const [regFile, setRegFile] = useState(false);
  // 이메일 변경 완료 모달
  const [emailComplete, setEmailComplete] = useState(false);
  // 이메일 빈 문자열
  const [emailNull, setEmaillNull] = useState(false);
  // 이메일 형식
  const [emailTest, setEmailTest] = useState(false);
  // 이메일 disabled flag
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);
  // 인증코드 disabled flag
  const [isCodeComplete, setIsCodeComplete] = useState(false);
  // 인증코드 fail modal
  const [isCodeFail, setIsCodeFail] = useState(false);
  /* E: 유효성 검사 모달 상태 */

  // 누락항목 체크
  const [modal17, setModal17] = useState(false);
  const [errorType, setErrorType] = useState("");

  // 인증관련 부분
  const [checkState01, setCheckState01] = useState(false);
  const [checkState02, setCheckState02] = useState(false);

  // 폼 셀렉트 박스에 들어갈 데이터들
  const [businessTypeList, setBusinessTypeList] = useState([]);
  const [headOfficeRegionList, setHeadOfficeRegionList] = useState([]);
  const [paymentMethodList, setPaymentMethodList] = useState([]);
  // 아이디
  const [cpLoginId, setCpLoginId] = useState("");
  const cpLoginIdRef = useRef(null);
  // 비밀번호
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);
  // 비밀번호 확인
  const [confirmPassword, setConfirmPassword] = useState("");
  const confirmPasswordRef = useRef(null);
  // 기업명
  const [cpUserName, setCpUserName] = useState("");
  const cpUserNameRef = useRef(null);
  // 企業名（カタカナ）
  const [cpUserKana, setCpUserKana] = useState("");
  const cpUserKanaRef = useRef(null);
  // 업종
  const [businessType, setBusinessType] = useState("");
  const businessTypeRef = useRef(null);
  // 본사 소재지
  const [headOfficeRegion, setHeadOfficeRegion] = useState("");
  const headOfficeRegionRef = useRef(null);
  // 담당자 이메일
  const [cpEmail, setCpEmail] = useState("");
  const cpEmailRef = useRef(null);
  // 인증 코드
  const [authCode, setAuthCode] = useState("");
  const authCodeRef = useRef(null);
  // 담당자 연락처
  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneNumberRef = useRef(null);
  // 회사 홈페이지
  const [homepage, setHomepage] = useState("");
  const homepageRef = useRef(null);
  // 지불 방법
  const [paymentMethod, setPaymentMethod] = useState("");
  const paymentMethodRef = useRef(null);
  // 사원수
  const [empCount, setEmpCount] = useState("");
  const empCountRef = useRef(null);
  // 매출
  const [salesAmount, setSalesAmount] = useState("");
  const salesAmountRef = useRef(null);
  // 회사 구인공고
  const [cpAd, setCpAd] = useState("");
  const cpAdRef = useRef(null);

  // 데이터베이스 조회 문제
  const [dBFail, setDBFail] = useState(false);
  // 중복검사 실패
  const [duplicateFail, setDuplicateFail] = useState(false);
  // 회원등록 실패
  const [modifyFail, setModifyFail] = useState(false);
  // 첨부파일 넘기는 실패
  const [documentFileFail, setDocumentFileFail] = useState(false);
  // 회사이미지 넘기는 실패
  const [imageFileFail, setImageFileFail] = useState(false);

  // 파일 관련 state
  const [documentFile, setDocumentFile] = useState([]);
  const [rsDocumentFile, setRsDocumentFile] = useState([]);

  // 회사이미지 관련 state
  const [image, setImage] = useState([]);
  const [rsFileImage, setRsFileImage] = useState([]);


  // 회사 로고 관련 state
  const [logoImage, setLogoImage] = useState([]);
  const [rsLogoFilePhoto, setRsLogoFilePhoto] = useState([]);

  // empty flag
  const [emptyFlag, setEmptyFlag] = useState(false);

  // 메일 전송상태
  const [isSending, setIsSending] = useState(false);

  // 이메일 인증 완료
  const [emailcodeDone, setEmailCodeDone] = useState(false);

  // 연락처
  const [regPhone, setRegPhone] = useState(false);

  // 비밀번호 유효성 검사
  const handleChange = () => {
    const confirm = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
    confirm.test(password) ? setPassword(password) : (setModal04(true), passwordRef.current.focus());
  }
  // 비밀번호 재확인
  const handleCheckPassword = () => {
    password !== confirmPassword && (setModal10(true), confirmPasswordRef.current.focus());
  }

  // 현재 비밀번호
  const [pwFlag, setPwFlag] = useState(false)
  // 확인 비밀번호
  const [checkFlag, setCheckFlag] = useState(false)

  // 아이디 검사
  const handleCheckId = () => {
    const idCheck = /^[a-zA-Z0-9]{1,20}$/;
    idCheck.test(cpLoginId) ?
      axios({
        url: "/api/join/duplication",
        data: {
          cpLoginId: cpLoginId,
        },
        method: "post",
      }).then((res) => {
        console.log(res)
        res.data.resultCode === '206' ? (
          setModal02(true)
        ) : (
          setModal03(true),
          setCheckState02(true)
        )
      }).catch((e) => {
        console.log(e);
      }) : setModal01(true);
  }

  // 이메일 검사(인증번호 전송)
  const handleCheckEmail01 = () => {
    if (isSending) return; // 전송중인 경우 중복 방지
    setIsSending(true)
    // 이메일 형식 검사
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (cpEmail === '') {
      setEmaillNull(true)
    } else if (!emailRegex.test(cpEmail)) {
      setEmailTest(true)
    } else {
      axios({
        url: "/api/join/auth/code",
        data: {
          cpEmail: cpEmail,
        },
        method: "post",
      }).then((res) => {
        console.log(res)
        res.data.resultCode === '200' ? (() => {
          setIsEmailDisabled(true)
          setModal09(true)
        })() : (() => {
          switch (res.data.resultCode) {
            case "204":
              setModal16(true)
              break;
            default:
              setModal05(true)
          }
        })()
      }).finally(() => {
        setIsSending(false);
      })
    }
  }

  // 이메일 인증번호 체크
  const handleCheckEmail02 = () => {
    axios({
      url: "/api/join/auth/check",
      data: {
        cpEmail: cpEmail,
        authCode: authCode
      },
      method: "put",
    }).then((res) => {
      console.log(res)
      res.data.resultCode === '200' ? (setModal07(true), setCheckState01(true)) :
        res.data.resultCode === '103' ? setModal08(true) :
          res.data.resultCode === '101' ? setModal06(true) :
            res.data.resultCode === '225' ? setEmailCodeNull(true) : setEmailCheckModal(true);
    }).catch((e) => {
      console.log(e);
    })
  }

  // 휴대폰 번호 체크
  const handlePhoneCheck = () => {
    const confirm = /^[0-9]+$/;
    !confirm.test(phoneNumber) && setModal11(true);
  }

  // 파일첨부
  const handleFileChange = async (e, index) => {
    const file = e.target.files

    if (documentFile.length + file.length > 2) {
      // alert('2개 이하의 이미지만 업로드 해주시기 바랍니다.')
      setDocumentFileFail(true)
      return false
    }
    for (let i = 0; i < file.length; i++) {
      const reader = new FileReader()
      reader.readAsDataURL(file[i])
      reader.onload = (res) => setDocumentFile(prevState => [...prevState, res.target.result])
      setRsDocumentFile(prev => [...prev, file[i]]);
    }
  }
  const handleFileDelete = (i) => {
    const newImages = [...documentFile];
    const tempForm = [...rsDocumentFile]
    newImages.splice(0, 1);
    tempForm.splice(0, 1)
    setDocumentFile(newImages);
    setRsDocumentFile([...tempForm])
  }


  // 회사 이미지 업로드
  const handleChangeImage = async (e, index) => {
    const file = e.target.files

    if (image.length + file.length > 5) {
      // alert('10개 이하의 이미지만 업로드 해주시기 바랍니다.')
      setImageFileFail(true);
      return false
    }
    // console.log(image.length)

    // console.log(file, index)

    for (let i = 0; i < file.length; i++) {
      const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
      if (!allowedExtensions.exec(file[i].name)) {
        setRegFile(true)
        return false;
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file[i])
        reader.onload = (res) => setImage(prevState => [...prevState, res.target.result])
        setRsFileImage(prevItem => [...prevItem, file[i]])
      }
    }

  };
  const handleDeleteImage = (index) => {
    const newImages = [...image];
    const tempForm = [...rsFileImage]
    newImages.splice(index, 1);
    tempForm.splice(index, 1)
    setImage(newImages);
    setRsFileImage([...tempForm])
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

  // 회사로고 등록
  const handleChangeLogo = async (e, index) => {
    const file = e.target.files
    if (file.length !== 1) {
      alert('1つの画像だけアップロードしてください。')
      return false
    }

    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(file[0].name)) {
      setRegFile(true)
      return false;
    } else {
      setLogoImage([])
      setRsLogoFilePhoto([])
      const reader = new FileReader()
      reader.readAsDataURL(file[0])
      reader.onload = (res) => setLogoImage(prevState => [...prevState, res.target.result])
      setRsLogoFilePhoto(file[0])
    }
  };
  const handleDeleteLogo = (index) => {
    setLogoImage([])
    setRsLogoFilePhoto([])
  };

  // 얼럿창 띄우기
  const alertHandler = prop => {
    console.log(prop)
    switch (prop) {
      case "cpLoginId":
        setErrorType("아이디");
        setModal17(true);
        cpLoginIdRef.current.focus();
        break;
      case "password":
        setErrorType("패스워드");
        setModal17(true);
        passwordRef.current.focus();
        break;
      case "cpEmail":
        setErrorType("이메일");
        setModal17(true);
        cpEmailRef.current.focus();
        break;
      case "cpUserName":
        setErrorType("기업명");
        setModal17(true);
        cpUserNameRef.current.focus();
        break;
      case "cpUserKana":
        setErrorType("기업명(카타카나)");
        setModal17(true);
        cpUserKanaRef.current.focus();
        break;
      case "headOfficeRegion":
        setErrorType("본사주소");
        setModal17(true);
        headOfficeRegionRef.current.focus();
        break;
      case "homepage":
        setErrorType("홈페이지");
        setModal17(true);
        homepageRef.current.focus();
        break;
      case "phoneNumber":
        setErrorType("연락처");
        setModal17(true)
        phoneNumberRef.current.focus();
        break;
      case "paymentMethod":
        setErrorType("지불방법");
        setModal17(true);
        paymentMethodRef.current.focus();
        break;
    }
  };
  // 필수값 체크
  const validateUpdateData = data => {
    // 가타가나 체크
    const pattern = /[^\u3040-\u309F\u30A0-\u30FF]/;
    if (pattern.test(data.cpUserKana)) {
      setRegCompanyName(true)
      cpUserKanaRef.current.focus();
      return
    }

    // url형식 체크
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;
    if (!urlRegex.test(data.homepage)) {
      urlRef.current.focus()
      return
    }

    // 담당자 연락처 (숫자 이외의 것테스트)
    const phonePattern = /^\d{2,3}-\d{4}-\d{4}$/; // 숫자와 하이픈으로 구성된 정규식 
    if (!phonePattern.test(data.phoneNumber)) {
      setRegPhone(true);
      console.log(phoneNumberRef)
      phoneNumberRef.current.focus();
      return;
    }

    // // 사원수,매출 유효성 검사
    const numberPattern = /^[\d,\s]*$/;

    if (!numberPattern.test(data.empCount)) {
      setRegPrice(true);
      empCountRef.current.focus()
      return;
    }

    if (!numberPattern.test(data.salesAmount)) {
      setRegPrice(true);
      salesAmountRef.current.focus()
      return;
    }

    const requiredProps = [
      "cpLoginId",
      "password",
      "cpUserName",
      "cpUserKana",
      "cpEmail",
      "headOfficeRegion",
      "phoneNumber",
      "paymentMethod",
      "homepage",
    ];

    let valid = true;

    for (const prop of requiredProps) {
      if (data.hasOwnProperty(prop)) {
        if (data[prop] === null || data[prop] === "") {
          alertHandler(prop);
          valid = false;
        }
      }
    }
    return valid;
  };

  // S: 유효성검사 

  // 기업명에 가타가나 확인
  const checkKatakana = (e) => {
    const inputValue = e.target.value;
    const pattern = /[^\u3040-\u309F\u30A0-\u30FF]/;

    if (pattern.test(inputValue)) {
      setRegCompanyName(true);
    }
  }

  // url형식 확인
  const checkUrl = (e) => {
    const url = e.target.value;
    console.log(url)
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;

    if (!urlRegex.test(url)) {
      setRegUrl(true);
      homepageRef.current.focus()
      return
    }
  }

  // 담당자 연락처 (숫자 이외의 것테스트)
  const checkNumber = (e) => {
    const inputValue = e.target.value;
    const pattern = /^\d{2,3}-\d{4}-\d{4}$/; // 숫자와 하이픈으로 구성된 정규식

    if (!pattern.test(inputValue)) {
      setRegPhone(true);
      phoneNumberRef.current.focus();
    }
  }

  // 사원수 유효성 검사
  const checkEmp = (e) => {
    const inputValue = e.target.value;
    const pattern = /^[\d,\s]*$/;

    if (!pattern.test(inputValue)) {
      setRegPrice(true);
      empCountRef.current.focus()
    }
  }


  // 매출 유효성 검사
  const checkPrice = (e) => {
    const inputValue = e.target.value;
    const pattern = /^[\d,\s]*$/;

    if (!pattern.test(inputValue)) {
      setRegPrice(true);
      salesAmountRef.current.focus()
    }
  }

  // E: 유효성검사
  useEffect(() => {
    let validArr = {
      cpLoginId,
      password,
      cpEmail,
      cpUserName,
      cpUserKana,
      headOfficeRegion,
      homepage,
      phoneNumber,
      paymentMethod,
      // empCount,
      // salesAmount
    }
    const isAnyValueEmpty = Object.values(validArr).some(value => value === "");

    if (isAnyValueEmpty) {
      setEmptyFlag(true)
    } else {
      setEmptyFlag(false)
    }
  }, [cpLoginId,
    password,
    cpEmail,
    cpUserName,
    cpUserKana,
    headOfficeRegion,
    homepage,
    phoneNumber,
    paymentMethod,
    // empCount,
    // salesAmount,
  ])
  // 회원가입
  const handleSignUp = async () => {
    const updateData = {
      cpLoginId: cpLoginId,
      password: password,
      cpEmail: cpEmail,
      cpUserName: cpUserName,
      cpUserKana: cpUserKana,
      headOfficeRegion: headOfficeRegion,
      homepage: homepage,
      phoneNumber: phoneNumber,
      paymentMethod: paymentMethod,
      cpAd: cpAd,
      empCount: empCount,
      salesAmount: salesAmount,
    };

    const formData = new FormData()
    const blob = new Blob([JSON.stringify(updateData)], { type: 'application/json' });

    await formData.append('request', blob);

    rsFileImage.length > 0 ? rsFileImage.map(item => formData.append('file', item)) : formData.append('file', new File([], 'photo.jpg'))
    rsLogoFilePhoto.length == 0 ? formData.append('logoFile', new File([], 'photo.jpg')) : formData.append('logoFile', rsLogoFilePhoto)
    rsDocumentFile.length > 0 ? rsDocumentFile.map(item => formData.append('documentfile', item)) : formData.append('documentfile', new File([], 'document.pdf'))

    //서버로 보내기
    if (validateUpdateData(updateData)) {
      const confirm = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/;
      !checkState02 ? setModal15(true) :
        !checkState01 ? setModal14(true) :
          password !== confirmPassword ? setModal10(true) :
            !confirm.test(password) ? setModal04(true) :
              !confirm.test(confirmPassword) ? setModal04(true) :
                axios.post('/api/join/signup',
                  formData,
                  {
                    headers: {
                      'Content-Type': 'multipart/form-data;',
                    },
                  }).then(response => {
                    // console.log(response)
                    const { data: { result } } = response;
                    response.data.resultCode === "200" ? (() => {
                      // setAuthCompleteFlag(true)
                      console.log(response)
                      setModal13(true);
                    })() : (() => {
                      console.log(response)
                      switch (response.data.resultCode) {
                        case "222":
                          setDBFail(true);
                          break;
                        case "206":
                          setDuplicateFail(true);
                          break;
                        case "210":
                          setModifyFail(true);
                          break;
                        case "225":
                          setModal12(true);
                          break;
                        default:
                          break;
                      }
                    })();
                  })
    }
  }

  // 연락처 하이픈 추가
  const handlePhone = (e) => {
    let newValue = e.target.value;
    newValue = newValue.replace(/-/g, ''); // 입력값에서 하이픈 제거

    e.target.value = newValue.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{4})(\d{4})$/, `$1-$2-$3`);
    
    setPhoneNumber(e.target.value);

  };




  // 방 진입 시 데이터 가져오기
  useEffect(() => {
    axios({
      url: "/api/join/form",
      method: "get",
    }).then((res) => {
      console.log(res)
      setBusinessTypeList(res.data.result.businessTypeList);
      setHeadOfficeRegionList(res.data.result.headOfficeRegionList);
      setPaymentMethodList(res.data.result.paymentMethodList);
    }).catch((e) => {
      console.log(e);
    });
  }, []);

  return (
    <>
      <div id="business" className="sign-up-business">
        <div className="box-type-default p-10">
          <div className="text-2xl font-bold text-center mb-5">
            企業 会員加入
          </div>
          <div className="resume-regist-cont">
            <div className="form-flex-box flex space-between items-start">
              <div className="box-item flex flex-col">
                <div>
                  <div className="form-tit">ID <span>*</span></div>
                  <div className="flex gap-2">
                    <input ref={cpLoginIdRef} type="text" className="form-control" placeholder="ID入力（半角英数字大文字を許容）" onChange={(e) => setCpLoginId(e.target.value)} />
                    <div className="form-check form-switch flex gap-2">
                      <button className="btn btn-sm btn-business w-28 font-14" onClick={handleCheckId}>重複チェック</button>
                    </div>
                  </div>
                </div>
                <div className="form-tit">パスワード <span>*</span></div>
                <div className="pwd-eye-wrap">
                  <input
                    ref={passwordRef}
                    type={pwFlag ? "text" : "password"}
                    className="form-control"
                    placeholder="英文・数字・特殊記号で組み合わせ8~16字で入力"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="eye-btn" onClick={() => {
                    setPwFlag(prev => !prev)
                  }}>
                    {
                      pwFlag === true ? <img src="/images/eye-open.svg" alt="" /> : <img src="/images/eye-close.svg" alt="" />
                    }
                  </button>
                </div>
                <div className="form-tit">パスワード確認<span>*</span></div>
                <div className="pwd-eye-wrap">
                  <input
                    ref={confirmPasswordRef}
                    type={checkFlag ? "text" : "password"}
                    className="form-control"
                    placeholder="パスワード再入力"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button className="eye-btn" onClick={() => {
                    setCheckFlag(prev => !prev)
                  }}>
                    {
                      checkFlag === true ? <img src="/images/eye-open.svg" alt="" /> : <img src="/images/eye-close.svg" alt="" />
                    }
                  </button>
                </div>
                <div className="form-tit">企業名 <span>*</span></div>
                <input ref={cpUserNameRef} type="text" className="form-control" maxLength={50} placeholder="企業名入力" onChange={(e) => setCpUserName(e.target.value)} />

                <div className="form-tit">企業名（カタカナ） <span>*</span></div>
                <input ref={cpUserKanaRef} type="text" className="form-control" maxLength={50} placeholder="企業名入力" onChange={(e) => setCpUserKana(e.target.value)} onBlur={checkKatakana} />
                <div className="flex flex-col gap-2">
                  {/* <select ref={businessTypeRef} className="form-select" onChange={(e) => setBusinessType(e.target.value)}> */}
                  <select ref={businessTypeRef} className="form-select" onChange={(e) => setBusinessType(10101)} disabled>
                    {
                      businessTypeList?.length > 0 && businessTypeList.map((type) => {
                        // return <option value={type.code} key={type.code} disabled={type.code !== '10101' ? true : false}>{type.codeName}</option>
                        if (type.code === '10101') {
                          return (
                            <option value={type.code} key={type.code} selected>{type.codeName}</option>
                          )
                        }
                      })
                    }
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="form-tit">本社<span>*</span></div>
                  <select name="" id="" className="form-select" onChange={(e) => setHeadOfficeRegion(e.target.value)}>
                    {/* <option value="">本社所在地</option> */}
                    <option value="">選択してください。</option>
                    {
                      headOfficeRegionList?.length > 0 && headOfficeRegionList.map((item) => {
                        return <option value={item.code} key={item.code}>{item.codeName}</option>
                      })
                    }
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="form-tit">担当者のメールアドレス<span>*</span></div>
                  <div className="flex items-center gap-2">
                    <input type="text" className="form-control" maxLength={30} placeholder="メールアドレス入力" disabled={isEmailDisabled} onChange={(e) => setCpEmail(e.target.value)} />
                    <div className="form-check form-switch flex gap-2">
                      <button className="btn btn-sm btn-business w-28 font-14" onClick={() => {
                        if (isCodeComplete) {
                          setEmailCodeDone(true)
                          return
                        } else if (isEmailDisabled) {
                          return
                        } else {
                          handleCheckEmail01()
                        }
                      }}>認証コード発行</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="text" className="form-control" maxLength={6} placeholder="認証コード確認" disabled={isCodeComplete} onChange={(e) => setAuthCode(e.target.value)} />
                    <div className="form-check form-switch flex gap-2">
                      <button className="btn btn-sm btn-business-white w-28 font-14" onClick={() => {
                        if (authCode.length == 0) {
                          setEmailCodeNull(true)
                        } else if (isCodeComplete) {
                          setEmailCodeDone(true)
                          return
                        } else {
                          handleCheckEmail02()
                        }
                      }}>確認</button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="form-tit">担当者の連絡先 <span>*</span></div>
                  <input ref={phoneNumberRef} type="text" className="form-control" maxLength={13} placeholder="'-なしで数字だけ入力してください。（例：12345678)" onChange={(e) => {
                    if (e.target.value.length >= 3) {
                      handlePhone(e)
                    } else {
                      setPhoneNumber(e.target.value)
                    }
                  }} onBlur={checkNumber} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="form-tit">企業ホームページ <span>*</span></div>
                  <input ref={homepageRef} type="text" className="form-control" maxLength={50} placeholder="企業ホームページ入力" onChange={(e) => setHomepage(e.target.value)} onBlur={checkUrl} />
                </div>
                <div className="form-tit">支払い方法 <span>*</span></div>
                <select name="" id="" className="form-select" onChange={(e) => setPaymentMethod(e.target.value)}>
                  {/* <option value="">支払い方法</option> */}
                  <option value="">選択してください。</option>
                  {
                    paymentMethodList?.length > 0 && paymentMethodList.map((item) => {
                      return <option value={item.code} key={item.code}>{item.codeName}</option>
                    })
                  }
                </select>
                <div className="flex items-center gap-2">
                  <div className="box-item flex flex-col">
                    <div className="form-tit">
                      社員数
                      {/* 사원수 <span>*</span> */}
                    </div>
                    <input type="text" className="form-control" maxLength={10} placeholder="社員数入力" onChange={(e) => setEmpCount(e.target.value)} onBlur={checkEmp} />
                  </div>
                  <div className="box-item flex flex-col">
                    <div className="form-tit">
                      売上高
                      {/* 매출 <span>*</span> */}
                    </div>
                    <input type="text" className="form-control" maxLength={20} placeholder="売上高" onChange={(e) => {
                      if (e.currentTarget.value.length > 20) {
                        alert("입력내용이 너무 많습니다.");
                      } else {
                        const inputValue = e.target.value;
                        const commaSeparatedValue = regexUserPoint(inputValue.replace(/,/g, ""));
                        e.target.value = commaSeparatedValue;

                        setSalesAmount(e.target.value)
                      }
                    }}
                      onBlur={checkPrice}
                    />
                  </div>
                </div>
              </div>

              <div className="box-item">
                <div className="flex flex-col">
                  <div className="form-tit">求人情報</div>
                  <textarea
                    className="form-control mt-2 w-full h-32 resize-none"
                    rows="1"
                    maxLength={3000}
                    placeholder="求人広告入力"
                    onChange={(e) => setCpAd(e.target.value)}
                  ></textarea>
                </div>
                {/* 파일첨부 */}
                <div className="attach-wrap flex">
                  <label htmlFor="file01" className="attach-tit-wrap mt-3 flex items-center gap-2">
                    <div className="attach-tit">
                      ファイル添付
                    </div>
                    <div className="attach-icon">
                      <img src={attachIcon} alt="" />
                    </div>
                    <input type="file" name="file01" id="file01" multiple onChange={(e) => handleFileChange(e)} />
                  </label>
                  <div className="flex flex-col attach-cont-wrap">
                    {
                      rsDocumentFile?.length > 0 && rsDocumentFile.map((file, index) => {
                        // console.log(file)
                        return (
                          <div className="attach-cont-item flex items-center space-between" key={index}>
                            <div className="attach-cont-tit">
                              {file.name}
                            </div>
                            <button className="attach-cont-btn" onClick={() => handleFileDelete(index)}>
                              <img src={blacksmallX} alt="" />
                            </button>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
                {/* 회사 이미지 등록 시작 */}
                <div className="flex flex-col mt-4">
                  <div className="form-tit">
                    企業イメージ登録
                    {/* 회사 이미지 등록 <span>*</span> */}
                  </div>
                  {/* <img src={CameraPhoto} alt="" className="w-40" /> */}
                  <div className='flex gap-3'>
                    {/* {
                                        image.length === 0 ? previewItem : image.map((_, index) => (
                                          <div className='image_item bg-slate-50' key={index}>
                                            <input
                                              id={`profileImg${index}`}
                                              type={'file'}
                                              multiple
                                              onChange={(e) => handleChangeImage(e, index)}
                                            />
                                            <label className={'custom-input-label'} htmlFor={`profileImg${index}`}>
                                                <img src={image[index]} alt='' />
                                            </label>
                                            {image[index] && (
                                              <button onClick={() => handleDeleteImage(index)}>
                                                  <img src={Xbutton} alt='삭제' />
                                              </button>
                                            )}
                                          </div>
                                        ))
                                      } */}
                    {previewItem}
                  </div>
                  <div className="camera-subtit2">
                    * 最大5枚　JPG,PNG,GIF形式で登録可能です。
                  </div>
                </div>

                {/* 회사 이미지 등록 미리보기*/}
                <div className="flex flex-wrap image_item_list mt-4 gap-3">
                  {
                    image && image.map((item, idx) => {
                      return (
                        <div className="image_item02" key={idx}>
                          <input
                            type="file"
                            id="uploadImage"
                          />
                          <label className={'custom-input-label'} htmlFor={`uploadImage${idx}`}>
                            <img src={image[idx]} alt='' />
                          </label>
                          <button onClick={() => handleDeleteImage(idx)}>
                            <img src={Xbutton} alt='削除' />
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
                {/* 회사 이미지 등록 끝 */}

                {/* 회사 로고 등록 시작 */}
                <div className="flex flex-col mt-4">
                  <div className="form-tit">
                    企業ロゴ登録
                    {/* 회사 로고 등록 <span>*</span> */}
                  </div>
                  <div className='flex gap-3'>
                    {
                      logoImage.length === 0 ? (
                        <div className='image_item01'>
                          <input
                            id={`LogoImg0`}
                            type={'file'}
                            multiple
                            onChange={(e) => handleChangeLogo(e, 0)}
                          />
                          <label className={'custom-input-label'} htmlFor={`LogoImg0`}>
                            <img src={CameraPhoto} alt='' />
                          </label>
                        </div>
                      ) : logoImage.map((_, index) => (
                        <div className='image_item bg-slate-50' key={index}>
                          <input
                            id={`LogoImg${index}`}
                            type={'file'}
                            multiple
                            onChange={(e) => handleChangeLogo(e, index)}
                          />
                          <label className={'custom-input-label'} htmlFor={`LogoImg${index}`}>
                            <img src={logoImage[index]} alt='' />
                          </label>
                          {logoImage[index] && (
                            <button onClick={() => handleDeleteLogo(index)}>
                              <img src={Xbutton} alt='削除' />
                            </button>
                          )}
                        </div>
                      ))
                    }
                  </div>
                  <div className="camera-subtit2">
                    * JPG,PNG,GIF形式で登録可能です。
                  </div>
                </div>
                {/* 회사 로고 등록 끝 */}

                {/* <div className="flex flex-col mt-4">
                                    <div className="form-tit pb-3 border-b">이용규약</div>
                                    <div className="agree-text text-slate-300 p-2 border-b text-sm">
                                        HITOBITO 관리자에서 등록한 내용 출력<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                    </div>
                                    <div className="mt-1">
                                        <input id="disagree" className="form-check-input" type="checkbox" name="agree_button" />
                                        <label className="form-check-label text-sm" htmlFor="disagree">상기 이용규약에 동의합니다.</label>
                                    </div>

                                </div>
                                <div className="flex flex-col mt-4">
                                    <div className="form-tit pb-3 border-b">개인정보보호정책</div>
                                    <div className="agree-text text-slate-300 p-2 border-b text-sm">
                                        HITOBITO 관리자에서 등록한 내용 출력<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                        내용<br />
                                    </div>
                                    <div className="mt-1">
                                        <input id="disagree" className="form-check-input" type="checkbox" name="agree_button" />
                                        <label className="form-check-label text-sm" htmlFor="disagree">상기 이용규약에 동의합니다.</label>
                                    </div>
                                </div> */}
                <div className="mt-5">
                  <a href="https://hitobito-net.com/api/files/company_sample.pdf" className="flex items-center" target='_blank'>
                    <button className="btn btn-outline-primary flex items-center w-full">
                      <img src={Download} alt="" />
                      サンプル·ダウンロード
                    </button>
                  </a>
                </div>
              </div>

            </div>
            <div className="flex flex-center mt-5">
              <button
                // className="btn btn-pending w-80 h-48 mr-5"
                className={`btn w-80 h-48 mr-5 ${emptyFlag ? "btn-gray-business" : "btn-pending"}`}
                onClick={() => {
                  if (!emptyFlag) {
                    handleSignUp();
                  }
                }}
                type="button">登録</button>
              <button className="btn btn-outline-pending w-80 h-48" onClick={() => navigate("/")} type="button"> 取消</button>
            </div>
          </div>
        </div>
      </div>

      {/* 아이디 유효성 검사 */}
      <Modal
        backdrop="static"
        show={modal01}
        onHidden={() => { setModal01(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">ID確認</div>
          <div className="modal-subtit">
            ID入力は20字以内半角英数字大文字のみ許容します。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => setModal01(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>

      {/* 아이디 중복 검사 */}
      <Modal
        backdrop="static"
        show={modal02}
        onHidden={() => { setModal02(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">ID重複チェック</div>
          <div className="modal-subtit">
            IDが重複しています。<br />
            異なるIDを入力してください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => setModal02(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        backdrop="static"
        show={modal03}
        onHidden={() => { setModal03(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">ID重複チェック</div>
          <div className="modal-subtit">
            このIDは利用可能です
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => setModal03(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>

      {/* 비밀번호 유효성 검사 */}
      <Modal
        backdrop="static"
        show={modal04}
        onHidden={() => { setModal04(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">パスワード確認</div>
          <div className="modal-subtit">
            パスワードは英文・数字・特殊記号で組み合わせ8~16字で入力してください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => (setModal04(false), passwordRef.current.focus())}>확인</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        backdrop="static"
        show={modal10}
        onHidden={() => { setModal10(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">パスワード確認</div>
          <div className="modal-subtit">
            パスワードが一致していません。<br />
            パスワードを確認してください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => (setModal10(false), confirmPasswordRef.current.focus())}>確認</a>
          </div>
        </ModalBody>
      </Modal>

      {/* 이메일 검사 */}
      <Modal
        backdrop="static"
        show={modal05}
        onHidden={() => { setModal05(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">イーメール確認</div>
          <div className="modal-subtit">
            メールフォームに合わせて入力してください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => (setModal05(false), setIsSending(false))}>確認</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        backdrop="static"
        show={modal09}
        onHidden={() => { setModal09(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">認証メール送信完了</div>
          <div className="modal-subtit">
            認証コードを {cpEmail} に送りました。<br />
            メールを確認後、認証コードを入力してください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => setModal09(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        backdrop="static"
        show={modal16}
        onHidden={() => { setModal16(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">認証メール確認</div>
          <div className="modal-subtit">
            該当メールアドレスは既に登録されています。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => (setModal16(false), setIsSending(false))}>確認</a>
          </div>
        </ModalBody>
      </Modal>

      {/* 인증코드 검사 */}
      <Modal
        backdrop="static"
        show={modal06}
        onHidden={() => { setModal06(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">認証コード再入力</div>
          <div className="modal-subtit">
            認証コードが正しくありません<br />
            。もう一度入力してください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => (setModal06(false), setIsSending(false))}>確認</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        backdrop="static"
        show={modal07}
        onHidden={() => { setModal07(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">認証完了</div>
          <div className="modal-subtit">
            メール認証が完了しました
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => {
              setModal07(false)
              setIsCodeComplete(true)
            }}>確認</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        backdrop="static"
        show={modal08}
        onHidden={() => { setModal08(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">認証コード入力</div>
          <div className="modal-subtit">
            認証コードを入力してください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => setModal08(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>

      {/* 연락처 양식 확인 */}
      <Modal
        backdrop="static"
        show={modal11}
        onHidden={() => { setModal11(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">連絡先確認</div>
          <div className="modal-subtit">
            連絡先は '-なしで数字だけ入力してください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => setModal11(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>

      {/* 데이터베이스 조회 실패 문제 */}
      <Modal
        show={dBFail}
        onHidden={() => {
          setDBFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">入力情報に問題があります。</div>
          <div className="modal-subtit">
            入力内容を確認してください。
          </div>
          <div className="flex flex-end gap-3">
            <a

              className="btn btn-pending"
              onClick={() => {
                setDBFail(false);
              }}
            >
              確認/
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 아이디 등록 실패 문제 */}
      <Modal
        show={duplicateFail}
        onHidden={() => {
          setDuplicateFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">このIDは既に登録されています。</div>
          <div className="modal-subtit">
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setDuplicateFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 회원등록 실패 문제 */}
      <Modal
        show={modifyFail}
        onHidden={() => {
          setModifyFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">会員登録に失敗しました。</div>
          <div className="modal-subtit">
            もう一度試してください
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setModifyFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 첨부파일 실패 문제 */}
      <Modal
        show={documentFileFail}
        onHidden={() => {
          setDocumentFileFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">添付ファイルは2個を超えることはできません。</div>
          <div className="modal-subtit">
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setDocumentFileFail(false);
              }}
            >
              確認/
            </a>
          </div>
        </ModalBody>
      </Modal>


      {/* 회원 수정 실패 문제 */}
      <Modal
        show={imageFileFail}
        onHidden={() => {
          setImageFileFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">添付ファイルは5個を超えることはできません。</div>
          <div className="modal-subtit">
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setImageFileFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 연락처 양식 확인 */}
      <Modal
        backdrop="static"
        show={modal12}
        onHidden={() => { setModal12(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">"すべての情報を入力してください。"</div>
          <div className="modal-subtit"></div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => setModal12(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>

      {/* 회원가입 팝업*/}
      <Modal
        show={modal13}
        onHidden={() => {
          setModal13(false);
        }}
        naviSrc='/user-guide-business'
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">HITOBITOにようこそ！</div>
          <div className="modal-subtit">
            会員登録が完了しました。 ’確認’ボタンを押すとHITOBITOの<br />
            利用ガイドが表示されます。
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-primary"
              onClick={() => {
                setModal13(false);
                navigate("/user-guide-business")
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>


      {/* 인증관련 */}
      <Modal
        backdrop="static"
        show={modal14}
        onHidden={() => { setModal14(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">メール認証</div>
          <div className="modal-subtit">
            メールアドレスを認証してください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => setModal14(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        backdrop="static"
        show={modal15}
        onHidden={() => { setModal15(false); }}>
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">ID重複チェック</div>
          <div className="modal-subtit">
            ID重複チェックをしてください。
          </div>
          <div className="flex flex-end gap-3">
            <a className="btn btn-pending" onClick={() => setModal15(false)}>確認</a>
          </div>
        </ModalBody>
      </Modal>


      {/* 누락 항목 체크 */}
      <Modal
        show={modal17}
        onHidden={() => {
          setModal17(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">入力漏れがあります。</div>
          <div className="modal-subtit">
            {errorType} を入力してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setModal17(false);
                // window.location(reload)
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>



      {/* S: 유효성검사 상태 모달 */}

      {/* 기업명 */}
      <Modal
        show={regCompanyName}
        onHidden={() => {
          setRegCompanyName(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">入力した内容にカタカナ以外の文字が含まれています</div>
          <div className="modal-subtit">

          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setRegCompanyName(false);
                // window.location(reload)
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* URL */}
      <Modal
        show={regUrl}
        onHidden={() => {
          setRegUrl(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">有効なURLの形式ではありません。</div>
          <div className="modal-subtit">

          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setRegUrl(false);
                // window.location(reload)
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 연락처, 사원수*/}
      <Modal
        show={regNumber}
        onHidden={() => {
          setRegNumber(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">数字以外の文字が入力されています。</div>
          <div className="modal-subtit">

          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setRegNumber(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 매출 */}
      <Modal
        show={regPrice}
        onHidden={() => {
          setRegPrice(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">数字以外の文字が入力されています。</div>
          <div className="modal-subtit">

          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setRegPrice(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 파일형식 안맞음 */}
      <Modal
        show={regFile}
        onHidden={() => {
          setRegFile(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">JPG, PNG, GIF ファイルだけ登録できます。</div>
          <div className="modal-subtit">

          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setRegFile(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* E: 유효성검사 상태 모달 */}

      {/* 이메일 変更完了 */}
      <Modal
        show={emailComplete}
        onHidden={() => {
          setEmailComplete(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">メールの変更を完了しました。</div>
          <div className="modal-subtit">
            他の項目を変更したい場合は該当項目を修正した後、登録ボタンを押下してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setEmailComplete(false);
                window.location.reload();
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 이메일 빈 문자열 */}
      <Modal
        show={emailNull}
        onHidden={() => {
          setEmaillNull(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">メールを入力してください。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setEmaillNull(false);
                setIsSending(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 이메일 형식으로 입력해주세요. */}
      <Modal
        show={emailTest}
        onHidden={() => {
          setEmailTest(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">メール形式で入力してください。</div>
          <div className="modal-subtit">メール形式で入力してください。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setEmailTest(false);
                setIsSending(false)
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 인증코드 fail */}
      <Modal
        show={isCodeFail}
        onHidden={() => {
          setIsCodeFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">認証コード入力してください。</div>
          <div className="modal-subtit">認証コード入力してください。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setIsCodeFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>


      {/* 인증코드 fail */}
      <Modal
        show={emailCodeNull}
        onHidden={() => {
          setEmailCodeNull(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">すべての情報を入力してください。</div>
          <div className="modal-subtit">すべての情報を入力してください。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setEmailCodeNull(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 인증코드 fail */}
      <Modal
        show={emailCheckModal}
        onHidden={() => {
          setEmailCheckModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">もう一度ご確認お願いします。</div>
          <div className="modal-subtit">もう一度ご確認お願いします。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setEmailCheckModal(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>


      {/* 이메일 인증 완료 */}
      <Modal
        show={emailcodeDone}
        onHidden={() => {
          setEmailCodeDone(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">メール認証が完了しました</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setEmailCodeDone(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 연락처 */}
      <Modal
        show={regPhone}
        onHidden={() => {
          setRegPhone(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">（―）なしで入力してください。</div>
          <div className="modal-subtit">

          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setRegPhone(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

    </>
  );
}

export default SignUpBusiness;
