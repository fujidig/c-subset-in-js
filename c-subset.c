int main() {
    eval(966401884145511148939945502593161555125446206260451971766551880715156478097755135701425334578834174807986518433849602371594428038963481146993475397143882816814382787708501771992385119601696298687267459639432551814417990503850287341490146883011896686670834572631567136309846129196426423029474781125229966263567178155736071205682316821474489143878160842741363107867871654677130285549515617095459058023986282352416718902029107989911999586000190089707576168753466881591695966835876951619599758606226619177322006275909079956118655987309222590097999654729047883753250414667124595557206624206065287567148994553273216369759075037074675015277532864313492395180301886286018398118663473789548566025792738018633175439798960144, 0, 0);
}

int eval(int code, int nodeid, int vars) {
    int type = node_type(code, nodeid);
    int val0 = node_val0(code, nodeid);
    int val1 = node_val1(code, nodeid);
    int val2 = node_val2(code, nodeid);
    int val3 = node_val3(code, nodeid);
    if (type == 1) { // func
        vars = set_var(vars, 0, 1);
        return get_var(eval(code, val0, vars), 0) / 2;
    } else if (type == 2) { // expr
        eval(code, val0, vars);
        return vars;
    } else if (type == 3) { // return
        return set_var(vars, 0, eval(code, val0, vars) * 2);
    } else if (type == 4) { // if
        int cond = eval(code, val0, vars);
        if (cond) {
            return eval(code, val1, vars);
        } else if (val2 != 0xffffffff) {
            return eval(code, val2, vars);
        } else {
            return vars;
        }
    } else if (type == 5) { // while
        while (eval(code, val0, vars)) {
            vars = eval(code, val1, vars);
            if ((get_var(vars, 0) & 1) == 0) return vars;
        }
        return vars;
    } else if (type == 6) { // block
        int i = 0;
        while (i < val0) {
            vars = eval(code, get_from_data(code, val1 + i), vars);
            if ((get_var(vars, 0) & 1) == 0) return vars;
            i = i + 1;
        }
        return vars;
    } else if (type == 7) { // assign
        int val = eval(code, val1, vars);
        return set_var(vars, val0 + 1, val);
    } else if (type == 8) { // constant
        return get_bigint_from_data(code, val0);
    } else if (type == 9) { // identifier
        return get_var(vars, val0 + 1);
    } else if (type == 10) { // print
        print(eval(code, val0, vars));
        return 0;
    } else if (type == 11) { // call
        int new_vars = 0;
        int i = 0;
        while (i < val1) {
            new_vars = set_var(new_vars, i + 1, eval(code, get_from_data(code, val2 + i), vars));
            i = i + 1;
        }
        return eval(code, val0, new_vars);
    } else if (type == 12) { // unary plus
        return +eval(code, val0, vars);
    } else if (type == 13) { // unary minus
        return -eval(code, val0, vars);
    } else if (type == 14) { // mul
        return eval(code, val0, vars) * eval(code, val1, vars);
    } else if (type == 15) { // div
        return eval(code, val0, vars) / eval(code, val1, vars);
    } else if (type == 16) { // mod
        return eval(code, val0, vars) % eval(code, val1, vars);
    } else if (type == 17) { // add
        return eval(code, val0, vars) + eval(code, val1, vars);
    } else if (type == 18) { // sub
        return eval(code, val0, vars) - eval(code, val1, vars);
    } else if (type == 19) { // lt
        return eval(code, val0, vars) < eval(code, val1, vars);
    } else if (type == 20) { // gt
        return eval(code, val0, vars) > eval(code, val1, vars);
    } else if (type == 21) { // lteq
        return eval(code, val0, vars) <= eval(code, val1, vars);
    } else if (type == 22) { // gteq
        return eval(code, val0, vars) >= eval(code, val1, vars);
    } else if (type == 23) { // eq
        return eval(code, val0, vars) == eval(code, val1, vars);
    } else if (type == 24) { // ne
        return eval(code, val0, vars) != eval(code, val1, vars);
    } else if (type == 25) { // lshift
        return eval(code, val0, vars) << eval(code, val1, vars);
    } else if (type == 26) { // rshift
        return eval(code, val0, vars) >> eval(code, val1, vars);
    } else if (type == 27) { // and
        return eval(code, val0, vars) & eval(code, val1, vars);
    } else if (type == 28) { // or
        return eval(code, val0, vars) | eval(code, val1, vars);
    } else if (type == 29) { // xor
        return eval(code, val0, vars) ^ eval(code, val1, vars);
    } else if (type == 30) { // bit not
        return ~eval(code, val0, vars);
    }
}

int at(int code, int i) {
    return code >> (i*32) & 0xffffffff;
}

int seek_var(int vars, int index) {
    int i = 0, pos = 0, length;
    while (i < index) {
        length = at(vars, pos) >> 1;
        pos = pos + 1 + length;
        i = i + 1;
    }
    return pos;
}

int bigint_length(int x) {
    int l = 0;
    while (x != 0) {
        x = x >> 32;
        l = l + 1;
    }
    return l;
}

int abs(x) {
    if (x < 0) {
        return -x;
    } else {
        return x;
    }
}

int get_var(int vars, int index) {
    int pos, length, negative, val;
    pos = seek_var(vars, index);
    length = at(vars, pos) >> 1;
    negative = at(vars, pos) & 1;
    val = vars >> ((pos + 1) * 32) & ((1 << length * 32) - 1);
    if (negative) {
        return -val;
    } else {
        return val;
    }
}

int set_var(int vars, int index, int val) {
    int pos = seek_var(vars, index);
    int pos2 = seek_var(vars, index + 1);
    int length = bigint_length(val);
    int negative = val < 0;
    int head = vars >> (32 * pos2) << 32 * (pos + length + 1);
    int body = (abs(val) << 32 | (length << 1 | negative)) << 32 * pos;
    int tail = vars & ((1 << (32 * pos)) - 1);
    return head | body | tail;
}

int num_nodes(int code) {
    return at(code, 0);
}

int node_type(int code, int nodeid) {
    return at(code, nodeid * 4 + 1);
}

int node_val0(int code, int nodeid) {
    return at(code, nodeid * 4 + 2);
}

int node_val1(int code, int nodeid) {
    return at(code, nodeid * 4 + 3);
}

int node_val2(int code, int nodeid) {
    return at(code, nodeid * 4 + 4);
}

int node_val3(int code, int nodeid) {
    return at(code, nodeid * 4 + 5);
}

int get_from_data(int code, int i) {
    return at(code, 1 + num_nodes(code) * 4 + i);
}

int get_bigint_from_data(int code, int offset) {
    int length = get_from_data(code, offset) >> 1;
    int negative = get_from_data(code, offset) & 1;
    int val = code >> (((1 + num_nodes(code) * 4 + offset + 1)) * 32) & ((1 << length * 32) - 1);
    if (negative) {
        return -val;
    } else {
        return val;
    }
}