

class Evaluator {
    env: Map<string, FunctionDefinition>;
    printFunc: (string) => void;

    constructor(funcs: FunctionDefinition[]) {
        this.env = new Map();
        funcs.forEach((func) => {
            this.env.set(func.name, func);
        });
        this.printFunc = console.log;
    }

    compMain() {
        this.comp(this.env.get("main"), []);
    }

    comp(func: FunctionDefinition, args: BigInteger[]): BigInteger {
        let vars = new Map<string, BigInteger>();
        for (let i = 0; i < func.params.length; i++) {
            vars.set(func.params[i], args[i]);
        }
        return this.evalStmt(vars, func.body);
    }

    evalStmt(vars: Map<string, BigInteger>, stmt: Stmt) {
        switch (stmt.type()) {
            case "expr":
                this.evalExpr(vars, (<ExprStmt>stmt).expr);
                return null;
            case "return":
                let expr = (<ReturnStmt>stmt).expr;
                return this.evalExpr(vars, expr);
            case "if": {
                let cond = (<IfStmt>stmt).cond;
                let thenstmt = (<IfStmt>stmt).thenstmt;
                let elsestmt = (<IfStmt>stmt).elsestmt;
                if (this.evalExpr(vars, cond).notEquals(0)) {
                    return this.evalStmt(vars, thenstmt);
                } else if (elsestmt != null) {
                    return this.evalStmt(vars, elsestmt);
                }
                return null;
            }
            case "while":
                let cond = (<WhileStmt>stmt).cond;
                let body = (<WhileStmt>stmt).body;
                let res: BigInteger = null;
                while (this.evalExpr(vars, cond).notEquals(0)) {
                    res = this.evalStmt(vars, body);
                    if (res != null) break;
                }
                return res;
            case "block":
                let definedVars = (<BlockStmt>stmt).vars;
                definedVars.forEach((definedVar) => {
                    vars.set(definedVar.name, definedVar.expr != null ? this.evalExpr(vars, definedVar.expr) : bigInt.zero);
                });
                let stmts = (<BlockStmt>stmt).stmts;
                for (stmt of stmts) {
                    let ret = this.evalStmt(vars, stmt);
                    if (ret != null) return ret;
                }
                return null;
            default:
                throw new Error("unsupported: " + stmt.type());
        }
    }

    evalExpr(vars: Map<string, BigInteger>, expr: Expr): BigInteger {
        switch (expr.type()) {
            case "constant": return (<ConstantExpr>expr).value;
            case "identifier": return vars.get((<IdentifierExpr>expr).name);
            case "call":
                let name = (<CallExpr>expr).name;
                let args = (<CallExpr>expr).args.map((expr) => { return this.evalExpr(vars, expr) });
                if (name == "print") {
                    this.printFunc(String(args[0]));
                    return bigInt.zero;
                } else {
                    return this.comp(this.env.get(name), args);
                }
            case "unaryplus":
                return this.evalExpr(vars, (<UnaryPlusExpr>expr).expr);
            case "unaryminus":
                return bigInt.zero.subtract(this.evalExpr(vars, (<UnaryMinusExpr>expr).expr));
            case "mul":
                return this.evalExpr(vars, (<MulExpr>expr).lhs).multiply(this.evalExpr(vars, (<MulExpr>expr).rhs));
            case "div":
                return this.evalExpr(vars, (<DivExpr>expr).lhs).divide(this.evalExpr(vars, (<DivExpr>expr).rhs));
            case "mod":
                return this.evalExpr(vars, (<ModExpr>expr).lhs).mod(this.evalExpr(vars, (<ModExpr>expr).rhs));
            case "add":
                return this.evalExpr(vars, (<AddExpr>expr).lhs).add(this.evalExpr(vars, (<AddExpr>expr).rhs));
            case "sub":
                return this.evalExpr(vars, (<SubExpr>expr).lhs).subtract(this.evalExpr(vars, (<SubExpr>expr).rhs));
            case "lt":
                return this.evalExpr(vars, (<LtExpr>expr).lhs).lesser(this.evalExpr(vars, (<LtExpr>expr).rhs)) ? bigInt.one : bigInt.zero;
            case "gt":
                return this.evalExpr(vars, (<GtExpr>expr).lhs).greater(this.evalExpr(vars, (<GtExpr>expr).rhs)) ? bigInt.one : bigInt.zero;
            case "lteq":
                return this.evalExpr(vars, (<LteqExpr>expr).lhs) <= this.evalExpr(vars, (<LteqExpr>expr).rhs) ? bigInt.one : bigInt.zero;
            case "gteq":
                return this.evalExpr(vars, (<GteqExpr>expr).lhs) >= this.evalExpr(vars, (<GteqExpr>expr).rhs) ? bigInt.one : bigInt.zero;
            case "eq":
                return this.evalExpr(vars, (<EqExpr>expr).lhs).equals(this.evalExpr(vars, (<EqExpr>expr).rhs)) ? bigInt.one : bigInt.zero;
            case "ne":
                return this.evalExpr(vars, (<NeExpr>expr).lhs).notEquals(this.evalExpr(vars, (<NeExpr>expr).rhs)) ? bigInt.one : bigInt.zero;
            case "lshift":
                return this.evalExpr(vars, (<LshiftExpr>expr).lhs).shiftLeft(this.evalExpr(vars, (<LshiftExpr>expr).rhs).toJSNumber());
            case "rshift":
                return this.evalExpr(vars, (<RshiftExpr>expr).lhs).shiftRight(this.evalExpr(vars, (<RshiftExpr>expr).rhs).toJSNumber());
            case "and":
                return this.evalExpr(vars, (<AndExpr>expr).lhs).and(this.evalExpr(vars, (<AndExpr>expr).rhs));
            case "or":
                return this.evalExpr(vars, (<OrExpr>expr).lhs).or(this.evalExpr(vars, (<OrExpr>expr).rhs));
            case "xor":
                return this.evalExpr(vars, (<XorExpr>expr).lhs).xor(this.evalExpr(vars, (<XorExpr>expr).rhs));
            case "bitnot":
                return this.evalExpr(vars, (<BitnotExpr>expr).expr).not();
            case "assign":
                let v = this.evalExpr(vars, (<AssignExpr>expr).expr);
                vars.set((<AssignExpr>expr).name, v);
                return v;
            default:
                throw new Error("unsupported: " + expr.type());
        }
    }
}


