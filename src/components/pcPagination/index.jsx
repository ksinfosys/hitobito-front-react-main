import {
  Lucide,

} from "@/base-components";

const PcPagination = ({pgnInfo, currentPageIdx, setCurrentPageIdx, color}) => {
  const renderPagination = () => {
      let paginationDOM = [];
      for(let p=pgnInfo.startPage; p<=pgnInfo.endPage; p++) {
          paginationDOM.push(
              <li key={p} className={`page-item ${currentPageIdx === (p) ? "active" : ""}`} onClick={() => {
                  setCurrentPageIdx(p)
              }}>
                  <a className="page-link" href="#">
                      {p}
                  </a>
              </li>
          )
      }
      return paginationDOM;
  }
  
  return (
      pgnInfo ?
      <div className={`pagination-wrap pc flex space-between ${color != undefined ? color : ""} mt-5`}>
          <div className="left-btn">
              <button className={`btn btn-sm btn-outline-primary
              ${currentPageIdx != 1 ? "active" : ""}`}
              disabled={currentPageIdx === 1}
              onClick={() => {
                  setCurrentPageIdx(pgnInfo.prevBtnPage);
              }}
              >
                  <Lucide icon="ArrowLeft" />
                  Previous
              </button>
          </div>
          <div className="">
              <nav className="w-full sm:w-auto sm:mr-auto">
                  <ul className="pagination">
                      {
                      pgnInfo.curBlock === 1 ? <></> :
                      <>
                          <li className="page-item"><a className="page-link" onClick={() => {setCurrentPageIdx(1)}}>1</a></li>
                          <li className="page-item"><a className="page-link">...</a></li>
                      </>
                      }
                      {renderPagination()}
                      {
                          pgnInfo.totBlock === pgnInfo.curBlock ? <></> :
                          <>
                              <li className="page-item"><a className="page-link">...</a></li>
                              <li className="page-item"><a className="page-link" onClick={() => {setCurrentPageIdx(pgnInfo.totPage)}}>{pgnInfo.totPage}</a></li>
                          </>
                      }
                  </ul>                    
              </nav>
          </div>
          <div className="right-btn">
              <button className={`btn btn-sm btn-outline-primary
                  ${currentPageIdx != pgnInfo.totPage ? "active" : ""}`}
                  disabled={currentPageIdx === pgnInfo.totPage}
                  onClick={() => {
                      setCurrentPageIdx(pgnInfo.nextBtnPage);
                  }}
                  >
                  Next
                  <Lucide icon="ArrowRight" />
              </button>
          </div>
      </div> : <></>
  );
}

export default PcPagination;