// Generated from ./src/antlr4/python.g4 by ANTLR 4.9.0-SNAPSHOT

import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { ProgContext } from "./pythonParser";

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `pythonParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface pythonVisitor<Result> extends ParseTreeVisitor<Result> {
  /**
   * Visit a parse tree produced by `pythonParser.prog`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitProg?: (ctx: ProgContext) => Result;
}
