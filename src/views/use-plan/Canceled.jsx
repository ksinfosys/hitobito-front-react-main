import React, {useEffect} from "react";

const Canceled = () => {
  useEffect(() => {
    localStorage.removeItem("sessionId");
    window.close()
  }, [])
  return<>

  </>
}

export default Canceled
