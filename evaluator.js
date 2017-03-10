class Evaluator {
    constructor(funcs) {
        this.stack = [];
        this.env = new Map();
        funcs.forEach((func) => {
            this.env.set(func.name, func);
        });
    }
    compMain() {
        this.comp(this.env.get("main"), []);
    }
    comp(func, args) {
        this.stack.push("  ");
        console.log(this.stack.join("") + func.name);
        let vars = new Map();
        if (func.params.length != args.length) {
            throw "unmatch arg length: " + func.name;
        }
        for (let i = 0; i < func.params.length; i++) {
            vars.set(func.params[i], args[i]);
        }
        let val = this.evalStmt(vars, func.body);
        console.log(this.stack.join("") + func.name + " retval=" + (val != null ? val.intValue() : 0));
        this.stack.pop();
        return val != null ? val : BigInteger.ZERO;
    }
    evalStmt(vars, stmt) {
        switch (stmt.type()) {
            case "expr":
                this.evalExpr(vars, stmt.expr);
                return null;
            case "return":
                let expr = stmt.expr;
                return this.evalExpr(vars, expr);
            case "if": {
                let cond = stmt.cond;
                let thenstmt = stmt.thenstmt;
                let elsestmt = stmt.elsestmt;
                if (!this.evalExpr(vars, cond).equals(BigInteger.ZERO)) {
                    return this.evalStmt(vars, thenstmt);
                }
                else if (elsestmt != null) {
                    return this.evalStmt(vars, elsestmt);
                }
                return null;
            }
            case "while":
                let cond = stmt.cond;
                let body = stmt.body;
                let res = null;
                while (!this.evalExpr(vars, cond).equals(BigInteger.ZERO)) {
                    res = this.evalStmt(vars, body);
                    if (res != null)
                        break;
                }
                return res;
            case "block":
                let definedVars = stmt.vars;
                definedVars.forEach((definedVar) => {
                    vars.set(definedVar.name, definedVar.expr != null ? this.evalExpr(vars, definedVar.expr) : BigInteger.ZERO);
                });
                let stmts = stmt.stmts;
                for (stmt of stmts) {
                    let ret = this.evalStmt(vars, stmt);
                    if (ret != null)
                        return ret;
                }
                return null;
            default:
                throw new Error("unsupported: " + stmt.type());
        }
    }
    evalExpr(vars, expr) {
        switch (expr.type()) {
            case "constant": return expr.value;
            case "identifier":
                let val = vars.get(expr.name);
                if (val == undefined) {
                    throw "unbound: " + expr.name;
                }
                return val;
            case "call":
                let name = expr.name;
                let args = expr.args.map((expr) => { return this.evalExpr(vars, expr); });
                if (name == "print") {
                    this.printFunc(args[0].toRadix(10));
                    return BigInteger.ZERO;
                }
                else {
                    return this.comp(this.env.get(name), args);
                }
            case "unaryplus":
                return this.evalExpr(vars, expr.expr);
            case "unaryminus":
                return BigInteger.ZERO.subtract(this.evalExpr(vars, expr.expr));
            case "mul":
                return this.evalExpr(vars, expr.lhs).multiply(this.evalExpr(vars, expr.rhs));
            case "div":
                return this.evalExpr(vars, expr.lhs).divide(this.evalExpr(vars, expr.rhs));
            case "mod":
                return this.evalExpr(vars, expr.lhs).remainder(this.evalExpr(vars, expr.rhs));
            case "add":
                return this.evalExpr(vars, expr.lhs).add(this.evalExpr(vars, expr.rhs));
            case "sub":
                return this.evalExpr(vars, expr.lhs).subtract(this.evalExpr(vars, expr.rhs));
            case "lt":
                return this.evalExpr(vars, expr.lhs).compareTo(this.evalExpr(vars, expr.rhs)) < 0 ? BigInteger.ONE : BigInteger.ZERO;
            case "gt":
                return this.evalExpr(vars, expr.lhs).compareTo(this.evalExpr(vars, expr.rhs)) > 0 ? BigInteger.ONE : BigInteger.ZERO;
            case "lteq":
                return this.evalExpr(vars, expr.lhs).compareTo(this.evalExpr(vars, expr.rhs)) <= 0 ? BigInteger.ONE : BigInteger.ZERO;
            case "gteq":
                return this.evalExpr(vars, expr.lhs).compareTo(this.evalExpr(vars, expr.rhs)) >= 0 ? BigInteger.ONE : BigInteger.ZERO;
            case "eq":
                return this.evalExpr(vars, expr.lhs).equals(this.evalExpr(vars, expr.rhs)) ? BigInteger.ONE : BigInteger.ZERO;
            case "ne":
                return !this.evalExpr(vars, expr.lhs).equals(this.evalExpr(vars, expr.rhs)) ? BigInteger.ONE : BigInteger.ZERO;
            case "lshift":
                return this.evalExpr(vars, expr.lhs).shiftLeft(this.evalExpr(vars, expr.rhs).intValue());
            case "rshift":
                return this.evalExpr(vars, expr.lhs).shiftRight(this.evalExpr(vars, expr.rhs).intValue());
            case "and":
                return this.evalExpr(vars, expr.lhs).and(this.evalExpr(vars, expr.rhs));
            case "or":
                return this.evalExpr(vars, expr.lhs).or(this.evalExpr(vars, expr.rhs));
            case "xor":
                return this.evalExpr(vars, expr.lhs).xor(this.evalExpr(vars, expr.rhs));
            case "bitnot":
                return this.evalExpr(vars, expr.expr).not();
            case "assign":
                let v = this.evalExpr(vars, expr.expr);
                vars.set(expr.name, v);
                return v;
            default:
                throw new Error("unsupported: " + expr.type());
        }
    }
}
//# sourceMappingURL=evaluator.js.map