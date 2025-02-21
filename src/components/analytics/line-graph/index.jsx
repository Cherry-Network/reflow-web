import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const LineGraph = ({ data, LinedataKey, YMinValue, YMaxValue, XdataKey }) => {
  function formatDateToDDMMYY(dateString) {
    // Split the string into components
    const [year, month, day] = dateString.split("-");

    // Format as DD/MM/YY
    return `${day}/${month}/${year.slice(-2)}`;
  }

  const sortData = (data) => {
    return data.sort((a, b) => {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
  };
  const dataLimit =
    sortData(data)?.length > 1000
      ? sortData(data).filter((_, index) => index % 5 === 0)
      : sortData(data);

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={dataLimit}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={XdataKey}
            angle={90}
            textAnchor="start"
            height={150}
            tick={{ fontSize: 13 }}
            tickFormatter={(value) => {
              return (
                formatDateToDDMMYY(value.split("T")[0]) +
                " " +
                value.split("T")[1].split(":")[0] +
                ":" +
                value.split("T")[1].split(":")[1]
              );
            }}
          />
          <YAxis domain={[Math.floor(YMinValue), Math.ceil(YMaxValue)]} />
          <Tooltip
            labelFormatter={(value) => {
              return (
                formatDateToDDMMYY(value.split("T")[0]) +
                " " +
                value.split("T")[1].split(":")[0] +
                ":" +
                value.split("T")[1].split(":")[1]
              );
            }}
          />

          <Line
            type="monotone"
            dataKey={LinedataKey}
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LineGraph;
