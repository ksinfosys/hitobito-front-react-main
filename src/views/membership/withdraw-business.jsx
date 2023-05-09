import { Modal, ModalBody, } from "@/base-components";
import { useState, useEffect } from "react";
import ServiceFetch from "../../../util/ServiceFetch";
import CheckToken from "../../../util/CheckToken";
import { useNavigate } from "react-router-dom";

function WithdrawBusiness() {
    const navigate = useNavigate();

    const [widthdrawConfirm, setwidthdrawConfirm] = useState(false);

    const handleQuitBusiness = () => {
        ServiceFetch('/company/quit', 'put')
            .then((res) => {
                CheckToken(res, navigate)
            })
    }

    useEffect(() => {
    }, [])

    return (
        <>
            <div id="withdraw" className="membership">
                <div className="box-type-default">
                    <div className="p-5 border-b border-slate-200/60 text-sm">
                        会員退会
                    </div>
                    <div className="cont-wrap pt-10 text-center flex flex-col items-center justify-center">
                        <p className="font-bold">退会時にポイントの残高が残っている場合でも、換金や返金などの払戻しが出来ません。 <br />
                            すべてのポイントを使い切ってから退会することをお勧めします。</p>
                        <button type="button" className="btn btn-pending w-80 mt-10 h-48" onClick={() => { setwidthdrawConfirm(true); }}>確認</button>
                    </div>
                </div>
            </div>
            {/* 회원탈퇴 확인 */}
            <Modal
                show={widthdrawConfirm}
                onHidden={() => {
                    setwidthdrawConfirm(false);
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
                            className="btn btn-pending"
                            onClick={() => {
                                setwidthdrawConfirm(false);
                                handleQuitBusiness()
                            }}
                        >
                            確認
                        </a>
                        <a
                            href="#"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setwidthdrawConfirm(!widthdrawConfirm);
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

export default WithdrawBusiness;
