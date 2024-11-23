import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const Grid = () => {
  const [gridTables, setGridTables] = useState([]);

  const [, drop] = useDrop(() => ({
    accept: "TABLE",
    drop: (item) => {
      if (!gridTables.some((t) => t.id === item.table.id)) {
        setGridTables((prev) => [
          ...prev,
          {
            ...item.table,
            position: { x: 100, y: 100 },
            size: { width: 300, height: 200 },
          },
        ]);
      }
    },
  }));

  const handleDragStop = (e, data, tableId) => {
    const updatedPositions = gridTables.map((table) =>
      table.id === tableId
        ? { ...table, position: { x: data.x, y: data.y } }
        : table
    );
    setGridTables(updatedPositions);
  };

  const handleResize = (tableId, newSize) => {
    const updatedSizes = gridTables.map((table) =>
      table.id === tableId
        ? { ...table, size: { width: newSize.width, height: newSize.height } }
        : table
    );
    setGridTables(updatedSizes);
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
          handle=".table-header" // Only the header is draggable
        >
          <div
            style={{
              width: table.size.width,
              height: table.size.height,
              position: "absolute",
            }}
          >
            <ResizableBox
              width={table.size.width}
              height={table.size.height}
              minConstraints={[150, 100]}
              maxConstraints={[500, 400]}
              onResizeStop={(e, data) =>
                handleResize(table.id, {
                  width: data.size.width,
                  height: data.size.height,
                })
              }
              resizeHandles={["se"]}
            >
              <div className="grid-table">
                <div className="table-header">
                  <span className="material-symbols-outlined icon">table</span>
                  <span
                    style={{
                      flex: "1",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    {table.name}
                  </span>
                  <button
                    className="remove-button"
                    onClick={() => removeTable(table.id)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    <span className="material-symbols-outlined icon">
                      close
                    </span>
                  </button>
                </div>

                <div
                  className="grid-table-table"
                  style={{
                    overflow: "auto",
                    height: "calc(100% - 40px)",
                  }}
                >
                  <table>
                    <thead>
                      <tr>
                        <th>
                          <span className="material-symbols-outlined icon">
                            check_box
                          </span>
                          Column
                        </th>
                        <th>Data Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.columns.map((column) => (
                        <tr key={column.id}>
                          <td>
                            <span className="material-symbols-outlined icon">
                              check_box
                            </span>
                            {column.name}
                          </td>
                          <td>{column.data_type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="scroll-here">Scroll to see more columns</div>
              </div>
            </ResizableBox>
          </div>
        </Draggable>
      ))}
    </div>
  );
};

export default Grid;
