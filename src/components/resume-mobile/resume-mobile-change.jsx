import { useEffect, useState } from 'react';


import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import setting from "@/assets/images/setting-icon.svg";
import blueX from "@/assets/images/blue-x.svg";
import Country from "./mobileChange/user/Country";
import UserAge from "./mobileChange/user/UserAge";
import UserGender from "./mobileChange/user/UserGender";
import Education from "./mobileChange/user/Education";
import Major from "./mobileChange/user/Major";
import Year from "./mobileChange/career/Year";
import Sectors from "./mobileChange/career/Sectors";
import CurrentIndustry from "./mobileChange/career/CurrentIndustry";
import Salary from "./mobileChange/career/Salary";
import Residence from './mobileChange/career/Residence';
import Target from './mobileChange/career/Target';
import Contact from './mobileChange/career/Contact';
import MajorCareer from './mobileChange/career/MajorCareer';
import Skill from './mobileChange/career/Skill';
import MajorCareerList from "./mobileChange/career/MajorCareerList";
import serviceFetch from "../../../util/ServiceFetch";
import DepthSplit from "../../../util/DepthSplit";
import { useRecoilState } from "recoil";
import { mobileStatus } from "../../stores/mobile-status";

const ResumeMobileChange = (props) => {
    const [selectPop, setselectPop] = useState(false);
    const [mobile, setMobile] = useRecoilState(mobileStatus)

    const findOneDepth = (code, group) => {
        //group으로 받은 parm array에서 code와 일치하는 child를 가진 1dep 정보 가져오기
        let filterOneDepth = group.filter(dep1 => dep1.child.filter(dep2 => Object.values(dep2).indexOf(code) != -1).length === 1)
        return filterOneDepth[0];
    }

    useEffect(() => {
        serviceFetch('/resume/reg', 'get')
            .then(res => {
                console.log(res)
                if (res.result.regiInfoDto) {
                    if (mobile) {
                        let tempResult = { ...res.result.regiInfoDto }
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

                        setMobile({
                            ...mobile,
                            ...tempResult,
                            // country: res.data.result.regiInfoDto.countrySelect,
                            api: res.result,
                            businessTypeOneDeps: findOneDepth(res.result.regiInfoDto.businessTypeSelect, businessDepthMenu).businessType,
                            hopeCareerOneDeps: findOneDepth(res.result.regiInfoDto.hopeCareerSelect, hopeCareerDepthMenu).hopeCareer,
                            jobTypeOneDeps: findOneDepth(res.result.regiInfoDto.jobTypeSelect, jobDepthMenu).jobType,

                            businessDepthMenu: businessDepthMenu,
                            jobDepthMenu: jobDepthMenu,
                            hopeCareerDepthMenu: hopeCareerDepthMenu
                        })
                    }
                }
            })
    }, [])

    return (
        <>
            <div className="mobile-resume-wrap change">
                <div className="mo-change-tit">
                    履歴書変更
                </div>
                <div className="change-box">
                    <Country />
                    <UserAge />
                    <UserGender />
                    <Education />
                    <Major />
                </div>
                <div className="change-box">
                    <Year />
                    <Sectors />
                    <CurrentIndustry />
                    <Salary />
                    <Residence />
                    <Target />
                </div>
                <div className="change-box">
                    <Contact />
                </div>
                <div className="mo-change-tit mt-10">
                    主要経歴
                </div>
                <MajorCareerList />
                <Skill />
            </div>
        </>
    );
};
export default ResumeMobileChange;
