import {useEffect, useState} from 'react';

import Download from "@/assets/images/download-icon-sky.svg";
import MobileCareer from "./MobileCareer";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import {useRecoilState} from "recoil";
import {mobileStatus} from "../../stores/mobile-status";


const ResumeMobile13 = (props) => {
  const [isPrimary, setIsPrimary] = useState(true);
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [career, setCareer] = useState([{process: []},])

  const handleAddBtn = (e, idx) => {
    if (idx === 0) {
      setCareer(prevState => [...prevState, {process: []}])
    } else {
      const tempArr = [...career]
      const tempMobile = {
        projectName: [...mobile.projectName ],
        projectRole: [...mobile.projectRole ],
        projectProcess: [...mobile.projectProcess ],
        projectPeriod: [...mobile.projectPeriod ],
      }
      console.log(tempMobile)
      tempArr.splice(idx, 1)
      tempMobile.projectName.splice(idx, 1)
      tempMobile.projectRole.splice(idx, 1)
      tempMobile.projectProcess.splice(idx, 1)
      tempMobile.projectPeriod.splice(idx, 1)
      setMobileStatus({
        ...mobile,
        ...tempMobile
      })
      setCareer(tempArr)
    }
  }
  const handleCareerChange = (e, idx) => {
    const id = e.target.id.replaceAll(' dropdown-button-dark-example1', '')
    const tempArr = [...mobile[id]]
    tempArr[idx] = id === 'projectPeriod' ? parseInt(e.target.value) : e.target.value
    setMobileStatus({...mobile, [id]: tempArr})
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
    for (let i = 0; i < arr.length; i++) {
      strArr[i] = arr[i].process.toString()
    }
    setMobileStatus({...mobile, projectProcess: [...strArr]})
  }

  const buttonClass = isPrimary ? 'btn-outline-primary' : 'btn-outline-secondary';


  useEffect(()=>{
    console.log(mobile)
  },[mobile])
  useEffect(() => {
    if(mobile.projectName.length >= 2) {
      setCareer([{process: []},])
      for(let i = 1 ; i < mobile.projectName.length ; i ++){
        setCareer(prev => [...prev, {process:[]}])
      }
    }
  },[])

  return (
    <>
      <div className="mobile-resume-wrap">
        <div className="flex items-center gap-3 space-between">
          <MobileProgress/>
          <button className="btn btn-sm btn-skyblue w-36 flex gap-1 items-center">
            <img src={Download} alt=""/>
            一時保存
          </button>
        </div>
        {
            career.map((career, key) => {
                return <MobileCareer
                  key={key}
                  index={key}
                  addState={key === 0}
                  handleAddBtn={handleAddBtn}
                  projectRoleList={mobile?.api.projectRoleList}
                  projectProcessList={mobile?.api.projectProcessList}
                  handleCareerChange={handleCareerChange}
                  handleProjectProcessChange={handleProjectProcessAdd}
                  handleProjectProcessDel={handleProjectProcessDel}
                />
            })
        }
      </div>

    </>
  );
};
export default ResumeMobile13;
