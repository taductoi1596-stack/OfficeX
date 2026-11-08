Mục tiêu

LAMBDA_ENGINE chịu trách nhiệm triển khai toàn bộ hệ thống hàm LET(), LAMBDA() và Named Lambda trong OfficeX Excel.

Engine này cho phép người dùng định nghĩa hàm riêng ngay trong Workbook mà không cần VBA hay Plugin.

Tương thích với Microsoft Excel 365.

Không phụ thuộc giao diện người dùng.

Chức năng chính

• Thực thi LET()
• Thực thi LAMBDA()
• Tạo Named Lambda
• Chỉnh sửa Named Lambda
• Xóa Named Lambda
• Đăng ký Named Lambda
• Gọi Named Lambda
• Hỗ trợ Recursive Lambda
• Hỗ trợ Nested Lambda
• Hỗ trợ Closure
• Hỗ trợ Variable Scope
• Hỗ trợ Local Variables
• Hỗ trợ Immutable Variables
• Hỗ trợ Dynamic Array Return
• Hỗ trợ Spill Result
• Hỗ trợ Multiple Parameters
• Hỗ trợ Optional Parameters
• Hỗ trợ Default Values
• Hỗ trợ Lambda Cache
• Hỗ trợ Incremental Recalculation

LET()

Cho phép khai báo biến cục bộ.

Ví dụ

=LET(x,A1*2,x+10)

=LET(a,10,b,20,a+b)

=LAMBDA(x,x+1)(5)

LAMBDA()

Cho phép tạo hàm tùy chỉnh.

Ví dụ

=LAMBDA(x,x^2)

=LAMBDA(a,b,a+b)

=LAMBDA(x,IF(x>10,"YES","NO"))

Named Lambda

Cho phép lưu hàm vào Name Manager.

Ví dụ

DOUBLE(x)

=SQUARE(A1)

=DISCOUNT(price,rate)

=VAT(amount)

Sau khi đăng ký

=DOUBLE(A1)

=SQUARE(B5)

=DISCOUNT(C2,D2)

Recursive Lambda

Ví dụ

=LAMBDA(n,
IF(n<=1,
1,
n*SELF(n-1)
)
)

Hỗ trợ

• Recursive Function
• Mutual Recursion
• Tail Recursion
• Stack Protection

Variable Scope

• Local Scope
• Lambda Scope
• Nested Scope
• Workbook Scope
• Name Manager Scope

Variable Types

• Number
• Text
• Boolean
• Date
• Array
• Dynamic Array
• Range
• Lambda

Return Types

• Number
• Text
• Boolean
• Date
• Array
• Dynamic Array
• Range
• Error
• Lambda

Lambda Features

• Anonymous Function
• Named Function
• Higher Order Function
• Callback Function
• Function Composition
• Function Chaining
• Partial Application
• Currying
• Lazy Evaluation

Hàm hỗ trợ

LAMBDA

LET

MAP

REDUCE

SCAN

BYROW

BYCOL

MAKEARRAY

TOCOL

TOROW

WRAPROWS

WRAPCOLS

DROP

TAKE

CHOOSECOLS

CHOOSEROWS

FILTER

UNIQUE

SORT

SORTBY

SEQUENCE

Execution

• Compile Lambda
• Parse Lambda
• Validate Lambda
• Execute Lambda
• Cache Lambda
• Reuse Lambda
• Optimize Lambda

Cache

• Lambda Cache
• Variable Cache
• Result Cache
• Compilation Cache

Validation

• Parameter Count
• Variable Name
• Scope
• Recursion Depth
• Circular Lambda
• Return Type
• Argument Type

Error Handling

• Invalid Lambda
• Invalid LET
• Invalid Variable
• Invalid Scope
• Invalid Parameter
• Circular Lambda
• Stack Overflow
• Recursion Limit
• Lambda Not Found
• Named Lambda Exists
• Invalid Return Type

API

Initialize()

Compile()

Parse()

Validate()

Execute()

ExecuteLET()

ExecuteLambda()

CreateNamedLambda()

UpdateNamedLambda()

DeleteNamedLambda()

Register()

Unregister()

Find()

GetLambda()

GetVariables()

GetParameters()

GetReturnType()

ClearCache()

Events

LambdaCreated

LambdaUpdated

LambdaDeleted

LambdaCompiled

LambdaExecuted

LETExecuted

VariableCreated

VariableDestroyed

LambdaError

RecursionDetected

Phụ thuộc

• FORMULA_ENGINE
• FUNCTION_ENGINE
• FUNCTION_REGISTRY
• NAME_MANAGER
• PARSER_ENGINE
• TOKENIZER_ENGINE
• AST_ENGINE
• EXPRESSION_ENGINE
• ARRAY_ENGINE
• CALCULATION_ENGINE
• CACHE_ENGINE
• VALIDATION_ENGINE
• ERROR_ENGINE

Không phụ thuộc

• Ribbon
• UI
• Viewport
• Render Engine
• Printer
• Mouse
• Keyboard

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ LET() đầy đủ
• Hỗ trợ LAMBDA() đầy đủ
• Hỗ trợ Named Lambda
• Hỗ trợ Recursive Lambda
• Hỗ trợ Higher Order Function
• Hỗ trợ Dynamic Array Return
• Hỗ trợ Function Composition
• Hỗ trợ Lambda Cache
• Hỗ trợ Incremental Recalculation
• Enterprise Ready
• Production Ready
