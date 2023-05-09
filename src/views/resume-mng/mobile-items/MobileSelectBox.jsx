import React from "react";

const MobileSelectBox = ({id, className, value, data, onChange, disabled, reference}) => {
  return <select id={id} className={"form-select " + className} onChange={onChange} defaultValue={value} disabled={disabled ? disabled : false} ref={reference}>
    <option disabled selected value> -- select an option -- </option>
    {
      data?.map((item, key) => {
        return <option key={key} value={item[Object.keys(item)[0]].toString()} >{item[Object.keys(item)[1]].toString()}</option>
      })
    }
  </select>
}

export default MobileSelectBox
