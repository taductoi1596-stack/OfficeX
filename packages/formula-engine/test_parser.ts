import { Lexer } from './src/parser/Lexer';
import { Parser } from './src/parser/Parser';

const testFormulas = [
  "1 + 2 * 3",
  "(1 + 2) * 3",
  "SUM(A1:A10)",
  "IF(A1>10, \"High\", \"Low\")",
  "'Sheet 1'!A1 & B1",
  "-5%",
  "2^3",
  "A1:B2"
];

for (const f of testFormulas) {
  console.log(`\nFormula: ${f}`);
  try {
    const lexer = new Lexer(f);
    const tokens = lexer.tokenize();
    console.log("Tokens:", tokens.map(t => t.type).join(', '));
    
    const parser = new Parser(tokens);
    const ast = parser.parse();
    console.log("AST:", JSON.stringify(ast, null, 2));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
