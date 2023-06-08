import { useEffect, useState } from 'react';
import {
    Lucide,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
} from "@/base-components";

import Download from "@/assets/images/download-icon-sky.svg";
import AddBtn from "@/assets/images/add-btn.svg";
import blacksmallX from "@/assets/images/black-small-x.svg";
import MobileProgress from "../../views/resume-mng/mobile-items/MobileProgress";
import { useRecoilState } from "recoil";
import { mobileStatus } from "../../stores/mobile-status";




const ResumeMobile15 = (props) => {

    //  파일 업로드
    const [fileNames, setFileNames] = useState([]);

    // 파일 업로드 부분
    const handleFileUpload = (event) => {
        if (props.rsFileDocument.length >= 5) {
            alert("ファイルは４つまで添付できます。")
            return false;
        }
        const files = Array.from(event.target.files);

        const fileSize = files.map(fs => fs.size);
        if(fileSize>1024*1024*10){
          setResumeLabel("ファイルの容量は10MBを超えることはできません。");
          setResumeAlert(true); 
          return false;
        }

        files.map(file => {
            console.log(file)
            props.setRsFileDocument(prevItem => [...prevItem, file])
            setFileNames(prevItem => [...prevItem, file.name])
        })
    };
    const handleDeleteFile = (index) => {
        const updatedNames = [...fileNames];
        const updatedDocument = [...props.rsFileDocument];

        updatedNames.splice(index, 1);
        updatedDocument.splice(index, 1);

        setFileNames(updatedNames);
        props.setRsFileDocument(updatedDocument);
    };

    useEffect(() => {
        const formData = new FormData()
        props.rsFileDocument.map((file) => {
            formData.append(file, 'rsFileDocument')
        })
    }, [props.rsFileDocument])

    useEffect(() => {

    }, [])


    // 기본정보모달
    const [basic, setBasic] = useState(false);

    // 업무経歴모달
    const [career, setCareer] = useState(false);

    // 스킬세트모달
    const [skillset, setSkillset] = useState(false);

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
                <div className="">
                    <div className="mo-resume-tit">
                        <div className='flex items-center justify-between fs13'>
                            履歴書に添付したいファイルがあれば<br />添付してください。 fdfdf
                            <div className="attach-tit-wrap flex items-center">
                                <div className="filebox attach-tit flex items-center">
                                    <label htmlFor="file02" className="flex items-center cursor-pointer add-career-btn">
                                        <img src={AddBtn} alt="" />
                                        ファイル追加
                                        <input type="file" id="file02" onChange={handleFileUpload} />
                                        {/* <img src={attachIcon} alt="" className="ml-2" /> */}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="mobile-drop-wrap">
                    <div className="attach-wrap">
                        <div className="flex flex-col attach-cont-wrap">
                            {fileNames.map((name, index) => (
                                <div className="attach-cont-item flex items-center space-between border-b" key={index}>
                                    <input className="upload-name mr-2 attach-cont-tit" value={name} placeholder="" readOnly />
                                    <button className="attach-cont-btn" onClick={() => handleDeleteFile(index)}>
                                        <img src={blacksmallX} alt="" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-4">
                    <button className="btn btn-outline-primary w-full" onClick={() => {
                        setBasic(true)
                    }}>基本情報</button>
                    <button className="btn btn-outline-primary w-full" onClick={() => {
                        setCareer(true)
                    }}>業務経歴</button>
                    <button className="btn btn-outline-primary w-full" onClick={() => {
                        setSkillset(true)
                    }}>スキルセット</button>
                </div>
            </div>

            {/* 기본정보 모달 */}
            <Modal
                show={basic}
                onHidden={() => {
                    setBasic(false);
                }}
            >
                <ModalHeader>
                    <div className="flex space-between items-center w-full">
                        <h2 className="modal-tit">基本情報</h2>
                        <button
                            onClick={() => {
                                setBasic(false);
                            }}
                        >
                            <Lucide icon="X" className="w-4 h-4" />
                        </button>
                    </div>
                </ModalHeader>
                <ModalBody className="change_modal">
                    <div className="mobile-resume-wrap change basic1">
                        <div className="change-box">
                            <div className="change-box-item flex items-center">
                                <div className="change-box-tit">国籍</div>
                                <div className="change-box-cont">日本</div>
                            </div>
                            <div className="change-box-item flex items-center">
                                <div className="change-box-tit">年齢</div>
                                <div className="change-box-cont">
                                    2002年 <span className="blue-text">20歳</span>
                                </div>
                            </div>
                            <div className="change-box-item flex items-center">
                                <div className="change-box-tit">性別</div>
                                <div className="change-box-cont">男性</div>
                            </div>
                            <div className="change-box-item flex items-center">
                                <div className="change-box-tit">最終学歴</div>
                                <div className="change-box-cont">大学 (学士)</div>
                            </div>
                            <div className="change-box-item flex items-center">
                                <div className="change-box-tit">最終学校名</div>
                                <div className="change-box-cont">早稲田大学</div>
                            </div>
                            <div className="change-box-item flex items-center">
                                <div className="change-box-tit">専攻名　</div>
                                <div className="change-box-cont">電算学</div>
                            </div>
                        </div>
                        <div className="change-box">
                            <div className="change-box-item flex items-center">
                                <div className="change-box-tit">経歴</div>
                                <div className="change-box-cont">5年以上</div>
                            </div>
                            <div className="change-box-item flex items-center">
                                <div className="change-box-tit">在職中の会社の業種</div>
                                <div className="change-box-cont">SI業界 / Sier（メーカ系）</div>
                            </div>
                            <div className="change-box-item flex items-center">
                                <div className="change-box-tit">現在の職種</div>
                                <div className="change-box-cont">ITコンサルタント / 情報化戦略</div>
                            </div>
                            <div className="change-box-item flex items-center">
                                <div className="change-box-tit">希望年収</div>
                                <div className="change-box-cont">1,100万円以上</div>
                            </div>
                            <div className="change-box-item flex items-center">
                                <div className="change-box-tit">居住地</div>
                                <div className="change-box-cont">北海道</div>
                            </div>
                            <div className="change-box-item flex items-start">
                                <div className="change-box-tit">将来の目標</div>
                                <div className="change-box-cont">
                                    ジェネラリスト / <br />
                                    ジェネラルマネージャー
                                </div>
                            </div>
                        </div>
                        <div className="change-box">
                            <div className="change-box-item flex items-center">
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <div className="change-box-tit">イーメール</div>
                                        <div className="change-box-cont">alkjsdhf87@jp.kr</div>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <div className="change-box-tit">連絡先</div>
                                        <div className="change-box-cont">123456789</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="w-full">
                    <button type="button" className="btn btn-primary w-full" onClick={() => {
                        setBasic(false);
                    }}>
                        確認
                    </button>
                </ModalFooter>
            </Modal>

            {/* 업무経歴 모달 */}
            <Modal
                show={career}
                onHidden={() => {
                    setCareer(false);
                }}
            >
                <ModalHeader>
                    <div className="flex space-between items-center w-full">
                        <h2 className="modal-tit">業務経歴</h2>
                        <button
                            onClick={() => {
                                setCareer(false);
                            }}
                        >
                            <Lucide icon="X" className="w-4 h-4" />
                        </button>
                    </div>
                </ModalHeader>
                <ModalBody className="change_modal">
                    <div className="mobile-resume-wrap change basic1">
                        <div className="career-box mt-6">
                            <div className="career-box-tit flex space-between items-center">
                                プロジェクト名
                            </div>
                            <div className="career-box-subtit">
                                ウェブデザイナー
                                <br />
                                2022. 07. 11
                            </div>
                            <div className="career-box-incharge">
                                <div className="career-box-incharge-tit">担当工程</div>
                                <div className="career-box-incharge-cont">
                                    <span>要件分析</span>
                                    <span>見積作成</span>
                                    <span>製造</span>
                                    <span>詳細設計</span>
                                    <span>基本設計</span>
                                </div>
                            </div>
                        </div>
                        <div className="career-box mt-6">
                            <div className="career-box-tit flex space-between items-center">
                                プロジェクト名
                            </div>
                            <div className="career-box-subtit">
                                ウェブデザイナー
                                <br />
                                2022. 07. 11
                            </div>
                            <div className="career-box-incharge">
                                <div className="career-box-incharge-tit">担当工程</div>
                                <div className="career-box-incharge-cont">
                                    <span>要件分析</span>
                                    <span>見積作成</span>
                                    <span>製造</span>
                                    <span>詳細設計</span>
                                    <span>基本設計</span>
                                </div>
                            </div>
                        </div>
                        <div className="career-box mt-6">
                            <div className="career-box-tit flex space-between items-center">
                                プロジェクト名
                            </div>
                            <div className="career-box-subtit">
                                ウェブデザイナー
                                <br />
                                2022. 07. 11
                            </div>
                            <div className="career-box-incharge">
                                <div className="career-box-incharge-tit">担当工程</div>
                                <div className="career-box-incharge-cont">
                                    <span>要件分析</span>
                                    <span>見積作成</span>
                                    <span>製造</span>
                                    <span>詳細設計</span>
                                    <span>基本設計</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="w-full">
                    <button type="button" className="btn btn-primary w-full" onClick={() => {
                        setCareer(false);
                    }}>
                        確認
                    </button>
                </ModalFooter>
            </Modal>


            {/* 스킬세트 모달 */}
            <Modal
                show={skillset}
                onHidden={() => {
                    setSkillset(false);
                }}
            >
                <ModalHeader>
                    <div className="flex space-between items-center w-full">
                        <h2 className="modal-tit">スキルセット</h2>
                        <button
                            onClick={() => {
                                setSkillset(false);
                            }}
                        >
                            <Lucide icon="X" className="w-4 h-4" />
                        </button>
                    </div>
                </ModalHeader>
                <ModalBody className="change_modal">
                    <div className="mobile-resume-wrap change basic1">
                        <span className="blue-text">登録されたスキルリスト</span>
                        <div className="skill-list-wrap">
                            <div className="skill-list-cont">
                                <div className="blue-btn-wrap flex gap-2 items-center">
                                    <div className="blue-btn">
                                        <span>Framework</span>
                                        <span>JAVA</span>
                                        <span>3年以上</span>
                                    </div>
                                    <div className="blue-btn">
                                        <span>言語</span>
                                        <span>JAVA Script</span>
                                        <span>3年以上</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter className="w-full">
                    <button type="button" className="btn btn-primary w-full" onClick={() => {
                        setSkillset(false);
                    }}>
                        確認
                    </button>
                </ModalFooter>
            </Modal>
        </>
    );
};
export default ResumeMobile15;
