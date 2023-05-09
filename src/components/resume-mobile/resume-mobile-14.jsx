import { useEffect, useState } from 'react';
import {
    Modal, ModalBody, ModalFooter
} from "@/base-components";
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import Download from "@/assets/images/download-icon-sky.svg";
import SelectArrow from "@/assets/images/select-arrow.svg";
import checkIcon from "@/assets/images/check-icon.svg";
import AddBtn from "@/assets/images/add-btn.svg";
import InchargeAdd from "@/assets/images/incharge-add.svg";
import blueX from "@/assets/images/blue-x.svg";
import setting from "@/assets/images/setting-icon.svg";
import Search from "@/assets/images/search.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import { useRecoilState } from "recoil";
import { mobileStatus } from "../../stores/mobile-status";
import SelectBox from "../../views/resume-mng/desktop-items/SelectBox";


const ResumeMobile14 = (props) => {

    const [selectPop, setselectPop] = useState(false);
    const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
    const [skillList, setSkillList] = useState({
        filter: [],
        origin: [...mobile.api.skillList],
    })
    const [skillItem, setSkillItem] = useState({
        temp: {},
        arr: [],
    })

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
        if (skillItem.temp.skillCode && skillItem.temp.careerCode) {
            setMobileStatus({
                ...mobile,
                skillCode: [...mobile.skillCode, skillItem.temp.skillCode.skill],
                careerCode: [...mobile.careerCode, skillItem.temp.careerCode.careerCode],
                tempSkillItem: {
                    arr: [
                        ...skillItem.arr,
                        {
                            name: skillItem.temp.skillCode.skillName,
                            year: skillItem.temp.careerCode.careerYear
                        }
                    ]
                }
            })

            setSkillItem({
                arr: [...skillItem.arr, {
                    name: skillItem.temp.skillCode.skillName,
                    year: skillItem.temp.careerCode.careerYear
                }],
                temp: {}
            })
            document.querySelector('.refTarget_select').value = null;
            document.querySelectorAll('.refTarget_radio').forEach(radio => radio.checked = false)
        } else {
            //alert('스킬이나 経歴이 선택되지 않았습니다.')
        }
    }

    const handleDelSkills = (index) => {
        const tempMobileSkills = [...mobile.tempSkillItem.arr]
        const tempSkillCode = [...mobile.skillCode]
        const tempCareerCode = [...mobile.careerCode]
        const tempSkills = { ...skillItem }

        tempMobileSkills.splice(index, 1)
        tempSkillCode.splice(index, 1)
        tempCareerCode.splice(index, 1)
        tempSkills.arr.splice(index, 1)

        setMobileStatus({
            ...mobile,
            skillCode: [...tempSkillCode],
            careerCode: [...tempCareerCode],
            tempSkillItem: {
                arr: [...tempMobileSkills,]
            }
        })
        setSkillItem(tempSkills)

    }

    useEffect(() => {
        if (mobile.tempSkillItem) {
            setSkillItem({
                temp: {},
                arr: [],
            })
            mobile.tempSkillItem.arr.map((skill) => {
                console.log(skill)
                setSkillItem({
                    arr: [
                        ...skillItem.arr,
                        {
                            name: skill.name,
                            year: skill.year
                        }
                    ],
                    temp: {}
                })
            })
        }
    }, [])

    return (
        <>
            <div className="mobile-resume-wrap">
                <div className="flex items-center gap-3 space-between">
                    <MobileProgress />
                    <button className="btn btn-sm btn-skyblue w-36 flex gap-1 items-center">
                        <img src={Download} alt="" />
                        一時保存
                    </button>
                </div>
                <div className="">
                    <div className="mo-resume-tit">
                        自分が経験したスキルを検索し、追加してください。
                    </div>
                </div>

                <div className="mobile-drop-wrap long-height">
                    <div className="relative text-slate-500">
                        <input
                            type="text"
                            className="form-control pr-10"
                            placeholder="검색"
                            onChange={(e) => {
                                setSkillList({
                                    ...skillList,
                                    filter: [...skillList.origin.filter(item => item.skillName.includes(e.target.value))]
                                })
                            }}
                        />
                        <button className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0">
                            <img src={Search} alt="" />
                        </button>
                    </div>
                    <div className="lang-search-box">
                        <div className="relative text-slate-500">
                            <div className="list-group">
                                {
                                    skillList.filter.map((skill, key) => {
                                        return <div key={key} className='list-group-item'>
                                            <label className='checkbox-btn w-18 flex'>
                                                <span className="lang-select">言語</span>
                                                <input id={'skillCode'} name='group' className='form-check-input chg2 refTarget_radio'
                                                    type='radio' onChange={(e) => handleUpdateSkill(e, skill)} />
                                                <span>{skill.skillName}</span>
                                            </label>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    {/* 기존 */}
                    <div className="period-wrap flex items-center gap-2 w-full">
                        <SelectBox className={'refTarget_select'} id={'careerCode'} data={mobile.api.skillCareerList}
                            onChange={handleUpdateSkill} />

                        <button className="btn btn-skyblue2 w-24 h-full" onClick={handleAddSkills}>登録</button>
                    </div>
                    <div className="skill-list-wrap">
                        <div className="skill-list-tit">
                            登録されたスキルリストㄴ
                        </div>
                        <div className="skill-list-cont">
                            <div className="blue-btn-wrap flex gap-2 items-center">
                                {
                                    skillItem.arr.map((item, key) => {
                                        return (
                                            <div className='blue-btn' key={key}>
                                                <span className="skilllist-langu blue-line pr-2 inline-block">
                                                    言語
                                                </span>
                                                <span className="pr-2 inline-block">{item.name}</span>
                                                <span>{item.year}</span>
                                                <button className='blue-x-btn' onClick={() => handleDelSkills(key)}>
                                                    <img src={blueX} alt='' />
                                                </button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ResumeMobile14;
