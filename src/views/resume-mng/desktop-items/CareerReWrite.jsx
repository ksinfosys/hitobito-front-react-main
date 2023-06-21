import { Modal, ModalBody, ModalFooter } from "@/base-components";
import { useEffect, useState, useRef } from 'react';
import AddBtn from "@/assets/images/add-btn.svg";
import MinusBtn from "@/assets/images/minus-icon.svg";
import blueX from "@/assets/images/blue-x.svg";
import SelectBox from "./SelectBox";
import Index from "../../../components/resume-mobile/MobileCareer";
import MinusGrayBtn from "@/assets/images/minus-gray-btn.svg";
import PlusGrayBtn from "@/assets/images/plus-gray-btn.svg";
import $ from "jquery";


const CareerReWrite = ({
  index,
  addState,
  projectRoleList,
  projectProcessList,
  handleAddBtn,
  handleCareerChange,
  handleProjectProcessChange,
  handleProjectProcessDelAll,
  handleProjectProcessDel,
  projectProcessDefault,
  handleCareerChangeAndProcess,
  name,
  role,
  period,
  process_re,
  crwProject,
  handlePeriodChange
}) => {
  const [selectPop, setSelectPop] = useState(false);
  const [process, setProcess] = useState([])
  const [isRoleSelect, setRoleSelect] = useState(true)

  const handleDelProcess = (idx) => {
    const temp = [...process]
    temp.splice(idx, 1)
    setProcess(temp)
  }

  useEffect(() => {
    const className = `.process-checked-box-${index}`
    document.querySelectorAll(className).forEach(item => {
      // item.checked = false
      // if()
      if (process_re.indexOf(item.value) !== -1) {
        item.checked = true
      }
    })
  }, [selectPop])

  // useEffect(() => {
  //   const className = `.process-checked-box-${index}`
  //   document.querySelectorAll(className).forEach(item => {
  //     if (item.checked) {
  //       const targetText = document.querySelector(`.label_${index}_${item.value}`).textContent
  //       if (process.indexOf(targetText) === -1) item.checked = false
  //     }
  //   })
  // }, [selectPop])

  useEffect(() => {
    const tempProcess = process_re.toString().split(',');
    const updatedProcess = [];
    for (let i = 0; i < tempProcess.length; i++) {
      for (let j = 0; j < projectProcessList.length; j++) {
        if (projectProcessList[j].projectProcess === tempProcess[i]) {
          updatedProcess.push(projectProcessList[j].projectProcessName);
          break;
        }
      }
    }

    setProcess(updatedProcess);
  }, [process_re, projectProcessList]);

  const crwProjectRef = useRef(null);
  
  useEffect(() => {
    if (crwProjectRef.current && index !== 0 && crwProject === true) {
      crwProjectRef.current.focus();
    }
  }, [crwProject]);
  
  // Plus Button Click Event
  const handleClickPlus = (index) => {
    let inputNumber = $(`.projectPeriod_${index}`);
    if(isNaN(inputNumber.val()) || inputNumber.val() === ""){
      Number(inputNumber.val(0));
    }
    inputNumber.val(Number(inputNumber.val()) + 1);
  };
  // Minus Button Click Event
  const handleClickMinus = (index) => {
    let inputNumber = $(`.projectPeriod_${index}`);
    if(inputNumber.val() > 0) {
      inputNumber.val(inputNumber.val() - 1);
    }
  };

  return <>
    <div className="flex-box2-tit flex space-between">
      <div className="box2-tit">主要経歴</div>

      {
        addState ? <button className="add-btn flex items-center" onClick={(e) => handleAddBtn(e, index)}>
          <img src={AddBtn} alt="" />
          主要経歴追加
        </button> : <button className="minus-btn flex items-center" onClick={(e) => handleAddBtn(e, index)}>
          <img src={MinusBtn} alt="" />
          この経歴を削除
        </button>
      }
    </div>

    <div className="flex-box2-cont form-flex-box">
      <div className="box-item2 flex flex-col">
        <div className="form-tit">プロジェクト名 <span>*</span></div>
        <input id={"projectNameSelect"} type="text" className={"form-control projectName_"+index} placeholder="プロジェクト名入力" maxLength={100}
          onChange={(e) => handleCareerChange(e, index)}   value={name || ""}  ref={crwProjectRef}/>
        <div className={'projectName-error-text'+index} style={{display:"none",color:"red",fontSize:"12px"}}>
              
        </div>
      </div>
      <div className="form-flex-box flex space-between items-start">
        <div className="box-item flex flex-col">
          <div className="form-tit">役割 <span>*</span></div>
          <SelectBox id={'projectRoleSelect'} data={projectRoleList} 
            className={"projectRole_"+index}
            onChange={async (e) => {
            const arr = projectProcessDefault[e.target.value].split(',')
            const value = e.target.value
            const tempArr = []
            const tempProcess = []
            
            document.querySelectorAll(`.process-checked-box-${index}`).forEach(item => {
              item.checked = false;
            });
            
            await arr.map(processItem => {
              tempArr.push(processItem)
              const event = { target: { value: processItem, checked: true } }
              //handleProjectProcessChange(event, index)
            })
            tempArr.map(item => {
              const name = projectProcessList.filter(p => p.projectProcess === item)[0].projectProcessName
              tempProcess.push(name)
            })
            setProcess(tempProcess)
            handleCareerChangeAndProcess(e, index, tempArr, value)
            setRoleSelect(false)
          }} defaultValue={role || ""} />
          <div className={'projectRole-error-text'+index} style={{display:"none",color:"red",fontSize:"12px"}}>
              
          </div>
        </div>
        <div className="box-item flex flex-col">
          <div className="form-tit">期間(月数) <span>*</span></div>
          {/* select > input 변경 */}
          <div className={"minus-plus-wrap flex items-center input-group periodInputGroup_"+index}>
            <button className="minus-gray-btn" onClick={() => {handleClickMinus(index),handlePeriodChange(index)}}>
                <img src={MinusGrayBtn} alt="" />
            </button>
            <input id="projectPeriod" type="number" min={0} className={"form-control projectPeriod_"+index} placeholder="カ月(数字で入力してください)"

            onChange={(e) => 
            {e.target.value = e.target.value.replaceAll(".", "").replaceAll("-", "");
            handlePeriodChange(index)}} value={period} />
            <button className="plus-gray-btn" onClick={() => {handleClickPlus(index),handlePeriodChange(index)}}>
                <img src={PlusGrayBtn} alt="" />
            </button>
          </div>
            <div className={'projectPeriod-error-text'+index} style={{display:"none",color:"red",fontSize:"12px"}}>
            
            </div>
        </div>
      </div>
    </div>
    <div className="btn-flex-box flex items-start">
      <button className="btn btn-primary shrink-0" onClick={() => {
        setSelectPop(true);
      }} disabled={process.length <= 0}>担当工程
      </button>
      <div className="blue-btn-wrap flex items-center">
        {
          process.map((item, key) => {
            if (item) {
              return <div key={key} className="blue-btn no-after items-center flex">
                <span>{item}</span>
                <button className="blue-x-btn" onClick={() => {
                  // handleDelProcess(key);
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

    {/* 担当工程選択 */}
    <Modal
      show={selectPop}
      onHidden={() => {
        setSelectPop(false);
      }}
      backdrop="static"
      className="select-modal"
    >
      <ModalBody className="p-10 text-center">
        <div className="select-modal-pop">
          <div className="select-modal-tit">
            担当工程選択
          </div>
          <div className="select-input-wrap">
            {
              projectProcessList?.map((item, idx) => {
                const checkboxIndex = `${index}_${idx}`; 
                return <div className="form-check" key={idx}>
                  <input id={`process-${idx}-${item.projectProcess} process-${checkboxIndex}-${item.projectProcess}`} className={`form-check-input process-checked-box-${index}`}
                    type="checkbox" value={item.projectProcess}
                    onChange={(e) => {
                      handleProjectProcessChange(e, index);
                    }}
                    checked={process.includes(item.projectProcessName)}
                  />
                  <label           
                  htmlFor={`process-${checkboxIndex}-${item.projectProcess}`}
                  onClick={(e) => {
                    const checkbox = e.target.previousSibling;
                    if (checkbox.checked) {
                      checkbox.checked = false;
                    } else {
                      checkbox.checked = true;
                    }
                    handleProjectProcessChange({ target: checkbox }, index);
                  }}
                >
                  {item.projectProcessName}
                  </label>
                </div>
              })
            }
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="sel-btn-wrap flex space-between">
          {/* <button className="btn btn-outline-secondary w-auto" onClick={() => {
            const className = `.process-checked-box-${index}`
            const tempArr = [...process]
            document.querySelectorAll(className).forEach(async (item, key) => {
              if (!item.checked) {
                const e = { target: { ...item } }
                item.checked = true
                tempArr.push(item.parentNode.childNodes[1].textContent)
                console.log("tempArr:::",tempArr)
                handleProjectProcessChange(e, index, key)
              }
            })
            setProcess(tempArr)
          }}>
            すべて選択
          </button> */}
            <button className="btn btn-outline-secondary w-auto" onClick={() => {
              const className = `.process-checked-box-${index}`;
              const tempArr = [...process];
              document.querySelectorAll(className).forEach((item, key) => {
                if (!item.checked) {
                  item.checked = true;
                  const value = item.parentNode.childNodes[1].textContent;
                  if (!tempArr.includes(value)) {
                    handleProjectProcessChange({ target: item }, index, key);
                  }
                }
              });
            }}>
              すべて選択
            </button>
          
          <button className="btn btn-outline-secondary w-auto" onClick={() => {
            const className = `.process-checked-box-${index}`
            const tempArr = [...process]
            document.querySelectorAll(className).forEach((item, key) => {
              if (item.checked) {
                item.checked = false
                const value = item.parentNode.childNodes[1].textContent;
                if (tempArr.includes(value)) {
                  handleProjectProcessDelAll({ target: item }, index, key);
                }
              }
            })
          }}>
            すべて解除
          </button>
          <button className="btn btn-primary" onClick={() => {
            setSelectPop(false);
          }}>
            確認
          </button>
        </div>
      </ModalFooter>
    </Modal>
  </>
}


export default CareerReWrite
