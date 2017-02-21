class Parser {
    tokens: Token[];
    tokensIndex: number;
    lookahead: Token;
    constructor(tokens: Token[]) {
        this.tokens = tokens;
        this.tokensIndex = 0;
        this.nextToken();
    }

    parse(): FunctionDefinition[] {
        var funcs : FunctionDefinition[] = [];
        while (!this.match("eof")) {
            funcs.push(this.parseExternalDeclaration());
        }
        return funcs;
    }

    parseExternalDeclaration(): FunctionDefinition {
        let [name, params] = this.parseFunctionDeclator();
        let body: Stmt = null;
        this.expect(";");
/*      if (this.match(";")) {
            body = null;
        } else {
            body = this.parseCompoundStatement();
        } */
        return {
            name: name,
            params: params,
            body: new Stmt(),
        };
    }

    parseFunctionDeclator(): [string, string[]] {
        this.parseTypeSpecifier();
        let name = (<TokenIdentifier>this.expect("identifier")).name;
        this.expect("(");
        var args = this.parseIdentifierList();
        this.expect(")");
        return [name, args];
    }

    parseIdentifierList() {
        let names: string[] = [];
        while (this.match("identifier")) {
            names.push((<TokenIdentifier>this.expect("identifier")).name);
            if (!this.match(",")) {
                break;
            }
            this.expect(",");
        }
        return names;
    }

    matchTypeSpecifier() {
        return this.match("int");
    }

    parseTypeSpecifier() {
        this.expect("int");
    }

    nextToken(): Token {
        const token = this.lookahead;
        this.lookahead = this.tokens[this.tokensIndex++];
        if (this.lookahead == undefined) {
            this.lookahead = new TokenEof();
        }
        return token;
    }

    expect(type: string) {
        let token = this.nextToken();
        if (token.type() != type) {
            throw new ParseError("expected "+type+" but got"+token.type());
        }
        return token;
    }

    match(type: string) {
        return this.lookahead.type() == type;
    }
}

class ParseError extends Error {
}

let tokens = new Lexer("int hoge(a, b, c); int huga();").lex();
let parsed = new Parser(tokens).parse();
console.log(parsed);
