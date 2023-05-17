import {
    Lucide,
    Modal,
    ModalBody,
    ModalHeader
} from "@/base-components";
import { useEffect, useState } from 'react';
import $ from 'jquery'

import PersonIcon from "@/assets/images/person-icon.png";
import PersonMenIcon from "@/assets/images/person-men.png";
import PersonWomanIcon from "@/assets/images/person-woman.png";
import MinusGrayBtn from "@/assets/images/minus-gray-btn.svg";
import PlusGrayBtn from "@/assets/images/plus-gray-btn.svg";
import InfoImg1 from "@/assets/images/info-icon1.svg";
import InfoImg2 from "@/assets/images/info-icon2.svg";
import InfoImg3 from "@/assets/images/info-icon3.svg";
import InfoImg4 from "@/assets/images/info-icon4.svg";
import InfoImg5 from "@/assets/images/info-icon5.svg";
import InfoImg6 from "@/assets/images/info-icon6.svg";
import InfoImg7 from "@/assets/images/info-icon7.svg";
import InfoImg8 from "@/assets/images/info-icon8.svg";
import moment from "moment";

// Axios
import axios from "axios";
// Cookie
import { getCookie } from "../../utils/cookie";

const DashboardListBusiness = ({ data, allCheck, checkId, setCheckId, onChange, setRequestModal, submitCheckState, offer, currentPageIdx, selectTags, educationList, careerList, hopeIncomeList, ageList, offerState }) => {
    const { nickname, ageName, genderName, educationName, residentialAreaName, countryName, jobTypeName, careerName, hopeIncomeName, businessTypeName, hopeCareerName, skillCodeNameArr, projectProcessNameArr, projectRoleNameArr } = data;

    // 나이 계산
    const year = moment().format('YYYY');
    const age = year - ageName;

    /* ********************* 검색 필터링 시작 ********************* */
    // 연령 조건
    const ageTagFilter = selectTags.filter((tag) => tag.codeType === '51').map(tag => tag.code).sort((a, b) => a.code - b.code);
    const ageTag = ageList.find(obj => obj.codeName === ageName);
    const ageCodeStart = parseInt(Math.min(...ageTagFilter));
    const ageCodeEnd = parseInt(Math.max(...ageTagFilter));
    const ageCode = parseInt(ageTag?.code);
    const ageActive = ageCodeStart <= ageCode && ageCode <= ageCodeEnd;
    // 学歴 조건
    const educationTagFilter = selectTags.filter((tag) => tag.codeType === '52').map(tag => tag.code).sort((a, b) => a.code - b.code);
    const education = educationList.find(obj => obj.codeName === educationName);
    const educationCodeStart = parseInt(Math.min(...educationTagFilter));
    const educationCodeEnd = parseInt(Math.max(...educationTagFilter));
    const educationCode = parseInt(education?.code);
    const educationActive = educationCodeStart <= educationCode && educationCode <= educationCodeEnd;
    // 居住地 조건
    const residentialAreaNameTagFilter = selectTags.filter((tag) => tag.codeType === '58').map(tag => tag.codeName);
    const residentialAreaNameMatched = residentialAreaNameTagFilter.some((item) => residentialAreaName.includes(item));
    // 国籍 조건
    const countryNameTagFilter = selectTags.filter((tag) => tag.codeType === '54').map(tag => tag.codeName);
    const countryNameMatched = countryNameTagFilter.some((item) => countryName.includes(item));
    // 직종 조건
    const jobTypeNameTagFilter = selectTags.filter((tag) => tag.codeType === '57').map(tag => tag.codeName);
    const jobTypeNameMatched = jobTypeNameTagFilter.some((item) => jobTypeName.includes(item));
    // 経歴연수 조건
    const careerNameTagFilter = selectTags.filter((tag) => tag.codeType === '55').map(tag => tag.code).sort((a, b) => a.code - b.code);
    const career = careerList.find(obj => obj.codeName === careerName);
    const careerCodeStart = parseInt(Math.min(...careerNameTagFilter));
    const careerCodeEnd = parseInt(Math.max(...careerNameTagFilter));
    const careerCode = parseInt(career?.code);
    const careerNameMatched = careerCodeStart <= careerCode && careerCode <= careerCodeEnd;
    // 希望年収 조건 hopeIncomeList
    const hopeIncomeNameTagFilter = selectTags.filter((tag) => tag.codeType === '61').map(tag => tag.code).sort((a, b) => a.code - b.code);
    const hopeIncome = hopeIncomeList.find(obj => obj.codeName === hopeIncomeName);
    const hopeIncomeCodeStart = parseInt(Math.min(...hopeIncomeNameTagFilter));
    const hopeIncomeCodeEnd = parseInt(Math.max(...hopeIncomeNameTagFilter));
    const hopeIncomeCode = parseInt(hopeIncome?.code);
    const hopeIncomeActive = hopeIncomeCodeStart <= hopeIncomeCode && hopeIncomeCode <= hopeIncomeCodeEnd;
    // 재직회사 업종 조건
    const businessTypeNameTagFilter = selectTags.filter((tag) => tag.codeType === '56').map(tag => tag.codeName);
    const businessTypeNameMatched = businessTypeNameTagFilter.some((item) => businessTypeName.includes(item));
    // 将来の目標
    const hopeCareerNameTagFilter = selectTags.filter((tag) => tag.codeType === '60').map(tag => tag.codeName);
    const hopeCareerNameMatched = hopeCareerNameTagFilter.some((item) => hopeCareerName.includes(item));
    // 스킬 조건
    const skillTagFilter = selectTags.filter((tag) => tag.codeType === '01' || tag.codeType === '02' || tag.codeType === '03' || tag.codeType === '04').map(tag => tag.codeName && tag.codeName.includes(":") ? tag.codeName.split(":")[0].trim() : tag.codeName);
    const skillTag = skillCodeNameArr?.length > 0 && skillCodeNameArr.filter((item) => skillTagFilter.includes(item));
    // 担当工程 조건
    const projectProcessTagFilter = selectTags.filter((tag) => tag.codeType === "63").map(tag => tag.codeName);
    const projectProcessTag = projectProcessNameArr?.length > 0 && projectProcessNameArr.filter((item) => projectProcessTagFilter.includes(item));
    // 役割 조건
    const projectRoleNameTagFilter = selectTags.filter((tag) => tag.codeType === "62").map(tag => tag.codeName);
    const projectRoleNameTag = projectRoleNameArr?.length > 0 && projectRoleNameArr.filter((item) => projectRoleNameTagFilter.includes(item));
    //const projectRoleNameTag = projectRoleNameArr?.length > 0 && projectRoleNameArr.filter((item) => projectRoleNameTagFilter.includes(item));
    // 성별 조건
    const genderTagFilter = selectTags.filter((tag) => tag.codeType === "53").map(tag => tag.codeName);

    /* ********************* 검색 필터링 끝 ********************* */

    // 리스트 펼처보기 상태
    const [arrowState, setArrowState] = useState(false);
    const handleClickArrow = () => {
        setArrowState(current => !current);
    }

    // 이력서 조회 맵
    const buttonList1 = skillCodeNameArr?.length > 0 && skillCodeNameArr.map((name, index) => {
        return skillTag.includes(name) ? (
            <button className="btn btn-lang orange" key={index}>{name} </button>
        ) : (
            <button className="btn btn-lang gray" key={index}>{name} </button>
        )
    })
    const buttonList2 = projectProcessNameArr?.length > 0 && projectProcessNameArr.map((name, index) => {
        return projectProcessTag.includes(name) ? (
            <button className="btn btn-lang orange" key={index}>{name} </button>
        ) : (
            <button className="btn btn-lang gray" key={index}>{name} </button>
        )
    })
    const buttonList3 = projectRoleNameArr?.length > 0 && projectRoleNameArr.map((name, index) => {
        return projectRoleNameTag.includes(name) ? (
            <button className="btn btn-lang orange" key={index}>{name} </button>
        ) : (
            <button className="btn btn-lang gray" key={index}>{name} </button>
        )
    })


    // Count State
    const [countState, setCountState] = useState(1);
    // Plus Button Click Event
    const handleClickPlus = () => {
        countState < 3 && setCountState(prev => prev + 1)
    };
    // Minus Button Click Event
    const handleClickMinus = () => {
        countState !== 1 && setCountState(prev => prev - 1)
    };

    // Check State
    const [isChecked, setIsChecked] = useState(false);

    // 체크 박스 클릭시 id 값 저장하기
    const handleCheckboxChange = (idx) => {
        setIsChecked(prev => !prev);
        if (!isChecked && !checkId.includes(idx)) {
            setCheckId([...checkId, idx]);
        } else if (isChecked && checkId.includes(idx)) {
            setCheckId(checkId.filter((value) => value !== idx));
        }
    };

    // detail State
    const [userInfoState, setUserInfoState] = useState();
    const [requestStatus, setRequestStatus] = useState();
    // detailUser API
    const detailUser = (id, requestStatus) => {
        axios.post("/api/reqmag/resume", {
            rqIdx: 0,
            jsUserId: id,
        }, {
            withCredentials: true,
            headers: {
                accessToken: getCookie("accessToken"),
                lastLoginTime: getCookie("lastLoginTime"),
            }
        }).then(response => {
            const code = response.data.resultCode;
            const result = response.data.result;
            code === '200' ? (() => {
                setUserInfoState(result);
                setinformModal(true);
                setRequestStatus(requestStatus);
            })() : console.log("fetching error:::", response);
        })
    };

    useEffect(() => {
        onChange(countState)
    }, [countState])

    // 전체 체크 박스 동작
    useEffect(() => {
        if(allCheck){
            if(data.requestStatus == false){
                setIsChecked(true),
                setCheckId((prev) => [...prev,data.jsUserId])
            }else{
                console.log("data.requestStatus:::",data.requestStatus);
            }
        }else{
            setIsChecked(false),
            setCheckId([])
        }
    }, [allCheck])

    // 의뢰시 체크 박스 false
    useEffect(() => {
        setIsChecked(false)
    }, [submitCheckState])

    useEffect(() => {
        setArrowState(false);
        setIsChecked(false);
        setCheckId([]);
    }, [currentPageIdx, data])

    useEffect(() => {
        setRequestStatus(offerState)
    }, [offerState])

    // 구직자 간단정보 모달
    const [informModal, setinformModal] = useState(false);

    return (
        <>
            <div className="dashboard-cont-cont flex flex-col">
                <div className="cont-top flex space-between items-center">
                    <div className="dash-cont-cont1 flex items-center">
                        <div className="form-check dash-cont1-tit gap-2">
                            <input
                                id="vertical-form-4"
                                className={data.requestStatus ? "form-check-input display-none" : "form-check-input"}
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheckboxChange(data.jsUserId)}
                            />
                            <p className={data.requestStatus ? " btn-sm btn-secondary" : "btn btn-sm btn-secondary hidden"}>{data.rqSendDateTime} 依頼完了</p>
                            <div className="form-check-label business flex items-center gap-2" htmlFor="vertical-form-4" onClick={() => { detailUser(data.jsUserId, data.requestStatus), setCheckId([data.jsUserId]) }}>
                                {
                                    data.genderName === '男性' ?
                                        <img src={PersonMenIcon} alt="" /> :
                                        data.genderName === '女性' ?
                                            <img src={PersonWomanIcon} alt="" /> :
                                            <img src={PersonIcon} alt="" />
                                }
                                <div>{nickname}</div>
                                <div>
                                    (<span className={ageActive ? "orange" : ""}>{age}歳</span>
                                    <span className={genderTagFilter.includes(genderName) ? "search-bg ml-2" : "ml-2"}>{genderName}</span>)
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dash-cont-cont3 flex items-center">
                        {
                            data.requestStatus ? (
                                <></>
                            ) : (
                                <>
                                    <div className="color-a8">面談依頼有効期限</div>
                                    <div className="minus-plus-wrap flex items-center">
                                        <button className="minus-gray-btn" onClick={handleClickMinus}>
                                            <img src={MinusGrayBtn} alt="" />
                                        </button>
                                        <div className="number-div">
                                            {countState}
                                        </div>
                                        <button className="plus-gray-btn" onClick={handleClickPlus}>
                                            <img src={PlusGrayBtn} alt="" />
                                        </button>
                                    </div>
                                    <button className="btn btn-sm btn-business"
                                        onClick={() => {
                                            setCheckId([data.jsUserId])
                                            setRequestModal(true)
                                        }}
                                    >
                                        依頼
                                    </button>
                                </>
                            )
                        }
                    </div>
                </div>
                <div className="cont-accordion-box flex flex-col gap-2">
                    <div className="info-flex flex">
                        <div className="flex items-center gap-2">
                            <div className={educationActive ? "info-flex-tit flex item-center orange" : "info-flex-tit flex item-center"}>
                                <img src={InfoImg3} alt="" className="mr-1" />
                                学歴
                            </div>
                            <div className={educationActive ? "info-flex-cont orange" : "info-flex-cont"}>
                                {educationName}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={residentialAreaNameMatched ? "info-flex-tit flex item-center orange" : "info-flex-tit flex item-center"}>
                                <img src={InfoImg1} alt="" className="mr-1" />
                                居住地
                            </div>
                            <div className={residentialAreaNameMatched ? "info-flex-cont orange" : "info-flex-cont"}>
                                {residentialAreaName}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={countryNameMatched ? "info-flex-tit flex item-center orange" : "info-flex-tit flex item-center"}>
                                <img src={InfoImg2} alt="" className="mr-1" />
                                国籍
                            </div>
                            <div className={countryNameMatched ? "info-flex-cont orange" : "info-flex-cont"}>
                                {countryName}
                            </div>
                        </div>
                    </div>
                    <div className="info-flex flex">
                        <div className="flex items-center gap-2">
                            <div className={jobTypeNameMatched ? "info-flex-tit flex item-center orange" : "info-flex-tit flex item-center"}>
                                <img src={InfoImg4} alt="" className="mr-1" />
                                現在の職種
                            </div>
                            <div className={jobTypeNameMatched ? "info-flex-cont orange" : "info-flex-cont"}>
                                {jobTypeName}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={careerNameMatched ? "info-flex-tit flex item-center orange" : "info-flex-tit flex item-center"}>
                                <img src={InfoImg5} alt="" className="mr-1" />
                                経歴年数
                            </div>
                            <div className={careerNameMatched ? "info-flex-cont orange" : "info-flex-cont"}>
                                {careerName}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={hopeIncomeActive ? "info-flex-tit flex item-center orange" : "info-flex-tit flex item-center"}>
                                <img src={InfoImg6} alt="" className="mr-1" />
                                希望年収
                            </div>
                            <div className={hopeIncomeActive ? "info-flex-cont orange" : "info-flex-cont"}>
                                {hopeIncomeName}
                            </div>
                        </div>
                    </div>
                    <button className="accord-arrow-or" onClick={handleClickArrow}>
                        <Lucide icon={arrowState ? "ChevronUp" : "ChevronDown"} />
                    </button>
                    <div className={arrowState ? "accord-btm-line" : "accord-btm-line hidden"}>
                        <div className="info-flex flex justify-start">
                            <div className="flex items-center gap-2">
                                <div className={businessTypeNameMatched ? "info-flex-tit flex item-center orange" : "info-flex-tit flex item-center"}>
                                    <img src={InfoImg8} alt="" className="mr-1" />
                                    所属会社の業種
                                </div>
                                <div className={businessTypeNameMatched ? "info-flex-cont orange" : "info-flex-cont"}>
                                    {businessTypeName}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={hopeCareerNameMatched ? "info-flex-tit flex item-center orange" : "info-flex-tit flex item-center"}>
                                    <img src={InfoImg7} alt="" className="mr-1" />
                                    将来の目標
                                </div>
                                <div className={hopeCareerNameMatched ? "info-flex-cont w-auto orange" : "info-flex-cont w-auto"}>
                                    {hopeCareerName}
                                </div>
                            </div>
                        </div>
                        <div className="skill-box-wrap">

                            <div className="skill-box flex items-center">
                                <div className="skill-tit">
                                    スキル
                                </div>
                                {/* class명에 orange-type2 넣으면 오렌지색 배경 버튼으로 바뀜 */}
                                <div className="cont-btm-btn-1 orange">
                                    {buttonList1}
                                </div>
                            </div>
                            <div className="skill-box flex items-center">
                                <div className="skill-tit">
                                    担当工程
                                </div>
                                <div className="cont-btm-btn-1 orange">
                                    {buttonList2}
                                </div>
                            </div>
                            <div className="skill-box flex items-center">
                                <div className="skill-tit">
                                    役割
                                </div>
                                <div className="cont-btm-btn orange">
                                    {buttonList3}
                                </div>
                            </div>
                            <div className="flex flex-end">
                                <button className="btn btn-sm btn-business btn-message-write-1" onClick={() => { detailUser(data.jsUserId, data.requestStatus), setCheckId([data.jsUserId]) }}>
                                    更に詳細を表示
                                </button>
                            </div>
                        </div>
                        <div className="skill-box flex flex-end">
                            <button className="btn btn-sm btn-detail flex flex-end" onClick={() => { detailUser(data.jsUserId, data.requestStatus), setCheckId([data.jsUserId]) }}>
                                更に詳細を表示
                            </button>
                        </div>
                        
                    </div>
                </div>
                <div className="accord-line"></div>
            </div>

            {/* 구직자 간단 정보 모달 */}
            <Modal className="em-info-modal"
                show={informModal}
                onHidden={() => {
                    setinformModal(false);
                }}
            >
                <ModalHeader>
                    <div className="flex space-between items-center w-full">
                        <h2 className="modal-tit">
                            {userInfoState && userInfoState.resume.nickname}
                        </h2>
                        <button className="" onClick={() => setinformModal(false)}>
                            <Lucide icon="X" className="w-4 h-4" />
                        </button>
                    </div>
                </ModalHeader>
                <ModalBody >
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-5 items-center space-between">
                            <div className="info-top-box flex gap-5 items-center">
                                <div className="modal-subtit1">
                                    国籍
                                </div>
                                <div className="modal-subtit2">
                                    {userInfoState && userInfoState.resume.country}
                                </div>
                            </div>
                            <div className="info-top-box box2 flex gap-5 items-center">
                                <div className="modal-subtit1">
                                    誕生年
                                </div>
                                <div className="modal-subtit2">
                                    {userInfoState && userInfoState.resume.userAge}年 <span className="blue">{year - Number(userInfoState && userInfoState.resume.userAge)}歳</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-5 items-center space-between">
                            <div className="info-top-box flex gap-5 items-center">
                                <div className="modal-subtit1">
                                    性別
                                </div>
                                <div className="modal-subtit2">
                                    {userInfoState && userInfoState.resume.userGender}
                                </div>
                            </div>
                            <div className="info-top-box box2 flex gap-5 items-center">
                                <div className="modal-subtit1">
                                    居住地
                                </div>
                                <div className="modal-subtit2">
                                    {userInfoState && userInfoState.resume.residentialArea}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-5 space-between items-start">
                            <div className="info-top-box flex gap-5 items-center">
                                <div className="modal-subtit1">
                                    学歴
                                </div>
                                <div className="modal-subtit2">
                                    {userInfoState && userInfoState.resume.education}
                                </div>
                            </div>
                            <div className="info-top-box box2 flex flex-col gap-2">
                                <div className="col-box flex gap-5">

                                    <div className="modal-subtit1">
                                        最終学校名
                                    </div>
                                    <div className="modal-subtit2">
                                        {userInfoState && userInfoState.resume.schoolName}
                                    </div>
                                </div>
                                <div className="col-box flex gap-5">
                                    <div className="modal-subtit1">
                                        専攻
                                    </div>
                                    <div className="modal-subtit2">
                                        {userInfoState && userInfoState.resume.majorName}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="current-box flex flex-col gap-2">
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                現在の職種
                            </div>
                            <div className="modal-subtit2">
                                {userInfoState && userInfoState.resume.jobType}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                所属会社の業種
                            </div>
                            <div className="modal-subtit2">
                                {userInfoState && userInfoState.resume.businessType}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                経歴
                            </div>
                            <div className="modal-subtit2">
                                {userInfoState && userInfoState.resume.career}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-center">
                            <div className="modal-subtit1">
                                希望年収
                            </div>
                            <div className="modal-subtit2">
                                {userInfoState && userInfoState.resume.hopeIncome}
                            </div>
                        </div>
                        <div className="info-top-box box3 flex gap-5 items-start">
                            <div className="modal-subtit1">
                                将来の目標
                            </div>
                            <div className="modal-subtit2">
                                {userInfoState && userInfoState.resume.hopeCareer}
                            </div>
                        </div>
                    </div>
                    <div className="main-curr">
                        <div className="main-curr-tit">
                            主要経歴
                        </div>
                        <div className="main-curr-cont flex flex-col gap-5">
                            {
                                userInfoState && userInfoState.resumeProjectList?.length > 0 ? userInfoState.resumeProjectList.map((project, index) => {
                                    const process = project.projectProcess.split(',');
                                    return (
                                        <div className="main-curr-box flex flex-col gap-2" key={index}>
                                            <div className="col-box flex gap-5">
                                                <div className="modal-subtit1">
                                                    プロジェクト名
                                                </div>
                                                <div className="modal-subtit2">
                                                    {project.projectName}
                                                </div>
                                            </div>
                                            <div className="flex gap-5 items-center space-between">
                                                <div className="info-top-box flex gap-5 items-center">
                                                    <div className="modal-subtit1">
                                                        役割
                                                    </div>
                                                    <div className="modal-subtit2">
                                                        {project.projectRole}
                                                    </div>
                                                </div>
                                                <div className="info-top-box flex gap-5 items-center">
                                                    <div className="modal-subtit1">
                                                        期間
                                                    </div>
                                                    <div className="modal-subtit2">
                                                        {project.projectPeriod} カ月
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="charge-btm">
                                                <div className="flex gap-5">
                                                    <div className="charge-btm-tit">担当工程</div>
                                                    <div className="charge-btm-cont flex gap-2">
                                                        {
                                                            process != '' && process?.length > 0 && process.map((item, index) => {
                                                                return (
                                                                    <div className="btn-lang" key={index}>{item}</div>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }) : (
                                    <div className="main-curr-box flex flex-col gap-2">
                                        経歴がありません。
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="skill-box">
                        <div className="charge-btm">
                            <div className="flex gap-5">
                                <div className="charge-btm-tit">スキル</div>
                                <div className="charge-btm-cont flex gap-2">
                                    {
                                        userInfoState && userInfoState?.resumeSkillList.length > 0 ? userInfoState.resumeSkillList.map((skill, index) => {
                                            return (
                                                <div className="btn-lang" key={index}>
                                                    {skill.skillName}<span>{skill.career}</span>
                                                </div>
                                            )
                                        }) : (
                                            <div className="btn-lang">
                                                スキルがありません。
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="introduce">
                        <div className="int-tit">
                            簡単な自己紹介
                        </div>
                        {
                            userInfoState && userInfoState.resume.additionalComment ? (
                                <div className="int-cont">
                                    {userInfoState.resume.additionalComment}
                                </div>
                            ) : (
                                <div className="int-cont">
                                    「簡単な自己紹介」がありません。
                                </div>
                            )
                        }
                    </div>
                    {
                        requestStatus ? (
                            <button
                                className="btn btn-sm btn-request btn-gray-business w-full"
                            >依頼完了</button>
                        ) : (
                            <>
                                <div className=" flex items-center gap-3 mt-10 border-t py-3 justify-center bg-slate-50">
                                    <div className="exp-date-tit">
                                        面談依頼有効期間
                                    </div>
                                    <div className="list-all-wrap flex items-center gap-4">
                                        <div className="minus-plus-wrap flex items-center">
                                            <button className="minus-gray-btn" onClick={handleClickMinus}>
                                                <img src={MinusGrayBtn} alt="" />
                                            </button>
                                            <div className="number-div">
                                                {countState}
                                            </div>
                                            <button className="plus-gray-btn" onClick={handleClickPlus}>
                                                <img src={PlusGrayBtn} alt="" />
                                            </button>
                                        </div>

                                    </div>
                                </div>
                                <button
                                    className="btn btn-sm btn-request btn-business w-full"
                                    onClick={() => {
                                        offer(),
                                            setCountState(1)
                                    }}
                                >
                                    依頼
                                </button>
                            </>
                        )
                    }
                </ModalBody>
            </Modal>
        </>
    );
};
export default DashboardListBusiness;
