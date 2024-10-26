// Generated from ./src/antlr4/python.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { pythonListener } from "./pythonListener";
import { pythonVisitor } from "./pythonVisitor";


export class pythonParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly RULE_prog = 0;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"prog",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'def'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(pythonParser._LITERAL_NAMES, pythonParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return pythonParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "python.g4"; }

	// @Override
	public get ruleNames(): string[] { return pythonParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return pythonParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(pythonParser._ATN, this);
	}
	// @RuleVersion(0)
	public prog(): ProgContext {
		let _localctx: ProgContext = new ProgContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, pythonParser.RULE_prog);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 2;
			this.match(pythonParser.T__0);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x03\x07\x04\x02" +
		"\t\x02\x03\x02\x03\x02\x03\x02\x02\x02\x02\x03\x02\x02\x02\x02\x02\x05" +
		"\x02\x04\x03\x02\x02\x02\x04\x05\x07\x03\x02\x02\x05\x03\x03\x02\x02\x02" +
		"\x02";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!pythonParser.__ATN) {
			pythonParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(pythonParser._serializedATN));
		}

		return pythonParser.__ATN;
	}

}

export class ProgContext extends ParserRuleContext {
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return pythonParser.RULE_prog; }
	// @Override
	public enterRule(listener: pythonListener): void {
		if (listener.enterProg) {
			listener.enterProg(this);
		}
	}
	// @Override
	public exitRule(listener: pythonListener): void {
		if (listener.exitProg) {
			listener.exitProg(this);
		}
	}
	// @Override
	public accept<Result>(visitor: pythonVisitor<Result>): Result {
		if (visitor.visitProg) {
			return visitor.visitProg(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


