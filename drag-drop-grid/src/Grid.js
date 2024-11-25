import React, { useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const COLUMN = "COLUMN";

const Grid = () => {
  const [gridTables, setGridTables] = useState([]);
  const [lines, setLines] = useState([]);
  const [draggingLine, setDraggingLine] = useState(null);

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
            columns: item.table.columns || [],
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
    setLines((prev) =>
      prev.filter(
        (line) =>
          line.sourceTableId !== tableId && line.targetTableId !== tableId
      )
    );
  };

  const addColumnToTable = (targetTableId, column) => {
    setGridTables((prev) =>
      prev.map((table) => {
        if (table.id === targetTableId) {
          return {
            ...table,
            columns: [...table.columns, column],
          };
        }
        return table;
      })
    );
  };

  const moveColumn = (sourceTableId, targetTableId, column) => {
    setGridTables((prev) =>
      prev.map((table) => {
        if (table.id === sourceTableId) {
          return {
            ...table,
            columns: table.columns.filter((col) => col.id !== column.id),
          };
        }
        if (table.id === targetTableId) {
          return {
            ...table,
            columns: [...table.columns, column],
          };
        }
        return table;
      })
    );
  };

  const addConnectionLine = (sourceTable, targetTable, column) => {
    const existingLine = lines.some(
      (line) =>
        (line.sourceTableId === sourceTable.id &&
          line.targetTableId === targetTable.id &&
          line.sourceColumnId === column.id) ||
        (line.targetTableId === sourceTable.id &&
          line.sourceTableId === targetTable.id &&
          line.targetColumnId === column.id)
    );
    if (!existingLine) {
      setLines((prev) => [
        ...prev,
        {
          sourceTableId: sourceTable.id,
          targetTableId: targetTable.id,
          sourceColumnId: column.id,
          targetColumnId: column.id,
        },
      ]);
    }
  };

  const calculateLinePosition = (table, columnIndex) => {
    const columnHeight = 40;
    return {
      x: table.position.x + table.size.width / 2,
      y: table.position.y + 50 + columnIndex * columnHeight,
    };
  };

  return (
    <div ref={drop} className="grid-container" style={{ position: "relative" }}>
      {gridTables.map((table) => (
        <Draggable
          key={table.id}
          position={table.position}
          onStop={(e, data) => handleDragStop(e, data, table.id)}
          handle=".table-header"
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
                  style={{ overflow: "auto", height: "calc(100% - 40px)" }}
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
                      {table.columns.map((column, index) => (
                        <DraggableColumn
                          key={column.id}
                          column={column}
                          sourceTableId={table.id}
                          moveColumn={moveColumn}
                          gridTables={gridTables}
                          addColumnToTable={addColumnToTable}
                          addConnectionLine={addConnectionLine}
                          columnIndex={index}
                          calculateLinePosition={calculateLinePosition}
                        />
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

      {lines.map((line, index) => {
        const sourceTable = gridTables.find(
          (table) => table.id === line.sourceTableId
        );
        const targetTable = gridTables.find(
          (table) => table.id === line.targetTableId
        );
        if (!sourceTable || !targetTable) return null;

        const sourcePosition = calculateLinePosition(
          sourceTable,
          line.sourceColumnId
        );
        const targetPosition = calculateLinePosition(
          targetTable,
          line.targetColumnId
        );

        return (
          <svg
            key={index}
            className="line"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
            }}
          >
            <path
              d={`M${sourcePosition.x},${sourcePosition.y} C${
                (sourcePosition.x + targetPosition.x) / 2
              },${sourcePosition.y} ${
                (sourcePosition.x + targetPosition.x) / 2
              },${targetPosition.y} ${targetPosition.x},${targetPosition.y}`}
            />
            <circle
              className="line-dot"
              cx={sourcePosition.x}
              cy={sourcePosition.y}
            />
            <circle
              className="line-dot"
              cx={targetPosition.x}
              cy={targetPosition.y}
            />
          </svg>
        );
      })}
    </div>
  );
};

const DraggableColumn = ({
  column,
  sourceTableId,
  moveColumn,
  gridTables,
  addColumnToTable,
  addConnectionLine,
  columnIndex,
  calculateLinePosition,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: COLUMN,
    item: { column, sourceTableId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: COLUMN,
    drop: (item) => {
      const sourceTable = gridTables.find(
        (table) => table.id === item.sourceTableId
      );
      const targetTable = gridTables.find(
        (table) => table.id === sourceTableId
      );

      if (sourceTable && targetTable && item.sourceTableId !== sourceTableId) {
        addColumnToTable(sourceTableId, item.column);
        addConnectionLine(sourceTable, targetTable, item.column);
      }
    },
  }));

  return (
    <tr
      ref={(node) => drag(drop(node))}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <td>{column.name}</td>
      <td>{column.data_type}</td>
    </tr>
  );
};

export default Grid;
