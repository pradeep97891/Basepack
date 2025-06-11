import CFG from "../config/config.json";

const dateFormat = (data: Date | string, format = "dateTime") => {
  if (!data) return "";
  let formats: any = {},
    formatter = "";
  switch (format) {
    case "dateTime":
      // formats = { ...CFG.date_format, ...CFG.time_format };
      formats = Object.assign(CFG.date_format, CFG.time_format);
      formatter = CFG.date_time_formatter;
      break;
    case "date":
      formats = CFG.date_format;
      formatter = CFG.date_formatter;
      break;
    default: //time
      formats = CFG.time_format;
      formatter = CFG.time_formatter;
      break;
  }

  let date = new Date(data);
  let dateArray = date
    .toLocaleDateString(CFG.default_lang, formats)
    .replace(/,/g, "")
    .split(" ");
  let timeArray = dateArray[3] ? dateArray[3].split(":") : [];
  const dates: any = {
    "%M": dateArray[0],
    "%d": dateArray[1],
    "%Y": dateArray[2],
    "%H": timeArray[0],
    "%i": timeArray[1],
    "%A": dateArray[4],
  };

  for (var i in dates) formatter = formatter.replace(i, dates[i]);
  return formatter;
};

const daysInMonth = (month: number, year: number) =>
  new Date(year, month, 0).getDate();
// Methods to calculate the difference between the departure and arrival time
const getDifferenceInTime = (startTime?: string, endTime?: string) => {
  let start_Time: string[] = (startTime as string).split(" ");
  let end_Time: string[] = (endTime as string).split(" ");

  let formattedStartTime: any = new Date(
    Number(start_Time[0].split("/")[2]),
    Number(start_Time[0].split("/")[1]) - 1,
    Number(start_Time[0].split("/")[0]),
    Number(start_Time[1].split(":")[0]),
    Number(start_Time[1].split(":")[1]),
    Number(start_Time[1].split(":")[2])
  );

  let formattedEndTime: any = new Date(
    Number(end_Time[0].split("/")[2]),
    Number(end_Time[0].split("/")[1]) - 1,
    Number(end_Time[0].split("/")[0]),
    Number(end_Time[1].split(":")[0]),
    Number(end_Time[1].split(":")[1]),
    Number(end_Time[1].split(":")[2])
  );

  // Get total seconds
  let TotalSeconds = Math.abs(formattedStartTime - formattedEndTime) / 1000;

  // Get days
  let days = Math.floor(TotalSeconds / 86400);

  // Get hours
  let hours = Math.floor(TotalSeconds / 3600) % 24;

  // Get minutes
  let minutes = Math.floor(TotalSeconds / 60) % 60;

  // Get seconds
  // let seconds = TotalSeconds % 60;

  let timeDifferce: string = "";

  timeDifferce =
    days !== 0
      ? days + "d " + hours + "h"
      : hours !== 0
        ? hours + "h " + minutes + "m"
        : minutes !== 0
          ? minutes + "m"
          : timeDifferce;

  return timeDifferce;
};

const DateFormatForReschedule = (date: string, day = true) => {
  const formattedValue = new Date(
    date.substring(3, 6) + date.substring(0, 3) + date.substring(6, 19)
  );
  return formattedValue
    .toString()
    .substring(day ? 0 : 4, 15)
    .replaceAll(" ", ", ");
};

const formatDate = (date: Date | string): string => {
  if (!(date instanceof Date)) date = new Date(date);
  // const options: Intl.DateTimeFormatOptions = {
  //   day: "2-digit",
  //   month: "short",
  //   year: "numeric",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: false,
  // };
  // return date.toLocaleDateString("en-GB", options);

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
 
  const time = date.toLocaleTimeString("en-GB", optionsTime); // "13:20"
  const day = date.toLocaleDateString("en-GB", { day: "2-digit" }); // "15"
  const month = date.toLocaleDateString("en-GB", { month: "short" }); // "Oct"
  const year = date.toLocaleDateString("en-GB", { year: "numeric" }); // "2024"
  
  // Combine the formatted time and date parts with a comma where required
  return `${time}, ${month} ${day}, ${year}`;
};

function formatDateString(dateString: string) {
  // Parse the date string
  const date = new Date(dateString);

  // Get the month name
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];

  // Get the day, year, hours, and minutes
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the minutes with leading zero if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Determine AM or PM
  // const ampm = hours >= 12 ? "PM" : "AM";
  // hours = hours % 12;
  // hours = hours ? hours : 12; // The hour '0' should be '12'

  // Construct the formatted date string
  // return `${month} ${day}, ${year} ${hours}:${formattedMinutes} ${ampm}`;
  return `${hours}:${formattedMinutes}, ${month} ${day}, ${year}`;
}

// const dateString = '2024-06-18T09:47:35.185684Z';
// console.log(formatDate(dateString)); // Output: "Jun 18, 2024 9:47 AM"

export {
  formatDate,
  formatDateString,
  dateFormat,
  daysInMonth,
  getDifferenceInTime,
  DateFormatForReschedule,
};
