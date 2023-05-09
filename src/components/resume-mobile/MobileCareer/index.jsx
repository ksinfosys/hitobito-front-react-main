import { useEffect, useState } from 'react';
import { useRecoilState } from "recoil";
import { Modal, ModalBody, ModalFooter } from "@/base-components";

import AddBtn from "@/assets/images/add-btn.svg";
import MinusBtn from "@/assets/images/minus-icon.svg";
import InchargeAdd from "@/assets/images/incharge-add.svg";
import blueX from "@/assets/images/blue-x.svg";
import { mobileStatus } from "../../../stores/mobile-status";
import MobileSelectBox from "../../../views/resume-mng/mobile-items/MobileSelectBox";


const Index = ({
  index,
  addState,
  projectRoleList,
  projectProcessList,
  handleAddBtn,
  handleCareerChange,
  handleProjectProcessChange,
  handleProjectProcessDel,
}) => {

  // 버튼 클래스 변경
  const [isPrimary, setIsPrimary] = useState(true);
  const [selectPop, setselectPop] = useState(false);
  const [process, setProcess] = useState([])
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);

  const handleButtonClick = () => {
    setIsPrimary(!isPrimary);
  };

  const handleDelProcess = (idx) => {
    const temp = [...process]
    temp.splice(idx, 1)
    setProcess(temp)
  }

  useEffect(() => {
    const className = `.process-checked-box-${index}`
    document.querySelectorAll(className).forEach(item => {
      if (item.checked) {
        const targetText = document.querySelector(`.label_${index}_${item.value}`).textContent
        if (process.indexOf(targetText) === -1) item.checked = false
      }
    })
  }, [selectPop])

  const buttonClass = isPrimary ? 'btn-outline-primary' : 'btn-outline-secondary';

  return (
    <>
      <div className="">
        <div className="mo-resume-tit flex space-between items-center">
          主要経歴を入力してください。
          {
            addState ? <button className="add-btn flex items-center" onClick={(e) => handleAddBtn(e, index)}>
              <img src={AddBtn} alt="" />
              主要経歴追加
            </button> : <button className="minus-btn flex items-center" onClick={(e) => handleAddBtn(e, index)}>
              <img src={MinusBtn} alt="" />
              主要経歴抜き
            </button>
          }
        </div>
      </div>

      <div className="mobile-drop-wrap">
        <div className="flex items-center gap-2">
          <div className="drop-left-tit">
            プロジェクト名
          </div>
          <div className="drop-right-cont">
            <input type='text' className='form-control' id={'projectName'} value={mobile.projectName[index]} onChange={(e) => handleCareerChange(e, index)} />
            {/*<select name="" id="" className='form-control'>
            <option value="">プロジェクト名入力</option>
            <option value="">option01</option>
          </select>*/}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="drop-left-tit">
            期間
          </div>
          <div className="drop-right-cont">
            <input type='text' className='form-control' id={'projectPeriod'} value={mobile.projectPeriod[index]}
              onChange={(e) => handleCareerChange(e, index)} />
            {/*<select name="" id="" className='form-control'>
            <option value="">期間</option>
            <option value="">option01</option>
          </select>*/}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="drop-left-tit">
            役割
          </div>
          <div className="drop-right-cont flex items-center gap-2">
            <MobileSelectBox id={'projectRole'} value={mobile.projectRole[index]}
              onChange={(e) => handleCareerChange(e, index)} data={mobile.api.projectRoleList} />
            {/*<select name="" id="" className='form-control'>
            <option value="">役割</option>
            <option value="">option01</option>
          </select>*/}
          </div>
        </div>
        <div className="incharge-select">
          <div className="incharge-tit flex items-center gap-2">担当工程 <button onClick={() => {
            setselectPop(true);
          }}><img src={InchargeAdd} alt="" /></button></div>
          <div className="blue-btn-wrap flex items-center">
            {
              process.map((item, key) => {
                if (item) {
                  return <div key={key} className="blue-btn no-after items-center flex">
                    <span>{item}</span>
                    <button className="blue-x-btn" onClick={() => {
                      handleDelProcess(key);
                      handleProjectProcessDel(index, item)
                    }}>
                      <img src={blueX} alt="" />
                    </button>
                  </div>
                }
              })
            }
          </div>
        </div>
      </div>
      <Modal
        show={selectPop}
        onHidden={() => {
          setselectPop(false);
        }}
        className="select-modal mo-select-modal"
      >
        <ModalBody className="p-10 text-center">
          <div className="select-modal-pop">
            <div className="select-modal-tit">
              担当工程選択
            </div>
            <div className="select-input-wrap">
              {
                projectProcessList?.map((item, idx) => {
                  return <div className="form-check" key={idx}>
                    <input id="projectProcess vertical-form-3" className={`form-check-input process-checked-box-${index}`} type="checkbox"
                      value={item.projectProcess}
                      onChange={(e) => {
                        const tempArr = [...process]
                        tempArr.push(item.projectProcessName)
                        setProcess(tempArr)
                        if (e.target.checked) {
                          handleProjectProcessChange(e, index)
                        } else {
                          const idx = process.indexOf(e.target.value)
                          handleDelProcess(idx)
                        }
                      }}
                    />
                    <label className={`form-check-label label_${index}_${item.projectProcess}`}
                      htmlFor="vertical-form-3">{item.projectProcessName}</label>
                  </div>
                })
              }
            </div>

          </div>
        </ModalBody>
        <ModalFooter>
          <div className="mo-sel-btn-wrap flex space-between">
            <button className="btn btn-primary" onClick={() => {
              setselectPop(false);
            }}>
              確認
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
export default Index;
