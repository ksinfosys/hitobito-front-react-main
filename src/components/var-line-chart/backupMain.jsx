import { Chart } from "@/base-components";
import { colors } from "@/utils";
import PropTypes from "prop-types";
import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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
  console.log(props.data)
  const data = useMemo(() => {
    return {
      labels: ["10월1일", "10월5일", "10월10일", "10월15일", "10월20일", "10월25일", "10월30일"],
      datasets: [

        {
          label: "사용",
          barPercentage: 0.5,
          barThickness: 40,
          maxBarThickness: 30,
          minBarLength: 2,
          data: [420, 240, 320, 480, 450, 250, 360],
          backgroundColor:'#78AEFF',
          borderRadius:5,
          order:2
        },
        {
          label: "구매",
          barPercentage: 0.5,
          barThickness: 40,
          maxBarThickness: 30,
          minBarLength: 2,
          data: [220, 430, 180, 290, 350, 450, 280],
          backgroundColor:'#FF9800',
          borderRadius:5,
          order:3
        },
        {
          type: 'line',
          label: "잔고",
          barPercentage: 0.5,
          barThickness: 40,
          maxBarThickness: 30,
          minBarLength: 2,
          data: [200, 200, 300, 480, 300, 400, 150],
          backgroundColor: '#FFC700',
          borderColor: '#FFC700',
          borderRadius:5,
          order:1
        },
      ],
    };
  });

  const options = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          align:'end',
          labels: {
            color: '#333',
            boxWidth:20,
            boxHeight:20,
            usePointStyle: 'circle',
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
            color: 'transparent',
            callback: function (value) {
              return "" + value;
            },
          },
          grid: {
            color: '#FFEACC',
            drawBorder: false,
          },
        },
      },
    };
  });

  return (
    <Chart
      type="bar"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
    />
  );
}

Main.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  lineColor: PropTypes.string,
  className: PropTypes.string,
};

Main.defaultProps = {
  width: "auto",
  height: "auto",
  lineColor: "",
  className: "",
};

export default Main;
