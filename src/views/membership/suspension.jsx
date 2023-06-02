import { Modal, ModalBody, } from "@/base-components";
import { useState, useEffect } from "react";
import ServiceFetch from "../../../util/ServiceFetch";
import CheckToken from "../../../util/CheckToken";
import { useNavigate } from "react-router-dom";


const Suspension = () => {
  const navigate = useNavigate()
  const [isActive, setIsActive] = useState(false);
  const [suspensionRequestModal, suspensionRequest] = useState(false);
  const [resignState, setResignState] = useState()

  const handleClick = () => {
    setIsActive(current => !current);
  }

  const handleResignUser = () => {
    ServiceFetch('/user/resign', 'put', {
      resignStatus: resignState.resignStatus !== '2' ? '0' : '2',
      resignFlag: resignState.resignStatus === '2' ? '0' : '2',
    }).then((res) => {
      console.log(res)
      window.location.reload()
    })
  }

  useEffect(() => {
    ServiceFetch('/user/resign', 'get')
      .then((res) => {
        setResignState(res.result)
        console.log(res.result)
      })
  }, [])

  return (
    <>
      <div id="suspension" className={'membership'}>
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-lg font-bold lg:text-sm lg:font-normal">
            利用停止
          </div>
          <div className="py-10 px-5 text-center cont-wrap flex flex-col items-center justify-center">
            {
              resignState?.resignStatus === '0' ?
                <p className="font-bold">利用を停止する期間中、企業からの面接提案や<br className="hidden sm:block" />メッセージの受信が不可能になります。</p> :
                <p className="font-bold"><span className="text-primary">{resignState?.lockStartDatetime}</span> から利用停止中です。</p>
            }
            <div className="flex flex-end gap-3">
            <button type="button" className="btn btn-primary w-80 mt-10" onClick={() => { resignState?.resignStatus === '0' ? suspensionRequest(true) : handleResignUser() }}>
              {resignState?.resignStatus === '0' ? '進む' : '利用再開'}
            </button>
            {
              resignState?.resignStatus === '2'
              ? 
              <button></button>
              :
              <button type="button" className="btn btn-outline-secondary w-80 mt-10" onClick={() => {window.location.replace("/");}}>戻る</button>
            }
            </div>
          </div>
        </div>
      </div>

      {/* 이용정지 확인 */}
      <Modal
        show={suspensionRequestModal}
        onHidden={() => {
          suspensionRequest(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">本当に利用を停止しますか？</div>
          <div className="modal-subtit">
            利用停止中は保有しているポイントの利用が不可能です。<br />
            利用を停止しますか？
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                suspensionRequest(false);
                handleClick(true);
                handleResignUser()
              }}
            >
              はい
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                suspensionRequest(!suspensionRequestModal);
              }}
            >
              いいえ
            </a>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Suspension;
