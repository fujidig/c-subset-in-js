class Expr {
    type() {
        return "";
    }
}
class ConstantExpr extends Expr {
    constructor(value) {
        super();
        this.value = value;
    }
    type() {
        return "constant";
    }
}
class IdentifierExpr extends Expr {
    constructor(name) {
        super();
        this.name = name;
    }
    type() {
        return "identifier";
    }
}
class CallExpr extends Expr {
    constructor(name, args) {
        super();
        this.name = name;
        this.args = args;
    }
    type() {
        return "call";
    }
}
class UnaryPlusExpr extends Expr {
    constructor(expr) {
        super();
        this.expr = expr;
    }
    type() {
        return "unaryplus";
    }
}
class UnaryMinusExpr extends Expr {
    constructor(expr) {
        super();
        this.expr = expr;
    }
    type() {
        return "unaryminus";
    }
}
class MulExpr extends Expr {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "mul";
    }
}
class DivExpr extends Expr {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "div";
    }
}
class ModExpr extends Expr {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "mod";
    }
}
class AddExpr extends Expr {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "add";
    }
}
class SubExpr extends Expr {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "sub";
    }
}
class LtExpr extends Expr {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "lt";
    }
}
class GtExpr extends Expr {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "gt";
    }
}
class LteqExpr extends Expr {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "lteq";
    }
}
class GteqExpr extends Expr {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "gteq";
    }
}
class EqExpr extends Expr {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "eq";
    }
}
class NeExpr extends Expr {
    constructor(lhs, rhs) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
    }
    type() {
        return "ne";
    }
}
class AssignExpr extends Expr {
    constructor(name, expr) {
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
    constructor(expr) {
        super();
        this.expr = expr;
    }
    type() {
        return "expr";
    }
}
class IfStmt extends Stmt {
    constructor(cond, thenstmt, elsestmt) {
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
    constructor(cond, body) {
        super();
        this.cond = cond;
        this.body = body;
    }
    type() {
        return "while";
    }
}
class ReturnStmt extends Stmt {
    constructor(expr) {
        super();
        this.expr = expr;
    }
    type() {
        return "return";
    }
}
class BlockStmt extends Stmt {
    constructor(vars, stmts) {
        super();
        this.vars = vars;
        this.stmts = stmts;
    }
    type() {
        return "block";
    }
}
//# sourceMappingURL=ast.js.map