import { useState } from 'react';
import Download from "@/assets/images/download-icon-sky.svg";
import AddBtn from "@/assets/images/add-btn.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import CareerWrite from "../../views/resume-mng/desktop-items/CareerWrite";
import { useRecoilState } from "recoil";
import { mobileStatus } from "../../stores/mobile-status";


const ResumeMobile7 = (props) => {

  // 버튼 클래스 변경
  const [isPrimary, setIsPrimary] = useState(true);
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [career, setCareer] = useState([{ process: [] },])

  const handleButtonClick = () => {
    setIsPrimary(!isPrimary);
  };

  const handleAddBtn = (e, idx) => {
    if (idx === 0) {
      setCareer(prevState => [...prevState, { process: [] }])
    } else {
      const tempArr = [...career]
      tempArr.splice(idx, 1)
      setCareer(tempArr)
    }
  }
  const handleCareerChange = (e, idx) => {
    const id = e.target.id.replaceAll(' dropdown-button-dark-example1', '')
    const tempArr = [...mobile[id]]
    tempArr[idx] = e.target.value
    setMobileStatus({ ...mobile, [id]: tempArr })
  }
  const handleProjectProcessAdd = (e, idx) => {
    const temp = [...career]
    temp[idx].process.push(e.target.value)
    temp[idx].process.map(item => item.sort)
    projectProcessEvent(temp)
  }
  const handleProjectProcessDel = (idx, target) => {
    const temp = [...career]
    const position = temp[idx].process.indexOf(target)
    temp[idx].process.splice(position, 1)
    projectProcessEvent(temp)
  }
  const projectProcessEvent = (arr) => {
    const temp = arr.reduce((acc, cur) => [...acc.process, ...cur.process]);
    setCareer(arr)
    setMobileStatus({ ...mobile, projectProcess: temp })
  }

  const buttonClass = isPrimary ? 'btn-outline-primary' : 'btn-outline-secondary';

  return (
    <>
      <div className="mobile-resume-wrap">
        <div className="flex items-center gap-3 space-between">
          <MobileProgress />
          <button className="btn btn-sm btn-skyblue w-36 flex gap-1 items-center">
            <img src={Download} alt="" />
            内容保存
          </button>
        </div>
        <div className="">
          <div className="mo-resume-tit flex space-between items-center">
            主要経歴を入力してください。
            <button className="add-career-btn flex items-center">
              <img src={AddBtn} alt="" />
              主要経歴追加
            </button>
          </div>
        </div>

        {/* 主要経歴 */
          career.map((career, key) => {
            return <CareerWrite
              key={key}
              index={key}
              addState={key === 0}
              handleAddBtn={handleAddBtn}
              hopeCareerList={data?.hopeCareerList}
              projectProcessList={data?.projectProcessList}
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
export default ResumeMobile7;
