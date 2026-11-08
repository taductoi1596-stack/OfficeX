Mục tiêu

PARSER_ENGINE chịu trách nhiệm phân tích cú pháp (Syntax Analysis) công thức Excel và xây dựng Formula AST (Abstract Syntax Tree).

Engine này nhận Token List từ TOKENIZER_ENGINE và chuyển thành cây AST để EVALUATOR_ENGINE và CALCULATION_ENGINE thực thi.

Không thực hiện tính toán.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn với Microsoft Excel 365.

────────────────────────────────────────

Chức năng chính

• Phân tích cú pháp Formula
• Xây dựng Formula AST
• Kiểm tra cú pháp
• Kiểm tra ngoặc
• Kiểm tra toán tử
• Kiểm tra tham số hàm
• Kiểm tra Structured Reference
• Kiểm tra Named Range
• Kiểm tra Dynamic Array
• Kiểm tra Spill Operator
• Kiểm tra LET()
• Kiểm tra LAMBDA()
• Kiểm tra External Reference
• Chuẩn hóa AST
• Tối ưu AST
• Hỗ trợ Incremental Parsing

────────────────────────────────────────

Đầu vào

Token List

Ví dụ

Formula

=SUM(A1:A10)+IF(B1>0,10,20)

Input

Equals

Function(SUM)

LeftParenthesis

Range(A1:A10)

RightParenthesis

Operator(+)

Function(IF)

LeftParenthesis

Cell(B1)

Operator(>)

Number(0)

Comma

Number(10)

Comma

Number(20)

RightParenthesis

────────────────────────────────────────

Đầu ra

Formula AST

Ví dụ

BinaryExpression(+)

├── FunctionCall(SUM)

│      └── Range(A1:A10)

└── FunctionCall(IF)

       ├── Compare(B1>0)

       ├── 10

       └── 20

────────────────────────────────────────

Node Types

• FormulaNode
• FunctionCallNode
• BinaryExpressionNode
• UnaryExpressionNode
• NumberNode
• StringNode
• BooleanNode
• DateNode
• ErrorNode
• CellReferenceNode
• RangeReferenceNode
• SheetReferenceNode
• WorkbookReferenceNode
• StructuredReferenceNode
• NamedRangeNode
• ArrayNode
• ArrayConstantNode
• DynamicArrayNode
• LambdaNode
• LETNode
• SpillNode
• IntersectionNode
• UnionNode
• ParenthesisNode

────────────────────────────────────────

Expression Types

Arithmetic Expression

Logical Expression

Comparison Expression

Reference Expression

Array Expression

Lambda Expression

LET Expression

Structured Reference

Dynamic Array

External Reference

────────────────────────────────────────

Operators

Arithmetic

+

-

*

/

^

%

Unary

+

-

Comparison

=

<>

<

>

<=

>=

Reference

:

,

(space)

#

@

────────────────────────────────────────

Supported Functions

SUM()

AVERAGE()

COUNT()

IF()

IFS()

XLOOKUP()

INDEX()

MATCH()

FILTER()

UNIQUE()

SORT()

SORTBY()

LET()

LAMBDA()

MAP()

REDUCE()

SCAN()

MAKEARRAY()

BYROW()

BYCOL()

TOCOL()

TOROW()

WRAPROWS()

WRAPCOLS()

HSTACK()

VSTACK()

TAKE()

DROP()

────────────────────────────────────────

Grammar

Formula

Expression

Primary Expression

Unary Expression

Binary Expression

Function Call

Reference

Array Constant

Lambda

LET

Parenthesis

────────────────────────────────────────

Parser Algorithms

Recursive Descent Parser

Pratt Parser

Operator Precedence Parser

AST Builder

Constant Folding

Tree Normalization

────────────────────────────────────────

Operator Priority

Highest

()

Reference

%

Unary

^

*

/

+

-

Comparison

Lowest

────────────────────────────────────────

Validation

• Missing Parenthesis
• Invalid Function
• Invalid Parameter Count
• Invalid Operator
• Invalid Expression
• Invalid Range
• Invalid Cell
• Invalid Workbook
• Invalid Sheet
• Invalid Structured Reference
• Invalid Lambda
• Invalid LET
• Invalid Spill Operator
• Invalid Dynamic Array

────────────────────────────────────────

Optimization

• Constant Folding
• Expression Simplification
• Dead Branch Removal
• AST Normalization
• AST Reuse
• Incremental Parsing

────────────────────────────────────────

Cache

• AST Cache
• Parse Cache
• Expression Cache
• Function Cache

────────────────────────────────────────

API

Initialize()

Parse()

BuildAST()

Validate()

Normalize()

Optimize()

Rebuild()

ParseExpression()

ParseFunction()

ParseReference()

ParseArray()

ParseLambda()

ParseLET()

GetAST()

GetRootNode()

ClearCache()

────────────────────────────────────────

Events

ParserStarted

ParserFinished

ASTCreated

ASTOptimized

ParseError

SyntaxError

ValidationCompleted

────────────────────────────────────────

Phụ thuộc

• TOKENIZER_ENGINE
• AST_ENGINE
• VALIDATION_ENGINE
• ERROR_ENGINE
• FUNCTION_REGISTRY
• CACHE_ENGINE

────────────────────────────────────────

Không phụ thuộc

• Ribbon
• UI
• Calculation Engine
• Evaluator Engine
• Render Engine
• Viewport
• Printer
• Mouse
• Keyboard

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ hơn 600 hàm Excel
• Hỗ trợ Dynamic Arrays
• Hỗ trợ LET()
• Hỗ trợ LAMBDA()
• Hỗ trợ Structured Reference
• Hỗ trợ Named Range
• Hỗ trợ External Workbook
• Hỗ trợ Spill Operator (#)
• Hỗ trợ Implicit Intersection (@)
• Hỗ trợ Array Constant
• Xây dựng AST chuẩn
• Constant Folding
• Incremental Parsing
• Hiệu năng O(n)
• Enterprise Ready
• Production Ready
