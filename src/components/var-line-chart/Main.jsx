import { Chart } from "@/base-components";
import { colors } from "@/utils";
import PropTypes from "prop-types";
import { useMemo, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import { getCookie } from "../../utils/cookie";

function Main(props) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const { dataList } = props;

  const [monthData, setMonthData] = useState([]);

  const [plusArr, setPlusArr] = useState([])
  const [minusArr, setMinusArr] = useState([])
  
  const [priceChangeArr, setPriceChangeArr] = useState([])

  const [balanceArr, setBalanceArr] = useState([])

  // 2022-02 형식으로 떨어지는 monthList 문자열 가공
  const getmonthData = () => {
    const formattedArr = dataList?.map(data => {
      if (data.pointCngType === "初期残高") {
        return null;
      }
      const formattedStr = data.pointOcrDatetime.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$2月$3日");
      return formattedStr;
    });
    // 초기잔고 들어있는 데이터 제외
    const validDate = formattedArr.filter((element) => element !== null);
    // 중복요소 제거
    const monthDate = [...new Set(validDate)]
    // 낮은 숫자부터 나올수있도록 배열 역정렬
    setMonthData(monthDate.reverse());
  };

  // plus flag data
  const getPlusData = () => {
    const plusFilter = dataList.filter(data => data.pointCngType === 'プラス')
    const plusPrice = plusFilter.map((data) => data.pointCngAmount)
    setPlusArr(plusPrice.reverse())
  }


  // minus flag data
  const getMinusData = () => {
    const minusFilter = dataList.filter(data => data.pointCngType === 'マイナス')
    const minusPrice = minusFilter.map((data) => data.pointCngAmount)
    setMinusArr(minusPrice.reverse())
  }


  const getDateBalance = () => {
    const initBalance = dataList.filter(data => data.pointCngType === "初期残高")[0]?.historyBalance


    // 잔고 배열 / 초기잔고값 0번인덱스에 넣기
    const finalArr = [initBalance];
    for (let i = 1; i < Math.ceil(dataList.length / 2); i++) {
      finalArr[i] = finalArr[i - 1] + (plusArr[i - 1] - minusArr[i - 1]);
    }
    // 초기값 들어가있던 인덱스 0번째요소 제거
    finalArr.shift();
    setBalanceArr(finalArr)

    const priceCngArr = [];
    for (let i = 0; i < Math.ceil(dataList.length / 2); i++) {
      priceCngArr[i] = plusArr[i] - minusArr[i];
    }
    priceCngArr.pop();
    setPriceChangeArr(priceCngArr)

  }
  // console.log(dataList)
  //console.log('month:::', monthData)
  //console.log("plusArr:::", plusArr)
  ///console.log("minusArr:::", minusArr)
  //console.log("priceChangeArr:::", priceChangeArr)


  useEffect(() => {
    getmonthData();
    getPlusData();
    getMinusData();
  }, [props.dataList]);

  useEffect(() => {
    getDateBalance();
  }, [plusArr, minusArr])

  // console.log(monthData)
  const data = useMemo(() => {
    return {
      labels: [...monthData],
      datasets: [
        {
          label: "変動量",
          barPercentage: 0.5,
          barThickness: 40,
          maxBarThickness: 30,
          minBarLength: 2,
          data: [...priceChangeArr],
          backgroundColor: "#78AEFF",
          borderRadius: 5,
          order: 2,
        },
        {
          label: "残高",
          barPercentage: 0.5,
          barThickness: 40,
          maxBarThickness: 30,
          minBarLength: 2,
          data: [...balanceArr],
          backgroundColor: "#FFC700",
          borderColor: "#FFC700",
          borderRadius: 5,
          order: 1,
        },
      ],
    };
  });

  const options = useMemo(() => {
    return {
      maintainAspectRatio: false,
      reponsive: false,
      plugins: {
        legend: {
          align: "start",
          labels: {
            color: "#333",
            boxWidth: 20,
            boxHeight: 20,
            usePointStyle: "circle",
            padding: 15,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 12,
            },
            color: colors.slate["500"](0.8),
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            font: {
              size: 12,
            },
            color: "transparent",
            callback: function (value) {
              return "" + value;
            },
          },
          grid: {
            color: "#FFEACC",
            drawBorder: false,
          },
        },
      },
    };
  });

  return (
    <div className="point_chart" style={{ overflowX: "auto", paddingBottom: 20, width: "100%" }}>
      <Chart
        type="bar"
        width={data.labels.length * 100 <= 963 ? "100%" : data.labels.length * 100}
        height={props.height}
        data={data}
        options={options}
        className={props.className}
        borderRadius={20}
      />
    </div>
  );
}

Main.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lineColor: PropTypes.string,
  className: PropTypes.string,
};

Main.defaultProps = {
  width: "100%",
  height: "100%",
  lineColor: "",
  className: "",
};

export default Main;
