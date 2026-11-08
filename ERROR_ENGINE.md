Mục tiêu

ERROR_ENGINE chịu trách nhiệm phát hiện, quản lý và lan truyền toàn bộ lỗi trong OfficeX Excel.

Engine này đảm bảo mọi lỗi được xử lý giống Microsoft Excel 365.

Không trực tiếp tính toán công thức.

Không phụ thuộc giao diện người dùng.

Chức năng chính

• Phát hiện lỗi
• Tạo đối tượng lỗi
• Quản lý Error Object
• Lan truyền lỗi
• Chuyển đổi lỗi
• Ghi nhật ký lỗi
• Báo cáo lỗi
• Hỗ trợ Error Recovery
• Hỗ trợ Formula Error
• Hỗ trợ Reference Error
• Hỗ trợ Runtime Error
• Hỗ trợ Dynamic Array Error
• Hỗ trợ External Link Error
• Hỗ trợ Plugin Error
• Hỗ trợ AI Function Error
• Hỗ trợ Validation Error

Các loại lỗi Excel

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

#UNKNOWN!

Lỗi công thức

• Syntax Error
• Invalid Formula
• Invalid Function
• Invalid Parameter
• Invalid Operator
• Invalid Token
• Parse Error
• AST Error
• Expression Error

Lỗi tham chiếu

• Invalid Cell
• Invalid Range
• Invalid Sheet
• Invalid Workbook
• Deleted Cell
• Deleted Sheet
• Circular Reference
• Broken External Link
• Invalid Structured Reference
• Invalid Named Range

Lỗi tính toán

• Divide By Zero
• Numeric Overflow
• Numeric Underflow
• Invalid Number
• Invalid Date
• Invalid Time
• Infinite Result
• NaN

Lỗi Dynamic Array

• Spill Blocked
• Spill Out Of Range
• Spill Unknown Size
• Spill Into Table
• Spill Circular
• Spill Memory Overflow

Lỗi Lambda

• Invalid Lambda
• Lambda Not Found
• Invalid LET
• Invalid Variable
• Invalid Scope
• Recursion Limit
• Stack Overflow

Lỗi Plugin

• Plugin Missing
• Plugin Disabled
• Plugin Timeout
• Plugin Exception
• Plugin Permission Denied

Lỗi AI

• AI Provider Offline
• AI Timeout
• AI Authentication Failed
• AI Response Invalid
• AI Quota Exceeded

Error Object

• Error Code
• Error Type
• Error Name
• Error Message
• Formula
• Workbook
• Worksheet
• Cell Address
• Range
• Function Name
• Timestamp
• Stack Trace
• Severity
• Source Engine

Mức độ lỗi

• Information
• Warning
• Error
• Critical
• Fatal

Error Propagation

• Cell → Formula
• Formula → Array
• Array → Worksheet
• Worksheet → Workbook

Error Recovery

• Retry
• Ignore
• Replace Value
• Use Default Value
• Recalculate
• Rollback
• Continue Execution

Validation

• Formula Validation
• Parameter Validation
• Reference Validation
• Range Validation
• Type Validation
• Workbook Validation

Cache

• Error Cache
• Error History
• Recovery Cache

API

Initialize()

CreateError()

Throw()

Catch()

Handle()

Propagate()

Convert()

Recover()

Clear()

ClearCell()

ClearRange()

ClearWorksheet()

ClearWorkbook()

GetError()

GetErrors()

HasError()

Log()

Export()

Import()

Events

ErrorCreated

ErrorHandled

ErrorRecovered

ErrorPropagated

ErrorCleared

CriticalError

FormulaError

ReferenceError

CalculationError

PluginError

AIError

Dependencies

• CALCULATION_ENGINE
• FORMULA_ENGINE
• FUNCTION_ENGINE
• DEPENDENCY_ENGINE
• VALIDATION_ENGINE
• CACHE_ENGINE
• LOG_ENGINE
• SERIALIZATION_ENGINE

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
• Hỗ trợ đầy đủ toàn bộ Error Type của Excel
• Hỗ trợ Error Propagation
• Hỗ trợ Error Recovery
• Hỗ trợ Dynamic Array Error
• Hỗ trợ Lambda Error
• Hỗ trợ Plugin Error
• Hỗ trợ AI Function Error
• Ghi nhật ký lỗi đầy đủ
• Hiệu năng cao
• Enterprise Ready
• Production Ready
