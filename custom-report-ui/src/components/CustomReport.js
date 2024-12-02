import React, { useState } from "react";
import MetricSelector from "./MetricSelector";
import GraphView from "./GraphView";
import { generateCSV } from "./csvGenerator";

const metricsList = [
  "Master-O ID",
  "Count",
  "Distinct Count",
  "Content Launch Date",
  "Challenges Status",
  "Completion Status",
  "Completion Date",
  "Completed In Days",
  "Attempts",
  "Score",
  "Max Score",
  "Time Spent",
  "Microskill Name",
  "Login Status",
  "Last Login Date",
];

const CustomReport = () => {
  const [selectedMetrics, setSelectedMetrics] = useState([]);
  const [showGraph, setShowGraph] = useState(false);

  const handleMetricChange = (metric) => {
    setSelectedMetrics((prev) =>
      prev.includes(metric)
        ? prev.filter((item) => item !== metric)
        : [...prev, metric]
    );
  };

  const handleGenerateReport = () => {
    if (selectedMetrics.length === 0) {
      alert("Please select at least one metric.");
      return;
    }
    setShowGraph(true);
  };

  const handleDownloadCSV = () => {
    if (selectedMetrics.length === 0) {
      alert("Please select at least one metric.");
      return;
    }
    generateCSV(selectedMetrics);
  };

  return (
    <div className="custom-report">
      <MetricSelector
        metrics={metricsList}
        selectedMetrics={selectedMetrics}
        onMetricChange={handleMetricChange}
      />
      <div className="report-actions">
        <button onClick={handleGenerateReport}>Generate Report</button>
        <button onClick={handleDownloadCSV}>Download CSV</button>
      </div>
      {showGraph && <GraphView selectedMetrics={selectedMetrics} />}
    </div>
  );
};

export default CustomReport;
