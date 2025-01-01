import { useState } from "react";

const Variable = () => {
  const [varName, setVarName] = useState("");
  const [varValue, setVarValue] =
    useState(""); /* Just taking strings for simplicity at the moment */

  return (
    <svg width="250" height="60" xmlns="http://www.w3.org/2000/svg">
      {/* Little piece at the bottom */}
      <rect
        x="25"
        y="40"
        width="20"
        height="20"
        rx="5"
        ry="5"
        fill="lightblue"
      />

      {/* Main block shape */}
      <rect
        x="0"
        y="0"
        width="250"
        height="50"
        rx="10"
        ry="10"
        fill="lightblue"
      />

      <text x="20" y="35" fontSize="20" fill="black">
        Set
      </text>

      {/* Input field for variable name */}
      <foreignObject x="50" y="10" width="50" height="30">
        <input
          type="text"
          placeholder="a"
          value={varName}
          onChange={(e) => setVarName(e.target.value)}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "4px",
            border: "1px solid gray",
            padding: "4px",
          }}
        />
      </foreignObject>

      <text x="120" y="35" fontSize="20" fill="black">
        to
      </text>

      {/* Input field for variable value */}
      <foreignObject x="150" y="10" width="50" height="30">
        <input
          type="text"
          placeholder="0"
          value={varValue}
          onChange={(e) => setVarValue(e.target.value)}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "4px",
            border: "1px solid gray",
            padding: "4px",
          }}
        />
      </foreignObject>

      {/* Little piece at the top */}
      <rect x="25" y="-10" width="20" height="20" rx="5" ry="5" fill="white" />
    </svg>
  );
};

export default Variable;
