import React from "react";

enum BlockTypes {
  VARIABLE = "variable",
  IF = "if",
}

// Define types for the blocks
type VariableBlockType = {
  type: BlockTypes.VARIABLE;
  name: string;
  value: string;
};

type IfBlockType = {
  type: BlockTypes.IF;
  condition: string;
  body: BlockType[];
};

type BlockType = VariableBlockType | IfBlockType;

// Variable Block Component
const VariableBlock: React.FC<{ block: VariableBlockType }> = ({ block }) => {
  return (
    <div
      style={{
        marginLeft: "20px",
        border: "1px solid orange",
        padding: "10px",
      }}
    >
      <strong>Variable Block:</strong> {block.name} = {block.value}
    </div>
  );
};

// If Block Component
const IfBlock: React.FC<{ block: IfBlockType }> = ({ block }) => {
  return (
    <div
      style={{ marginLeft: "20px", border: "1px solid blue", padding: "10px" }}
    >
      <strong>If Block:</strong> {block.condition}
      <div>
        {block.body.map((b, index) => (
          <Block key={index} block={b} />
        ))}
      </div>
    </div>
  );
};

// General Block Component
const Block: React.FC<{ block: BlockType }> = ({ block }) => {
  switch (block.type) {
    case BlockTypes.VARIABLE:
      return <VariableBlock block={block} />;
    case BlockTypes.IF:
      return <IfBlock block={block} />;
    default:
      return null;
  }
};

// Function to convert blocks to JSON
const blocksToJson = (blocks: BlockType[]) => {
  return {
    type: "program",
    body: blocks.map((block) => ({ ...block })),
  };
};

// Function to convert JSON to Python code
const jsonToPython = (
  json: { type: string; body: BlockType[] },
  indent: number = 0,
): string => {
  let code = "";

  const indentSpaces = " ".repeat(indent);

  json.body.forEach((block) => {
    switch (block.type) {
      case "variable":
        code += `${indentSpaces}${block.name} = ${block.value}\n`;
        break;
      case "if":
        code += `${indentSpaces}if ${block.condition}:\n`;
        code += jsonToPython({ type: "program", body: block.body }, indent + 4);
        break;
      default:
        break;
    }
  });

  return code;
};

// Main App Component
const App: React.FC = () => {
  const json: { type: string; body: BlockType[] } = {
    type: "program",
    body: [
      {
        type: BlockTypes.VARIABLE,
        name: "x",
        value: "1",
      },
      {
        type: BlockTypes.VARIABLE,
        name: "y",
        value: "2",
      },
      {
        type: BlockTypes.VARIABLE,
        name: "z",
        value: "3",
      },
      {
        type: BlockTypes.IF,
        condition: "x > 4",
        body: [
          {
            type: BlockTypes.IF,
            condition: "y < 5",
            body: [
              {
                type: BlockTypes.IF,
                condition: "z > 6",
                body: [
                  {
                    type: BlockTypes.VARIABLE,
                    name: "z",
                    value: "7",
                  },
                ],
              },
              {
                type: BlockTypes.VARIABLE,
                name: "y",
                value: "8",
              },
            ],
          },
        ],
      },
    ],
  };

  const jsonOutput = blocksToJson(json.body);
  const pythonOutput = jsonToPython(jsonOutput);

  return (
    <div>
      <h1>JSON Input:</h1>
      <pre>{JSON.stringify(jsonOutput, null, 2)}</pre>
      <h1>Generated Code Blocks:</h1>
      <div>
        {json.body.map((block, index) => (
          <Block key={index} block={block} />
        ))}
      </div>
      <h1>Generated Python Code</h1>
      <pre>{pythonOutput}</pre>
    </div>
  );
};

export default App;
