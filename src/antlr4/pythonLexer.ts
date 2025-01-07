// Generated from ./src/antlr4/python.g4 by ANTLR 4.9.0-SNAPSHOT

import { ATN } from 'antlr4ts/atn/ATN';
import { ATNDeserializer } from 'antlr4ts/atn/ATNDeserializer';
import { CharStream } from 'antlr4ts/CharStream';
import { Lexer } from 'antlr4ts/Lexer';
import { LexerATNSimulator } from 'antlr4ts/atn/LexerATNSimulator';
import { NotNull } from 'antlr4ts/Decorators';
import { Override } from 'antlr4ts/Decorators';
import { RuleContext } from 'antlr4ts/RuleContext';
import { Vocabulary } from 'antlr4ts/Vocabulary';
import { VocabularyImpl } from 'antlr4ts/VocabularyImpl';

import * as Utils from 'antlr4ts/misc/Utils';

export class pythonLexer extends Lexer {
  public static readonly T__0 = 1;

  // tslint:disable:no-trailing-whitespace
  public static readonly channelNames: string[] = [
    'DEFAULT_TOKEN_CHANNEL',
    'HIDDEN',
  ];

  // tslint:disable:no-trailing-whitespace
  public static readonly modeNames: string[] = ['DEFAULT_MODE'];

  public static readonly ruleNames: string[] = ['T__0'];

  private static readonly _LITERAL_NAMES: Array<string | undefined> = [
    undefined,
    "'def'",
  ];
  private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [];
  public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(
    pythonLexer._LITERAL_NAMES,
    pythonLexer._SYMBOLIC_NAMES,
    []
  );

  // @Override
  // @NotNull
  public get vocabulary(): Vocabulary {
    return pythonLexer.VOCABULARY;
  }
  // tslint:enable:no-trailing-whitespace

  constructor(input: CharStream) {
    super(input);
    this._interp = new LexerATNSimulator(pythonLexer._ATN, this);
  }

  // @Override
  public get grammarFileName(): string {
    return 'python.g4';
  }

  // @Override
  public get ruleNames(): string[] {
    return pythonLexer.ruleNames;
  }

  // @Override
  public get serializedATN(): string {
    return pythonLexer._serializedATN;
  }

  // @Override
  public get channelNames(): string[] {
    return pythonLexer.channelNames;
  }

  // @Override
  public get modeNames(): string[] {
    return pythonLexer.modeNames;
  }

  public static readonly _serializedATN: string =
    '\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x02\x03\t\b\x01\x04' +
    '\x02\t\x02\x03\x02\x03\x02\x03\x02\x03\x02\x02\x02\x02\x03\x03\x02\x03' +
    '\x03\x02\x02\x02\b\x02\x03\x03\x02\x02\x02\x03\x05\x03\x02\x02\x02\x05' +
    '\x06\x07f\x02\x02\x06\x07\x07g\x02\x02\x07\b\x07h\x02\x02\b\x04\x03\x02' +
    '\x02\x02\x03\x02\x02';
  public static __ATN: ATN;
  public static get _ATN(): ATN {
    if (!pythonLexer.__ATN) {
      pythonLexer.__ATN = new ATNDeserializer().deserialize(
        Utils.toCharArray(pythonLexer._serializedATN)
      );
    }

    return pythonLexer.__ATN;
  }
}
