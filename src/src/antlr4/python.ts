import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { pythonLexer } from "./pythonLexer";
import { pythonParser } from "./pythonParser";

// Create the lexer and parser
let inputStream = new ANTLRInputStream("dev");
let lexer = new pythonLexer(inputStream);
let tokenStream = new CommonTokenStream(lexer);
let parser = new pythonParser(tokenStream);

// Parse the input, where `compilationUnit` is whatever entry point you defined
let tree = parser.prog();
