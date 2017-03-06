class Evaluator {
    constructor(funcs) {
        this.env = new Map();
        funcs.forEach((func) => {
            this.env.set(func.name, func);
        });
        this.printFunc = console.log;
    }
    compMain() {
        this.comp(this.env.get("main"), []);
    }
    comp(func, args) {
        let vars = new Map();
        for (let i = 0; i < func.params.length; i++) {
            vars.set(func.params[i], args[i]);
        }
        return this.evalStmt(vars, func.body);
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
                if (this.evalExpr(vars, cond).notEquals(0)) {
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
                while (this.evalExpr(vars, cond).notEquals(0)) {
                    res = this.evalStmt(vars, body);
                    if (res != null)
                        break;
                }
                return res;
            case "block":
                let definedVars = stmt.vars;
                definedVars.forEach((definedVar) => {
                    vars.set(definedVar.name, definedVar.expr != null ? this.evalExpr(vars, definedVar.expr) : bigInt.zero);
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
            case "identifier": return vars.get(expr.name);
            case "call":
                let name = expr.name;
                let args = expr.args.map((expr) => { return this.evalExpr(vars, expr); });
                if (name == "print") {
                    this.printFunc(String(args[0]));
                    return bigInt.zero;
                }
                else {
                    return this.comp(this.env.get(name), args);
                }
            case "unaryplus":
                return this.evalExpr(vars, expr.expr);
            case "unaryminus":
                return this.evalExpr(vars, expr.expr);
            case "mul":
                return this.evalExpr(vars, expr.lhs).multiply(this.evalExpr(vars, expr.rhs));
            case "div":
                return this.evalExpr(vars, expr.lhs).divide(this.evalExpr(vars, expr.rhs));
            case "mod":
                return this.evalExpr(vars, expr.lhs).mod(this.evalExpr(vars, expr.rhs));
            case "add":
                return this.evalExpr(vars, expr.lhs).add(this.evalExpr(vars, expr.rhs));
            case "sub":
                return this.evalExpr(vars, expr.lhs).subtract(this.evalExpr(vars, expr.rhs));
            case "lt":
                return this.evalExpr(vars, expr.lhs).lesser(this.evalExpr(vars, expr.rhs)) ? bigInt.one : bigInt.zero;
            case "gt":
                return this.evalExpr(vars, expr.lhs).greater(this.evalExpr(vars, expr.rhs)) ? bigInt.one : bigInt.zero;
            case "lteq":
                return this.evalExpr(vars, expr.lhs) <= this.evalExpr(vars, expr.rhs) ? bigInt.one : bigInt.zero;
            case "gteq":
                return this.evalExpr(vars, expr.lhs) >= this.evalExpr(vars, expr.rhs) ? bigInt.one : bigInt.zero;
            case "eq":
                return this.evalExpr(vars, expr.lhs).equals(this.evalExpr(vars, expr.rhs)) ? bigInt.one : bigInt.zero;
            case "ne":
                return this.evalExpr(vars, expr.lhs).notEquals(this.evalExpr(vars, expr.rhs)) ? bigInt.one : bigInt.zero;
            case "lshift":
            //return this.evalExpr(vars, (<LshiftExpr>expr).lhs).shiftthis.evalExpr(vars, (<LshiftExpr>expr).rhs);
            case "rshift":
            //return this.evalExpr(vars, (<RshiftExpr>expr).lhs) >> this.evalExpr(vars, (<RshiftExpr>expr).rhs);
            case "and":
            //return this.evalExpr(vars, (<AndExpr>expr).lhs) & this.evalExpr(vars, (<AndExpr>expr).rhs);
            case "or":
            //return this.evalExpr(vars, (<OrExpr>expr).lhs) | this.evalExpr(vars, (<OrExpr>expr).rhs);
            case "xor":
            //return this.evalExpr(vars, (<XorExpr>expr).lhs) ^ this.evalExpr(vars, (<XorExpr>expr).rhs);
            case "bitnot":
            //return ~this.evalExpr(vars, (<BitnotExpr>expr).expr);
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