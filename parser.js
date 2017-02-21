class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.tokensIndex = 0;
        this.nextToken();
    }
    parse() {
        var funcs = [];
        while (!this.match("eof")) {
            funcs.push(this.parseExternalDeclaration());
        }
        return funcs;
    }
    parseExternalDeclaration() {
        let [name, params] = this.parseFunctionDeclator();
        let body = null;
        if (this.match(";")) {
            this.nextToken();
            body = null;
        }
        else {
            body = this.parseCompoundStatement();
        }
        return {
            name: name,
            params: params,
            body: body,
        };
    }
    parseFunctionDeclator() {
        this.parseTypeSpecifier();
        let name = this.parseIdentifier();
        this.expect("(");
        var args = this.parseIdentifierList();
        this.expect(")");
        return [name, args];
    }
    parseIdentifierList() {
        let names = [];
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
    parseStatement() {
        if (this.match("{")) {
            return this.parseCompoundStatement();
        }
        else if (this.match("if")) {
            return this.parseIfStatement();
        }
        else if (this.match("while")) {
            return this.parseWhileStatement();
        }
        else if (this.match("return")) {
            return this.parseReturnStatement();
        }
        else {
            return this.parseExpressionStatement();
        }
    }
    parseCompoundStatement() {
        this.expect("{");
        let definedVars = [];
        let stmts = [];
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
    parseDeclaration() {
        let definedVars = [];
        this.parseTypeSpecifier();
        while (!this.match(";")) {
            definedVars.push(this.parseInitDeclarator());
            if (this.match(",")) {
                this.nextToken();
            }
            else {
                break;
            }
        }
        this.expect(";");
        return definedVars;
    }
    parseInitDeclarator() {
        let name = this.parseIdentifier();
        let expr = null;
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
        return this.expect("identifier").name;
    }
    parseIfStatement() {
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
    parseWhileStatement() {
        this.expect("while");
        this.expect("(");
        let cond = this.parseExpression();
        this.expect(")");
        let stmt = this.parseStatement();
        return new WhileStmt(cond, stmt);
    }
    parseReturnStatement() {
        this.expect("return");
        let expr = this.parseExpression();
        this.expect(";");
        return new ReturnStmt(expr);
    }
    parseExpressionStatement() {
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
            rhs = new AssignExpr(lhs.name, rhs);
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
            }
            else {
                expr = new NeExpr(expr, this.parseRelationalExpression());
            }
        }
        return expr;
    }
    parseRelationalExpression() {
        let expr = this.parseAdditiveExpression();
        while (this.match("<") || this.match(">") || this.match("<=") || this.match(">=")) {
            let token = this.lookahead;
            this.nextToken();
            if (token.type() == "<") {
                expr = new LtExpr(expr, this.parseAdditiveExpression());
            }
            else if (token.type() == ">") {
                expr = new GtExpr(expr, this.parseAdditiveExpression());
            }
            else if (token.type() == "<=") {
                expr = new LteqExpr(expr, this.parseAdditiveExpression());
            }
            else {
                expr = new GteqExpr(expr, this.parseAdditiveExpression());
            }
        }
        return expr;
    }
    parseAdditiveExpression() {
        let expr = this.parseMultiplicativeExpression();
        while (this.match("+") || this.match("-")) {
            let token = this.lookahead;
            this.nextToken();
            if (token.type() == "+") {
                expr = new AddExpr(expr, this.parseMultiplicativeExpression());
            }
            else {
                expr = new SubExpr(expr, this.parseMultiplicativeExpression());
            }
        }
        return expr;
    }
    parseMultiplicativeExpression() {
        let expr = this.parseUnaryExpression();
        while (this.match("*") || this.match("/") || this.match("%")) {
            let token = this.lookahead;
            this.nextToken();
            if (token.type() == "*") {
                expr = new MulExpr(expr, this.parseUnaryExpression());
            }
            else if (token.type() == "/") {
                expr = new DivExpr(expr, this.parseUnaryExpression());
            }
            else {
                expr = new ModExpr(expr, this.parseUnaryExpression());
            }
        }
        return expr;
    }
    parseUnaryExpression() {
        if (this.match("+")) {
            this.nextToken();
            return new UnaryPlusExpr(this.parseUnaryExpression());
        }
        if (this.match("-")) {
            this.nextToken();
            return new UnaryMinusExpr(this.parseUnaryExpression());
        }
        if (this.match("identifier")) {
            return this.parseIdentifierOrCall();
        }
        if (this.match("constant")) {
            return new ConstantExpr(this.expect("constant").val);
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
        let exprs = [];
        while (!this.match(")")) {
            exprs.push(this.parseExpression());
            if (this.match(",")) {
                this.nextToken();
            }
            else {
                break;
            }
        }
        this.expect(")");
        return new CallExpr(name, exprs);
    }
    nextToken() {
        const token = this.lookahead;
        this.lookahead = this.tokens[this.tokensIndex++];
        if (this.lookahead == undefined) {
            this.lookahead = new TokenEof();
        }
        return token;
    }
    expect(type) {
        let token = this.nextToken();
        if (token.type() != type) {
            throw new ParseError("expected " + type + " but got" + token.type());
        }
        return token;
    }
    match(type) {
        return this.lookahead.type() == type;
    }
}
class ParseError extends Error {
}
//# sourceMappingURL=parser.js.map