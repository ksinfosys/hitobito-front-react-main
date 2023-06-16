import React from "react";

const SelectBox = ({id, className, data, onChange, defaultValue}) => {

  let currentValue = defaultValue || "DEFAULT";

/*  console.log('================================================================')
  console.log(id + ' ' + currentValue + ' ' + defaultValue)*/


  return <>
    <select key={defaultValue} value={currentValue} id={id + ' dropdown-button-dark-example1'}
            className={`form-select flex items-center space-between ${className ? className : ''}`}
            onChange={onChange}
            multiple={false}>
      <option disabled selected value={'DEFAULT'}> 選択してください。</option>
      {
        data?.map((item, key) => {
          return <option key={key} value={item[Object.keys(item)[0]].toString()}>{item[Object.keys(item)[1]].toString()}</option>
        })
      }
    </select>
  </>
}

export default SelectBox
