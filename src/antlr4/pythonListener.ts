// Generated from ./src/antlr4/python.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { ProgContext } from "./pythonParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `pythonParser`.
 */
export interface pythonListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `pythonParser.prog`.
	 * @param ctx the parse tree
	 */
	enterProg?: (ctx: ProgContext) => void;
	/**
	 * Exit a parse tree produced by `pythonParser.prog`.
	 * @param ctx the parse tree
	 */
	exitProg?: (ctx: ProgContext) => void;
}

