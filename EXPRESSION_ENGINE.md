Mục tiêu

EXPRESSION_ENGINE chịu trách nhiệm đánh giá (Evaluate) toàn bộ biểu thức toán học, logic, so sánh và tham chiếu trong công thức Excel.

Engine này nhận Formula AST từ PARSER_ENGINE và tính toán từng Expression Node trước khi FUNCTION_ENGINE hoặc CALCULATION_ENGINE xử lý các hàm phức tạp.

Không quản lý Formula.

Không quản lý Dependency.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn với Microsoft Excel 365.

────────────────────────────────────────

Chức năng chính

• Đánh giá biểu thức số học
• Đánh giá biểu thức logic
• Đánh giá biểu thức so sánh
• Đánh giá biểu thức tham chiếu
• Đánh giá biểu thức mảng
• Đánh giá biểu thức Dynamic Array
• Đánh giá biểu thức Lambda
• Đánh giá LET
• Đánh giá Structured Reference
• Đánh giá Named Range
• Đánh giá Spill Reference
• Đánh giá Array Constant
• Constant Folding
• Expression Simplification
• Type Conversion
• Implicit Conversion
• Short Circuit Evaluation
• Lazy Evaluation
• Expression Cache

────────────────────────────────────────

Expression Types

Arithmetic Expression

Logical Expression

Comparison Expression

Reference Expression

Array Expression

Dynamic Array Expression

Lambda Expression

LET Expression

Structured Reference

Named Range

Workbook Reference

Sheet Reference

External Reference

────────────────────────────────────────

Supported Operators

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

Logical

AND

OR

NOT

XOR

Reference

:

,

(space)

#

@

────────────────────────────────────────

Supported Data Types

• Number
• Integer
• Decimal
• Currency
• Percentage
• Boolean
• Text
• Date
• Time
• DateTime
• Error
• Blank
• Cell
• Range
• Array
• Dynamic Array
• Lambda

────────────────────────────────────────

Expression Nodes

LiteralNode

NumberNode

StringNode

BooleanNode

DateNode

ErrorNode

UnaryExpressionNode

BinaryExpressionNode

ComparisonNode

LogicalNode

FunctionCallNode

ReferenceNode

RangeNode

ArrayNode

DynamicArrayNode

LambdaNode

LETNode

────────────────────────────────────────

Evaluation Rules

Arithmetic

1+2

3*5

10/2

2^8

100%

Logical

TRUE AND FALSE

TRUE OR FALSE

NOT(TRUE)

IF(A1>0)

Comparison

A1=B1

A1>B1

A1<=B1

Reference

A1:B10

Table1[Sales]

Sales#

@Price

────────────────────────────────────────

Implicit Conversion

Number → Boolean

Boolean → Number

Text → Number

Date → Number

Percentage → Decimal

Blank → Zero

────────────────────────────────────────

Constant Folding

2+3

↓

5

10*20

↓

200

TRUE AND FALSE

↓

FALSE

────────────────────────────────────────

Short Circuit

AND()

OR()

IFS()

SWITCH()

IF()

Không tính toán các nhánh không cần thiết.

────────────────────────────────────────

Lazy Evaluation

IF()

IFS()

CHOOSE()

SWITCH()

LET()

LAMBDA()

MAP()

REDUCE()

────────────────────────────────────────

Expression Optimization

• Constant Folding
• Algebraic Simplification
• Dead Branch Removal
• Common Subexpression Elimination
• Expression Cache
• AST Reuse
• Lazy Evaluation
• Short Circuit Evaluation

────────────────────────────────────────

Expression Cache

• Literal Cache
• Binary Cache
• Logical Cache
• Comparison Cache
• Result Cache
• Constant Cache

────────────────────────────────────────

Validation

• Invalid Type
• Invalid Operator
• Divide By Zero
• Overflow
• Underflow
• Invalid Boolean
• Invalid Array
• Invalid Reference
• Invalid Lambda
• Invalid LET

────────────────────────────────────────

API

Initialize()

Evaluate()

EvaluateNode()

EvaluateUnary()

EvaluateBinary()

EvaluateComparison()

EvaluateLogical()

EvaluateReference()

EvaluateArray()

EvaluateLambda()

EvaluateLET()

ConvertType()

Optimize()

FoldConstants()

Simplify()

ClearCache()

────────────────────────────────────────

Events

EvaluationStarted

EvaluationCompleted

ExpressionOptimized

ConstantFolded

ExpressionCached

EvaluationError

TypeConverted

────────────────────────────────────────

Phụ thuộc

• AST_ENGINE
• PARSER_ENGINE
• FUNCTION_ENGINE
• REFERENCE_ENGINE
• ARRAY_ENGINE
• LAMBDA_ENGINE
• ERROR_ENGINE
• CACHE_ENGINE
• VALIDATION_ENGINE

────────────────────────────────────────

Không phụ thuộc

• Ribbon
• UI
• Viewport
• Render Engine
• Printer
• Mouse
• Keyboard
• Workbook Engine

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ toàn bộ Expression của Excel
• Hỗ trợ Dynamic Arrays
• Hỗ trợ LET()
• Hỗ trợ LAMBDA()
• Hỗ trợ Structured Reference
• Hỗ trợ Named Range
• Hỗ trợ Spill Operator (#)
• Hỗ trợ Implicit Intersection (@)
• Hỗ trợ Constant Folding
• Hỗ trợ Short Circuit Evaluation
• Hỗ trợ Lazy Evaluation
• Hỗ trợ Expression Cache
• Hiệu năng O(n)
• Enterprise Ready
• Production Ready
