Mục tiêu

DATA_VALIDATION_ENGINE chịu trách nhiệm quản lý, kiểm tra và thực thi toàn bộ quy tắc Data Validation trong OfficeX Excel.

Engine này đảm bảo dữ liệu nhập vào ô luôn tuân thủ các điều kiện đã định nghĩa, hỗ trợ danh sách (List), số, ngày tháng, thời gian, công thức tùy chỉnh và các quy tắc xác thực động tương đương Microsoft Excel 365.

Đây là Data Validation Engine.

Không trực tiếp tính toán Formula.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

User Input

↓

CELL_ENGINE

↓

DATA_VALIDATION_ENGINE

↓

Validation Rules

↓

Validation Processor

↓

Validation Result

↓

Worksheet

────────────────────────────────────────

Mục tiêu thiết kế

Input

↓

Validation Rule

↓

Evaluate

↓

Pass / Fail

↓

Accept

or

Reject

────────────────────────────────────────

Chức năng chính

• Data Validation
• Validation Rule
• Validation Formula
• Validation List
• Validation Number
• Validation Decimal
• Validation Date
• Validation Time
• Validation Text Length
• Validation Custom Formula
• Validation Error Alert
• Validation Input Message
• Validation Dropdown
• Dynamic Validation
• Batch Validation
• Validation Import
• Validation Export

────────────────────────────────────────

Validation Types

Any Value
Whole Number
Decimal
List
Date
Time
Text Length
Custom Formula

────────────────────────────────────────

Comparison Operators

Equal
Not Equal
Greater Than
Less Than
Greater Or Equal
Less Or Equal
Between
Not Between

────────────────────────────────────────

List Validation

Static List
Named Range
Worksheet Range
Table Column
Dynamic Array
Formula Result
External List

────────────────────────────────────────

Number Validation

Integer
Decimal
Positive
Negative
Zero
Percentage
Currency
Scientific

────────────────────────────────────────

Date Validation

Before
After
Between
Today
Tomorrow
Yesterday
Current Month
Current Year
Custom Formula

────────────────────────────────────────

Time Validation

Before
After
Between
Working Hours
Business Time
Custom Formula

────────────────────────────────────────

Text Validation

Minimum Length
Maximum Length
Exact Length
Contains
Not Contains
Starts With
Ends With
Regular Expression

────────────────────────────────────────

Custom Formula Validation

Formula Evaluation
Boolean Result
Cross Cell Validation
Named Formula
LAMBDA
LET
Dynamic Formula

────────────────────────────────────────

Input Message

Title
Description
Tooltip
Auto Display
Localization

────────────────────────────────────────

Error Alert

Stop
Warning
Information
Custom Message
Custom Title
Recovery Suggestion

────────────────────────────────────────

Dropdown

Auto Complete
Search
Dynamic Update
Large List
Multi Column
Icons

────────────────────────────────────────

Dynamic Validation

Dependent Dropdown
Dynamic Array
Table Expansion
Named Range Update
Formula Refresh
Worksheet Refresh

────────────────────────────────────────

Batch Validation

Worksheet Validation
Workbook Validation
Range Validation
Selected Cells
Entire Table

────────────────────────────────────────

Validation Events

Before Edit
During Edit
After Edit
Paste
Fill Handle
AutoFill
Import
External Update

────────────────────────────────────────

Import / Export

XLSX
XLS
XLSM
XLSB
ODS
CSV
SpreadsheetML
OOXML

────────────────────────────────────────

Validation Result

Valid
Invalid
Warning
Ignored
Skipped
Corrected

────────────────────────────────────────

Error Types

Invalid Number
Invalid Date
Invalid Time
Invalid Text
Invalid Formula
Invalid List
Broken Reference
Missing Named Range
Circular Formula

────────────────────────────────────────

Optimization

• Incremental Validation
• Background Validation
• Parallel Validation
• Rule Cache
• Formula Cache
• Batch Processing
• Lazy Validation
• Dynamic Refresh

────────────────────────────────────────

Cache

Validation Rule Cache
Formula Cache
Named Range Cache
List Cache
Result Cache

────────────────────────────────────────

Memory Management

Rule Pool
Validation Pool
Shared Buffer
Object Pool
Memory Cache

────────────────────────────────────────

API

Initialize()
Validate()
ValidateCell()
ValidateRange()
ValidateWorkbook()
AddRule()
RemoveRule()
UpdateRule()
EvaluateFormula()
ShowInputMessage()
ShowErrorAlert()
ImportRules()
ExportRules()
Refresh()
ClearCache()
Shutdown()

────────────────────────────────────────

Events

ValidationStarted
ValidationCompleted
ValidationPassed
ValidationFailed
RuleAdded
RuleRemoved
RuleUpdated
InputMessageShown
ErrorAlertShown
WorkbookValidated

────────────────────────────────────────

Dependencies

• CELL_ENGINE
• RANGE_ENGINE
• TABLE_ENGINE
• FORMULA_ENGINE
• FUNCTION_ENGINE
• CALCULATION_ENGINE
• NAME_MANAGER
• DYNAMIC_ARRAY_ENGINE
• CACHE_ENGINE
• VALIDATION_ENGINE
• IMPORT_ENGINE
• EXPORT_ENGINE

────────────────────────────────────────

Không phụ thuộc

• Ribbon
• Viewport
• Render Engine
• Printer
• Mouse
• Keyboard

────────────────────────────────────────

Cấu hình

Enable Real-time Validation
Enable Dynamic Validation
Enable Formula Validation
Enable Dropdown Search
Enable Background Validation
Enable Batch Validation
Enable Error Alert
Enable Input Message
Enable Rule Cache

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ đầy đủ Data Validation của Excel
• Hỗ trợ List, Number, Date, Time, Text và Custom Formula
• Hỗ trợ Named Range và Dynamic Array
• Hỗ trợ Dependent Dropdown
• Hỗ trợ Error Alert và Input Message
• Hỗ trợ Import/Export theo chuẩn OOXML
• Tự động cập nhật khi dữ liệu nguồn thay đổi
• Hỗ trợ Workbook với hàng triệu ô
• Multi-thread Safe
• Enterprise Ready
• Production Ready
