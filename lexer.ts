const RESERVED_WORD = {
    "int": TokenInt,
    "if": TokenIf,
    "else": TokenElse,
    "while": TokenWhile,
    "return": TokenReturn,
};

const SYMBOLS = {
    "<=": TokenLe,
    ">=": TokenGe,
    "==": TokenEq,
    "!=": TokenNe,
    "<<": TokenLshift,
    ">>": TokenRshift,
    "&": TokenAnd,
    "|": TokenOr,
    "^": TokenXor,
    "~": TokenTlide,
    "(": TokenRparen,
    ")": TokenLparen,
    ",": TokenComma,
    "+": TokenPlus,
    "-": TokenMinus,
    "*": TokenAsterisk,
    "/": TokenSlash,
    "%": TokenPercent,
    "=": TokenEqual,
    ";": TokenSemicolon,
    ":": TokenColon,
    "{": TokenRbrace,
    "}": TokenLbrace,
    "<": TokenLt,
    ">": TokenGt,
};

class Lexer {
    src: string;
    constructor(src: string) {
        this.src = src;
    }

    lex(): Array<Token> {
        var tokens : Array<Token> = [];
        var src = this.src;
        while (src != "") {
            var m: RegExpMatchArray;
            if (m = src.match(/^\s+/)) {
            } else if (m = src.match(/^[a-zA-Z_][a-zA-Z_0-9]*/)) {
                if (RESERVED_WORD.hasOwnProperty(m[0])) {
                    tokens.push(new RESERVED_WORD[m[0]]);
                } else {
                    tokens.push(new TokenIdentifier(m[0]));
                }
            } else if (m = src.match(/^[0-9]+/)) {
                tokens.push(new TokenConstant(new BigInteger(m[0], 10)));
            } else if (m = src.match(/<=|>=|==|!=|<<|>>|\&|\||\^|~|\(|\)|,|\+|-|\*|\/|%|=|;|:|{|}|<|>/)) {
                tokens.push(new SYMBOLS[m[0]]);
            }
            src = src.slice(m[0].length);
        }
        return tokens;
    }
}
