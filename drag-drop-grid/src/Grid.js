import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Draggable from "react-draggable";

const Grid = () => {
  const [gridTables, setGridTables] = useState([]);

  const [, drop] = useDrop(() => ({
    accept: "TABLE",
    drop: (item) => {
      if (!gridTables.some((t) => t.id === item.table.id)) {
        setGridTables((prev) => [
          ...prev,
          { ...item.table, position: { x: 100, y: 100 } },
        ]);
      }
    },
  }));

  const handleDragStop = (e, data, tableId) => {
    const newTablePositions = gridTables.map((table) =>
      table.id === tableId
        ? { ...table, position: { x: data.x, y: data.y } }
        : table
    );
    setGridTables(newTablePositions);
  };

  const removeTable = (tableId) => {
    setGridTables(gridTables.filter((table) => table.id !== tableId));
  };

  return (
    <div ref={drop} className="grid-container">
      {gridTables.map((table) => (
        <Draggable
          key={table.id}
          position={table.position}
          onStop={(e, data) => handleDragStop(e, data, table.id)}
        >
          <div className="grid-table">
            <div className="table-header">
              <span className="material-symbols-outlined icon">table</span>

              <span style={{ flex: "1", fontWeight: "500" }}>{table.name}</span>

              <button className="" onClick={() => removeTable(table.id)}>
                <span className="material-symbols-outlined icon">close</span>
              </button>
            </div>

            <div className="grid-table-table">
              <table>
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Data Type</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((column) => (
                    <tr key={column.id}>
                      <td>{column.name}</td>
                      <td>{column.data_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default Grid;
