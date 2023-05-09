import { useState } from 'react';
import ResumeMobile15 from "../../components/resume-mobile/resume-mobile-15";
import MobileBottom2 from "../../components/mobileBottom/mobile-bottom2";


const ResumeRegistMo15 = () => {
    const [selectPop, setselectPop]= useState(false);
    const [rsFileDocument, setRsFileDocument] = useState([])

    return (
        <>
            <div className="resume-mng">
                <div className="mo-resume-mng">
                    <ResumeMobile15  progress="progress-bar  w-1/5 bg-green"
                                     rsFileDocument={rsFileDocument}
                                     setRsFileDocument={setRsFileDocument}/>
                </div>
            </div>
            <MobileBottom2 rsFileDocument={rsFileDocument} />
        </>
    );
};
export default ResumeRegistMo15;
