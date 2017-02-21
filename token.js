class Token {
    type() { return ""; }
}
class TokenEof {
    type() { return "eof"; }
}
class TokenInt extends Token {
    type() { return "int"; }
}
class TokenConstant extends Token {
    constructor(val) {
        super();
        this.val = val;
    }
    type() { return "constant"; }
}
class TokenIdentifier extends Token {
    constructor(name) {
        super();
        this.name = name;
    }
    type() { return "identifier"; }
}
class TokenIf extends Token {
    type() { return "if"; }
}
class TokenElse extends Token {
    type() { return "else"; }
}
class TokenWhile extends Token {
    type() { return "while"; }
}
class TokenReturn extends Token {
    type() { return "return"; }
}
class TokenRparen extends Token {
    type() { return "("; }
}
class TokenLparen extends Token {
    type() { return ")"; }
}
class TokenComma extends Token {
    type() { return ","; }
}
class TokenPlus extends Token {
    type() { return "+"; }
}
class TokenMinus extends Token {
    type() { return "-"; }
}
class TokenAsterisk extends Token {
    type() { return "*"; }
}
class TokenSlash extends Token {
    type() { return "/"; }
}
class TokenPercent extends Token {
    type() { return "%"; }
}
class TokenEqual extends Token {
    type() { return "="; }
}
class TokenSemicolon extends Token {
    type() { return ";"; }
}
class TokenColon extends Token {
    type() { return ":"; }
}
class TokenRbrace extends Token {
    type() { return "{"; }
}
class TokenLbrace extends Token {
    type() { return "}"; }
}
class TokenLt extends Token {
    type() { return "<"; }
}
class TokenGt extends Token {
    type() { return ">"; }
}
class TokenLe extends Token {
    type() { return "<="; }
}
class TokenGe extends Token {
    type() { return ">="; }
}
class TokenEq extends Token {
    type() { return "=="; }
}
class TokenNe extends Token {
    type() { return "!="; }
}
//# sourceMappingURL=token.js.map