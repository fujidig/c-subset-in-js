window.onload = () => {
    var src = <HTMLTextAreaElement>document.getElementById("src");
    var output = <HTMLTextAreaElement>document.getElementById("output");
    var runbutton = <HTMLButtonElement>document.getElementById("run");
    var encodebutton = <HTMLButtonElement>document.getElementById("encode");
    runbutton.addEventListener("click", () => {
        let tokens = new Lexer(src.value).lex();
        let parsed = new Parser(tokens).parse();
        let evaluator = new Evaluator(parsed);
        let out = "";
        let outfn = (str) => {
            out += str + "\n";
        };
        evaluator.printFunc = outfn;
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