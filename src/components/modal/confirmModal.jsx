

import { Modal, ModalBody } from "@/base-components";

const ConfirmModal = (props) => {
    return (
        <>
            <Modal
                show={pwdError}
                onHidden={() => {
                    setpwdError(false);
                }}
            >
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">비밀번호가 맞지 않습니다.</div>
                    <div className="modal-subtit">
                        등록하신 아이디와 비밀번호가 일치하지 않습니다. <br />
                        다시 확인해주세요.
                    </div>
                    <div className="flex flex-end gap-3">
                        <a
                            href="#"
                            className="btn btn-primary"
                            onClick={() => {
                                setpwdError(false);
                            }}
                        >
                            확인
                        </a>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};
export default ConfirmModal;
