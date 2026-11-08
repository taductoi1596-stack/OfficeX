Mục tiêu

CONDITIONAL_FORMATTING_ENGINE chịu trách nhiệm quản lý, tính toán và áp dụng toàn bộ Conditional Formatting (Định dạng có điều kiện) trong OfficeX Excel.

Engine này tự động đánh giá giá trị ô, công thức, dữ liệu và trạng thái của Worksheet để áp dụng định dạng tương ứng theo thời gian thực, tương thích hoàn toàn với Microsoft Excel 365.

Đây là Formatting Rule Engine.

Không trực tiếp tính toán Formula.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Workbook

↓

Worksheet

↓

Conditional Formatting Rules

↓

CONDITIONAL_FORMATTING_ENGINE

↓

Rule Evaluator

↓

Format Resolver

↓

Render Model

↓

Worksheet

────────────────────────────────────────

Mục tiêu thiết kế

Cell Value

↓

Evaluate Rules

↓

Determine Format

↓

Resolve Priority

↓

Apply Style

↓

Render

────────────────────────────────────────

Chức năng chính

• Conditional Formatting
• Rule Management
• Rule Evaluation
• Formula Rule
• Cell Value Rule
• Duplicate Rule
• Unique Rule
• Top / Bottom Rule
• Average Rule
• Data Bar
• Color Scale
• Icon Set
• Custom Rule
• Dynamic Rule
• Rule Import
• Rule Export

────────────────────────────────────────

Conditional Formatting Types

Cell Value
Formula
Text
Date
Blank
Non Blank
Error
No Error
Duplicate
Unique
Top 10
Bottom 10
Above Average
Below Average
Percent
Percentile

────────────────────────────────────────

Data Bars

Solid Fill
Gradient Fill
Positive Bar
Negative Bar
Custom Color
Axis
Minimum
Maximum
Automatic Scaling

────────────────────────────────────────

Color Scales

2 Color Scale
3 Color Scale
Minimum
Midpoint
Maximum
Custom Color
Percentile
Formula Based

────────────────────────────────────────

Icon Sets

3 Arrows
4 Arrows
5 Arrows
Traffic Lights
Flags
Stars
Ratings
Symbols
Custom Icons

────────────────────────────────────────

Formula Rules

Boolean Formula
Cross Cell Formula
Named Formula
Dynamic Formula
LET()
LAMBDA()
Reference Formula

────────────────────────────────────────

Text Rules

Contains
Does Not Contain
Begins With
Ends With
Exact Match
Regular Expression

────────────────────────────────────────

Date Rules

Today
Yesterday
Tomorrow
Last Week
This Week
Next Week
Last Month
This Month
Next Month
Custom Date

────────────────────────────────────────

Number Rules

Equal
Not Equal
Greater Than
Less Than
Between
Not Between
Positive
Negative
Zero

────────────────────────────────────────

Duplicate Rules

Duplicate Values
Unique Values
Case Sensitive
Ignore Blank

────────────────────────────────────────

Top / Bottom Rules

Top N
Bottom N
Top Percent
Bottom Percent

────────────────────────────────────────

Average Rules

Above Average
Below Average
Equal Average
One Standard Deviation
Two Standard Deviations

────────────────────────────────────────

Rule Priority

Highest Priority
Lowest Priority
Stop If True
Rule Order
Rule Conflict Resolution

────────────────────────────────────────

Rule Scope

Cell
Range
Worksheet
Workbook
Named Range
Excel Table
Pivot Table

────────────────────────────────────────

Dynamic Formatting

Dynamic Array
Spill Range
Table Expansion
Pivot Refresh
Worksheet Refresh
Workbook Refresh

────────────────────────────────────────

Supported Styles

Font
Font Color
Bold
Italic
Underline
Strikethrough
Fill Color
Border
Number Format
Alignment
Protection

────────────────────────────────────────

Validation

Rule Validation
Formula Validation
Reference Validation
Priority Validation
Range Validation
Style Validation

────────────────────────────────────────

Import / Export

XLSX
XLS
XLSM
XLSB
ODS
SpreadsheetML
OOXML

────────────────────────────────────────

Optimization

• Incremental Rule Evaluation
• Parallel Rule Processing
• Rule Cache
• Formula Cache
• Batch Evaluation
• Lazy Evaluation
• Dynamic Refresh
• Background Processing
• Shared Style Cache

────────────────────────────────────────

Cache

Rule Cache
Formula Cache
Style Cache
Priority Cache
Result Cache
Worksheet Cache

────────────────────────────────────────

Memory Management

Rule Pool
Style Pool
Shared Buffer
Object Pool
Memory Cache

────────────────────────────────────────

API

Initialize()
AddRule()
RemoveRule()
UpdateRule()
Evaluate()
EvaluateCell()
EvaluateRange()
ApplyFormatting()
Refresh()
ImportRules()
ExportRules()
Validate()
ClearCache()
Shutdown()

────────────────────────────────────────

Events

RuleAdded
RuleRemoved
RuleUpdated
EvaluationStarted
EvaluationCompleted
FormattingApplied
FormattingRemoved
WorksheetUpdated
WorkbookUpdated
ValidationPassed
ValidationFailed

────────────────────────────────────────

Dependencies

• CELL_ENGINE
• RANGE_ENGINE
• STYLE_ENGINE
• FORMAT_ENGINE
• FORMULA_ENGINE
• FUNCTION_ENGINE
• CALCULATION_ENGINE
• DYNAMIC_ARRAY_ENGINE
• TABLE_ENGINE
• PIVOT_ENGINE
• CACHE_ENGINE
• VALIDATION_ENGINE

────────────────────────────────────────

Không phụ thuộc

• Ribbon
• UI
• Viewport
• Printer
• Mouse
• Keyboard

────────────────────────────────────────

Cấu hình

Enable Formula Rules
Enable Data Bars
Enable Color Scales
Enable Icon Sets
Enable Dynamic Refresh
Enable Parallel Evaluation
Enable Background Processing
Enable Incremental Evaluation
Enable Style Cache

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ đầy đủ Conditional Formatting
• Hỗ trợ Formula-based Rules
• Hỗ trợ Data Bars
• Hỗ trợ Color Scales
• Hỗ trợ Icon Sets
• Hỗ trợ Dynamic Arrays
• Hỗ trợ PivotTable và Excel Table
• Hỗ trợ Import/Export theo chuẩn OOXML
• Tự động cập nhật khi dữ liệu thay đổi
• Hỗ trợ Workbook với hàng triệu ô
• Multi-thread Safe
• Enterprise Ready
• Production Ready
