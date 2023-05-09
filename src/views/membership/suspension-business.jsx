import { Modal, ModalBody, } from "@/base-components";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import ServiceFetch from "../../../util/ServiceFetch";

function SuspensionBusiness() {
    const [isActive, setIsActive] = useState(false);
    const [suspensionRequestModal, setsuspensionRequestModal] = useState(false);
    const [resignState, setResignState] = useState()

    const handleClick = () => {
        setIsActive(current => !current);
    }

    const handleResignBusiness = () => {
        ServiceFetch('/company/resign', 'put', {
            resignStatus: resignState.resignStatus !== '2' ? '0' : '2',
            resignFlag: resignState.resignStatus === '2' ? '0' : '2',
        }).then((res) => {
            // console.log(res)
            window.location.reload()
        })
    }

    useEffect(() => {

    }, [])

    return (
        <>
            <div id="suspension" className={isActive ? "membership display-none" : "membership"}>
                <div className="box-type-default">
                    <div className="p-5 border-b border-slate-200/60 text-sm">
                        利用停止
                    </div>
                    <div className="pt-10 text-center cont-wrap flex flex-col items-center justify-center">
                        {
                            resignState?.resignStatus === '0' ?
                                <p className="font-bold">利用停止中には企業からの面談の依頼及び <br className="hidden sm:block" />メッセージの受信ができません。</p> :
                                <p className="font-bold"><span className="text-primary">{resignState?.lockStartDatetime}</span> から利用停止中です。</p>
                        }
                        <button type="button" className="btn btn-primary w-80 mt-10" onClick={() => { resignState?.resignStatus === '0' ? suspensionRequest(true) : handleResignUser() }}>
                            {resignState?.resignStatus === '0' ? '利用停止' : '利用再開'}
                        </button>
                    </div>
                </div>
            </div>
            {/* 이용정지 확인 */}
            <Modal
                show={suspensionRequestModal}
                onHidden={() => {
                    setsuspensionRequestModal(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">利用を停止します。</div>
                    <div className="modal-subtit">
                        利用停止中には企業からの面談の依頼及びメッセージの <br />
                        受信ができません。

                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-business"
                            onClick={() => {
                                setsuspensionRequestModal(false);
                                handleClick(true);
                                handleResignBusiness()
                            }}
                        >
                            確認
                        </a>
                        <a
                            href="#"
                            className="btn btn-cancle-type1"
                            onClick={() => {
                                setsuspensionRequestModal(!suspensionRequestModal);
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

export default SuspensionBusiness;
