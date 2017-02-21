window.onload = () => {
    var src = document.getElementById("src");
    var output = document.getElementById("output");
    var runbutton = document.getElementById("run");
    runbutton.addEventListener("click", () => {
        console.log("hello");
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
//# sourceMappingURL=app.js.map