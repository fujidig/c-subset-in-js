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
        if (this.match(";")) {
            this.nextToken();
            body = null;
        } else {
            body = this.parseCompoundStatement();
        }
        return {
            name: name,
            params: params,
            body: body,
        };
    }

    parseFunctionDeclator(): [string, string[]] {
        this.parseTypeSpecifier();
        let name = this.parseIdentifier();
        this.expect("(");
        var args = this.parseIdentifierList();
        this.expect(")");
        return [name, args];
    }

    parseIdentifierList() {
        let names: string[] = [];
        while (this.match("identifier")) {
            names.push(this.parseIdentifier());
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

    parseStatement(): Stmt {
        if (this.match("{")) {
            return this.parseCompoundStatement();
        } else if (this.match("if")) {
            return this.parseIfStatement();
        } else if (this.match("while")) {
            return this.parseWhileStatement();
        } else if (this.match("return")) {
            return this.parseReturnStatement();
        } else {
            return this.parseExpressionStatement();
        }
    }

    parseCompoundStatement(): BlockStmt {
        this.expect("{");
        let definedVars: DefinedVar[] = [];
        let stmts: Stmt[] = [];
        while (this.matchTypeSpecifier()) {
            this.parseDeclaration().forEach((definedVar) => {
                definedVars.push(definedVar);
            });
        }
        while (!this.match("}")) {
            stmts.push(this.parseStatement());
        }
        this.expect("}");
        return new BlockStmt(definedVars, stmts);
    }

    parseDeclaration(): DefinedVar[] {
        let definedVars: DefinedVar[] = [];
        this.parseTypeSpecifier();
        while (!this.match(";")) {
            definedVars.push(this.parseInitDeclarator());
            if (this.match(",")) {
                this.nextToken();
            } else {
                break;
            }
        }
        this.expect(";");
        return definedVars;
    }

    parseInitDeclarator(): DefinedVar {
        let name = this.parseIdentifier();
        let expr: Expr = null;
        if (this.match("=")) {
            this.nextToken();
            expr = this.parseExpression();
        }
        return {
            name: name,
            expr: expr
        };
    }

    parseIdentifier() {
        return (<TokenIdentifier>this.expect("identifier")).name;
    }

    parseIfStatement(): IfStmt {
        this.expect("if");
        this.expect("(");
        let cond = this.parseExpression();
        this.expect(")");
        let thenstmt = this.parseStatement();
        let elsestmt = null;
        if (this.match("else")) {
            this.nextToken();
            elsestmt = this.parseStatement();
        }
        return new IfStmt(cond, thenstmt, elsestmt);
    }

    parseWhileStatement(): WhileStmt {
        this.expect("while");
        this.expect("(");
        let cond = this.parseExpression();
        this.expect(")");
        let stmt = this.parseStatement();
        return new WhileStmt(cond, stmt);
    }

    parseReturnStatement(): ReturnStmt {
        this.expect("return");
        let expr = this.parseExpression();
        this.expect(";");
        return new ReturnStmt(expr);
    }

    parseExpressionStatement(): ExprStmt {
        let expr = this.parseExpression();
        this.expect(";");
        return new ExprStmt(expr);
    }

    parseExpression() {
        return this.parseAssignmentExpression();
    }

    parseAssignmentExpression() {
        var stack = [this.parseEqualityExpression()];
        while (this.match("=")) {
            this.nextToken();
            stack.push(this.parseEqualityExpression());
        }
        let rhs = stack.pop();
        while (stack.length > 0) {
            let lhs = stack.pop();
            if (lhs.type() != "identifier") {
                throw new ParseError("lhs of '=' is not identifier");
            }
            rhs = new AssignExpr((<IdentifierExpr>lhs).name, rhs);
        }
        return rhs;
    }

    parseEqualityExpression() {
        let expr = this.parseRelationalExpression();
        while (this.match("==") || this.match("!=")) {
            let token = this.lookahead;
            this.nextToken();
            if (token.type() == "==") {
                expr = new EqExpr(expr, this.parseRelationalExpression());
            } else {
                expr = new NeExpr(expr, this.parseRelationalExpression());
            }
        }
        return expr;
    }

    parseRelationalExpression(): Expr {
        let expr = this.parseBitopExpression();
        while (this.match("<") || this.match(">") || this.match("<=") || this.match(">=")) {
            let token = this.lookahead;
            this.nextToken();
            if (token.type() == "<") {
                expr = new LtExpr(expr, this.parseBitopExpression());   
            } else if (token.type() == ">") {
                expr = new GtExpr(expr, this.parseBitopExpression());
            } else if (token.type() == "<=") {
                expr = new LteqExpr(expr, this.parseBitopExpression());
            } else {
                expr = new GteqExpr(expr, this.parseBitopExpression());
            }
        }
        return expr;
    }

    parseBitopExpression(): Expr {
        let expr = this.parseShiftExpression();
        while (this.match("&") || this.match("|") || this.match("^")) {
            let token = this.lookahead;
            this.nextToken();
            if (token.type() == "&") {
                expr = new AndExpr(expr, this.parseShiftExpression());
            } else if (token.type() == "|") {
                expr = new OrExpr(expr, this.parseShiftExpression());
            } else {
                expr = new XorExpr(expr, this.parseShiftExpression());
            }
        }
        return expr;
    }

    parseShiftExpression(): Expr {
        let expr = this.parseAdditiveExpression();
        while (this.match("<<") || this.match(">>")) {
            let token = this.lookahead;
            this.nextToken();
            if (token.type() == "<<") {
                expr = new LshiftExpr(expr, this.parseAdditiveExpression());
            } else {
                expr = new RshiftExpr(expr, this.parseAdditiveExpression());
            }
        }
        return expr;
    }

    parseAdditiveExpression(): Expr {
        let expr = this.parseMultiplicativeExpression();
        while (this.match("+") || this.match("-")) {
            let token = this.lookahead;
            this.nextToken();
            if (token.type() == "+") {
                expr = new AddExpr(expr, this.parseMultiplicativeExpression());
            } else {
                expr = new SubExpr(expr, this.parseMultiplicativeExpression());
            }
        }
        return expr;
    }

    parseMultiplicativeExpression(): Expr {
        let expr = this.parseUnaryExpression();
        while (this.match("*") || this.match("/") || this.match("%")) {
            let token = this.lookahead;
            this.nextToken();
            if (token.type() == "*") {
                expr = new MulExpr(expr, this.parseUnaryExpression());
            } else if (token.type() == "/") {
                expr = new DivExpr(expr, this.parseUnaryExpression());
            } else {
                expr = new ModExpr(expr, this.parseUnaryExpression());
            }
        }
        return expr;
    }

    parseUnaryExpression(): Expr {
        if (this.match("+")) {
            this.nextToken();
            return new UnaryPlusExpr(this.parseUnaryExpression());
        }
        if (this.match("-")) {
            this.nextToken();
            return new UnaryMinusExpr(this.parseUnaryExpression());
        }
        if (this.match("~")) {
            this.nextToken();
            return new BitnotExpr(this.parseUnaryExpression());
        }
        if (this.match("identifier")) {
            return this.parseIdentifierOrCall();
        }
        if (this.match("constant")) {
            return new ConstantExpr((<TokenConstant>this.expect("constant")).val);
        }
        if (this.match("(")) {
            this.nextToken();
            let expr = this.parseExpression();
            this.expect(")");
            return expr;
        }
        throw new ParseError("parse error at parseUnaryExprresion");
    }

    parseIdentifierOrCall() {
        let name = this.parseIdentifier();
        if (!this.match("(")) {
            return new IdentifierExpr(name);
        }
        this.nextToken();
        let exprs: Expr[] = [];
        while (!this.match(")")) {
            exprs.push(this.parseExpression());
            if (this.match(",")) {
                this.nextToken();
            } else {
                break;
            }
        }
        this.expect(")");
        return new CallExpr(name, exprs);
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

