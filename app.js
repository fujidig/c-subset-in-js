window.onload = () => {
    var src = document.getElementById("src");
    var output = document.getElementById("output");
    var runbutton = document.getElementById("run");
    var encodebutton = document.getElementById("encode");
    runbutton.addEventListener("click", () => {
        let tokens = new Lexer(src.value).lex();
        let parsed = new Parser(tokens).parse();
        let evaluator = new Evaluator(parsed);
        let out = "";
        let outfn = (str) => {
            out += str + "\n";
        };
        //evaluator.printFunc = outfn;
        evaluator.compMain();
        output.value = out;
    });
    encodebutton.addEventListener("click", () => {
        let tokens = new Lexer(src.value).lex();
        let parsed = new Parser(tokens).parse();
        let code = new Encoder(parsed).encode();
        output.value = code.toString(10);
    });
};
//# sourceMappingURL=app.js.map