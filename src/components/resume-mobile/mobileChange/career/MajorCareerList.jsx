import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@/base-components";
import { useEffect, useState } from "react";

import AddBtn from "@/assets/images/add-btn.svg";
import MinusBtn from "@/assets/images/minus-icon.svg";
import InchargeAdd from "@/assets/images/incharge-add.svg";
import blueX from "@/assets/images/blue-x.svg";
import MobileCareer from "../../MobileCareer";
import { mobileStatus } from "../../../../stores/mobile-status";
import { useRecoilState } from "recoil";
import majorCareer from "./MajorCareer";
import MajorCareer from "./MajorCareer";
import serviceFetch from "../../../../../util/ServiceFetch";
import React from "react";

const MajorCareerList = ({
  index,
  addState,
  projectProcessList,
  handleAddBtn,
  handleProjectProcessChange,
  handleProjectProcessDel,
}) => {
  const [mobile, setMobile] = useRecoilState(mobileStatus)
  const [career, setCareer] = useState([])
  const [projects, setProjects] = useState([])

  const [MajorCareerModal, setMajorCareer] = useState(false);

  const careerAddBtn = (e, index) => {
    console.log(index)
    if (index === 0) {
      setCareer(prevState => [...prevState, {
        projectName: '',
        projectPeriod: '',
        projectRole: '',
        projectProcess: ''
      }])
    } else {
      const tempArr = [...career]
      tempArr.splice(index, 1)
      setCareer(tempArr)
    }
    //updateCareer()
  }

  const updateCareer = () => {
    const tempList = mobile.api.regiInfoDto.projectProcessSelect.split(";")
    const tempRole = mobile.api.regiInfoDto.projectRoleSelect.split(',')
    const tempName = mobile.api.regiInfoDto.projectNameSelect.split(',')
    const tempPeriod = mobile.api.regiInfoDto.projectPeriodSelect.split(',')
    const processList = [];
    tempList.map((item, key) => {
      processList.push({
        projectName: tempName[key],
        projectPeriod: tempPeriod[key],
        projectRole: tempRole[key],
        projectProcess: item.split(','),
      })
    })
    setCareer([...processList])
    setProjects([...processList])
  }

  useEffect(() => {
    updateCareer()
  }, [])

  return (
    <div className="career-box mt-6">
      <div className="change-box-btn">
        <button
          className="btn btn-primary"
          onClick={() => setMajorCareer(true)}
        >
          変更
        </button>
      </div>

      {
        projects.map((project, key) => {
          return <React.Fragment key={key}>
            <div className="career-box-tit flex space-between items-center">
              {project.projectName}
            </div>
            <div className="career-box-subtit">
              {mobile.api.projectRoleList.filter(role => role.projectRole === project.projectRole)[0].projectRoleName}
              <br />
              {project.projectPeriod} か月
            </div>
            <div className="career-box-incharge">
              <div className="career-box-incharge-tit">担当工程</div>
              <div className="career-box-incharge-cont">
                {
                  project.projectProcess.map((p, keys) => {
                    return <span key={keys}>{mobile.api.projectProcessList.filter(filter => filter.projectProcess === p)[0]?.projectProcessName}</span>
                  })
                }
              </div>
            </div>
          </React.Fragment>
        })
      }


      {/* 主要経歴 변경 */}
      <Modal
        show={MajorCareerModal}
        onHidden={() => {
          setMajorCareer(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">主要経歴</h2>
            <button
              onClick={() => {
                setMajorCareer(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal mobile-resume-wrap">

          {/*
            커리어 리스트
          */}
          {
            career?.map((item, key) => {
              return <MajorCareer
                key={key}
                index={key}
                handleAddBtn={careerAddBtn}
                career={career}
                setCareer={setCareer}
                roleList={mobile.api.projectRoleList}
                projectProcessList={mobile.api.projectProcessList}
                projectProcessDefault={mobile.api.projectProcessDefault}
              />
            })
          }


        </ModalBody>
        <ModalFooter>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setMajorCareer(false);
              }}
            >
              キャンセル
            </button>
            <button type="button" className="btn btn-primary"
              onClick={() => {
                let body = {
                  projectName: [],
                  projectPeriod: [],
                  projectRole: [],
                  projectProcess: []
                }
                career.map(c => {
                  body.projectName.push(c.projectName)
                  body.projectPeriod.push(parseInt(c.projectPeriod))
                  body.projectRole.push(c.projectRole)
                  body.projectProcess.push(c.projectProcess.toString())
                })

                serviceFetch('/resume/edit/project', 'put', body)
                  .then((res) => {
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
  );
};

export default MajorCareerList;
