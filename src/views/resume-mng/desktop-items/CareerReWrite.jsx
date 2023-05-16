import { Modal, ModalBody, ModalFooter } from "@/base-components";
import { useEffect, useState } from 'react';
import AddBtn from "@/assets/images/add-btn.svg";
import MinusBtn from "@/assets/images/minus-icon.svg";
import blueX from "@/assets/images/blue-x.svg";
import SelectBox from "./SelectBox";


const CareerReWrite = ({
  index,
  addState,
  projectRoleList,
  projectProcessList,
  handleAddBtn,
  handleCareerChange,
  handleProjectProcessChange,
  handleProjectProcessDel,
  projectProcessDefault,
  handleCareerChangeAndProcess,
  name,
  role,
  period,
  process_re = process_re.toString().split(','),
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

  useEffect(() => {
    const className = `.process-checked-box-${index}`
    document.querySelectorAll(className).forEach(item => {
      if (item.checked) {
        const targetText = document.querySelector(`.label_${index}_${item.value}`).textContent
        if (process.indexOf(targetText) === -1) item.checked = false
      }
    })
  }, [selectPop])

  useEffect(() => {
    const tempProcess = process_re.toString().split(',')
    for (let i = 0; i < tempProcess.length; i++) {
      for (let j = 0; j < projectProcessList.length; j++) {
        if (projectProcessList[j].projectProcess === tempProcess[i]) {
          setProcess(prevState => [...prevState, projectProcessList[j].projectProcessName])
          break;
        }
      }
    }
  }, [])

  return <>
    <div className="flex-box2-tit flex space-between">
      <div className="box2-tit">主要経歴</div>

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

    <div className="flex-box2-cont form-flex-box">
      <div className="box-item2 flex flex-col">
        <div className="form-tit">プロジェクト名 <span>*</span></div>
        <input id="projectNameSelect" type="text" className="form-control" placeholder="プロジェクト名入力"
          onChange={(e) => handleCareerChange(e, index)} value={name} />
      </div>
      <div className="form-flex-box flex space-between items-start">
        <div className="box-item flex flex-col">
          <div className="form-tit">役割 <span>*</span></div>
          <SelectBox id={'projectRoleSelect'} data={projectRoleList} onChange={async (e) => {
            const arr = projectProcessDefault[e.target.value].split(',')
            const value = e.target.value
            const tempArr = []
            const tempProcess = []

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
          }} defaultValue={role} />
        </div>
        <div className="box-item flex flex-col">
          <div className="form-tit">期間 <span>*</span></div>
          {/* select > input 변경 */}
          <input id="projectPeriodSelect" type="number" min={0} className="form-control" placeholder="カ月(数字で入力してください)"
            onChange={(e) => handleCareerChange(e, index)} value={period} />
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

    {/* 担当工程選択 */}
    <Modal
      show={selectPop}
      onHidden={() => {
        setSelectPop(false);
      }}
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
                return <div className="form-check" key={idx}>
                  <input id={`process-${idx}-${item.projectProcess}`} className={`form-check-input process-checked-box-${index}`}
                    type="checkbox" value={item.projectProcess}
                    onChange={(e) => {
                      const tempArr = [...process]
                      tempArr[idx] = item.projectProcessName
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
                    htmlFor={`process-${idx}-${item.projectProcess}`}>{item.projectProcessName}</label>
                </div>
              })
            }
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="sel-btn-wrap flex space-between">
          <button className="btn btn-outline-secondary w-auto" onClick={() => {
            const className = `.process-checked-box-${index}`
            const tempArr = [...process]
            document.querySelectorAll(className).forEach(async (item, key) => {
              if (!item.checked) {
                const e = { target: { ...item } }
                item.checked = true
                tempArr.push(item.parentNode.childNodes[1].textContent)
                handleProjectProcessChange(e, index)
              }
            })
            setProcess(tempArr)
          }}>
            すべて選択
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
