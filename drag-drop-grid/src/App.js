import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Grid from "./Grid";
import Table from "./Table";

const App = () => {
  const tables = [
    {
      id: "1",
      name: "Employee",
      columns: [
        { id: "1", name: "age", data_type: "INTEGER" },
        { id: "2", name: "emp_id", data_type: "INTEGER" },
      ],
    },
    {
      id: "2",
      name: "Department",
      columns: [
        { id: "1", name: "dept_name", data_type: "VARCHAR(50)" },
        { id: "2", name: "location", data_type: "VARCHAR(100)" },
      ],
    },
    {
      id: "3",
      name: "Patient",
      columns: [
        { id: "1", name: "pat_name", data_type: "VARCHAR(50)" },
        { id: "2", name: "ward", data_type: "VARCHAR(100)" },
      ],
    },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <h1>Drag Tables to the Right</h1>
        <div style={{ display: "flex" }}>
          <div style={{ width: "25vw" }}>
            {tables.map((table) => (
              <Table key={table.id} table={table} onAddTable={(table) => {}} />
            ))}
          </div>
          <Grid />
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
