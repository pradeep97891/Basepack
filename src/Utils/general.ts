import dayjs from "dayjs";

/* Async Friendly SetTimeout */
export const asyncTimeout = (s: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, s * 1000);
  });
};

export const isPossiblyBtoaEncoded = (str: any) => {
  try {
    // Attempt to decode the string
    const decoded = atob(str);

    // Check if the decoded string contains only printable characters
    return decoded
      .split("")
      .every((char) => char.charCodeAt(0) >= 32 && char.charCodeAt(0) <= 126);
  } catch (error) {
    // If decoding fails, it's likely not btoa encoded
    return false;
  }
};

/**
 * Utility function to check if a value is an object or array.
 * @param obj - The value to check.
 * @returns {boolean} - True if the value is an object or array, false otherwise.
 */
const isObject = (obj: any) => obj && typeof obj === "object";

/**
 * Utility funciton for detecting changes between two objects.
 * It compares the initial values with the current values recursively
 * to determine if any field has been updated.
 *
 * @param {object} original - The initial values.
 * @param {object} updated - The current values.
 * @returns {boolean} - Returns true if any changes are detected, false otherwise.
 */
export const deepCompare = (
  original: any,
  updated: any,
  checkKeyLength: boolean = false
): boolean => {
  // If both are not objects, compare directly
  if (!isObject(original) || !isObject(updated)) {
    return original != updated;
  }

  // If both are arrays, compare their elements
  if (Array.isArray(original) && Array.isArray(updated)) {
    if (original.length != updated.length) return true;

    return original.some((item, index) => deepCompare(item, updated[index]));
  }

  // For objects, compare their keys and values
  const originalKeys = Object.keys(original);
  const updatedKeys = Object.keys(updated);

  if (checkKeyLength && originalKeys.length !== updatedKeys.length) return true;

  return updatedKeys.some((key) => deepCompare(original[key], updated[key]));
};

/**
 * Utility function to calculate a dynamic date based on an offset.
 * It takes a string with year, month, and day offsets, and generates a new date
 * relative to the current date. The returned date is formatted as 'MMM DD, YYYY'.
 *
 * @param {string} dateParam - The input string in the format "('yearOffset,monthOffset,day')".
 * Example: '0,1,1' would return a date that is 1 month and 1st of the month.
 * @param {boolean} reverse - True : convert 'Jul 13, 2024' to '0,-2,13'
 *
 * @returns {string} - A formatted string representing the calculated date in 'MMM DD, YYYY' format.
 *
 * Example usage:
 *
 * getDynamicDate('0,1,1'); // If today is Jan 10, 2024, the output would be 'Feb 1, 2024'.
 * Extra forth value(time) can be given. That will be appended after the dynamic date.
 */
export const getDynamicDate = (
  dateParam: string | dayjs.Dayjs,
  reverse: boolean = false,
  dateFormat: string = ""
): string | dayjs.Dayjs | undefined => {
  // Remove parentheses and single quotes, then split into an array of numbers
  try {
    if (reverse) {
      // Parse the input date (e.g., "Jul 13, 2024") to dayjs
      const targetDate = dayjs(
        dateParam,
        dateFormat ? dateFormat : "MMM DD, YYYY"
      );
      const currentDate = dayjs();

      // Calculate year and month offsets
      const yearOffset = targetDate.year() - currentDate.year();
      const monthOffset = targetDate.month() - currentDate.month();
      const day = targetDate.date();

      // Return the string in the format "yearOffset, monthOffset, day"
      return `${yearOffset},${monthOffset},${day}`;
    }

    if (typeof dateParam !== "string") throw "Invalid date format";

    const [yearOffset, monthOffset, day, added] = dateParam?.split(",");

    // Calculate the dynamic date based on the extracted values
    const dynamicDate = new Date(
      new Date().getFullYear() + Number(yearOffset),
      new Date().getMonth() + Number(monthOffset),
      Number(day)
    );

    // Format the date to "MMM DD, YYYY"
    const formattedDate = dynamicDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    // Append 'added' value if it exists, trimming any leading/trailing spaces
    return added ? `${formattedDate} ${added.trim()}` : formattedDate;
  } catch {
    return dateParam;
  }
};

/**
 * Formats and returns a group label.
 * If the group string contains "fdms", it will:
 *  - Split the string by underscores (_)
 *  - Remove the "fdms" prefix
 *  - Capitalize the first letter of the remaining string
 * If "fdms" is not present, it returns the group string as is.
 *
 * @param group - The group string to be formatted
 * @returns The formatted group label
 *
 * Example:
 * Input: "fdms_head_of_operations"
 * Output: "Head of operations"
 */
export const getGroupLabel = (group: string) =>
  group?.includes("fdms")
    ? group
        .split("_")
        .splice(1)
        .join(" ")
        ?.replace(/^\w/, (char: any) => char.toUpperCase())
    : group;


/* Filter by date range */
type ItemType = {
  date: string; // e.g., 'Nov 01, 2024'
};

export const filterItemsByDateRange = (items: ItemType[], key: string, filterOption: string) => {
  const today = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (filterOption) {
    case "today":
      startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );
      break;

    case "this week":
      const dayOfWeek = today.getDay();
      startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - dayOfWeek
      );
      endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + (6 - dayOfWeek) + 1
      );
      break;

    case "this month":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      break;

    case "this year":
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear() + 1, 0, 1);
      break;

    default:
      return items;
  }

  return items.filter((item : any) => {
    const itemDate = new Date(getDynamicDate(item[key]) as string);
    console.log(getDynamicDate(item[key]) as string)
    return itemDate >= startDate && itemDate < endDate;
  });
};
