import Download from "@/assets/images/download-icon-sky.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import { useRecoilState } from "recoil";
import { mobileStatus } from "../../stores/mobile-status";
import { useEffect } from "react";

const ResumeMobile12 = (props) => {


  const [mobile, setMobileStatus] = useRecoilState(mobileStatus);

  const handleUpdateMobileBody = (e) => {
    const key = e.target.id.replaceAll(' regular-form-1', '').replaceAll(' checkbox-events', '')
    let value = e.target.value

    if (key === 'phoneNumberFlag' || key === 'userEmailFlag') {
      value = mobile[key] === 0 ? 1 : 0
    }

    setMobileStatus({
      ...mobile,
      [key]: value
    })
  }

  useEffect(() => {
    console.log(mobile)
  }, [mobile])

  return (
    <>
      <div className="mobile-resume-wrap">
        <div className="flex items-center gap-3 space-between">
          <MobileProgress />
          <button className="btn btn-sm btn-skyblue w-36 flex gap-1 items-center">
            <img src={Download} alt="" />
            一時保存
          </button>
        </div>
        <div className="mo-resume-tit">
          メールアドレスと電話番号を入力し、公開したい <br />
          項目のボタンを設定してください。
        </div>
        <div className="mo-resume-subtit">
          少なくとも1つは公開でボタンを設定してください。あなたが面談依頼を承諾した企業だけに公開されます。
        </div>
        <div className="mobile-drop-wrap">
          <div className="flex items-center gap-2">
            <input id="userEmail regular-form-1" value={mobile.userEmail} type="text" className="form-control" placeholder="メールアドレス入力" onChange={handleUpdateMobileBody} />
            <div className="toggle-wrap">
              <div className="form-check form-switch flex flex-col items-end">
                <label className="form-check-label" htmlFor="checkbox-events">
                  {mobile.userEmailFlag === 1 ? '公開' : '非公開'}
                </label>
                <input
                  className="show-code form-check-input ml-auto"
                  type="checkbox"
                  id="userEmailFlag checkbox-events"
                  onChange={handleUpdateMobileBody}
                  checked={mobile.userEmailFlag === 1}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input id="phoneNumber regular-form-1" value={mobile.phoneNumber} type="text" className="form-control" placeholder="'-なしで数字だけ入力してください。" onChange={handleUpdateMobileBody} />
            <div className="toggle-wrap">
              <div className="form-check form-switch flex flex-col items-end">
                <label className="form-check-label" htmlFor="checkbox-events">
                  {mobile.phoneNumberFlag === 1 ? '公開' : '非公開'}
                </label>
                <input
                  className="show-code form-check-input ml-auto"
                  type="checkbox"
                  id="phoneNumberFlag checkbox-events"
                  onChange={handleUpdateMobileBody}
                  checked={mobile.phoneNumberFlag === 1}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ResumeMobile12;
