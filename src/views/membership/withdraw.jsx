import { Modal, ModalBody, } from "@/base-components";
import { useEffect, useState } from "react";
import ServiceFetch from "../../../util/ServiceFetch";
import { delCookie } from "../../utils/cookie";
import { useNavigate } from "react-router-dom";
import CheckToken from "../../../util/CheckToken";
import {useLiff} from "react-liff";

function Withdraw() {

  const navigate = useNavigate();
  const {liff } = useLiff();

  const [withdrawConfirmModal, withdrawConfirm] = useState(false);

  const handleQuitUser = () => {
    ServiceFetch('/user/quit', 'put')
      .then((res) => {
        if (CheckToken(res, navigate)){
          liff.logout()
        }
      })
  }

  useEffect(() => {
    ServiceFetch('/user/quit', 'get')
      .then((res) => {
        console.log(res)
      })
  }, [])

  return (
    <>
      <div id="withdraw" className="membership">
        <div className="box-type-default">
          <div className="p-5 border-b border-slate-200/60 text-lg font-bold lg:text-sm lg:font-normal">
            会員退会
          </div>
          <div className="cont-wrap py-10 px-5 text-center flex flex-col items-center justify-center">
            <p className="font-bold">会員の退会をした場合、HITOBITOサービスが<br className="hidden sm:block" />利用できなくなります。</p>
            <button type="button" className="btn btn-primary w-80 mt-10" onClick={() => {
              withdrawConfirm(true);
            }}>確認
            </button>
          </div>
        </div>
      </div>
      {/* 회원탈퇴 확인 */}
      <Modal
        show={withdrawConfirmModal}
        onHidden={() => {
          withdrawConfirm(false);
        }}
      >
        <ModalBody className="p-10 text-center">
          <div className="modal-tit">会員の退会をします。</div>
          <div className="modal-subtit">
            退会した場合、保有しているポイントは消滅します。<br />
            会員の退会をしますか？
          </div>
          <div className="flex flex-end gap-3">
            <a
              href="#"
              className="btn btn-primary"
              onClick={() => {
                withdrawConfirm(false);
                handleQuitUser();
              }}
            >
              確認
            </a>
            <a
              href="#"
              className="btn btn-outline-secondary"
              onClick={() => {
                withdrawConfirm(!withdrawConfirmModal);
              }}
            >
              キャンセル
            </a>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Withdraw;
