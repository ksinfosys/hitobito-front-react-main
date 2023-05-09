import React, { useState, useEffect } from "react";
import moment from "moment";

const MessageBoxList02 = ({data, msgIdx, msgTypeName, nickname, msgTitle, msgSendDate, replyCount, msgIdxes, setMsgIdxes, allCheckbox, setReceptionState, setMsgModal, info, msgData, setMsgData}) => {

  // 체크박스 상태
  const [isChecked, setIsChecked] = useState(false);

  // 체크박스 인식
  const handleCheckboxChange = (idx, data) => {
    setIsChecked(prev => !prev);
    if (!isChecked && !msgIdxes.includes(idx)) {
      setMsgIdxes([...msgIdxes, idx]);
      setReceptionState(data)
    } else if (isChecked && msgIdxes.includes(idx)) {
      setMsgIdxes(msgIdxes.filter((value) => value !== idx));
      setReceptionState({})
    }
    if (!isChecked && !msgData.includes(data)) {
      setMsgData([...msgData, data]);
    } else if (isChecked && msgData.includes(data)) {
      setMsgData(msgData.filter((value) => value !== data));
    }
  };

  const handleLink = () => {
    setMsgModal(true);
    setReceptionState(data)
  };

  // 전체 체크 박스 동작
  useEffect(() => {
    allCheckbox ? (
      setIsChecked(true),
      setMsgIdxes((prev) => [...prev, msgIdx]),
      setMsgData((prev) => [...prev, data])
    ) : (
      setIsChecked(false),
      setMsgIdxes([]),
      setMsgData([])
    )
  }, [allCheckbox])

  // 답장 시 체크 버튼 해제
  useEffect(() => {
    setIsChecked(false);
    setMsgIdxes([])
  }, [data])

  return (
    <tr key={msgIdx} className="link">
      <td>
        <input 
          type="checkbox" 
          className="form-check-input" 
          checked={isChecked}
          onChange={() => handleCheckboxChange(msgIdx, data)}
        />
      </td>
      <td onClick={handleLink}>{msgTypeName}</td>
      <td onClick={handleLink}>{nickname}</td>
      <td onClick={handleLink}>{msgTitle}</td>
      <td className="text-slate-500" onClick={handleLink}>
        {moment(msgSendDate).format(`YYYY-MM-DD HH:mm`)}
      </td>
      <td className={!info ? 'text-warning' : 'text-info'} onClick={handleLink}>
        {replyCount}
      </td>
    </tr>
  )
}

export default MessageBoxList02;