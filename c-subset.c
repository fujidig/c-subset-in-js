int main() {
    eval(305336928040822177095924161208169517740955529978466210934000789943685251149552846782651626430512210076692127344630112246921343381527746071833426675993215978116952920221184121299768371624501820209905108503445591303365195417854448685146043507390700741230922454099959902035332290137990184406891670613396333038380075414665392804315529924595626361655062116868604445220444451512450769205503550214891106511693858938312255407226268184730429545018137565566527677768669014370004829267720104863455420977654993982392367806588659998282340560730230308814497803608072365202411630156569914089036823340906183208169575032232527818994047649383957683184953657025397422807556417667841549854427488845717785638195350162049238644673284899218670089977168635826933894996673988176554119708902795576965260115443082068830919418251656622485048113860738756519413604399004164820625641805411095303531950900027929925914499590946725328075424656757699367858570227273805486295089356913719998011321793523545263892202742489276384671718529792872599171743368351556532933034425737980543105625780843860462755547154323040072338675736841663574751816090860289576953430641546148717005914055473820628310967474503995509403866411298823475843692366994468999221822309278232486647670276319476256247220141131388090250489600280622186925901692419911864972010971939516417536539412291115853422170513432686057304082978467410816179619613435423190170161564566564715073697577975010883622539467140768793105328462525369829261131435866988657918939417710756732397940320145195829287068893216, 0, 0);
    print(114514);
}

int eval(int code, int nodeid, int vars) {
    int type = node_type(code, nodeid);
    int val0 = node_val0(code, nodeid);
    int val1 = node_val1(code, nodeid);
    int val2 = node_val2(code, nodeid);
    int val3 = node_val3(code, nodeid);
    if (type == 1) { // func
        return eval(code, val0, vars);
    } else if (type == 2) { // expr
        eval(code, val0, vars);
        return 1;
    } else if (type == 3) { // return
        return eval(code, val0, vars) * 2;
    } else if (type == 4) { // if
        int cond = eval(code, val0, vars);
        if (cond) {
            return eval(code, val1, vars);
        } else if (val2 != 0xffffffff) {
            return eval(code, val2, vars);
        } else {
            return 1;
        }
    } else if (type == 5) { // while
        while (eval(code, val0, vars)) {
            int val = eval(code, val1, vars);
            if ((val & 1) == 0) return val;
        }
        return 1;
    } else if (type == 6) { // block
        int i = 0;
        while (i < val0) {
            int val = eval(code, get_from_data(code, val1 + i), vars);
            if ((val & 1) == 0) return val;
            i = i + 1;
        }
        return 1;
    } else if (type == 7) { // constant
        return get_bigint_from_data(code, val0);
    } else if (type == 8) { // identifier
        return get_var(vars, val0);
    } else if (type == 9) { // print
        print(eval(code, val0, vars));
        return 0;
    } else if (type == 10) { // call
        int new_vars = 0;
        int i = 0;
        while (i < val1) {
            set_var(new_vars, i, eval(code, get_from_data(code, val2 + i), vars));
            i = i + 1;
        }
        return eval(code, val0, new_vars) / 2;
    } else if (type == 11) { // unary plus
        return +eval(code, val0, vars);
    } else if (type == 12) { // unary minus
        return -eval(code, val0, vars);
    } else if (type == 13) { // mul
        return eval(code, val0, vars) * eval(code, val1, vars);
    } else if (type == 14) { // div
        return eval(code, val0, vars) / eval(code, val1, vars);
    } else if (type == 15) { // mod
        return eval(code, val0, vars) % eval(code, val1, vars);
    } else if (type == 16) { // add
        return eval(code, val0, vars) + eval(code, val1, vars);
    } else if (type == 17) { // sub
        return eval(code, val0, vars) - eval(code, val1, vars);
    } else if (type == 18) { // lt
        return eval(code, val0, vars) < eval(code, val1, vars);
    } else if (type == 19) { // gt
        return eval(code, val0, vars) > eval(code, val1, vars);
    } else if (type == 20) { // lteq
        return eval(code, val0, vars) <= eval(code, val1, vars);
    } else if (type == 21) { // gteq
        return eval(code, val0, vars) >= eval(code, val1, vars);
    } else if (type == 22) { // eq
        return eval(code, val0, vars) == eval(code, val1, vars);
    } else if (type == 23) { // ne
        return eval(code, val0, vars) != eval(code, val1, vars);
    } else if (type == 24) { // lshift
        return eval(code, val0, vars) << eval(code, val1, vars);
    } else if (type == 25) { // rshift
        return eval(code, val0, vars) >> eval(code, val1, vars);
    } else if (type == 26) { // and
        return eval(code, val0, vars) & eval(code, val1, vars);
    } else if (type == 27) { // or
        return eval(code, val0, vars) | eval(code, val1, vars);
    } else if (type == 28) { // xor
        return eval(code, val0, vars) ^ eval(code, val1, vars);
    } else if (type == 29) { // bit not
        return ~eval(code, val0, vars);
    } else if (type == 30) { // assign
        int val = eval(code, val1, vars);
        return val;
    }
}

int at(int code, int i) {
    return code >> (i*32) & 0xffffffff;
}

int get_var(int vars, int index) {
    int i = 0, pos = 0, length, negative, val;
    while (i < index) {
        length = at(vars, pos) >> 1;
        pos = pos + 1 + length;
    }
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