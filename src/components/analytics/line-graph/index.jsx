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
  
  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
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
            
          />
          <YAxis domain={[Math.floor(YMinValue), Math.ceil(YMaxValue)]} />
          <Tooltip />

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
