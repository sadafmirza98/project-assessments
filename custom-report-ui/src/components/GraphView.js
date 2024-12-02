import React from "react";

const GraphView = ({ selectedMetrics }) => {
  return (
    <div className="graph-view">
      <h3>Report Graphs</h3>
      <p>Selected Metrics:</p>
      <ul>
        {selectedMetrics.map((metric, index) => (
          <li key={index}>{metric}</li>
        ))}
      </ul>
      <div className="powerbi-placeholder">
        <p>Power BI  graph</p>
        <iframe
          title="powerA"
          width="800"
          height="600"
          src="https://app.powerbi.com/view?r=your_report_link"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default GraphView;
