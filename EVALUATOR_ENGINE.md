Mục tiêu

EVALUATOR_ENGINE chịu trách nhiệm thực thi Formula AST và trả về kết quả cuối cùng của công thức trong OfficeX Excel.

Engine này nhận AST từ AST_ENGINE, đánh giá từng Node theo đúng thứ tự và trả về Value hoặc Excel Error.

Đây là Engine trung tâm của hệ thống tính toán, nằm giữa AST_ENGINE và CALCULATION_ENGINE.

Tương thích hoàn toàn với Microsoft Excel 365.

Không phụ thuộc giao diện người dùng.

────────────────────────────────────────

Chức năng chính

• Thực thi Formula AST
• Đánh giá Expression Node
• Thực thi Function Call
• Thực thi Binary Expression
• Thực thi Unary Expression
• Thực thi Comparison
• Thực thi Logical Expression
• Thực thi Reference
• Thực thi Array
• Thực thi Dynamic Array
• Thực thi LET
• Thực thi LAMBDA
• Thực thi Spill
• Thực thi Structured Reference
• Thực thi Named Range
• Thực thi External Workbook Reference
• Chuyển đổi kiểu dữ liệu
• Lan truyền lỗi
• Tối ưu Evaluation
• Cache kết quả

────────────────────────────────────────

Đầu vào

Formula AST

Ví dụ

Root

↓

BinaryExpression(+)

├── FunctionCall(SUM)

│     └── Range(A1:A10)

└── Number(100)

────────────────────────────────────────

Đầu ra

Evaluation Result

Ví dụ

650

TRUE

FALSE

"Hello"

#VALUE!

#DIV/0!

Array

Dynamic Array

────────────────────────────────────────

Supported Node

RootNode

FormulaNode

FunctionCallNode

UnaryExpressionNode

BinaryExpressionNode

ComparisonNode

LogicalNode

NumberNode

StringNode

BooleanNode

DateNode

ErrorNode

ReferenceNode

CellReferenceNode

RangeReferenceNode

NamedRangeNode

StructuredReferenceNode

ArrayNode

DynamicArrayNode

LambdaNode

LETNode

SpillNode

────────────────────────────────────────

Evaluation Order

Root

↓

Expression

↓

Child Nodes

↓

Operator

↓

Function

↓

Return Result

────────────────────────────────────────

Expression Evaluation

Arithmetic

Logical

Comparison

Reference

Array

Dynamic Array

Lambda

LET

Structured Reference

────────────────────────────────────────

Supported Operations

Addition

Subtraction

Multiplication

Division

Power

Modulo

Unary Plus

Unary Minus

Comparison

Logical

Reference Resolution

Function Invocation

Array Expansion

Lambda Invocation

────────────────────────────────────────

Function Evaluation

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

LET()

LAMBDA()

MAP()

REDUCE()

SCAN()

MAKEARRAY()

BYROW()

BYCOL()

────────────────────────────────────────

Reference Resolution

Cell

Range

Named Range

Worksheet

Workbook

External Workbook

Structured Reference

Table Reference

────────────────────────────────────────

Dynamic Array

Spill Result

Implicit Intersection

Explicit Spill

Array Expansion

Array Broadcasting

────────────────────────────────────────

Type Conversion

Number

Integer

Decimal

Currency

Boolean

Text

Date

Time

Array

Dynamic Array

Blank

Error

────────────────────────────────────────

Evaluation Optimization

• Constant Folding
• Lazy Evaluation
• Short Circuit Evaluation
• Result Cache
• Expression Cache
• Function Cache
• Node Cache
• Memoization
• Incremental Evaluation

────────────────────────────────────────

Short Circuit

IF()

IFS()

AND()

OR()

SWITCH()

CHOOSE()

Chỉ đánh giá nhánh cần thiết.

────────────────────────────────────────

Lazy Evaluation

LET()

LAMBDA()

MAP()

REDUCE()

SCAN()

────────────────────────────────────────

Error Propagation

#VALUE!

#DIV/0!

#REF!

#NAME?

#NUM!

#N/A

#SPILL!

#CALC!

#FIELD!

#BLOCKED!

#CONNECT!

#GETTING_DATA

────────────────────────────────────────

Evaluation Cache

• Result Cache
• Node Cache
• AST Cache
• Function Cache
• Array Cache
• Reference Cache

────────────────────────────────────────

API

Initialize()

Evaluate()

EvaluateNode()

EvaluateExpression()

EvaluateBinary()

EvaluateUnary()

EvaluateFunction()

EvaluateReference()

EvaluateArray()

EvaluateDynamicArray()

EvaluateLambda()

EvaluateLET()

ResolveReference()

ConvertType()

Optimize()

CacheResult()

ClearCache()

────────────────────────────────────────

Events

EvaluationStarted

NodeEvaluated

FunctionExecuted

ReferenceResolved

ArrayExpanded

LambdaExecuted

LETEvaluated

EvaluationCompleted

EvaluationFailed

ResultCached

────────────────────────────────────────

Validation

• Invalid AST
• Invalid Node
• Invalid Function
• Invalid Reference
• Invalid Type
• Invalid Array
• Invalid Lambda
• Invalid LET
• Invalid Operator
• Divide By Zero
• Overflow
• Stack Overflow

────────────────────────────────────────

Performance

• Incremental Evaluation
• Parallel Evaluation Ready
• Multi-thread Ready
• Zero Copy Node Access
• Lock-Free Result Cache
• O(n) AST Traversal
• High Performance Memoization

────────────────────────────────────────

Dependencies

• AST_ENGINE
• EXPRESSION_ENGINE
• FUNCTION_ENGINE
• REFERENCE_ENGINE
• ARRAY_ENGINE
• LAMBDA_ENGINE
• ERROR_ENGINE
• CACHE_ENGINE
• VALIDATION_ENGINE
• CALCULATION_ENGINE

────────────────────────────────────────

Không phụ thuộc

• Ribbon
• UI
• Viewport
• Render Engine
• Printer
• Mouse
• Keyboard

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365
• Thực thi đầy đủ Formula AST
• Hỗ trợ hơn 600 hàm Excel
• Hỗ trợ Dynamic Arrays
• Hỗ trợ LET()
• Hỗ trợ LAMBDA()
• Hỗ trợ Structured Reference
• Hỗ trợ Named Range
• Hỗ trợ External Workbook
• Hỗ trợ Spill Operator (#)
• Hỗ trợ Implicit Intersection (@)
• Hỗ trợ Lazy Evaluation
• Hỗ trợ Short Circuit Evaluation
• Hỗ trợ Memoization
• Hỗ trợ Result Cache
• Hỗ trợ Incremental Evaluation
• Multi-thread Ready
• Enterprise Ready
• Production Ready
