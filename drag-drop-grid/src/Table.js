import React, { useState } from "react";
import { useDrag } from "react-dnd"; // Import useDrag hook

const Table = ({ table, onAddTable }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); // Toggle the expansion of columns
  };

  // Using useDrag to make this table draggable
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TABLE", // Define the type of draggable item
    item: { table }, // Pass the table data when dragging
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // Track the dragging state
    }),
  }));

  return (
    <div
      ref={drag} // This makes the component draggable
      className="left-table"
    >
      <div className="left-table-header">
        <button
          onClick={toggleExpand}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            color: "#696e74",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span class="material-symbols-outlined icon">
            {isExpanded ? "remove" : "add_box"}
          </span>
        </button>
        <span className="material-symbols-outlined icon">table</span>{" "}
        <div className="left-table-header">
          {" "}
          <span style={{ flex: "1", fontWeight: "500" }}>{table.name}</span>
        </div>
      </div>
      {isExpanded && (
        <div className="left-table-header">
          <ul>
            {table.columns.map((column) => (
              <li
                key={column.id}
                style={{ display: "flex", alignItems: "center", gap: "22px" }}
              >
                <span className="material-symbols-outlined icon">table</span>
                {column.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Table;
