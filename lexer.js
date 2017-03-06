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
    constructor(src) {
        this.src = src;
    }
    lex() {
        var tokens = [];
        var src = this.src;
        while (src != "") {
            var m;
            if (m = src.match(/^\s+/)) {
            }
            else if (m = src.match(/^[a-zA-Z_][a-zA-Z_0-9]*/)) {
                if (RESERVED_WORD.hasOwnProperty(m[0])) {
                    tokens.push(new RESERVED_WORD[m[0]]);
                }
                else {
                    tokens.push(new TokenIdentifier(m[0]));
                }
            }
            else if (m = src.match(/^[0-9]+/)) {
                tokens.push(new TokenConstant(Number(m[0])));
            }
            else if (m = src.match(/<=|>=|==|!=|<<|>>|\&|\||\^|~|\(|\)|,|\+|-|\*|\/|%|=|;|:|{|}|<|>/)) {
                tokens.push(new SYMBOLS[m[0]]);
            }
            src = src.slice(m[0].length);
        }
        return tokens;
    }
}
//# sourceMappingURL=lexer.js.map