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
const Country = () => {

  // 国籍모달
  const [Nationality, setnNationality] = useState(false);
  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);
  const [slctCountry, setSlctCountry] = useState(mobile.country);

  const handleUpdateMobileBody = (e) => {
    setSlctCountry(e.target.value);
  };

  const cancleModCountry = () => {
    setnNationality(false);
  }

  const modCountryOnClick = () => {
    axios.put("api/resume/edit/scode", {
      sCode: slctCountry
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
          country: slctCountry
        });
        alert("国籍変更に成功しました。");
        setnNationality(false);
      })() : console.log("fetching error:::", response);
    })
  }

  const getCountryName = (code) => {
    let cInfo = mobile.api.countryList.filter(country => country.country === code);
    return cInfo[0]?.countryName;
  }

  return (
    <div className="change-box-item flex items-center">
      <div className="change-box-tit">国籍</div>
      <div className="change-box-cont">{getCountryName(mobile.country)}</div>
      <div className="change-box-btn">
        <button
          className="btn btn-primary"
          onClick={() => setnNationality(true)}
        >
          変更
        </button>
      </div>

      {/* 国籍 */}
      <Modal
        show={Nationality}
        onHidden={() => {
          setnNationality(false);
        }}
      >
        <ModalHeader>
          <div className="flex space-between items-center w-full">
            <h2 className="modal-tit">国籍</h2>
            <button
              onClick={() => {
                setnNationality(false);
              }}
            >
              <Lucide icon="X" className="w-4 h-4" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="change_modal">
          <div className="mobile-resume-wrap">
            <div className="mo-resume-tit">国籍を選択してください。</div>
            <div className="mobile-drop-wrap">
              <MobileSelectBox
                id={"country"}
                value={mobile.country}
                data={mobile.api && mobile.api.countryList}
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
              onClick={cancleModCountry}
            >
              取消
            </button>
            <button type="button" className="btn btn-primary" onClick={modCountryOnClick}>
              変更完了
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Country;
