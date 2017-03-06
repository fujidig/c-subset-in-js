class Expr {
    type() {
        return "";
    }
}

class ConstantExpr extends Expr {
    value: BigInteger;
    constructor(value: BigInteger) {
        super();
        this.value = value;
    }
    type() {
        return "constant";
    }
}

class IdentifierExpr extends Expr {
    name: string;
    constructor(name: string) {
        super();
        this.name = name;
    }
    type() {
        return "identifier";
    }
}

class CallExpr extends Expr {
    name: string;
    args: Array<Expr>;
    constructor(name: string, args: Array<Expr>) {
        super();
        this.name = name;
        this.args = args;
    }
    type() {
        return "call";
    }
}

class UnaryPlusExpr extends Expr {
    expr: Expr;
    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }
    type() {
        return "unaryplus";
    }
}

class UnaryMinusExpr extends Expr {
    expr: Expr;
    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }
    type() {
        return "unaryminus";
    }
}

class MulExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "mul";
    }
}

class DivExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "div";
    }
}

class ModExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "mod";
    }
}

class AddExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "add";
    }
}

class SubExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "sub";
    }
}

class LtExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "lt";
    }
}

class GtExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "gt";
    }
}

class LteqExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "lteq";
    }
}

class GteqExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "gteq";
    }
}

class EqExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "eq";
    }
}

class NeExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "ne";
    }
}

class LshiftExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "lshift";
    }
}

class RshiftExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "rshift";
    }
}

class AndExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "and";
    }
}

class OrExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "or";
    }
}

class XorExpr extends Expr {
    lhs: Expr;
    rhs: Expr;
    constructor(lhs: Expr, rhs: Expr) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "xor";
    }
}

class BitnotExpr extends Expr {
    expr: Expr;
    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }
    type() {
        return "bitnot";
    }
}

class AssignExpr extends Expr {
    name: string;
    expr: Expr;
    constructor(name: string, expr: Expr) {
        super();
        this.name = name;
        this.expr = expr;
    }
    type() {
        return "assign";
    }
}

class Stmt {
    type() {
        return "";
    }
}

class ExprStmt extends Stmt {
    expr: Expr;
    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }
    type() {
        return "expr";
    }
}

class IfStmt extends Stmt {
    cond: Expr;
    thenstmt: Stmt;
    elsestmt: Stmt;
    constructor(cond: Expr, thenstmt: Stmt, elsestmt: Stmt) {
        super();
        this.cond = cond;
        this.thenstmt = thenstmt;
        this.elsestmt = elsestmt;
    }
    type() {
        return "if";
    }
}

class WhileStmt extends Stmt {
    cond: Expr;
    body: Stmt;
    elsestmt: Stmt;
    constructor(cond: Expr, body: Stmt) {
        super();
        this.cond = cond;
        this.body = body;
    }
    type() {
        return "while";
    }
}

class ReturnStmt extends Stmt {
    expr: Expr;
    constructor(expr: Expr) {
        super();
        this.expr = expr;
    }
    type() {
        return "return";
    }
}

class BlockStmt extends Stmt {
    vars: Array<DefinedVar>;
    stmts: Array<Stmt>;
    constructor(vars: Array<DefinedVar>, stmts: Array<Stmt>) {
        super();
        this.vars = vars;
        this.stmts = stmts;
    }
    type() {
        return "block";
    }
}

interface DefinedVar {
    name: string;
    expr: Expr;
}

interface FunctionDefinition {
    name: string;
    params: Array<string>;
    body: Stmt;
}