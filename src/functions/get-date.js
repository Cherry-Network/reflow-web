function getFromDateIST() {
  // Define the IST timezone offset in minutes (+5:30 = 330 minutes)
  const IST_OFFSET = 330;

  // Get the current UTC time and apply the IST offset
  const now = new Date();
  const istNow = new Date(now.getTime() + IST_OFFSET * 60 * 1000);

  // Check if the current time in IST is before 7:00 AM
  if (istNow.getHours() < 7) {
    // If before 7:00 AM, subtract one day
    istNow.setDate(istNow.getDate() - 1);
  }

  // Format the date as dd-mm-yyyy
  const day = String(istNow.getDate()).padStart(2, "0");
  const month = String(istNow.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = istNow.getFullYear();

  return {
    day: day,
    month: month,
    year: year,
  };
}

const getToDateIST = () => {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  const parts = formatter.formatToParts(new Date());
  const day = parts.find((part) => part.type === "day").value;
  const month = parts.find((part) => part.type === "month").value;
  const year = parts.find((part) => part.type === "year").value;

  return {
    day: day,
    month: month,
    year: year,
  };
};

export { getFromDateIST, getToDateIST };
