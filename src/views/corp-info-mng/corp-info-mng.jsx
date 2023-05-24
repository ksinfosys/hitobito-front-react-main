import { TomSelect, Modal, ModalBody, ModalFooter } from "@/base-components";
import { useEffect, useRef, useState } from "react";

import CameraPhoto from "@/assets/images/camera.png";
import attachIcon from "@/assets/images/attach-icon.svg";
import blacksmallX from "@/assets/images/black-small-x.svg";

import SelectBoxNew from "../../components/select-box-new/selectBoxNew";
import axios from "axios";
import { getCookie } from "../../utils/cookie";
import Xbutton from "@/assets/images/x_button.svg";
import { useNavigate } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userInfo } from "../../stores/user-info";
import { regexUserPoint } from "../../utils/utils";

const CorpInfoMng = () => {
  const [isActive, setIsActive] = useState(false);
  const [isActive2, setIsActive2] = useState(false);

  const [emailPop, setemailPop] = useState(false);

  // userInfo
  const [userInfoV, setUserInfoV] = useRecoilState(userInfo);

  const navigate = useNavigate();

  // 이메일 인증 모달
  const [emailTest, setEmailTest] = useState(false);
  // 이메일 빈값 체크
  const [nullEmail, setNullEmail] = useState(false);
  // 이메일 발송 완료
  const [sendEmailComplete, setSendEmailComplete] = useState(false);
  // 이메일 변경 완료 모달
  const [emailComplete, setEmailComplete] = useState(false);

  // 코드 빈값 체크
  const [nullCode, setNullCode] = useState(false);

  // 처리중 문제
  const [errorFail, setErrorFail] = useState(false);
  // 네트워크 문제
  const [networkFail, setNetworkFail] = useState(false);
  // 중복 문제
  const [duplicateFail, setDuplicateFail] = useState(false);

  // 인증 전체 완료
  const [authCompleteFlag, setAuthCompleteFlag] = useState(false);

  const [codeFail, setCodeFail] = useState(false);
  const [recodeFail, setRecodeFail] = useState(false);

  // 입력내용 문제
  const [regFail, setRegFail] = useState(false);
  // 회원 수정 실패 문제
  const [modifyFail, setModifyFail] = useState(false);
  // 첨부파일 넘기는 실패
  const [documentFileFail, setDocumentFileFail] = useState(false);
  // 회사이미지 넘기는 실패
  const [imageFileFail, setImageFileFail] = useState(false);

  const handleClick = () => {
    setIsActive(current => !current);
  };
  const handleClick2 = () => {
    setIsActive2(current => !current);
  };

  // 초기 api 결과물
  const [result, setResult] = useState({});
  // console.log(result);

  // update시에 넘겨줄 데이터
  const [updateData, setUpdateData] = useState({
    businessType: '101'
  });
  // console.log(updateData);

  // 이메일 인증
  const [authEmail, setAuthEmail] = useState("");
  // 인증 코드
  const [authCode, setAuthCode] = useState(0);

  // console.log(authCode);
  // 이메일 인증 발급중이면 disabled
  const [isDisabled, setIsDisabled] = useState(false);

  // 파일 관련 state
  const [documentFile, setDocumentFile] = useState([]);
  const [rsDocumentFile, setRsDocumentFile] = useState([]);

  // 회사이미지 관련 state
  const [image, setImage] = useState([]);
  const [rsFileImage, setRsFileImage] = useState([]);


  // 회사 로고 관련 state
  const [logoImage, setLogoImage] = useState();
  const [rsLogoFilePhoto, setRsLogoFilePhoto] = useState();

  /* S: 유효성 검사 모달 상태 */

  // 기업명
  const [regCompanyName, setRegCompanyName] = useState(false);

  // 회사 홈페이지
  const [regUrl, setRegUrl] = useState(false);

  // 연락처
  const [regPhone, setRegPhone] = useState(false);

  // 사원수
  const [regNumber, setRegNumber] = useState(false);

  // 매출
  const [regPrice, setRegPrice] = useState(false);

  // 파일 형식 안맞음
  const [regFile, setRegFile] = useState(false);

  /* E: 유효성 검사 모달 상태 */

  const [errorType, setErrorType] = useState(false);
  const [errorModal, setErrorModal] = useState(false)

  // 업종 기본 체크
  const [defaultType, setDefaultType] = useState({})
  // 본사 소재지 기본 체크
  const [defaultOffice, setDefaultOffice] = useState({})
  // 지불방법 기본 체크
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState({})

  // 이미지 등록한것있을때 flag, fetch해서 가져오는 회사이미지
  const [fetchImage, setFetchImage] = useState([])
  // 로고 등록한것있을때 flag, fetch해서 가져오는 로고
  const [fetchLogo, setFetchLogo] = useState()

  // 문서 등록한것있을때 flag, fetch해서 가져오는 문서
  const [fetchDocument, setFetchDocument] = useState([])

  // 메일 전송상태
  const [isSending, setIsSending] = useState(false);

  // empty flag
  const [emptyFlag, setEmptyFlag] = useState(false);


  // ref
  // 이메일
  const cpEmailRef = useRef(null);
  // 카타카나
  const cpUserKanaRef = useRef(null);
  // 담당자 연락처
  const phoneNumberRef = useRef(null);
  // 회사 홈페이지
  const urlRef = useRef(null);
  // 사원수
  const empCountRef = useRef(null);
  // 매출
  const salesAmountRef = useRef(null);

  const getBusinessUser = () => {
    axios
      .get("/api/join/modify", {
        withCredentials: true,
        headers: {
          accessToken: getCookie("accessToken"),
          lastLoginTime: getCookie("lastLoginTime"),
        },
      })
      .then(response => {
        const {
          data: { result },
        } = response;
        response.data.resultCode === "200"
          ? (() => {
            setResult(result);
            setUpdateData(result.joinList);

            // 배열에 맞는 값 찾기 (업종)
            const typeResult = result.businessTypeList.find(obj => {
              const codeSuffix = obj.code.slice(-3);
              return codeSuffix === result.joinList.businessType;
            });
            //console.log(typeResult)
            // setDefaultType(typeResult)
            setDefaultType({ code: '10101', codeName: 'IT/システム開発', categoryName: '業種' })

            // 본사 소재지
            const officeResult = result.headOfficeRegionList.find(obj => {
              const codeSuffix = obj.code;
              return codeSuffix === result.joinList.headOfficeRegion;
            });
            setDefaultOffice(officeResult)


            // 지불방법
            const paymentMethodResult = result.paymentMethodList.find(obj => {
              const codeSuffix = obj.code;
              return codeSuffix === result.joinList.paymentMethod;
            });
            setDefaultPaymentMethod(paymentMethodResult)

            // 파일 이미지
            if (result.imageFile !== null) {
              setFetchImage(result.imageFile.split(","))
            }

            // 회사 로고
            if (result.logoFile !== null) {
              setFetchLogo(result.logoFile)
            }

            // 파일첨부
            if (result.attahcedList !== null) {
              setFetchDocument(result.attahcedList)
            }

            // console.log(fetchImage)
            // if (result.imageFile.split(",") !== fetchImage) {
            // }

          })()
          : console.log("fetching error:::", response);
      });
  };

  // 이메일 유효성 검사
  const emailRegCheck = email => {
    // console.log(email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    return isValidEmail;
  };

  // 이메일 인증
  const getEmailCode = () => {
    if (isSending) return; // 전송중인 경우 중복 방지
    setIsSending(true)
    axios
      .post(
        "/api/join/modify/email/check",
        {
          cpEmail: authEmail,
        },
        {
          withCredentials: true,
          headers: {
            accessToken: getCookie("accessToken"),
            lastLoginTime: getCookie("lastLoginTime"),
          },
        }
      )
      .then(response => {
        // console.log(response);
        const {
          data: { result },
        } = response;
        response.data.resultCode === "200"
          ? (() => {
            setSendEmailComplete(true);
            setIsDisabled(true);
          })()
          : (() => {
            switch (response.data.resultCode) {
              case "102":
                setErrorFail(true);
                handleClick(true);
                break;
              case "902":
                setNetworkFail(true);
                handleClick(true);
                break;
              case "204":
                setDuplicateFail(true);
                handleClick(true);
                break;
              default:
                break;
            }
          })();
      })
      .finally(() => {
        setIsSending(false);
      })
  };

  // 이메일 최종 인증 완료
  const getEmailCheck = () => {
    axios
      .put(
        "/api/join/modify/email/check",
        {
          cpEmail: authEmail,
          check: authCode,
        },
        {
          withCredentials: true,
          headers: {
            accessToken: getCookie("accessToken"),
            lastLoginTime: getCookie("lastLoginTime"),
          },
        }
      )
      .then(response => {
        // console.log(response);
        const {
          data: { result },
        } = response;
        response.data.resultCode === "200"
          ? (() => {
            setEmailComplete(true)
            setemailPop(false)
          })()
          : (() => {
            switch (response.data.resultCode) {
              case "103":
                setNullCode(true);
                break;
              case "901":
                setCodeFail(true);
                break;
              case "101":
                setRecodeFail(true);
                break;
              default:
                break;
            }
          })();
      });
  };

  // 얼럿창 띄우기
  const alertHandler = prop => {
    switch (prop) {
      case "cpEmail":
        setErrorType("イーメール")
        setErrorModal(true)
        cpEmailRef.current.focus();
        break;
      case "cpUserName":
        setErrorType("企業名")
        setErrorModal(true)
        break;
      case "cpUserKana":
        setErrorType("企業名（カタカナ）")
        setErrorModal(true)
        cpUserKanaRef.current.focus();
        break;
      case "headOfficeRegion":
        setErrorType("本社住所")
        setErrorModal(true)
        break;
      case "homepage":
        setErrorType("ホームページ")
        setErrorModal(true)
        urlRef.current.focus();
        break;
      case "phoneNumber":
        setErrorType("担当者の連絡先")
        setErrorModal(true)
        phoneNumberRef.current.focus();
        break;
      case "paymentMethod":
        setErrorType("支払い方法")
        setErrorModal(true)
        break;
    }
  };
  // console.log(updateData)
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
      //console.log(phoneNumberRef)
      phoneNumberRef.current.focus();
      return;
    }

    // // 사원수,매출 유효성 검사
    const numberPattern = /^[\d,\s]*$/;
    const salesAmountPattern = /^[0-9]+(.)?[0-9]{1,2}$/;
    let checkSalesAmountPattern = data.salesAmount.replaceAll(",", "");
    if (!numberPattern.test(data.empCount)) {
      setRegPrice(true);
      empCountRef.current.focus()
      return;
    }

    if (!salesAmountPattern.test(checkSalesAmountPattern)) {
      setRegPrice(true);
      salesAmountRef.current.focus()
      return;
    }


    const requiredProps = [
      "cpEmail",
      "cpUserName",
      "cpUserKana",
      "headOfficeRegion",
      "homepage",
      "phoneNumber",
      "paymentMethod",
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


  // 파일첨부
  const handleFileChange = async (e, index) => {
    const file = e.target.files
    
    if (rsDocumentFile.length + file.length > 2) {
      setDocumentFileFail(true)
      return false
    } else {
      for (let i = 0; i < file.length; i++) {
        const reader = new FileReader()
        reader.readAsDataURL(file[i])
        reader.onload = (res) => setDocumentFile(prevState => [...prevState, res.target.result])
        setRsDocumentFile(prev => [...prev, file[i]]);
      }
    }
  }
  const handleFileDelete = (i) => {
    const newImages = [...documentFile];
    const tempForm = [...rsDocumentFile]
    newImages.splice(i, 1);
    tempForm.splice(i, 1)
    setDocumentFile(newImages);
    setRsDocumentFile([...tempForm])
  }


  // 회사 이미지 업로드
  const handleChangeImage = async (e, index) => {
    const file = e.target.files

    if (image.length + file.length > 5) {
      setImageFileFail(true);
      return false
    }

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
  const handleDeleteLogo = () => {
    setLogoImage()
    setRsLogoFilePhoto()
  };

  // 최종 업데이트
  const updateHandler = async () => {
    if (validateUpdateData(updateData)) {
      const formData = new FormData()
      const blob = new Blob([JSON.stringify(updateData)], { type: 'application/json' });

      await formData.append('request', blob);

      rsFileImage.length > 0 ? rsFileImage.map(item => formData.append('file', item)) : formData.append('file', new File([], 'photo.jpg'))
      rsLogoFilePhoto ? formData.append('logoFile', rsLogoFilePhoto) : formData.append('logoFile', new File([], 'photo.jpg'))
      rsDocumentFile.length > 0 ? rsDocumentFile.map(item => formData.append('documentfile', item)) : formData.append('documentfile', new File([], 'document.pdf'))

      //서버로 보내기
      axios.put('/api/join/update',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data;',
            accessToken: getCookie('accessToken').toString(),
            lastLoginTime: getCookie('lastLoginTime').toString()
          },
        }).then(response => {
          const {
            data: { result },
          } = response;
          response.data.resultCode === "200"
            ? (() => {
              setAuthCompleteFlag(true)
              setUserInfoV(prev => ({
                ...prev,
                cpUserName: updateData.cpUserName
              }))
            })()
            : (() => {
              switch (response.data.resultCode) {
                case "211":
                  setRegFail(true);
                  break;
                case "224":
                  setModifyFail(true);
                  break;
                default:
                  break;
              }
            })();
        })
    }
  };



  // S: 유효성검사

  // 기업명에 가타가나 확인
  const checkKatakana = (e) => {
    const inputValue = e.target.value;
    const pattern = /[^\u3040-\u309F\u30A0-\u30FF]/;

    if (pattern.test(inputValue)) {
      setRegCompanyName(true);
      cpUserKanaRef.current.focus();
    }
  }


  // url형식 확인
  const checkUrl = (e) => {
    const url = e.target.value;
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/;

    if (!urlRegex.test(url)) {
      setRegUrl(true);
      urlRef.current.focus();
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
    const pattern = /^[0-9]+(.)?[0-9]{1,2}$/;
    let checkValue = inputValue.replaceAll(",", "");
    
    if (!pattern.test(checkValue)) {
      setRegPrice(true);
      salesAmountRef.current.focus()
    }
  }



  // 연락처 하이픈 추가
  const handlePhone = (e) => {
    let newValue = e.target.value;
    newValue = newValue.replace(/-/g, ''); // 입력값에서 하이픈 제거

    e.target.value = newValue.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{4})(\d{4})$/, `$1-$2-$3`);
    
    setUpdateData({ ...updateData, phoneNumber: e.target.value})
  };


  // E: 유효성검사

  useEffect(() => {
    getBusinessUser();
  }, []);

  // 회사 이미지
  useEffect(() => {
    fetchImage?.map((img) => {
      axios.get('/api' + img, {
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
          
          setImage(prevState => {
            const uniqueImage = new Set(prevState)
            if (!uniqueImage.has(imageData)) {
              return [...uniqueImage, imageData]
            }
            return [...uniqueImage]
          })
        }
        if (rsFileImage.length <= image) {
          setRsFileImage(prev => [...prev, res.data])
        }
      })
    })
  }, [fetchImage])

  // 로고
  useEffect(() => {
    if (fetchLogo) {
      axios.get('/api' + fetchLogo, {
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
          
          setLogoImage(imageData)
        }
        setRsLogoFilePhoto(res.data)
      })
    }
  }, [fetchLogo])

  // 파일첨부
  useEffect(() => {

    setRsDocumentFile([])
    fetchDocument?.map((document) => {
      axios.get('/api' + document.cpFileIdx, {
        responseType: 'blob',
        headers: {
          accessToken: getCookie('accessToken').toString(),
          lastLoginTime: getCookie('lastLoginTime').toString()
        }
      }).then(res => {
        if (rsDocumentFile.length > 1) {
          return false
        } else {
          const file = new File([res.data], document.cpFileIdxName)
          setRsDocumentFile(prev => [...prev, file])
        }
      })
    })
  }, [fetchDocument])

  // 값 비어있는지 검사
  useEffect(() => {
    const requiredProps = [
      "cpEmail",
      "cpUserName",
      "cpUserKana",
      "headOfficeRegion",
      "homepage",
      "phoneNumber",
      "paymentMethod",
    ];

    const isAnyValueEmpty = requiredProps.some(value => value === "");

    if (isAnyValueEmpty) {
      setEmptyFlag(true)
    } else {
      setEmptyFlag(false)
    }
  }, [updateData])


  return (
    <>
      <div className="resume-mng">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-sm">
            企業情報管理
          </div>
          <div className="resume-regist-cont">
            <div className="form-flex-box flex space-between items-start">
              <div className="box-item flex flex-col">
                <div className="form-tit">
                  企業名 <span>*</span>
                </div>
                <input
                  id="regular-form-1"
                  type="text"
                  className="form-control"
                  placeholder="企業名入力"
                  maxLength={50}
                  defaultValue={userInfoV.cpUserName}
                  onChange={e => {
                    if (e.currentTarget.value.length > 200) {
                      alert("入力内容が多すぎます。");
                    } else if (e.currentTarget.value === '') {
                      setUpdateData({
                        ...updateData,
                        cpUserName: '',
                      });
                      // setEx(e.currentTarget.value)
                    } else {
                      setUpdateData({
                        ...updateData,
                        cpUserName: e.currentTarget.value,
                      });
                    }
                  }}
                />

                {/* 업종 */}
                {result.businessTypeList && (
                  <div className="flex flex-col gap-2">
                    <div className="form-tit">
                      業種 <span>*</span>
                    </div>
                    <select
                      className="form-select"
                      onChange={e => {
                        setUpdateData({
                          ...updateData,
                          businessType: e.currentTarget.value,
                        });
                      }}
                      disabled
                      defaultValue={defaultType.code}
                    >
                      {result.businessTypeList.map((option, idx) => {
                        if (option.code === '10101') {
                          return (
                            <option value={option.code} key={idx} selected>
                              {option.codeName}
                            </option>
                          )
                        }
                      })}
                    </select>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="form-tit">
                    担当者のメールアドレス <span>*</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      ref={cpEmailRef}
                      id="regular-form-1"
                      type="text"
                      className="form-control"
                      disabled
                      defaultValue={authCompleteFlag ? authEmail : result?.joinList?.cpEmail}
                    />
                    <div className="form-check form-switch flex gap-2">
                      <button
                        className="btn btn-sm btn-business w-28 font-16"
                        onClick={() => {
                          if (!authCompleteFlag) {
                            setemailPop(true);
                          }
                        }}
                      >
                        {
                          authCompleteFlag ? '認証完了' : '担当者変更'
                        }
                      </button>
                    </div>
                  </div>
                </div>

                {/* 회사 홈페이지 */}
                <div className="flex flex-col gap-2">
                  <div className="form-tit">
                    企業ホームページ
                    <span>*</span>
                  </div>
                  <input
                    ref={urlRef}
                    id="regular-form-1"
                    type="text"
                    className="form-control"
                    placeholder="企業ホームページ入力"
                    maxLength={50}
                    defaultValue={result?.joinList?.homepage}
                    onChange={e => {
                      if (e.currentTarget.value.length > 200) {
                        alert("入力内容が多すぎます。");
                      } else if (e.currentTarget.value === '') {
                        setUpdateData({
                          ...updateData,
                          homepage: '',
                        });
                        // setEx(e.currentTarget.value)
                      } else {
                        setUpdateData({
                          ...updateData,
                          homepage: e.currentTarget.value,
                        });
                      }
                    }}
                    onBlur={checkUrl}
                  />
                </div>

              </div>
              <div className="box-item flex flex-col">
                <div className="form-tit">
                  企業名（カタカナ） <span>*</span>
                </div>
                <input
                  ref={cpUserKanaRef}
                  id="regular-form-1"
                  type="text"
                  className="form-control"
                  placeholder="企業名（カタカナ） 入力"
                  maxLength={50}
                  defaultValue={result?.joinList?.cpUserKana}
                  onChange={e => {
                    if (e.currentTarget.value.length > 200) {
                      alert("入力内容が多すぎます。");
                    } else if (e.currentTarget.value === '') {
                      setUpdateData({
                        ...updateData,
                        cpUserKana: '',
                      });
                      // setEx(e.currentTarget.value)
                    } else {
                      setUpdateData({
                        ...updateData,
                        cpUserKana: e.currentTarget.value,
                      });
                    }
                  }}
                  onBlur={checkKatakana}
                />
                {/* 본사 소재지 */}
                {result.headOfficeRegionList && (
                  <div className="flex flex-col gap-2">
                    <div className="form-tit">
                      本社所在地 <span>*</span>
                    </div>
                    <select
                      className="form-select"
                      onChange={e => {
                        setUpdateData({
                          ...updateData,
                          headOfficeRegion: e.currentTarget.value,
                        });
                      }}
                      defaultValue={defaultOffice.code}
                    >
                      {/* <option value="000" disabled>本社所在地</option> */}
                      {result.headOfficeRegionList.map((option, idx) => (
                        <option value={option.code} key={idx}>
                          {option.codeName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {/* 연락처 */}
                <div className="flex flex-col gap-2">
                  <div className="form-tit">
                    担当者の連絡先 <span>*</span>
                  </div>
                  <input
                    ref={phoneNumberRef}
                    id="regular-form-1"
                    type="text"
                    className="form-control"
                    maxLength={13}
                    placeholder="-なしで数字だけ入力してください。（例：12345678)"
                    defaultValue={result?.joinList?.phoneNumber}
                    onChange={(e) => {
                      if (e.currentTarget.value.length >= 3) {
                        handlePhone(e)
                      } else {
                        setUpdateData({
                          ...updateData,
                          phoneNumber: e.currentTarget.value
                        })
                      }
                    }}
                    onBlur={checkNumber}
                  />
                </div>
                {/* 지불 방법 */}
                {result.paymentMethodList && (
                  <div className="flex flex-col gap-2">
                    <div className="form-tit">
                      支払い方法 <span>*</span>
                    </div>
                    <select
                      className="form-select"
                      onChange={e => {
                        setUpdateData({
                          ...updateData,
                          paymentMethod: e.currentTarget.value,
                        });
                      }}
                      defaultValue={defaultPaymentMethod.code}
                    >
                      {/* <option value="000" disabled>支払い方法</option> */}
                      {result.paymentMethodList.map((option, idx) => (
                        <option value={option.code} key={idx}>
                          {option.codeName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="box-item flex flex-col">
                    {/* 사원수 */}
                    <div className="form-tit">
                      社員数（名）
                      {/* 사원수 <span>*</span> */}
                    </div>
                    <input
                      ref={empCountRef}
                      id="regular-form-1"
                      type="text"
                      className="form-control"
                      placeholder="数字入力"
                      maxLength={10}
                      defaultValue={result?.joinList?.empCount}
                      onChange={e => {
                        if (e.currentTarget.value.length > 10) {
                          alert("入力内容が多すぎます。");
                        } else if (e.currentTarget.value === '') {
                          setUpdateData({
                            ...updateData,
                            empCount: '',
                          });
                          // setEx(e.currentTarget.value)
                        } else {
                          setUpdateData({
                            ...updateData,
                            empCount: e.currentTarget.value,
                          });
                        }
                      }}
                      onBlur={checkEmp}
                    />
                  </div>
                  <div className="box-item flex flex-col">
                    {/* 매출 */}
                    <div className="form-tit">
                      売上高（億円）
                      {/* 매출 <span>*</span> */}
                    </div>
                    <input
                      ref={salesAmountRef}
                      id="regular-form-1"
                      type="text"
                      className="form-control"
                      placeholder="数字、少数入力"
                      maxLength={20}
                      defaultValue={result?.joinList?.salesAmount && regexUserPoint(result?.joinList?.salesAmount)}
                      onChange={e => {
                        if (e.currentTarget.value.length > 20) {
                          alert("入力内容が多すぎます。");
                        } else if (e.currentTarget.value === '') {
                          setUpdateData({
                            ...updateData,
                            salesAmount: '',
                          });
                          // setEx(e.currentTarget.value)
                        } else {
                          const inputValue = e.target.value;
                          const commaSeparatedValue = regexUserPoint(inputValue.replace(/,/g, ""));
                          e.target.value = commaSeparatedValue;

                          setUpdateData({
                            ...updateData,
                            salesAmount: e.currentTarget.value,
                          });
                        }
                      }}
                      onBlur={checkPrice}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-flex-box">
              <div className="box-item w-full">
                <div className="flex flex-col">
                  <div className="form-tit">
                    求人情報(面談依頼時に、求職者に開示されます)
                  </div>
                  <textarea
                    className="form-control mt-2 w-full resize-none"
                    style={{ width: "665px" , wordWrap:"break-word", whiteSpace: "pre-wrap" }}
                    rows="1"
                    placeholder="求人公告入力"
                    maxLength={3000}
                    defaultValue={result?.joinList?.cpAd}
                    onChange={e => {
                      setUpdateData({
                        ...updateData,
                        cpAd: e.currentTarget.value,
                      });
                    }}
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
                    <input type="file" name="file01" id="file01" accept="pdf" multiple onChange={(e) => handleFileChange(e)} />
                  </label>
                  <div className="flex flex-col attach-cont-wrap">
                    {
                      rsDocumentFile?.length > 0 && rsDocumentFile.map((file, index) => {
                        return (
                          <div className="attach-cont-item flex items-center space-between" key={index}>
                            <div className="attach-cont-file">
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
                  <div className="camera-subtit2">
                    * 最大5枚　JPG,PNG,GIF形式で登録可能です。
                  </div>
                  {/* <img src={CameraPhoto} alt="" className="w-40" /> */}
                  <div className='flex gap-3 mt-4'>
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
                            accept="image/jpeg, image/png, image/gif"
                          />
                          <label className={'custom-input-label'} htmlFor={`uploadImage${idx}`}>
                            <img src={image[idx]} alt='' />
                          </label>
                          <button onClick={() => handleDeleteImage(idx)}>
                            <img src={Xbutton} alt='삭제' />
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
                  <div className="camera-subtit2">
                    * JPG,PNG,GIF形式で登録可能です。
                  </div>
                  <div className='flex gap-3 mt-4'>
                    {
                      !logoImage ? (
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
                      ) :
                        (
                          <div className='image_item bg-slate-50'>
                            <input
                              id={`LogoImg`}
                              type={'file'}
                              multiple
                              onChange={(e) => handleChangeLogo(e)}
                            />
                            <label className={'custom-input-label'} htmlFor={`LogoImg`}>
                              <img src={logoImage} alt='' />
                            </label>
                            {logoImage && (
                              <button onClick={handleDeleteLogo}>
                                <img src={Xbutton} alt='삭제' />
                              </button>
                            )}
                          </div>
                        )
                    }
                  </div>

                </div>
                {/* 회사 로고 등록 끝 */}
              </div>
            </div>
            <div className="flex flex-center mt-32">
              {/* 아이디 유효성검사 , 비밀번호 유효성검사 후 update api */}
              <button
                className={`btn w-380 h-48 ${emptyFlag ? "btn-gray-business" : "btn-business"}`}
                onClick={() => {
                  if (!emptyFlag) {
                    updateHandler();
                  }
                }}
              >
                {" "}
                登録
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* 인증코드 발급 */}
      <Modal backdrop="static"
        show={emailPop}
        onHidden={() => {
          setemailPop(false);
        }}
        className="email-modal"
      >
        <ModalBody className="p-10 text-center">
          <div className="email-modal-pop">
            <div className="email-modal-tit">新しい担当者のメールアドレス</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  id="regular-form-1"
                  type="text"
                  className="form-control h-48"
                  placeholder="新しいメールアドレス"
                  maxLength={30}
                  disabled={isDisabled ? true : false}
                  onChange={e => {
                    setAuthEmail(e.currentTarget.value);
                  }}
                />

                <div className="form-check form-switch flex gap-2">
                  <button
                    className={
                      isActive
                        ? "btn btn-sm btn-secondary w-28 font-14"
                        : "btn btn-sm btn-business w-28 font-14"
                    }
                    onClick={() => {
                      if (authEmail === "") {
                        // 이메일 빈값
                        setNullEmail(true);
                      } else if (emailRegCheck(authEmail)) {
                        handleClick();
                        getEmailCode();
                      } else {
                        // 이메일 형식 맞지 않음
                        setEmailTest(true);
                      }
                    }}
                    disabled={isDisabled}
                  >
                    認証コード送
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="regular-form-1"
                  type="text"
                  className="form-control h-48"
                  placeholder="認証コード入力"
                  maxLength="6"
                  onChange={e => {
                    setAuthCode(e.currentTarget.value);
                  }}
                />
                <div className="form-check form-switch flex gap-2">
                  {/* <button
                    className="btn btn-sm btn-business-white w-28 font-16"
                    onClick={() => {
                      // handleClick2();
                      if (authCode === 0) {
                        setNullCode(true);
                      } else {
                        getEmailCheck();
                      }
                    }}
                  > */}
                  <button
                    className={authCode === 0 
                      ?
                      "btn btn-sm btn-business-white w-28 font-14 disabled"
                      :
                      "btn btn-sm btn-business-white w-28 font-14"
                    }
                    onClick={() => {
                      // handleClick2();
                      if (authCode === 0) {
                        setNullCode(true);
                      } else {
                        getEmailCheck();
                      }
                    }}
                  >
                    変更
                  </button>
                </div>
              </div>
            </div>
            <div className="btn-wrap flex flex-end">
              {/* <button
                className={isActive2 ? "btn btn-secondary" : "btn btn-pending"}
                onClick={() => {
                  if (authCompleteFlag){
                    setemailPop(false);
                  } else {
                    alert('인증을 완료해주세요.')
                  }
                }}
              >
                인증완료
              </button> */}
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setemailPop(false);
                }}
              >
                キャンセル
              </button>
            </div>
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
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setEmailTest(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>
      {/* 이메일 형식으로 입력해주세요. */}
      <Modal
        show={nullEmail}
        onHidden={() => {
          setNullEmail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">新しいメールアドレスを入力してください。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setNullEmail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 처리중 문제 */}
      <Modal
        show={errorFail}
        onHidden={() => {
          setErrorFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">処理中に問題が発生しました。</div>
          <div className="modal-subtit">管理者にお問い合わせください。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setErrorFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 네트워크 문제 */}
      <Modal
        show={networkFail}
        onHidden={() => {
          setNetworkFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">ネットワーク障害が発生しました。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setNetworkFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 중복 문제 */}
      <Modal
        show={duplicateFail}
        onHidden={() => {
          setDuplicateFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">
            このメールアドレスは既に登録されています。
          </div>
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

      {/* 인증코드 없음 */}
      <Modal
        show={nullCode}
        onHidden={() => {
          setNullCode(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">認証コードを入力してください。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setNullCode(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 인증 실패 */}
      <Modal
        show={codeFail}
        onHidden={() => {
          setCodeFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">認証に失敗しました。</div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setCodeFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 인증 실패, 재발급후 시도 */}
      <Modal
        show={recodeFail}
        onHidden={() => {
          setRecodeFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">認証に失敗しました。</div>
          <div className="modal-subtit">
            認証コードを再発行してやり直してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setRecodeFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 입력내용문제 */}
      <Modal
        show={regFail}
        onHidden={() => {
          setRegFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">入力内容に問題がありました。</div>
          <div className="modal-subtit">
            画面をご確認ください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setRegFail(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 회원 수정 실패 문제 */}
      <Modal
        show={modifyFail}
        onHidden={() => {
          setModifyFail(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">会員修正に失敗しました。</div>
          <div className="modal-subtit">
            もう一度試してください。
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


      {/* 최종완료 */}
      <Modal
        show={authCompleteFlag}
        onHidden={() => {
          setAuthCompleteFlag(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">登録が完了しました。</div>
          <div className="modal-subtit">

          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setAuthCompleteFlag(false);
                window.location.replace("/business");
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


      {/* 연락처 */}
      <Modal
        show={regPhone}
        onHidden={() => {
          setRegPhone(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">'-なしで数字だけ入力してください。</div>
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

      {/* 사원수*/}
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
          <div className="modal-tit">入力形式を守ってください。（定数13文字、少数2文字）<br/>例）1,234.56</div>
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

      {/* 이메일 발송완료 */}
      <Modal
        show={sendEmailComplete}
        onHidden={() => {
          setSendEmailComplete(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">認証メール 発送完了</div>
          <div className="modal-subtit">
            認証コードを {authEmail}に転送しました。<br />
            メール確認後、認証コードを入力してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setSendEmailComplete(false);
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>

      {/* 누락 항목 체크 */}
      <Modal
        show={errorModal}
        onHidden={() => {
          setErrorModal(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">欠落内容の確認</div>
          <div className="modal-subtit">
            {errorType} を入力してください。
          </div>
          <div className="flex flex-end gap-3">
            <a
              className="btn btn-pending"
              onClick={() => {
                setErrorModal(false);
                // window.location(reload)
              }}
            >
              確認
            </a>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};
export default CorpInfoMng;
