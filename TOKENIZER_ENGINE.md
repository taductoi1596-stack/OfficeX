Mục tiêu

TOKENIZER_ENGINE chịu trách nhiệm phân tích chuỗi công thức Excel thành các Token để phục vụ PARSER_ENGINE.

Đây là bước đầu tiên trong quá trình xử lý công thức.

Engine này không thực hiện tính toán và không xây dựng AST.

Nó chỉ chuyển chuỗi Formula thành danh sách Token có cấu trúc.

Tương thích hoàn toàn với Microsoft Excel 365.

Không phụ thuộc giao diện người dùng.

────────────────────────────────────────

Chức năng chính

• Đọc chuỗi Formula
• Loại bỏ ký tự không cần thiết
• Phân tích Token
• Xác định Token Type
• Xác định Token Position
• Xác định Priority
• Hỗ trợ Unicode
• Hỗ trợ Locale
• Hỗ trợ Dynamic Array
• Hỗ trợ Structured Reference
• Hỗ trợ Named Range
• Hỗ trợ Lambda
• Hỗ trợ LET
• Hỗ trợ External Reference
• Hỗ trợ Table Reference
• Hỗ trợ Spill Operator
• Hỗ trợ Implicit Intersection
• Hỗ trợ Array Constant
• Hỗ trợ Error Literal

────────────────────────────────────────

Đầu vào

Formula String

Ví dụ

=A1+B1

=SUM(A1:A10)

=IF(A1>10,"YES","NO")

=FILTER(A1:A100,B1:B100>0)

=LAMBDA(x,x+1)

────────────────────────────────────────

Đầu ra

Token List

Ví dụ

Formula

=A1+B1

Output

[Equals]

[CellReference:A1]

[Operator:+]

[CellReference:B1]

────────────────────────────────────────

Token Types

• Equals
• Identifier
• Function
• CellReference
• RangeReference
• SheetReference
• WorkbookReference
• TableReference
• StructuredReference
• NamedRange
• Number
• Text
• Boolean
• Date
• Time
• ErrorLiteral
• ArrayConstant
• LambdaKeyword
• LETKeyword
• Operator
• ComparisonOperator
• ArithmeticOperator
• LogicalOperator
• PercentOperator
• SpillOperator
• IntersectionOperator
• UnionOperator
• Comma
• Colon
• Semicolon
• LeftParenthesis
• RightParenthesis
• LeftBrace
• RightBrace
• LeftBracket
• RightBracket
• Whitespace
• Comment
• EndOfFile

────────────────────────────────────────

Arithmetic Operators

+

-

*

/

^

%

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

────────────────────────────────────────

Reference Operators

:

,

(space)

#

@

────────────────────────────────────────

Array Operators

{

}

;

,

────────────────────────────────────────

Special Symbols

$

!

'

"

#

@

[]

()

{}

────────────────────────────────────────

Excel Objects

Cell

A1

AA20

XFD1048576

Range

A1:B20

A:A

1:10

Named Range

Sales

Total

TaxRate

Structured Reference

Table1[Amount]

Table1[#All]

Table1[@Price]

Workbook Reference

[Book1.xlsx]

External Reference

'[Budget.xlsx]Sheet1'!A1

────────────────────────────────────────

Formula Elements

Function

SUM

IF

FILTER

UNIQUE

LET

LAMBDA

MAP

REDUCE

SCAN

Literal

123

12.56

TRUE

FALSE

"Hello"

#VALUE!

────────────────────────────────────────

Validation

• Invalid Character
• Invalid Number
• Invalid Cell
• Invalid Range
• Invalid Workbook
• Invalid Sheet
• Invalid Function Name
• Invalid Token
• Unterminated String
• Unterminated Array
• Invalid Operator

────────────────────────────────────────

Tokenizer States

• Start
• Reading Identifier
• Reading Number
• Reading String
• Reading Function
• Reading Reference
• Reading Operator
• Reading Array
• Reading Structured Reference
• Reading Workbook Reference
• Reading Error Literal
• Finished

────────────────────────────────────────

Cache

• Token Cache
• Formula Cache
• Identifier Cache

────────────────────────────────────────

API

Initialize()

Tokenize()

NextToken()

Peek()

Reset()

Validate()

Normalize()

ClearCache()

GetTokens()

GetTokenCount()

HasErrors()

────────────────────────────────────────

Events

TokenizerStarted

TokenCreated

TokenizerFinished

TokenizerFailed

InvalidTokenDetected

────────────────────────────────────────

Performance

• Streaming Tokenizer
• Zero-Copy Parsing
• UTF-8 Support
• Unicode Support
• Incremental Tokenization
• Large Formula Support

────────────────────────────────────────

Phụ thuộc

• VALIDATION_ENGINE
• CACHE_ENGINE
• ERROR_ENGINE

────────────────────────────────────────

Không phụ thuộc

• Ribbon
• UI
• Parser Engine
• AST Engine
• Calculation Engine
• Function Engine
• Render Engine
• Viewport
• Printer
• Mouse
• Keyboard

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ toàn bộ cú pháp Formula
• Hỗ trợ Dynamic Arrays
• Hỗ trợ LET()
• Hỗ trợ LAMBDA()
• Hỗ trợ Structured Reference
• Hỗ trợ External Workbook
• Hỗ trợ Named Range
• Hỗ trợ Spill Operator (#)
• Hỗ trợ Implicit Intersection (@)
• Hỗ trợ Unicode đầy đủ
• Hiệu năng O(n)
• Streaming Tokenization
• Enterprise Ready
• Production Ready
