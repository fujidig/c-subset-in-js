window.onload = () => {
    var src = <HTMLTextAreaElement>document.getElementById("src");
    var output = <HTMLTextAreaElement>document.getElementById("output");
    var runbutton = <HTMLButtonElement>document.getElementById("run");
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
};