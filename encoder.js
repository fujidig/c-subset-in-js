const NODE_FUNC = 1;
const NODE_EXPR = 2;
const NODE_RETURN = 3;
const NODE_IF = 4;
const NODE_WHILE = 5;
const NODE_BLOCK = 6;
const NODE_CONSTANT = 7;
const NODE_IDENTIFIER = 8;
const NODE_PRINT = 9;
const NODE_CALL = 10;
const NODE_UNARYPLUS = 11;
const NODE_UNARYMINUS = 12;
const NODE_MUL = 13;
const NODE_DIV = 14;
const NODE_MOD = 15;
const NODE_ADD = 16;
const NODE_SUB = 17;
const NODE_LT = 18;
const NODE_GT = 19;
const NODE_LTEQ = 20;
const NODE_GTEQ = 21;
const NODE_EQ = 22;
const NODE_NE = 23;
const NODE_LSHIFT = 24;
const NODE_RSHIFT = 25;
const NODE_AND = 26;
const NODE_OR = 27;
const NODE_XOR = 28;
const NODE_BITNOT = 29;
const NODE_ASSIGN = 30;
class Encoder {
    constructor(funcs) {
        this.funcs = [];
        for (let i = 0; i < funcs.length; i++) {
            if (funcs[i].name == "main") {
                this.funcs.unshift(funcs[i]);
            }
            else {
                this.funcs.push(funcs[i]);
            }
        }
        this.nodes = [];
        this.data = [];
        this.funcIndex = new Map();
    }
    encode() {
        for (let i = 0; i < this.funcs.length; i++) {
            let func = this.funcs[i];
            this.nodes.push([NODE_FUNC, -1]);
            this.funcIndex.set(func.name, i);
        }
        for (let i = 0; i < this.funcs.length; i++) {
            this.encodeFunc(i, this.funcs[i]);
        }
        return this.toNumber();
    }
    toNumber() {
        let numbers = [];
        numbers.push(this.nodes.length);
        for (let xs of this.nodes) {
            for (let i = 0; i < 4; i++) {
                numbers.push(xs[i] != undefined ? xs[i] : 0);
            }
        }
        for (let x of this.data) {
            numbers.push(x);
        }
        let code = bigInt.zero;
        for (let x of numbers.reverse()) {
            code = code.shiftLeft(32).or(x >>> 0);
        }
        return code;
    }
    encodeFunc(index, func) {
        let vars = new Map();
        for (let param of func.params) {
            this.putVar(vars, param);
        }
        this.nodes[index][1] = this.encodeStmt(vars, func.body);
    }
    encodeStmt(vars, stmt) {
        switch (stmt.type()) {
            case "expr":
                this.nodes.push([NODE_EXPR, this.encodeExpr(vars, stmt.expr)]);
                break;
            case "return":
                this.nodes.push([NODE_RETURN, this.encodeExpr(vars, stmt.expr)]);
                break;
            case "if": {
                let cond = stmt.cond;
                let thenstmt = stmt.thenstmt;
                let elsestmt = stmt.elsestmt;
                this.nodes.push([NODE_IF, this.encodeExpr(vars, cond), this.encodeStmt(vars, thenstmt), elsestmt != null ? this.encodeStmt(vars, elsestmt) : -1]);
                break;
            }
            case "while":
                let cond = stmt.cond;
                let body = stmt.body;
                this.nodes.push([NODE_WHILE, this.encodeExpr(vars, cond), this.encodeStmt(vars, body)]);
                break;
            case "block":
                let definedVars = stmt.vars;
                let stmts = stmt.stmts;
                let nodes = [];
                for (let definedVar of definedVars) {
                    this.nodes.push([NODE_ASSIGN, this.putVar(vars, definedVar.name), this.encodeExpr(vars, definedVar.expr)]);
                    this.nodes.push([NODE_EXPR, this.nodes.length - 1]);
                    nodes.push(this.nodes.length - 1);
                }
                for (let stmt of stmts) {
                    nodes.push(this.encodeStmt(vars, stmt));
                }
                this.nodes.push([NODE_BLOCK, nodes.length, this.pushData(nodes)]);
                break;
            default:
                throw new Error("unsupported: " + stmt.type());
        }
        return this.nodes.length - 1;
    }
    encodeExpr(vars, expr) {
        switch (expr.type()) {
            case "constant":
                this.nodes.push([NODE_CONSTANT, this.pushBigint(expr.value)]);
                break;
            case "identifier":
                this.nodes.push([NODE_IDENTIFIER, this.putVar(vars, expr.name)]);
                break;
            case "call":
                let name = expr.name;
                let args = expr.args;
                if (name == "print") {
                    this.nodes.push([NODE_PRINT, this.encodeExpr(vars, args[0])]);
                }
                else {
                    let nodes = [];
                    for (let arg of args) {
                        nodes.push(this.encodeExpr(vars, arg));
                    }
                    this.nodes.push([NODE_CALL, this.funcIndex.get(name), nodes.length, this.pushData(nodes)]);
                }
                break;
            case "unaryplus":
                this.nodes.push([NODE_UNARYPLUS, this.encodeExpr(vars, expr.expr)]);
                break;
            case "unaryminus":
                this.nodes.push([NODE_UNARYMINUS, this.encodeExpr(vars, expr.expr)]);
                break;
            case "mul":
                this.nodes.push([NODE_MUL, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "div":
                this.nodes.push([NODE_DIV, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "mod":
                this.nodes.push([NODE_MOD, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "add":
                this.nodes.push([NODE_ADD, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "sub":
                this.nodes.push([NODE_SUB, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "lt":
                this.nodes.push([NODE_LT, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "gt":
                this.nodes.push([NODE_GT, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "lteq":
                this.nodes.push([NODE_LTEQ, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "gteq":
                this.nodes.push([NODE_GTEQ, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "eq":
                this.nodes.push([NODE_EQ, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "ne":
                this.nodes.push([NODE_NE, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "lshift":
                this.nodes.push([NODE_LSHIFT, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "rshift":
                this.nodes.push([NODE_RSHIFT, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "and":
                this.nodes.push([NODE_AND, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "or":
                this.nodes.push([NODE_OR, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "xor":
                this.nodes.push([NODE_XOR, this.encodeExpr(vars, expr.lhs), this.encodeExpr(vars, expr.rhs)]);
                break;
            case "bitnot":
                this.nodes.push([NODE_BITNOT, this.encodeExpr(vars, expr.expr)]);
                break;
            case "assign":
                this.nodes.push([NODE_ASSIGN, this.putVar(vars, expr.name), this.encodeExpr(vars, expr.expr)]);
                break;
            default:
                throw new Error("unsupported: " + expr.type());
        }
        return this.nodes.length - 1;
    }
    putVar(vars, name) {
        let index = vars.get(name);
        if (index != undefined)
            return index;
        index = vars.size;
        vars.set(name, index);
        return index;
    }
    pushBigint(bigint) {
        let bint = bigint;
        let value;
        if (bint.isSmall) {
            value = [bint.value];
        }
        else {
            value = bint.value;
        }
        let sign = bint.sign;
        let length_and_sign = value.length << 1 | (sign ? 1 : 0);
        return this.pushData([length_and_sign, ...value]);
    }
    pushData(data) {
        let offset = this.data.length;
        for (let x of data) {
            this.data.push(x);
        }
        return offset;
    }
}
//# sourceMappingURL=encoder.js.map