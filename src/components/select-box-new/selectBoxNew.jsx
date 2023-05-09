
import { useState } from "react";
import {
    Lucide,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownContent,
    DropdownItem,
    DropdownHeader,
    DropdownDivider,
} from "@/base-components";
import { faker as $f } from "@/utils";
import * as $_ from "lodash";
import classnames from "classnames";
import SelectArrow from "@/assets/images/select-arrow.svg";
import checkIcon from "@/assets/images/check-icon.svg";

function SelectBoxNew(props) {
    const [isActive3, setIsActive3] = useState(false);
    const handleClick3 = () => {
        setIsActive3(current => !current);
    }

    return (
        <>
            <div className="select_box">
                <button className="option_label flex items-center space-between" onClick={handleClick3}>{props.seltit} <img src={SelectArrow} alt="" /></button>
                <div className={isActive3 ? "option_wrap" : "option_wrap show"}>
                    <ul className="option_list">
                        <li>
                            <a href="#" className="selected">
                                option1   <img src={checkIcon} alt="" />
                            </a>
                        </li>
                        <li>
                            <a href="#" className="">
                                option2
                            </a>
                        </li>
                        <li>
                            <a href="#" className="">
                                option3
                            </a>
                        </li>
                    </ul>
                    <div className="slide_down">
                        <a href="#" role="button"></a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SelectBoxNew;
