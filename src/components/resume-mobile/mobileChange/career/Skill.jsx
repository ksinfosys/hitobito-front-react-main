import { Lucide, Modal, ModalBody, ModalFooter, ModalHeader, } from "@/base-components";
import { useEffect, useState } from "react";

import blueX from "@/assets/images/blue-x.svg";
import Search from "@/assets/images/search.svg";
import { mobileStatus } from "../../../../stores/mobile-status";
import { useRecoilState } from "recoil";
import SelectBox from "../../../../views/resume-mng/desktop-items/SelectBox";
import serviceFetch from "../../../../../util/ServiceFetch";

const Skill = () => {
  const [skillList, setSkillList] = useState({
    filter: [],
    origin: [],
  })
  const [skillItem, setSkillItem] = useState({
    temp: {},
    arr: [],
  })
  const [body, setBody] = useState({
    skillCodeSelect: [],
    careerCodeSelect: []
  })
  // 스킬 변경 모달
  const [Skill, setSkill] = useState(false);
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [saveSkill, setSaveSkill] = useState({
    skillCode: [],
    skillCareerCode: [],
  })

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

  const collectSkill = () => {

  }

  useEffect(() => {
    // 기존에 등록된 스킬
    setSaveSkill({
      skillCode: [...mobile.api.regiInfoDto.skillCodeSelect.split(',')],
      skillCareerCode: [...mobile.api.regiInfoDto.careerCodeSelect.split(',')]
    })

    // Skill List 초기세팅
    setSkillList({
      origin: [...mobile.api.skillList],
      filter: []
    })
    console.log([...mobile.api.skillList])
  }, [])
  return (
    <>
      <div className="mo-change-tit mt-10 flex space-between items-center">
        スキル
        <div className="change-box-btn">
          <button className="btn btn-primary mr-5"
            onClick={() =>
              setSkill(true)
            }
          >変更
          </button>
        </div>
      </div>
      <div className="skill-list-wrap">
        <div className="skill-list-cont">
          <div className="blue-btn-wrap flex gap-2 items-center">
            {
              saveSkill.skillCode.map((item, key) => {
                return <div key={key} className='blue-btn'>
                  <span className="skilllist-langu blue-line pr-2 inline-block">
                    {mobile.api.skillList.filter(skill => skill.skill === item)[0].skillCategoryName}
                  </span>
                  <span className="pr-2 inline-block">{mobile.api.skillList.filter(skill => skill.skill === item)[0].skillName}</span>
                  <span>{mobile.api.skillCareerList.filter(career => career.skillCareer === saveSkill.skillCareerCode[key])[0].skillCareerName}</span>
                </div>
              })
            }
          </div>
        </div>

        {/* 스킬 변경 */}
        <Modal
          show={Skill}
          onHidden={() => {
            setSkill(false);
          }}
        >
          <ModalHeader>
            <div className="flex space-between items-center w-full">
              <h2 className="modal-tit">スキル</h2>
              <button
                onClick={() => {
                  setSkill(false);
                }}
              >
                <Lucide icon="X" className="w-4 h-4" />
              </button>
            </div>
          </ModalHeader>
          <ModalBody className="change_modal">
            <div className="mobile-resume-wrap">
              <div className="">
                <div className="mo-resume-tit">
                  自分が経験したスキルを検索し、追加してください。
                </div>
              </div>

              <div className="mobile-drop-wrap">
                <div className="relative text-slate-500">
                  <input
                    type="text"
                    className="form-control pr-10"
                    placeholder='検索'
                    onChange={(e) => {
                      if (e.target.value !== '') {
                        setSkillList({
                          ...skillList,
                          filter: [...skillList.origin.filter(item => item.skillName.toUpperCase().includes(e.target.value.toUpperCase()))]
                        })
                      } else {
                        setSkillList({
                          ...skillList,
                          filter: []
                        })
                      }
                      console.log(skillList)
                    }
                    }
                  />
                  <button className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0">
                    <img src={Search} alt="" />
                  </button>
                </div>
                <div className="lang-search-box ">
                  <div className="relative text-slate-500 h-150 overflow-y-scroll skil_list">
                    <div className="list-group list-over">

                      {
                        skillList.filter.map((skill, key) => {
                          return <div key={key} className='list-group-item'>
                            <label className='checkbox-btn w-18'>
                              <input id={'skillCodeSelect'} name='group'
                                className='form-check-input chg2 refTarget_radio'
                                type='radio' onChange={(e) => handleUpdateSkill(e, skill)} />
                              <span>{skill.skillCategoryName} | {skill.skillName}</span>
                            </label>
                          </div>
                        })
                      }

                    </div>
                  </div>
                </div>
                <div className="period-wrap flex items-center gap-2 w-full">
                  <SelectBox className={'refTarget_select'} id={'careerCodeSelect'}
                    data={mobile?.api.skillCareerList}
                    defaultValue={skillItem.temp?.careerCodeSelect?.careerCode}
                    onChange={handleUpdateSkill} />
                  <button className="btn btn-skyblue2 w-24 h-full" onClick={handleAddSkills}>등록</button>
                </div>
                <div className="skill-list-wrap skil_list_wrap">
                  <div className="skill-list-tit">登録されたスキルリスト</div>
                  <div className="skill-list-cont">
                    <div className="blue-btn-wrap flex gap-2 items-center">
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
                                  setSkillItem({
                                    ...skillItem.temp,
                                    arr: [...tempArr]
                                  })
                                }}>
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
          </ModalBody>
          <ModalFooter>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setSkill(false);
                }}
              >
                取消
              </button>
              <button type="button" className="btn btn-primary"
                onClick={() => {
                  let temp = {}
                  Object.entries(body).forEach(obj => {
                    temp[obj[0].replaceAll('Select', '').replaceAll('skillCode', 'skill')] = obj[1]
                  })
                  serviceFetch('/resume/edit/skill', 'put', temp)
                    .then(res => {
                      console.log(res)
                      window.location.reload()
                    })
                }}>
                変更完了
              </button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default Skill;
