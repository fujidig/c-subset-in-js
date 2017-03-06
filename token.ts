class Token {
    type(): string { return ""; }
}

class TokenEof {
    type(): string { return "eof"; }
}

class TokenInt extends Token {
    type(): string { return "int"; }
}

class TokenConstant extends Token {
    val: number;
    constructor(val: number) {
        super();
        this.val = val;
    }
    type(): string { return "constant"; }
}

class TokenIdentifier extends Token {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
    type(): string { return "identifier"; }
}

class TokenIf extends Token {
    type(): string { return "if"; }
}

class TokenElse extends Token {
    type(): string { return "else"; }
}

class TokenWhile extends Token {
    type(): string { return "while"; }
}

class TokenReturn extends Token {
    type(): string { return "return"; }
}

class TokenRparen extends Token {
    type(): string { return "("; }
}
class TokenLparen extends Token {
    type(): string { return ")"; }
}
class TokenComma extends Token {
    type(): string { return ","; }
}
class TokenPlus extends Token {
    type(): string { return "+"; }
}
class TokenMinus extends Token {
    type(): string { return "-"; }
}
class TokenAsterisk extends Token {
    type(): string { return "*"; }
}
class TokenSlash extends Token {
    type(): string { return "/"; }
}
class TokenPercent extends Token {
    type(): string { return "%"; }
}
class TokenEqual extends Token {
    type(): string { return "="; }
}
class TokenSemicolon extends Token {
    type(): string { return ";"; }
}
class TokenColon extends Token {
    type(): string { return ":"; }
}
class TokenRbrace extends Token {
    type(): string { return "{"; }
}
class TokenLbrace extends Token {
    type(): string { return "}"; }
}
class TokenLt extends Token {
    type(): string { return "<"; }
}
class TokenGt extends Token {
    type(): string { return ">"; }
}
class TokenLe extends Token {
    type(): string { return "<="; }
}
class TokenGe extends Token {
    type(): string { return ">="; }
}
class TokenEq extends Token {
    type(): string { return "=="; }
}
class TokenNe extends Token {
    type(): string { return "!="; }
}
class TokenLshift extends Token {
    type(): string { return "<<"; }
}
class TokenRshift extends Token {
    type(): string { return ">>"; }
}
class TokenAnd extends Token {
    type(): string { return "&"; }
}
class TokenOr extends Token {
    type(): string { return "|"; }
}
class TokenXor extends Token {
    type(): string { return "^"; }
}
class TokenTlide extends Token {
    type(): string { return "~"; }
}