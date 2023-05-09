import { Modal, ModalBody, ModalFooter, } from "@/base-components";
import { useState } from "react";

import AddBtn from "@/assets/images/add-btn.svg";
import MinusBtn from "@/assets/images/minus-icon.svg";
import InchargeAdd from "@/assets/images/incharge-add.svg";
import blueX from "@/assets/images/blue-x.svg";
import SelectBox from "../../../../views/resume-mng/desktop-items/SelectBox";
import { useEffect } from "react";

const MajorCareer = ({
  index,
  projectProcessList,
  handleAddBtn,
  handleProjectProcessChange,
  projectProcessDefault,
  career,
  setCareer,
  roleList
}) => {


  // 버튼 클래스 변경
  const [selectPop, setselectPop] = useState(false);
  const [process, setProcess] = useState([]);


  const handleDelProcess = (idx) => {
    const temp = [...process];
    temp.splice(idx, 1);
    setProcess(temp);
  };

  useEffect(() => {
    const className = `.process-checked-box-${index}`
    document.querySelectorAll(className).forEach(item => {
      if (!item.checked) {
        if (career[index].projectProcess.indexOf(item.value) !== -1) item.checked = true
      }
    })
  }, [selectPop])


  return <>

    <div className="">
      <div className="mo-resume-tit flex space-between items-center">
        主要経歴を入力してください。
        {index === 0 ? (
          <button
            className="add-btn flex items-center"
            onClick={(e) => handleAddBtn(e, index)}
          >
            <img src={AddBtn} alt="" />
            主要経歴追加
          </button>
        ) : (
          <button
            className="minus-btn flex items-center"
            onClick={(e) => handleAddBtn(e, index)}
          >
            <img src={MinusBtn} alt="" />
            主要経歴抜き
          </button>
        )}
      </div>
    </div>
    <div className="mobile-drop-wrap flex flex-col gap-3 mt-5">
      <div className="flex items-center gap-2">
        <div className="drop-left-tit w-24">プロジェクト名</div>
        <div className="drop-right-cont w-full">
          <input type={'text'} value={career[index].projectName} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="drop-left-tit w-24">期間</div>
        <div className="drop-right-cont w-full">
          <input type={'text'} value={career[index].projectPeriod} />

        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="drop-left-tit w-24">役割</div>
        <div className="drop-right-cont flex items-center gap-2 w-full">
          <SelectBox
            id={"projectRole"}
            data={roleList}
            defaultValue={career[index].projectRole}
            value={career[index].projectRole}
            onChange={(e) => {
              const arr = projectProcessDefault[e.target.value].split(',')
              const temp = [...career]
              const tempArr = []
              arr.map(processDefaultItem => {
                tempArr.push(processDefaultItem)
              })
              temp[index].projectRole = e.target.value
              temp[index].projectProcess = tempArr
              setCareer(temp)
              const className = `.process-checked-box-${index}`
              document.querySelectorAll(className).forEach(item => item.checked = false)
            }}
          />
          {/*<button
            className={`btn btn-rounded ${buttonClass} btn-role-select w-130`}
            onClick={handleButtonClick}
          >
            복수 선택
          </button>*/}
        </div>
      </div>
      <div className="incharge-select">
        <div className="incharge-tit flex items-center gap-2">
          担当工程{" "}
          <button
            onClick={() => {
              setselectPop(true);
            }}
          >
            <img src={InchargeAdd} alt="" />
          </button>
        </div>
        <div className="blue-btn-wrap flex items-center">
          {
            career[index].projectProcess?.map((item, key) => {
              if (item) {
                return <div key={key} className="blue-btn no-after items-center flex">
                  <span>{
                    projectProcessList.filter(filter => filter.projectProcess === item)[0]?.projectProcessName
                  }</span>
                  <button className="blue-x-btn" onClick={(e) => {
                    const temp = [...career]
                    temp[index].projectProcess.splice(key, 1)
                    setCareer(temp)
                    const className = `.process-checked-box-${index}`

                    document.querySelectorAll(className).forEach(it => {
                      if (it.value === item) it.checked = false
                    })
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
    <br />

    <Modal
      show={selectPop}
      onHidden={() => {
        setselectPop(false);
      }}
      className="select-modal mo-select-modal"
    >
      <ModalBody className="p-10 text-center">
        <div className="select-modal-pop">
          <div className="select-modal-tit">担当工程選択</div>
          <div className="select-input-wrap">
            {projectProcessList?.map((item, idx) => {
              return (
                <div className="form-check" key={idx}>
                  <input
                    id="projectProcess vertical-form-3"
                    className={`form-check-input form-check-input process-checked-box-${index}`}
                    type="checkbox"
                    value={item.projectProcess}
                    onChange={(e) => {
                      const temp = [...career]
                      temp[index].projectProcess.push(item.projectProcess)
                      setCareer(temp)
                    }}
                  />
                  <label
                    className={`form-check-label  label_${index}_${item.projectProcess}`}
                    htmlFor="vertical-form-3"
                  >
                    {item.projectProcessName}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="mo-sel-btn-wrap flex space-between">
          <button
            className="btn btn-primary"
            onClick={() => {

              setselectPop(false);
            }}
          >
            確認
          </button>
        </div>
      </ModalFooter>
    </Modal>
  </>
};

export default MajorCareer;
