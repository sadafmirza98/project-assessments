import React from "react";

const MetricSelector = ({ metrics, selectedMetrics, onMetricChange }) => {
  return (
    <div className="metric-selector">
      <h3>Select Metrics</h3>
      <ul>
        {metrics.map((metric) => (
          <li key={metric}>
            <input
              type="checkbox"
              checked={selectedMetrics.includes(metric)}
              onChange={() => onMetricChange(metric)}
            />
            <label>{metric}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MetricSelector;
