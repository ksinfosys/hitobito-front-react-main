import React, { useState, useEffect } from "react";
import moment from "moment";

const MessageBoxList01 = ({ 
  data,
  id, 
  nickname, 
  msgTitle, 
  msgSendDate, 
  replyCount, 
  msgIdxes, 
  setMsgIdxes, 
  allCheckbox, 
  link,
  setReceptionState,
  setMsgModal,
  textInfo,
  msgData,
  setMsgData
}) => {
  
  const [isChecked, setIsChecked] = useState(false);

  // 체크 박스 클릭시 id 값 저장하기
  const handleCheckboxChange = (idx, data) => {
    setIsChecked(prev => !prev);
    if (!isChecked && !msgIdxes.includes(idx)) {
      setMsgIdxes([...msgIdxes, idx]);
    } else if (isChecked && msgIdxes.includes(idx)) {
      setMsgIdxes(msgIdxes.filter((value) => value !== idx));
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
      setMsgIdxes((prev) => [...prev, id]),
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
    <>
      <tr 
        className={link ? "link" : ""}
      >
        <td>
          <input
            className="form-check-input"
            type="checkbox"
            checked={isChecked}
            onChange={() => handleCheckboxChange(id, data)}
          />
        </td>
        <td onClick={handleLink}>{nickname}</td>
        <td onClick={handleLink} className="text-left">{msgTitle}</td>
        <td 
          className="text-slate-500"
          onClick={handleLink}
        >
          {moment(msgSendDate).format('YYYY-MM-DD HH:mm')}
        </td>
        <td 
          className={textInfo ? "text-info" : "text-warning"}
          onClick={handleLink}
        >
          {replyCount}
        </td>
      </tr>
    </>
  )
};

export default MessageBoxList01;