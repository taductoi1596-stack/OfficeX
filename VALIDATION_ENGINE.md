Mục tiêu

VALIDATION_ENGINE chịu trách nhiệm kiểm tra, xác thực và phát hiện lỗi của công thức Excel trước khi công thức được thực thi.

Đây là lớp bảo vệ đầu tiên của Calculation Engine, đảm bảo mọi Formula AST, tham chiếu, kiểu dữ liệu và đối số đều hợp lệ trước khi chuyển sang EVALUATOR_ENGINE.

Engine này không trực tiếp tính toán công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Workbook

↓

FORMULA_ENGINE

↓

TOKENIZER_ENGINE

↓

PARSER_ENGINE

↓

AST_ENGINE

↓

VALIDATION_ENGINE

↓

EVALUATOR_ENGINE

↓

Calculation Result

────────────────────────────────────────

Mục tiêu thiết kế

Formula

↓

Syntax Validation

↓

Semantic Validation

↓

Reference Validation

↓

Type Validation

↓

Dependency Validation

↓

Execution Ready

────────────────────────────────────────

Chức năng chính

• Formula Validation

• Syntax Validation

• Semantic Validation

• AST Validation

• Function Validation

• Parameter Validation

• Reference Validation

• Range Validation

• Type Validation

• Named Range Validation

• Dynamic Array Validation

• Spill Validation

• Lambda Validation

• Circular Reference Detection

• Security Validation

• Validation Cache

• Validation Report

────────────────────────────────────────

Các lớp Validation

Lexical Validation

Syntax Validation

Semantic Validation

Reference Validation

Dependency Validation

Execution Validation

Security Validation

Compatibility Validation

────────────────────────────────────────

Syntax Validation

Kiểm tra:

()

[]

{}

,

;

:

$

@

#

"

'

=

Tên hàm

Toán tử

Đóng mở ngoặc

Chuỗi

Token

────────────────────────────────────────

Semantic Validation

Kiểm tra

Tên hàm tồn tại

Đối số hợp lệ

Kiểu dữ liệu

Giá trị hợp lệ

Dynamic Array

Lambda

LET

────────────────────────────────────────

Reference Validation

Cell Reference

Range Reference

Worksheet Reference

Workbook Reference

Table Reference

Structured Reference

Named Range

External Workbook

3D Reference

────────────────────────────────────────

Parameter Validation

Too Few Arguments

Too Many Arguments

Optional Parameter

Default Parameter

Parameter Type

Parameter Order

Parameter Range

────────────────────────────────────────

Data Type Validation

Number

Text

Boolean

Date

Time

Currency

Percentage

Array

Reference

Dynamic Array

Lambda

Error

Blank

────────────────────────────────────────

Function Validation

Function Exists

Function Enabled

Function Deprecated

Function Supported

Locale Support

Version Support

────────────────────────────────────────

Dynamic Array Validation

Spill Range

Array Shape

Dimension Match

Array Size

Array Overflow

Blocked Spill

────────────────────────────────────────

Lambda Validation

LAMBDA()

LET()

Recursive Lambda

Parameter Count

Captured Variable

Closure

────────────────────────────────────────

Dependency Validation

Dependency Graph

Circular Dependency

Missing Dependency

External Dependency

Calculation Chain

────────────────────────────────────────

Security Validation

External Link

Unsafe Function

Macro Reference

OLE Reference

COM Reference

External Data

────────────────────────────────────────

Workbook Validation

Workbook Exists

Worksheet Exists

Named Range Exists

External Workbook Exists

Workbook Accessible

────────────────────────────────────────

Supported Error Detection

#NULL!

#DIV/0!

#VALUE!

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

Validation Rules

Formula Length

Maximum Nesting

Maximum Arguments

Maximum Range

Maximum Array Size

Maximum Recursion

Maximum Dependency Depth

Maximum Lambda Depth

────────────────────────────────────────

Optimization

• Incremental Validation

• Cached Validation

• AST Validation Cache

• Function Signature Cache

• Reference Cache

• Batch Validation

• Parallel Validation

• Lazy Validation

────────────────────────────────────────

Cache

Validation Cache

AST Cache

Reference Cache

Function Cache

Dependency Cache

Workbook Cache

────────────────────────────────────────

Validation Report

Syntax Errors

Semantic Errors

Reference Errors

Type Errors

Dependency Errors

Security Warnings

Compatibility Warnings

Optimization Suggestions

────────────────────────────────────────

API

Initialize()

Validate()

ValidateFormula()

ValidateSyntax()

ValidateSemantic()

ValidateReference()

ValidateRange()

ValidateFunction()

ValidateArguments()

ValidateTypes()

ValidateLambda()

ValidateDynamicArray()

ValidateDependency()

ValidateWorkbook()

GenerateReport()

ClearCache()

────────────────────────────────────────

Events

ValidationStarted

ValidationCompleted

SyntaxErrorDetected

SemanticErrorDetected

ReferenceErrorDetected

TypeMismatchDetected

CircularReferenceDetected

ValidationPassed

ValidationFailed

CacheHit

CacheMiss

────────────────────────────────────────

Dependencies

• TOKENIZER_ENGINE

• PARSER_ENGINE

• AST_ENGINE

• FUNCTION_ENGINE

• FUNCTION_REGISTRY

• REFERENCE_ENGINE

• NAME_MANAGER

• DEPENDENCY_ENGINE

• DYNAMIC_ARRAY_ENGINE

• LAMBDA_ENGINE

• ERROR_ENGINE

• CACHE_ENGINE

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

Cấu hình

Enable Syntax Validation

Enable Semantic Validation

Enable Reference Validation

Enable Type Validation

Enable Dependency Validation

Enable Security Validation

Enable Parallel Validation

Enable Incremental Validation

Enable Validation Cache

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365

• Kiểm tra đầy đủ cú pháp Formula

• Kiểm tra AST trước khi thực thi

• Kiểm tra Function Signature

• Kiểm tra số lượng và kiểu đối số

• Kiểm tra Named Range

• Kiểm tra Dynamic Array

• Kiểm tra Spill Range

• Kiểm tra LAMBDA() và LET()

• Phát hiện Circular Reference

• Phát hiện toàn bộ lỗi Excel chuẩn

• Hỗ trợ Validation theo thời gian thực khi người dùng nhập công thức

• Hỗ trợ Batch Validation cho Workbook lớn

• Multi-thread Safe

• Enterprise Ready

• Production Ready
