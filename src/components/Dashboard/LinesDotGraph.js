import React from "react";
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

const LinesDotGraph = ({ data, lineDataConfig }) => {
    return (
        <ResponsiveContainer width="100%" height={500}>
            <LineChart data={data}>
                {/* Grid */}
                <CartesianGrid strokeDasharray="3 3" />

                {/* Axes */}
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" domain={[500, 3500]} />
                <YAxis yAxisId="right" orientation="right" domain={[1.33, 1.42]} tickFormatter={(tick) => tick.toFixed(3)} />

                {/* Tooltip and Legend */}
                <Tooltip />
                <Legend />

                {/* Dynamically rendering Line components */}
                {lineDataConfig.map((config, index) => (
                    <Line
                        key={index}
                        yAxisId={config.yAxisId}
                        type="monotone"
                        dataKey={config.dataKey}
                        stroke={config.stroke}
                        strokeWidth={config.strokeWidth}
                        dot={config.dot}
                        name={config.name}
                        strokeDasharray={config.strokeDasharray || ""}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default LinesDotGraph;
