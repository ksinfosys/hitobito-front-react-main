import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@/base-components";
import axios from "axios";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { mobileStatus } from "../../../../stores/mobile-status";
import { getCookie } from "../../../../utils/cookie";
import MobileSelectBox from "../../../../views/resume-mng/mobile-items/MobileSelectBox";


const Salary = () => {
  // 希望年収 변경 모달
  const [SalaryModal, setSalary] = useState(false);
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [slctIncome, setSlctIncome] = useState(mobile.hopeIncome);

  const handleUpdateMobileBody = (e) => {
    setSlctIncome(e.target.value)
  }

  const modIncomeOnClick = () => {
    axios.put("api/resume/edit/scode", {
      sCode: slctIncome
    }, {
      withCredentials: true,
      headers: {
        accessToken: getCookie("accessToken"),
        lastLoginTime: getCookie("lastLoginTime"),
      }
    }).then(response => {
      response.data.resultCode === '200' ? (() => {
        setMobileStatus({
          ...mobile,
          hopeIncome: slctIncome
        });
        alert("希望年俸変更に成功しました。");
        setSalary(false);
      })() : console.log("fetching error:::", response);
    })
  }

  const getIncomeTxt = (code) => {
    let cInfo = mobile.api.hopeIncomeList.filter(income => income.hopeIncome === code);
    return cInfo[0]?.hopeIncomeName;
  }

  return (
    <div className="change-box-item flex items-center">
      <div className="flex justify-start flex-col">
        <div className="change-box-tit">希望年収</div>
        <div className="change-box-cont">{getIncomeTxt(mobile.hopeIncome)}</div>
      </div>
      <div className="change-box-btn">
        <button className="btn btn-primary"
          onClick={() =>
            setSalary(true)
          }
        >変更</button>
      </div>

      {/* 希望年収 변경 */}
      <Modal
        show={SalaryModal}
        onHidden={() => {
          setSalary(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">希望年収</h2>
            <button
              onClick={() => {
                setSalary(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">
              希望年収を入力してください。
            </div>
            <div className="mobile-drop-wrap">
              <MobileSelectBox
                id={"country"}
                value={mobile.hopeIncome}
                data={mobile.api && mobile.api.hopeIncomeList}
                onChange={handleUpdateMobileBody}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setSalary(false);
              }}
            >
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={modIncomeOnClick}>
              変更完了
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Salary;
