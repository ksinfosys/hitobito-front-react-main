function Main({ total, limit, page, setPage }) {
    const numPages = Math.ceil(total / limit);

    const MAX_PAGE_COUNT = 5; // MAX_PAGE_COUNT -> 한번에 보여지는 페이지 수,
    let firstPage = Math.ceil((page / MAX_PAGE_COUNT) - 1) * MAX_PAGE_COUNT;
    let lastPage = firstPage + 10;

    if (numPages < lastPage) {
        lastPage = numPages;
    }
    let resultList = [];
    function getPaginationArray(currPage, pageCount) {
        // 1, 11, 21 ... 페이지가 선택될 때 ,
        // 1~10, 11~20, 21~30 ... 리스트 생성
        if ((currPage + 1) % MAX_PAGE_COUNT === 1) {
            let idx = 1;
            resultList = [currPage];
            while (resultList.length < MAX_PAGE_COUNT && currPage + idx < pageCount) {
                resultList.push(currPage + idx);
                idx++;
            }
            // 9, 19, 29 ... 페이지가 선택될 때,
            // 1~10, 11~20, 21~30 ... 리스트 생성
        } else if (currPage % MAX_PAGE_COUNT === MAX_PAGE_COUNT - 1) {
            let idx = 1;
            resultList = [currPage];
            while (resultList.length < MAX_PAGE_COUNT) {
                resultList.unshift(currPage - idx);
                idx++;
            }
        }
        return resultList;
    }

    return (
        <>
            <button type="button" className="prev_next_btn prev" onClick={() => setPage(page - 1)} disabled={page === 1}>
                <img src="/icon/icon_arrow_18px.svg" alt="화살표 아이콘" />
            </button>
            <div className="pagination_list">
                {getPaginationArray(firstPage, lastPage).map((i) => (
                    // <button type="button" className="active">1</button>
                    // <button type="button">2</button>
                    // <button type="button">3</button>
                    // <button type="button">4</button>
                    // <button type="button" key={i + 1} onClick={() => setPage(i + 1)} aria-current={page == i + 1 ? "page" : null} className={page == i + 1 ? "active" : ""}>{i + 1}</button>
                    <button type="button" key={i + 1} onClick={() => setPage(i + 1)} className={page == i + 1 ? "active" : ""}>{i + 1}</button>
                ))}
            </div>
            <button type="button" className="prev_next_btn" onClick={() => setPage(page + 1)} disabled={page === numPages}>
                <img src="/icon/icon_arrow_18px.svg" alt="화살표 아이콘" />
            </button>
        </>
    );
}

export default Main;
