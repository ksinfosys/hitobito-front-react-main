import {
  Lucide,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@/base-components";
import { useEffect, useState } from "react";

import { useRecoilState } from "recoil";
import { mobileStatus } from "@/stores/mobile-status";
import MobileSelectBox from "@/views/resume-mng/mobile-items/MobileSelectBox";
import axios from "axios";
import { getCookie } from "../../../../utils/cookie";

const UserAge = () => {
  // 연령
  const [AgeModal, setAgeModal] = useState(false);

  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [slctAge, setSlctAge] = useState(mobile.userAge);

  const [year, setYear] = useState(
    mobile.api && mobile.userAge
      ? parseInt(
          mobile.api.userAgeList.filter(
            (item) => item.userAge === mobile.userAge
          )[0].userAgeName
        )
      : 0
  );

  const handleAgeCalculator = (year) => {
    return new Date().getFullYear() - parseInt(year) + 1 + "歳";
  }

  const handleUpdateMobileBody = (e) => {
    setSlctAge(e.target.value);

    setYear(
      parseInt(
        e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text.toString()
      )
    );

  };

  const modUserAgeOnClick = () => {
    axios.put("api/resume/edit/scode", {
      sCode: slctAge
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
            userAge: slctAge
          });
          alert("年齢変更に成功しました。");
          setAgeModal(false);
        })() : console.log("fetching error:::", response);
    })
  }

  useEffect(() => {
    
  },[])
  
  const getUserAge = (code) => {
    let cInfo = mobile.api.userAgeList.filter(userAge => userAge.userAge === code);
    return cInfo[0]?.userAgeName;
  }
  
  return (
    <div className="change-box-item flex items-center">
      <div className="change-box-tit">年齢</div>
      <div className="change-box-cont">
        {getUserAge(mobile.userAge)}年 <span className="blue-text">{handleAgeCalculator(getUserAge(mobile.userAge))}</span>
      </div>
      <div className="change-box-btn">
        <button className="btn btn-primary"
         onClick={() => {
          setAgeModal(true);
        }}
        >変更</button>
      </div>

      {/* 연령 */}
      <Modal
        show={AgeModal}
        onHidden={() => {
          setAgeModal(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">年齢</h2>
            <button
              onClick={() => {
                setAgeModal(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">誕生年を選択してください。</div>

            <div className="mobile-drop-wrap">
              <button className="btn btn-skyblue2 w_full mt-2">
                {year ? handleAgeCalculator(year) : "0세"}
              </button>
              <div className="mobile-drop-wrap">
                <MobileSelectBox
                  id={"userAge"}
                  data={mobile.api && mobile.api.userAgeList}
                  value={mobile.userAge}
                  onChange={handleUpdateMobileBody}
                />
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
                setAgeModal(false);
              }}
            >
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={modUserAgeOnClick}>
              変更完了
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default UserAge;
