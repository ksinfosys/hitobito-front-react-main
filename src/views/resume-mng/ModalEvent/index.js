const ModalEvent = (type) => {
  return {
    oneDepth: (e, depthMenu, setDepthMenu, flag) => {
      const depth = parseInt(e.nativeEvent.target.selectedIndex) - 1
      const text = e.nativeEvent.target[depth + 1].text
      const sFlag = flag ? flag : ''

      console.log(text)

      setDepthMenu({
        ...depthMenu,
        [type + sFlag]:{
          ...depthMenu[type],
          depth: depth,
          depth_first: text,
        }
      })

      console.log(depthMenu)
    },
    secondDepth: (e, depthMenu, setDepthMenu, body, setBody, flag) => {
      const depth = parseInt(e.nativeEvent.target.selectedIndex)
      const text = e.nativeEvent.target[depth].text
      const sFlag = flag ? flag : ''

      console.log(e, depthMenu, setDepthMenu, body, setBody)
      setDepthMenu({
        ...depthMenu,
        [type+sFlag]:{
          ...depthMenu[type+sFlag],
          depth_seconds: text,
        }
      })
      setBody({
        ...body,
        [type+sFlag]: e.target.value
      })
      console.log({
        ...body,
        [type]: e.target.value
      })
    }
  }
}

export default ModalEvent
