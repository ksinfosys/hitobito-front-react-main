/* import colorLib from '@kurkle/color'; */
import { DateTime } from "luxon";
import "chartjs-adapter-luxon";
// import {valueOrDefault} from '../../dist/helpers.js';'

const valueOrDefault = (value, defaultValue) => {
  return value ? value : defaultValue;
};

// Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
var _seed = Date.now();

export function srand(seed) {
  _seed = seed;
}

export function rand(min, max) {
  min = valueOrDefault(min, 0);
  max = valueOrDefault(max, 0);
  _seed = (_seed * 9301 + 49297) % 233280;
  return min + (_seed / 233280) * (max - min);
}

export function numbers(config) {
  var cfg = config || {};
  var min = valueOrDefault(cfg.min, 0);
  var max = valueOrDefault(cfg.max, 100);
  var from = valueOrDefault(cfg.from, []);
  var count = valueOrDefault(cfg.count, 8);
  var decimals = valueOrDefault(cfg.decimals, 8);
  var continuity = valueOrDefault(cfg.continuity, 1);
  var dfactor = Math.pow(10, decimals) || 0;
  var data = [];
  var i, value;

  for (i = 0; i < count; ++i) {
    value = (from[i] || 0) + rand(min, max);
    if (rand() <= continuity) {
      data.push(Math.round(dfactor * value) / dfactor);
    } else {
      data.push(null);
    }
  }

  return data;
}

export function points(config) {
  const xs = this.numbers(config);
  const ys = this.numbers(config);
  return xs.map((x, i) => ({ x, y: ys[i] }));
}

export function bubbles(config) {
  return this.points(config).map(pt => {
    pt.r = rand(config.rmin, config.rmax);
    return pt;
  });
}

export function labels(config) {
  var cfg = config || {};
  var min = cfg.min || 0;
  var max = cfg.max || 100;
  var count = cfg.count || 8;
  var step = (max - min) / count;
  var decimals = cfg.decimals || 8;
  var dfactor = Math.pow(10, decimals) || 0;
  var prefix = cfg.prefix || "";
  var values = [];
  var i;

  for (i = min; i < max; i += step) {
    values.push(prefix + Math.round(dfactor * i) / dfactor);
  }

  return values;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function months(config) {
  var cfg = config || {};
  var count = cfg.count || 12;
  var section = cfg.section;
  var values = [];
  var i, value;

  for (i = 0; i < count; ++i) {
    value = MONTHS[Math.ceil(i) % 12];
    values.push(value.substring(0, section));
  }

  return values;
}

const COLORS = [
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
];

export function color(index) {
  return COLORS[index % COLORS.length];
}

export function transparentize(value, opacity) {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
}

export const CHART_COLORS = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)",
};

const NAMED_COLORS = [
  CHART_COLORS.red,
  CHART_COLORS.orange,
  CHART_COLORS.yellow,
  CHART_COLORS.green,
  CHART_COLORS.blue,
  CHART_COLORS.purple,
  CHART_COLORS.grey,
];

export function namedColor(index) {
  return NAMED_COLORS[index % NAMED_COLORS.length];
}

export function newDate(days) {
  return DateTime.now().plus({ days }).toJSDate();
}

export function newDateString(days) {
  return DateTime.now().plus({ days }).toISO();
}

export function parseISODate(str) {
  return DateTime.fromISO(str);
}

export function getUsrPntLstCgnTm(date) {
  date = date != null ? date.substring(0, 10).replaceAll("-", "/") : "";
  return date;
}

export function regexUserJoinDate(date) {
  return date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1/$2/$3");
}

// - 추가
export function regexUserHypenJoinDate(date) {
  return date.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
}

// 세자리마다 콤마찍기
export function regexUserPoint(price) {
  // console.log(typeof price, "price:::", price)
  if(price === undefined) {
    return 
  } else {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

// plancode - 플랜명 string으로 변환
export function planCodeToPlanName(planCode) {
  switch (planCode) {
    case "P0000":
      return "フリープラン";
    case "P0001":
      return "プランA";
    case "P0002":
      return "プランB";
  }
}

export function getGiftCardDate(date) {
  const dateStr = new Date(date);
  const formattedDate = dateStr.toISOString().substring(0, 10);
  return formattedDate;
}

export function getTimeFormatMsg(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear().toString().substr(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const hour = ("0" + date.getHours()).slice(-2);
  const minute = ("0" + date.getMinutes()).slice(-2);

  const formattedDate = `${year}-${month}-${day} [${hour}:${minute}]`;
  return formattedDate;
}

// /를 -로 대체
export function replaceSlashToHypen(dateString) {
  let str = dateString;
  str = str.replace(/-/g, "/");
  return str;
}

// /를 -로 대체하면서 오늘 날짜 표시
export function todayReplaceSlashToHypen(dateString) {
  let str = dateString;
  const todayFlag = "今日";

  str = str.replace(/^(\d{4}-\d{2}-\d{2})/, todayFlag);
  return str;
}

// 문자열 앞자리 2개 21인지 확인
export function cancleRegularPayFlag(enddate) {
  if (enddate) {
    let flag = enddate.substr(0, 2) === "21";
    return flag;
  }
}

// YYYYMMDD 문자열형식을 M월 D일 로 변경
export function replaceToPointFormat(date) {
  const regex = /^(\d{4})(\d{2})(\d{2})$/;
  const [, year, month, day] = date.match(regex);
  const formattedDate = `${parseInt(month)}月 ${parseInt(day)}日`;

  return formattedDate // "5월 1일"
}