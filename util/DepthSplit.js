const DepthSplit = (mobile, menuKey, apiKey, type) => {
  let menu = []

  if (mobile[menuKey]) {
    let index = -1
    mobile.api[apiKey].map(item => {
      if (item[type][4] === '0') {
        index++
        menu.push({
          ...item,
          child: []
        })
      } else {
        menu[index].child.push(item)
      }
    })
  }

  console.log(menu)

  return menu
}

export default DepthSplit
