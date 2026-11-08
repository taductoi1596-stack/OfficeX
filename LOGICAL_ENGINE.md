Mục tiêu

LOGICAL_ENGINE chịu trách nhiệm thực thi toàn bộ các hàm logic trong OfficeX Excel.

Engine này triển khai đầy đủ các Logical Functions theo Microsoft Excel 365, bao gồm IF, IFS, SWITCH, AND, OR, XOR, NOT cùng toàn bộ cơ chế điều kiện, đánh giá logic và Short-Circuit Evaluation.

Không trực tiếp phân tích công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Chức năng chính

• Thực thi Logical Functions
• Điều kiện IF
• Điều kiện nhiều nhánh
• Boolean Evaluation
• Short-Circuit Evaluation
• Lazy Evaluation
• Logical Comparison
• Nested IF
• Nested SWITCH
• Boolean Conversion
• Truth Table
• Error Propagation
• Logical Cache
• Branch Optimization

────────────────────────────────────────

Nhóm hàm Logic

IF()

IFS()

SWITCH()

AND()

OR()

NOT()

XOR()

IFERROR()

IFNA()

TRUE()

FALSE()

────────────────────────────────────────

Conditional Functions

IF()

IFS()

SWITCH()

CHOOSE()

────────────────────────────────────────

Boolean Functions

TRUE()

FALSE()

AND()

OR()

NOT()

XOR()

────────────────────────────────────────

Error Handling

IFERROR()

IFNA()

ISERROR()

ISERR()

ISNA()

ISLOGICAL()

ISNUMBER()

ISTEXT()

ISBLANK()

ISREF()

ISFORMULA()

────────────────────────────────────────

Comparison Operators

=

<>

<

>

<=

>=

────────────────────────────────────────

Logical Operators

AND

OR

NOT

XOR

────────────────────────────────────────

Supported Data Types

Boolean

Number

Text

Date

Time

Array

Dynamic Array

Reference

Blank

Error

────────────────────────────────────────

Truth Values

TRUE

FALSE

BLANK

ERROR

NULL

────────────────────────────────────────

Implicit Boolean Conversion

0

↓

FALSE

Non-zero Number

↓

TRUE

Empty Cell

↓

FALSE

Non-empty Text

↓

TRUE

Boolean

↓

No Conversion

────────────────────────────────────────

Supported Expressions

IF(A1>10,"High","Low")

AND(A1>0,B1<100)

OR(A1="",B1="")

NOT(A1>100)

SWITCH(A1,1,"One",2,"Two","Other")

IFS(A1>90,"A",
A1>80,"B",
TRUE,"F")

────────────────────────────────────────

Nested Logic

Nested IF

Nested SWITCH

Nested IFS

Nested AND

Nested OR

Nested XOR

Unlimited Nesting

────────────────────────────────────────

Dynamic Array Support

IF()

FILTER()

BYROW()

BYCOL()

MAP()

MAKEARRAY()

LAMBDA()

LET()

Array Boolean Evaluation

────────────────────────────────────────

Short Circuit Evaluation

AND()

Nếu FALSE

↓

Dừng đánh giá

OR()

Nếu TRUE

↓

Dừng đánh giá

IF()

Chỉ tính nhánh được chọn

IFS()

Dừng khi gặp điều kiện TRUE đầu tiên

SWITCH()

Dừng khi tìm thấy giá trị khớp

────────────────────────────────────────

Lazy Evaluation

IF()

IFS()

SWITCH()

CHOOSE()

LET()

LAMBDA()

MAP()

REDUCE()

SCAN()

────────────────────────────────────────

Truth Table

AND

TRUE TRUE

↓

TRUE

TRUE FALSE

↓

FALSE

FALSE TRUE

↓

FALSE

FALSE FALSE

↓

FALSE

OR

TRUE TRUE

↓

TRUE

TRUE FALSE

↓

TRUE

FALSE TRUE

↓

TRUE

FALSE FALSE

↓

FALSE

NOT

TRUE

↓

FALSE

FALSE

↓

TRUE

XOR

TRUE TRUE

↓

FALSE

TRUE FALSE

↓

TRUE

FALSE TRUE

↓

TRUE

FALSE FALSE

↓

FALSE

────────────────────────────────────────

Optimization

• Short-Circuit Evaluation

• Lazy Evaluation

• Branch Prediction

• Constant Folding

• Boolean Cache

• Logical Simplification

• Expression Memoization

────────────────────────────────────────

Cache

Logical Cache

Condition Cache

Branch Cache

Boolean Cache

Expression Cache

────────────────────────────────────────

Validation

• Invalid Boolean

• Invalid Condition

• Invalid Branch

• Invalid Comparison

• Invalid Data Type

• Divide By Zero

• Invalid Array

• Invalid Logical Function

────────────────────────────────────────

API

Initialize()

Execute()

Evaluate()

EvaluateCondition()

EvaluateIF()

EvaluateIFS()

EvaluateSWITCH()

EvaluateAND()

EvaluateOR()

EvaluateNOT()

EvaluateXOR()

ConvertBoolean()

Validate()

Optimize()

ClearCache()

────────────────────────────────────────

Events

LogicalEvaluationStarted

LogicalEvaluationCompleted

ConditionMatched

BranchExecuted

ShortCircuitTriggered

LazyEvaluationTriggered

ValidationFailed

CacheHit

CacheMiss

────────────────────────────────────────

Dependencies

• FUNCTION_ENGINE

• EXPRESSION_ENGINE

• EVALUATOR_ENGINE

• ARRAY_ENGINE

• LAMBDA_ENGINE

• ERROR_ENGINE

• CACHE_ENGINE

• VALIDATION_ENGINE

• PERFORMANCE_ENGINE

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

• Hỗ trợ đầy đủ các hàm IF, IFS, SWITCH, AND, OR, NOT, XOR

• Hỗ trợ IFERROR và IFNA

• Hỗ trợ Nested IF không giới hạn

• Hỗ trợ Dynamic Arrays

• Hỗ trợ LET()

• Hỗ trợ LAMBDA()

• Hỗ trợ Short-Circuit Evaluation

• Hỗ trợ Lazy Evaluation

• Hỗ trợ Constant Folding

• Hỗ trợ Multi-thread Evaluation

• Hỗ trợ Branch Optimization

• Enterprise Ready

• Production Ready
