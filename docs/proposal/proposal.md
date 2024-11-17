# School of Computing &mdash; Year 4 Project Proposal Form

## SECTION A

|                     |                |
| ------------------- | -------------- |
| Project Title:      | snap-py        |
| Student 1 Name:     | Luigi Di Paolo |
| Student 1 ID:       | 21725939       |
| Student 2 Name:     | Andy Vodopi    |
| Student 2 ID:       | 21477816         |
| Project Supervisor: | Stephen Blott  |

## SECTION B

### Introduction

This project focuses on developing an online visual programming tool aimed at beginner Python programmers. It uses a drag-and-drop interface where users can assemble Python commands and functions through interactive blocks. The project provides a user-friendly environment for understanding Python's logic and structure by bridging visual block-based programming and real Python code.

### Outline

The project is a web-based application where users can visually construct Python programs by arranging blocks on a canvas. Each block represents a Python command or function, and users can see real-time Python code generated from their block arrangement. Additionally, users can edit the Python code directly, and the application will update the block view accordingly. The application also includes an interpreter that runs the generated code and highlights the block and line of code currently being executed, helping users visualize control flow.

### Background

The idea for this project stems from the popularity of visual programming tools like Scratch and Blockly, which simplify the coding process for beginners. While tools like these exist for various programming languages, there is a lack of comprehensive tools specifically tailored to Python that also allow switching between block-based programming and raw code, as well as including an interpreter. This project aims to fill that gap by giving learners an interactive and hands-on approach to understanding Python.

### Achievements

The project will provide several key functions:

- A drag-and-drop interface for building Python code using visual blocks.
- Real-time code generation from blocks, as well as the reverse—blocks from modified Python code.
- An embedded interpreter that runs code, providing immediate feedback and a better understanding of control flow.
- The primary users will be beginner programmers, educators, and students interested in learning Python interactively.

### Justification

This tool will be useful in introductory programming classes or for self-learners who find traditional text-based programming intimidating. By making programming visual, it reduces the initial learning curve. The project can also serve educational institutions as a supplemental tool for teaching Python. It can be accessed from any web browser, making it available across platforms without installation.

### Programming language(s)

The project will be built using:

- TypeScript (for both the frontend and backend logic, and the interpreter)
- JavaScript (for additional frontend functionality if needed)

### Programming tools / Tech stack

- Frontend: React
- Interpreter: TypeScript (to handle the block-to-code and code-to-block conversions, as well as real-time execution)
- Parser Generator: Antlr
- Database: PostgreSQL
- Backend: Node.js (for any server-side logic, though the majority of the application will run client-side)
- Version Control: Git

### Hardware

No non-standard hardware is required for this project. It will run entirely within web browsers on standard devices like laptops, desktops, and tablets.

### Learning Challenges

The main learning challenges include:

- Implementing a real-time Python interpreter using TypeScript.
- Developing the conversion algorithms between block-based code and raw Python code.
- Developing the visual blocks from scratch, including the complex logic for how blocks interact, connect, and influence each other’s behavior.
- Ensuring smooth performance of the code execution within the browser.

### Breakdown of work

#### Luigi Di Paolo

- Implementing a real-time Python interpreter using TypeScript: Luigi will design and implement the interpreter that allows users to execute the generated Python code in real time. This involves handling control flow, providing feedback on execution, and visually linking the code to the blocks.
- Developing the conversion algorithms between block-based code and raw Python code: Luigi will work on the logic and algorithms necessary to translate blocks into Python code and vice versa. This requires implementing a robust two-way conversion system that ensures accuracy and usability.
- Backend (server, database): Luigi will handle the server-side implementation and manage data storage with PostgreSQL. Responsibilities include setting up the backend architecture, managing user sessions, and providing data persistence for users’ projects and progress.

#### Student 2

> Implementing drag and drop interface

Blocks and how they interact

app layout


