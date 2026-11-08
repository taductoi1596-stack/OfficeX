Mục tiêu

REFERENCE_ENGINE chịu trách nhiệm phân tích, quản lý, xác thực và giải quyết (Resolve) toàn bộ tham chiếu trong OfficeX Excel.

Đây là Engine trung tâm xử lý mọi loại Reference trước khi EVALUATOR_ENGINE hoặc FUNCTION_ENGINE thực thi công thức.

Engine này không thực hiện tính toán.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Chức năng chính

• Phân tích Cell Reference
• Phân tích Range Reference
• Phân tích Worksheet Reference
• Phân tích Workbook Reference
• Phân tích External Workbook
• Phân tích Named Range
• Phân tích Structured Reference
• Phân tích Table Reference
• Phân tích Spill Reference
• Phân tích Dynamic Array Reference
• Chuyển đổi Relative/Absolute Reference
• Di chuyển Reference
• Cập nhật Reference khi Insert/Delete
• Theo dõi Dependency Reference
• Resolve Reference
• Cache Reference
• Validate Reference
• Serialize Reference

────────────────────────────────────────

Các loại Reference

Cell Reference

Range Reference

Entire Row Reference

Entire Column Reference

Worksheet Reference

Workbook Reference

External Workbook Reference

Named Range

Named Formula

Structured Reference

Table Reference

Dynamic Array Reference

Spill Reference

3D Reference

Union Reference

Intersection Reference

────────────────────────────────────────

Cell Reference

A1

B10

AA20

XFD1048576

────────────────────────────────────────

Absolute Reference

$A$1

A$1

$A1

────────────────────────────────────────

Range Reference

A1:B10

A:A

1:100

A1:A1048576

────────────────────────────────────────

Worksheet Reference

Sheet1!A1

Sheet2!A1:B100

'January Sales'!A1

────────────────────────────────────────

Workbook Reference

[Budget.xlsx]Sheet1!A1

[Report.xlsx]Summary!B5

────────────────────────────────────────

External Workbook

'C:\Reports\[Sales.xlsx]Data'!A1

'\\Server\Finance\[Budget.xlsx]Plan'!B10

'https://example.com/report.xlsx'!A1

OneDrive Workbook

SharePoint Workbook

────────────────────────────────────────

Named Range

Sales

TotalRevenue

VAT

ExchangeRate

CurrentYear

────────────────────────────────────────

Structured Reference

Table1[Amount]

Table1[Price]

Table1[#All]

Table1[#Headers]

Table1[#Totals]

Table1[@Price]

────────────────────────────────────────

Dynamic Array

A1#

FILTER(...)

UNIQUE(...)

SORT(...)

────────────────────────────────────────

3D Reference

Sheet1:Sheet12!A1

Sheet1:Sheet10!A1:B10

────────────────────────────────────────

Reference Operators

:

,

(space)

#

@

!

$

[]

────────────────────────────────────────

Reference Resolution

Resolve Cell

Resolve Range

Resolve Sheet

Resolve Workbook

Resolve External Workbook

Resolve Named Range

Resolve Structured Reference

Resolve Dynamic Array

Resolve Spill Range

────────────────────────────────────────

Reference Conversion

Relative → Absolute

Absolute → Relative

A1 → R1C1

R1C1 → A1

Workbook Relative

Worksheet Relative

────────────────────────────────────────

Reference Update

Insert Row

Delete Row

Insert Column

Delete Column

Move Cells

Copy Cells

Rename Sheet

Delete Sheet

Rename Workbook

External Workbook Changed

Named Range Changed

────────────────────────────────────────

Validation

• Invalid Cell
• Invalid Range
• Invalid Sheet
• Invalid Workbook
• Invalid External Workbook
• Invalid Table
• Invalid Structured Reference
• Invalid Named Range
• Invalid Spill
• Invalid Dynamic Array
• Broken Reference

────────────────────────────────────────

Reference Cache

Cell Cache

Range Cache

Sheet Cache

Workbook Cache

Named Range Cache

Table Cache

Dynamic Array Cache

External Link Cache

────────────────────────────────────────

Optimization

• Fast Reference Lookup
• Incremental Reference Update
• Lazy Reference Resolution
• Cached Workbook Lookup
• Cached Sheet Lookup
• Zero Copy Reference

────────────────────────────────────────

API

Initialize()

Resolve()

ResolveCell()

ResolveRange()

ResolveSheet()

ResolveWorkbook()

ResolveExternalWorkbook()

ResolveNamedRange()

ResolveStructuredReference()

ResolveTable()

ResolveDynamicArray()

ResolveSpill()

ConvertA1ToR1C1()

ConvertR1C1ToA1()

UpdateReference()

MoveReference()

CopyReference()

Validate()

Cache()

ClearCache()

────────────────────────────────────────

Events

ReferenceResolved

ReferenceUpdated

ReferenceMoved

ReferenceCopied

ReferenceDeleted

NamedRangeChanged

WorkbookReferenceChanged

SheetReferenceChanged

ExternalWorkbookLoaded

ExternalWorkbookDisconnected

────────────────────────────────────────

Dependencies

• FORMULA_ENGINE
• PARSER_ENGINE
• AST_ENGINE
• NAME_MANAGER
• ARRAY_ENGINE
• DEPENDENCY_ENGINE
• CACHE_ENGINE
• VALIDATION_ENGINE
• ERROR_ENGINE
• OPENXML_FORMULA_ENGINE

────────────────────────────────────────

Không phụ thuộc

• Ribbon
• UI
• Render Engine
• Viewport
• Printer
• Mouse
• Keyboard

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ A1 Reference
• Hỗ trợ R1C1 Reference
• Hỗ trợ Absolute/Relative Reference
• Hỗ trợ Range Reference
• Hỗ trợ Worksheet Reference
• Hỗ trợ Workbook Reference
• Hỗ trợ External Workbook
• Hỗ trợ Named Range
• Hỗ trợ Structured Reference
• Hỗ trợ Excel Table
• Hỗ trợ Dynamic Array
• Hỗ trợ Spill Operator (#)
• Hỗ trợ Implicit Intersection (@)
• Hỗ trợ 3D Reference
• Hỗ trợ Incremental Reference Update
• Hiệu năng O(1) cho Cell Lookup
• Enterprise Ready
• Production Ready
