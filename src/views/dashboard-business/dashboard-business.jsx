import { Modal, ModalBody } from "@/base-components";
import { useState, useEffect, useRef } from "react";
import Search from "@/assets/images/search.svg";
import blueX from "@/assets/images/gray-x-btn.svg";

import Pagination from "../../components/pagination";
import DashboardListBusiness from "../../components/dashboard-cont-list-business/dashboard-list";
import MinusGrayBtn from "@/assets/images/minus-gray-btn.svg";
import PlusGrayBtn from "@/assets/images/plus-gray-btn.svg";

import ServiceFetch from "../../../util/ServiceFetch";
import { useRecoilState } from "recoil";
import { searchBusiness } from "../../stores/search-business";

const DashboardBusiness = () => {
    // Search 상태 관리
    const [searchRecoil, setSearchRecoil] = useRecoilState(searchBusiness);
    const [searchStatus, setSearchStatus] = useState(false);

    // 스킬 조건으로 검색 시 추가
    const skillCareerList = [
        {
            value: "",
            text: "経歴選択"
        },
        {
            value: "65001",
            text: "関係なし",
        },
        {
            value: "65002",
            text: "1年以上",
        },
        {
            value: "65003",
            text: "3年以上",
        },
        {
            value: "65004",
            text: "5年以上",
        },
        {
            value: "65005",
            text: "10年以上",
        },
    ];

    // Modal State
    const [requestModal, setRequestModal] = useState(false);
    const [requestSuccessModal, setRequestSuccessModal] = useState(false);
    const [requestFailModal, setRequestFailModal] = useState(false);
    const [searchFailModal, setSearchFailModal] = useState(false);
    const [modalState05, setModalState05] = useState(false);
    const [modalState06, setModalState06] = useState(false);
    const [modalState07, setModalState07] = useState(false);
    // ListState
    const [listState, setListState] = useState();
    const [pgnInfo, setPgnInfo] = useState({});
    const [currentPageIdx, setCurrentPageIdx] = useState(1);
    // 검색 태그
    const [tagsFilter, setTagsFilter] = useState([]);
    const [tagsList, setTagsList] = useState([]);
    const [selectTags, setSelectTags] = useState([]);
    const [selectCode, setSelectCode] = useState([]);
    const [searchConditionList, setSearchConditionList] = useState([]);
    useEffect(() => {
        const tagsList = searchConditionList.map(({ category, codeType, codes, searchCondition }) => ({ categoryName: category, codeType: codeType, code: codes, codeName: searchCondition }));
        const codesList = searchConditionList.map(({ codes }) => codes);
        searchConditionList && setSelectTags(tagsList);
        searchConditionList && setSelectCode(codesList);
    }, [searchConditionList]);
    useEffect(() => {
        const tagsList = searchConditionList.map(({ category, codeType, codes, searchCondition }) => ({ categoryName: category, codeType: codeType, code: codes, codeName: searchCondition }));
        // Recoil로 검색 데이터 관리
        searchConditionList && setSearchRecoil([]);
    }, [searchConditionList, searchStatus])

    // 검색
    const [selectValue, setSelectValue] = useState("000");
    const [skillCareer, setSkillCareer] = useState("");
    const [inputValue, setInputValue] = useState("");
    const [searchId, setSearchId] = useState();
    // Counter
    const [allCountState, setAllCountState] = useState(1);
    const [countState, setCountState] = useState(1);
    // Plus Button Click Event
    const handleClickPlus = () => {
        allCountState < 3 && setAllCountState((prev) => prev + 1);
    };
    // Minus Button Click Event
    const handleClickMinus = () => {
        allCountState !== 1 && setAllCountState((prev) => prev - 1);
    };
    // 체크된 리스트 아이디
    const [allCheck, setAllCheck] = useState(false);
    const [checkId, setCheckId] = useState([]);
    // 전송 시 체크 상태 변경
    const [submitCheckState, setSubmitCheckState] = useState(false);

    // getList API
    const getList = () => {
        ServiceFetch("/search/main", "post", {
            curPage: currentPageIdx,
        })
            .then((res) => {
                setListState(res.result.searchList);
                setPgnInfo(res.result.pageItem);
                setSearchId(res.result.searchCondition.srchId);
                setSearchConditionList(res.result.searchCondition.searchConditionList);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    // 年齢
    const searchTags = () => {
        ServiceFetch("/search/tags", "post", {
            keyword: inputValue,
            codeType: selectValue,
        }).then((res) => {
            const shortenedArr = selectCode.map((str) => str.slice(0, 8));
            const filteredArr1 = res.result.searchTags.filter((item) => !shortenedArr.includes(item.code));
            const now = new Date();
            const year = now.getFullYear();
            for(var i = 0; i < filteredArr1.length; i++){
                if(filteredArr1[i].codeType === '51'){
                    let keisanCodename = Number(year) - Number(filteredArr1[i].codeName);
                    filteredArr1[i].codeName = keisanCodename + '歳';
                }
            }
            setTagsList(filteredArr1);
        }).catch((e) => {
            console.log(e);
        });
    };

    // 学歴 리스트 저장
    const [ageList, setAgeList] = useState([]);
    const getAge = () => {
        ServiceFetch("/search/tags", "post", {
            keyword: "",
            codeType: 51,
        }).then((res) => {
            setAgeList(res.result.searchTags)
        }).catch((e) => {
            console.log(e);
        });
    };
    useEffect(() => {
        getAge()
    }, [])

    // 学歴 리스트 저장
    const [educationList, setEducationList] = useState([]);
    const getEducation = () => {
        ServiceFetch("/search/tags", "post", {
            keyword: "",
            codeType: 52,
        }).then((res) => {
            setEducationList(res.result.searchTags)
        }).catch((e) => {
            console.log(e);
        });
    };
    useEffect(() => {
        getEducation()
    }, [])

    // 경험연수 리스트 저장
    const [careerList, setCareerList] = useState([]);
    const getCareer = () => {
        ServiceFetch("/search/tags", "post", {
            keyword: "",
            codeType: 55,
        }).then((res) => {
            setCareerList(res.result.searchTags)
        }).catch((e) => {
            console.log(e);
        });
    };
    useEffect(() => {
        getCareer()
    }, [])

    // 希望年収 리스트 저장
    const [hopeIncomeList, setHopeIncomeList] = useState([]);
    const gethopeIncome = () => {
        ServiceFetch("/search/tags", "post", {
            keyword: "",
            codeType: 61,
        }).then((res) => {
            setHopeIncomeList(res.result.searchTags)
        }).catch((e) => {
            console.log(e);
        });
    };
    useEffect(() => {
        gethopeIncome()
    }, [])

    // searchFind API
    const searchFind = () => {
        //console.log('selectcode', selectCode)
        ServiceFetch("/search/find", "post", {
            curPage: currentPageIdx,
            selectCode: selectCode,
        }).then((res) => {
            res.resultCode === '200' ? (
                setListState(res.result.searchList),
                setPgnInfo(res.result.pageItem),
                setSearchId(res.result.searchCondition.srchId),
                getList(),
                setSearchStatus(!searchStatus)
            ) : res.resultCode === "702" ? (
                setSearchFailModal(true)
            ) : (
                setSearchFailModal(true)
            );
        }).catch((e) => {
            console.log(e);
        });
    };

    // offer API
    const [offerState, setOfferState] = useState(false);
    const offer = () => {
        ServiceFetch("/search/offer", "post", {
            userId: checkId,
            rqLimit: checkId.length > 1 ? allCountState : countState,
            srchId: searchId,
        })
            .then((res) => {
                res.resultCode === "701"
                    ? // 포인트 부족 케이스
                    (setSubmitCheckState(!submitCheckState), setCheckId([]), setRequestModal(false), setRequestFailModal(true))
                    : res.resultCode === "708"
                        ? // 포인트 부족 케이스
                        (setSubmitCheckState(!submitCheckState), setCheckId([]), setRequestModal(false), setModalState06(true))
                        : res.resultCode === "718"
                            ? // 의뢰기한 3일 초과
                            (setSubmitCheckState(!submitCheckState), setCheckId([]), setRequestModal(false), setModalState05(true))
                            : res.resultCode === "200"
                                ? (setSubmitCheckState(!submitCheckState),
                                    setCheckId([]),
                                    setRequestModal(false),
                                    setRequestSuccessModal(true),
                                    setOfferState(!offerState),
                                    setUserInfoV((prev) => ({
                                        ...prev,
                                        historyBalance: res.result.historyBalance,
                                    })))
                                : (setSubmitCheckState(!submitCheckState), setCheckId([]), setRequestModal(false), setRequestSuccessModal(true));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    // Tag 선택하기
    //const [careerActive, setCareerActive] = useState(false);
    const [skillTagActive, setSkillTagActive] = useState({});
    const [tagActive, setTagActive] = useState("");
    const handleSelectTags = (tag) => {
        const count01 = selectTags.filter((item) => item.codeType === "51").length;
        const count02 = selectTags.filter((item) => item.codeType === "52").length;
        const count03 = selectTags.filter((item) => item.codeType === "55").length;
        const count04 = selectTags.filter((item) => item.codeType === "61").length;
        if (tag.code.length === 8) {
            setCareerActive(true);
            setSkillTagActive(tag);
        } else if (tag.codeType === "51") {
            count01 < 2 ? (setTagsFilter([...tagsFilter, tag]), setSelectTags([...selectTags, tag]), setSelectCode([...selectCode, tag.code])) : setModalState07(true);
        } else if (tag.codeType === "52") {
            count02 < 2 ? (setTagsFilter([...tagsFilter, tag]), setSelectTags([...selectTags, tag]), setSelectCode([...selectCode, tag.code])) : setModalState07(true);
        } else if (tag.codeType === "55") {
            count03 < 2 ? (setTagsFilter([...tagsFilter, tag]), setSelectTags([...selectTags, tag]), setSelectCode([...selectCode, tag.code])) : setModalState07(true);
        } else if (tag.codeType === "61") {
            count04 < 2 ? (setTagsFilter([...tagsFilter, tag]), setSelectTags([...selectTags, tag]), setSelectCode([...selectCode, tag.code])) : setModalState07(true);
        } else {
            setTagsFilter([...tagsFilter, tag]);
            setSelectTags([...selectTags, tag]);
            setSelectCode([...selectCode, tag.code]);
        }
        document.getElementById('texttest').value = ""; 
        setInputValue(""); 
        setTagActive("");
    };
    const handleSkillSelect = (value) => {
        if (value) {
            const career = skillCareerList.filter((career) => career.value === value);
            const skillTagCustom = { ...skillTagActive, career };
            setTagsFilter([...tagsFilter, skillTagActive]);
            setSelectTags([...selectTags, skillTagCustom]);
            setSelectCode([...selectCode, skillTagActive.code + value]);
        } else {
            setTagsFilter([...tagsFilter, skillTagActive]);
            setSelectTags([...selectTags, skillTagActive]);
            setSelectCode([...selectCode, skillTagActive.code]);
        }
        //setCareerActive(false);
        document.getElementById('texttest').value = ""; 
        setInputValue(""); 
        document.getElementById('skillBox').value = "";
        skillBox.disabled = true;
        setSkillTagActive({});
    }

    // Tag 지우기
    const deleteTags = (code) => {
        const updatedTags = selectTags.filter((value) => !code.includes(value.code));
        const updatedTagsFilter = tagsFilter.filter((value) => !code.includes(value.code));
        setSelectTags(updatedTags);
        setTagsFilter(updatedTagsFilter);
        if (Array.isArray(code)) {
            const filterCode01 = selectCode.filter((value) => !code.includes(value));
            setSelectCode(filterCode01);
        } else {
            const filterCode01 = selectCode.filter((item) => {
                return !item.includes(code);
            });
            setSelectCode(filterCode01);
        }
    };

    // 검색시 태그 호출
    useEffect(() => {
        inputValue.length > 0 && searchTags();
    }, [inputValue]);

    // 최초 방 진입 시 list 가져오기
    useEffect(() => {
        selectTags?.length > 0 ? searchFind() : getList();
        setAllCheck(false);
    }, [currentPageIdx, offerState]);

    // 対象以外の外部クリック時のイベント
    const target = useRef();
    useEffect(() => {
        const handleClick = (e) => {
            if (target.current && !target.current.contains(e.target)) {
                setTagsList([]);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    // 選択した検索タグを削除
    useEffect(() => {
        const filteredArr1 = tagsList.filter((value) => !tagsFilter.includes(value));
        setTagsList(filteredArr1);
    }, [tagsFilter, inputValue]);

    // 태그 리스트 Filter
    // 전체
    const tagsList01 = selectTags.filter((item) => {
        return item.codeType !== "51" && item.codeType !== "52" && item.codeType !== "55" && item.codeType !== "61";
    });
    // 年齢
    const tagsList02 = selectTags.filter((item) => item.codeType === "51").sort((a, b) => a.code - b.code);
    const codeList02 = tagsList02.map((item) => item.code);
    // 学歴
    const tagsList03 = selectTags.filter((item) => item.codeType === "52").sort((a, b) => a.code - b.code);
    const codeList03 = tagsList03.map((item) => item.code);
    // 경험 연수
    const tagsList04 = selectTags.filter((item) => item.codeType === "55").sort((a, b) => a.code - b.code);
    const codeList04 = tagsList04.map((item) => item.code);
    // 희망 연봉
    const tagsList05 = selectTags.filter((item) => item.codeType === "61").sort((a, b) => a.code - b.code);
    const codeList05 = tagsList05.map((item) => item.code);

    return (
        <>
            <div className="dashboard orange">
                <div className="box-type-default">
                    <div className="dashboard-top p-5 border-b border-slate-200/60 text-sm">求職者検索一覧</div>
                    <div className="list-top flex justify-end items-center mt-10 mb-5 px-5">
                        <div className="flex gap-2">
                            <select className="form-select w-32" onChange={(e) => setSelectValue(e.target.value)}>
                                <option value="000">全て</option>
                                <option value="101">スキル</option>
                                <option value="51">年齢</option>
                                <option value="52">学歴</option>
                                <option value="53">性別</option>
                                <option value="54">国籍</option>
                                <option value="55">経験年数</option>
                                <option value="56">会社の業種</option>
                                <option value="57">現在の職種</option>
                                <option value="58">居住地</option>
                                <option value="60">将来の目標</option>
                                <option value="61">希望年収</option>
                                <option value="62">経験した役割</option>
                                <option value="63">担当工程</option>
                            </select>

                            <div className="search-box relative text-slate-500">
                                <input
                                    type="text"
                                    id="texttest"
                                    className="form-control pr-10"
                                    placeholder="検索ワードを必ずクリック"                                    
                                    value={inputValue}
                                    onFocus={searchTags}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.code === "Enter") {
                                            setCurrentPageIdx(1)
                                            searchFind();
                                        }
                                        return;
                                    }}
                                />
                                <button className="w-4 h-4 absolute my-auto inset-y-0 mr-3 right-0" onClick={() => {setCurrentPageIdx(1), searchFind()}}>
                                    <img src={Search} alt="" />
                                </button>

                                <div className="search_button_area" ref={target}>
                                    {tagsList?.length > 0 && (
                                        <ul>
                                            {tagsList.map((code, index) => {
                                                return (
                                                    <li key={index} 
                                                    className={tagActive === code ? "orange" : ""}>
                                                    <button type="button" onClick={() => {
                                                        if (code.code.length == 5) {
                                                            setTagActive(code);
                                                        } else {
                                                            setSkillTagActive(code);
                                                            let skillBox = document.getElementById('skillBox');
                                                            skillBox.disabled = false;
                                                        }                                                           
                                                        document.getElementById('texttest').value = code.codeName; 
                                                        setInputValue(code.codeName); 
                                                        }}>
                                                        {code.codeName}
                                                    </button>
                                                    <div className={tagActive === code ? "task-tooltip" : "display-none"}>確定したならもう１回クリック</div>    
                                                </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <select id="skillBox" className="form-select w-32 mr-2" disabled>
                                {skillCareerList.map((career, index) => {
                                    return (
                                        <option value={career.value} key={index}>
                                            {career.text}
                                        </option>
                                    );
                                })}
                            </select>
                            <button className="btn-lg btn btn-pending w-20" onClick={() => {                                 
                                if (tagActive != "") {
                                    handleSelectTags(tagActive);
                                } else {
                                    let targetValue = document.getElementById('skillBox').value;
                                    handleSkillSelect(targetValue);
                                }                               
                            }}>
                                追加
                            </button>
                            <button
                                className="btn btn-lg btn-cancle-type1 w-32"
                                onClick={() => {
                                    setSelectTags([]), setSelectCode([]), setTagsFilter([]);
                                }}>
                                条件クリア
                            </button>
                        </div>
                    </div>
                    <div><button className="btn-lg btn btn-pending w-32" style={{height: 60 + 'px', float : 'right', marginRight : 20 + 'px'}} onClick={() => {setCurrentPageIdx(1), searchFind()}}><img src={Search} alt="" />　検&nbsp;索</button></div>
                    {selectTags?.length > 0 && (
                        <div className="skill-list-wrap business2">
                            <div className="skill-list-cont">
                                <div className="blue-btn-wrap flex gap-2 items-center justify-end flex-wrap" style={{paddingRight : 10 + 'px'}}>
                                    {tagsList01.map((tag, index) => {
                                        const codeName = tag.codeName;
                                        const slicedStr01 = codeName && codeName.includes(":") && codeName.split(":")[0].trim();
                                        const slicedStr02 = codeName && codeName.includes(":") && codeName.split(":")[1].trim();
                                        return (
                                            <div className="blue-btn gray-change" key={index}>
                                                <span>{tag.categoryName}</span>
                                                <span>{slicedStr01 ? slicedStr01 : tag.codeName}</span>
                                                {slicedStr02 && <span>{slicedStr02}</span>}
                                                {tag.career && <span>{tag.career[0].text}</span>}
                                                <button
                                                    className="blue-x-btn"
                                                    onClick={() => {
                                                        deleteTags(tag.code);
                                                    }}>
                                                    <img src={blueX} alt="" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {tagsList02?.length > 0 && (
                                        <div className="blue-btn gray-change">
                                            <span>{tagsList02[0].categoryName}</span>
                                            <span>
                                                {tagsList02[0].codeName}
                                                {tagsList02[1] && " ~ "}
                                                {tagsList02[1]?.codeName}
                                            </span>
                                            <button
                                                className="blue-x-btn"
                                                onClick={() => {
                                                    deleteTags(codeList02);
                                                }}>
                                                <img src={blueX} alt="" />
                                            </button>
                                        </div>
                                    )}
                                    {tagsList03?.length > 0 && (
                                        <div className="blue-btn gray-change">
                                            <span>{tagsList03[0].categoryName}</span>
                                            <span>
                                                {tagsList03[0].codeName}
                                                {tagsList03[1] && " ~ "}
                                                {tagsList03[1]?.codeName}
                                            </span>
                                            <button
                                                className="blue-x-btn"
                                                onClick={() => {
                                                    deleteTags(codeList03);
                                                }}>
                                                <img src={blueX} alt="" />
                                            </button>
                                        </div>
                                    )}
                                    {tagsList04?.length > 0 && (
                                        <div className="blue-btn gray-change">
                                            <span>{tagsList04[0].categoryName}</span>
                                            <span>
                                                {tagsList04[0].codeName}
                                                {tagsList04[1] && " ~ "}
                                                {tagsList04[1]?.codeName}
                                            </span>
                                            <button
                                                className="blue-x-btn"
                                                onClick={() => {
                                                    deleteTags(codeList04);
                                                }}>
                                                <img src={blueX} alt="" />
                                            </button>
                                        </div>
                                    )}
                                    {tagsList05?.length > 0 && (
                                        <div className="blue-btn gray-change">
                                            <span>{tagsList05[0].categoryName}</span>
                                            <span>
                                                {tagsList05[0].codeName}
                                                {tagsList05[1] && " ~ "}
                                                {tagsList05[1]?.codeName}
                                            </span>
                                            <button
                                                className="blue-x-btn"
                                                onClick={() => {
                                                    deleteTags(codeList05);
                                                }}>
                                                <img src={blueX} alt="" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end p_20" style={{marginTop : 10 + 'px'}}>
                        <div className="dash-cont-cont3 flex items-center">
                            <div className="color-a8">※全体を確認するためには「Space」を押下してください。</div>
                            <div className="color-a8">面談依頼有効期限</div>
                            <div className="minus-plus-wrap flex items-center">
                                <button className="minus-gray-btn" onClick={handleClickMinus}>
                                    <img src={MinusGrayBtn} alt="" />
                                </button>
                                <div className="number-div">{allCountState}</div>
                                <button className="plus-gray-btn" onClick={handleClickPlus}>
                                    <img src={PlusGrayBtn} alt="" />
                                </button>
                            </div>
                            <button
                                className="btn btn-sm btn-business w-80"
                                onClick={() => {
                                    checkId.length > 0 && setRequestModal(true);
                                }}>
                                一括依頼
                            </button>
                        </div>
                    </div>
                    <div className="dashboard-cont pb-12">
                        <div className="flex items-center dashboard-cont-tit">
                            <div className="form-check w-24">
                                <input id="vertical-form-3" className="form-check-input" type="checkbox" checked={allCheck} onChange={() => setAllCheck(!allCheck)} />
                                <label className="form-check-label" htmlFor="vertical-form-3">
                                    一括選択
                                </label>
                            </div>
                            <div className="dashboard-tit-list ml-auto flex flex-center w-full">LIST</div>
                        </div>
                        {listState?.length > 0 ? (
                            listState.map((data, index) => {
                                return (
                                    <DashboardListBusiness
                                        key={index}
                                        data={data}
                                        allCheck={allCheck}
                                        checkId={checkId}
                                        setCheckId={setCheckId}
                                        onChange={(count) => setCountState(count)}
                                        setRequestModal={setRequestModal}
                                        submitCheckState={submitCheckState}
                                        offer={offer}
                                        currentPageIdx={currentPageIdx}
                                        selectTags={searchRecoil}
                                        educationList={educationList}
                                        careerList={careerList}
                                        hopeIncomeList={hopeIncomeList}
                                        ageList={ageList}
                                        offerState={offerState}
                                    />
                                );
                            })
                        ) : (
                            <div className="dashboard-cont-cont flex flex-col">
                                <div className="cont-top flex flex-center items-center">求職者の検索条件を設定してください。</div>
                            </div>
                        )}
                    </div>
                </div>
                <Pagination pgnInfo={pgnInfo} currentPageIdx={currentPageIdx} setCurrentPageIdx={setCurrentPageIdx} />
            </div>

            {/* ************ 검색시 Find API 모달 ************ */}
            <Modal
                show={searchFailModal}
                onHidden={() => {
                    setSearchFailModal(false);
                }}>
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">検索確認</div>
                    <div className="modal-subtit">求職者の検索条件を設定してください。</div>
                    <div className="flex flex-end gap-3">
                        <a href="#" className="btn btn-pending" onClick={() => setSearchFailModal(false)}>
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 범위검색 모달 */}
            <Modal
                show={modalState07}
                onHidden={() => {
                    setModalState07(false);
                }}>
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">検索タグ数を超えています</div>
                    <div className="modal-subtit">
                        同じカテゴリを選択しています.
                        <br />
                        年齢は2つまで選択できます。
                    </div>
                    <div className="flex flex-end gap-3">
                        <a href="#" className="btn btn-pending" onClick={() => setModalState07(false)}>
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>

            {/* ************ 의뢰하기 모달 ************ */}
            <Modal
                show={requestModal}
                onHidden={() => {
                    setRequestModal(false);
                }}>
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">依頼を送信しますか？</div>
                    <div className="modal-subtit">
                        面談依頼にはポイントが必要になります。
                        <br />
                        依頼を送信しますか？
                    </div>
                    <div className="flex flex-end gap-3">
                        <a href="#" className="btn btn-pending" onClick={offer}>
                            はい
                        </a>
                        <a
                            href="#"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                                setRequestModal(false);
                                setSubmitCheckState(!submitCheckState);
                                setCheckId([]);
                            }}>
                            いいえ
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 성공시 */}
            <Modal
                show={requestSuccessModal}
                onHidden={() => {
                    setRequestSuccessModal(false);
                }}>
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">依頼完了</div>
                    <div className="modal-subtit">面談依頼をしました。</div>
                    <div className="flex flex-end gap-3">
                        <a href="#" className="btn btn-pending" onClick={() => setRequestSuccessModal(false)}>
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 의뢰 포인트 부족 */}
            <Modal
                show={requestFailModal}
                onHidden={() => {
                    setRequestFailModal(false);
                }}>
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">依頼失敗</div>
                    <div className="modal-subtit">ポイント残高が不足しています。</div>
                    <div className="flex flex-end gap-3">
                        <a href="#" className="btn btn-pending" onClick={() => setRequestFailModal(false)}>
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 의뢰 기한 초과 */}
            <Modal
                show={modalState05}
                onHidden={() => {
                    setModalState05(false);
                }}>
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">依頼失敗</div>
                    <div className="modal-subtit">依頼期限は最大3日です。</div>
                    <div className="flex flex-end gap-3">
                        <a href="#" className="btn btn-pending" onClick={() => setModalState05(false)}>
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
            {/* 의뢰 실패 */}
            <Modal
                show={modalState06}
                onHidden={() => {
                    setModalState06(false);
                }}>
                <ModalBody className="p-10 text-center">
                    <div className="modal-tit">依頼失敗</div>
                    <div className="modal-subtit">面談依頼に失敗しました。</div>
                    <div className="flex flex-end gap-3">
                        <a href="#" className="btn btn-pending" onClick={() => setModalState06(false)}>
                            確認
                        </a>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};
export default DashboardBusiness;
