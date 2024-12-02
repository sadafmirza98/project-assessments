export const generateCSV = (metrics) => {
  const headers = metrics.join(",");
  const dummyData = Array.from({ length: 5 }, (_, i) =>
    metrics.map(() => Math.random().toFixed(2)).join(",")
  );

  const csvContent = [headers, ...dummyData].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "custom_report.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
