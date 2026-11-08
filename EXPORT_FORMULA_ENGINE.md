Mục tiêu

EXPORT_FORMULA_ENGINE chịu trách nhiệm xuất (Export), chuyển đổi và ghi toàn bộ công thức của Workbook từ OfficeX Excel sang các định dạng bảng tính tiêu chuẩn.

Engine này đảm bảo mọi Formula, Shared Formula, Array Formula, Dynamic Array, Structured Reference, Named Formula, LAMBDA và LET được ghi chính xác theo chuẩn Microsoft Excel 365 và OpenDocument Spreadsheet.

Engine này không trực tiếp thực thi công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Calculation Engine

↓

FORMULA_ENGINE

↓

EXPORT_FORMULA_ENGINE

↓

Formula Serializer

↓

Compatibility Layer

↓

OOXML / BIFF / ODS Writer

↓

Workbook File

────────────────────────────────────────

Mục tiêu thiết kế

Internal Formula AST

↓

Formula Serializer

↓

Compatibility Converter

↓

Workbook Writer

↓

XLSX / XLS / XLSM / XLSB / ODS

────────────────────────────────────────

Chức năng chính

• Export Workbook Formula

• Export Worksheet Formula

• Export Cell Formula

• Export Shared Formula

• Export Array Formula

• Export Dynamic Array

• Export Named Formula

• Export Table Formula

• Export Structured Reference

• Export External Reference

• Formula Serialization

• Compatibility Conversion

• Formula Validation

• Batch Export

• Streaming Export

────────────────────────────────────────

Định dạng hỗ trợ

XLSX

XLS

XLSM

XLSB

ODS

FODS

SpreadsheetML

CSV (Value Export)

Template (.xltx)

Macro Workbook (.xlsm)

────────────────────────────────────────

Formula Types

Normal Formula

Shared Formula

Array Formula

Dynamic Array Formula

Structured Reference

Named Formula

External Formula

3D Formula

LAMBDA()

LET()

────────────────────────────────────────

Export Process

Workbook

↓

Collect Formula

↓

Normalize Formula

↓

Compatibility Conversion

↓

Serialize

↓

Write Workbook

↓

Verify Output

────────────────────────────────────────

OOXML Export

Workbook.xml

Worksheet.xml

CalcChain.xml

DefinedNames.xml

SharedStrings.xml

Tables.xml

Relationships

Content Types

────────────────────────────────────────

Shared Formula Export

Master Formula

Shared Index

Shared Range

Reference Update

Compression

────────────────────────────────────────

Array Formula Export

Legacy Array Formula

Reference Range

Array Constant

Curly Brace Formula

────────────────────────────────────────

Dynamic Array Export

Spill Formula

Anchor Cell

Spill Range

Resize Metadata

Dynamic Function

────────────────────────────────────────

Structured Reference Export

Excel Table

Table Column

Header

Totals Row

Special Item

Structured Formula

────────────────────────────────────────

Named Formula Export

Workbook Scope

Worksheet Scope

Named Range

Named Lambda

Hidden Name

────────────────────────────────────────

External Reference Export

External Workbook

Linked Workbook

Cross Workbook Reference

Named External Reference

────────────────────────────────────────

Reference Conversion

A1

R1C1

Absolute

Relative

Mixed

3D Reference

Structured Reference

Named Reference

────────────────────────────────────────

Compatibility Layer

Excel 2007

Excel 2010

Excel 2013

Excel 2016

Excel 2019

Excel 2021

Microsoft 365

LibreOffice Calc

Apache OpenOffice

────────────────────────────────────────

Validation

Formula Syntax

Reference Integrity

Named Range Validation

Shared Formula Validation

Array Formula Validation

Dynamic Array Validation

Workbook Validation

OOXML Validation

ODS Validation

────────────────────────────────────────

Error Handling

Unsupported Function

Unsupported Format

Broken Reference

Missing Sheet

Missing Workbook

Invalid Dynamic Array

Invalid Shared Formula

Serialization Error

Write Error

Compatibility Warning

────────────────────────────────────────

Optimization

• Streaming XML Writer

• Streaming Binary Writer

• Incremental Export

• Formula Deduplication

• Shared Formula Compression

• Batch Formula Export

• Parallel Worksheet Export

• Lazy Serialization

• Incremental Save

────────────────────────────────────────

Cache

Export Cache

Formula Cache

Workbook Cache

Worksheet Cache

Shared Formula Cache

Compatibility Cache

────────────────────────────────────────

Memory Management

Streaming Buffer

Export Buffer

Formula Pool

Shared Buffer

Memory Pool

Zero Copy

────────────────────────────────────────

API

Initialize()

ExportWorkbook()

ExportWorksheet()

ExportFormula()

ExportNamedFormula()

ExportSharedFormula()

ExportArrayFormula()

ExportDynamicArray()

ExportTableFormula()

NormalizeFormula()

SerializeFormula()

ConvertFormula()

Validate()

GenerateReport()

ClearCache()

Shutdown()

────────────────────────────────────────

Events

ExportStarted

WorkbookExported

WorksheetExported

FormulaExported

SharedFormulaExported

ArrayFormulaExported

DynamicArrayExported

NamedFormulaExported

CompatibilityWarning

ValidationPassed

ValidationFailed

ExportCompleted

────────────────────────────────────────

Dependencies

• FORMULA_ENGINE

• TOKENIZER_ENGINE

• PARSER_ENGINE

• AST_ENGINE

• REFERENCE_ENGINE

• NAME_MANAGER

• DYNAMIC_ARRAY_ENGINE

• SPILL_ENGINE

• OPENXML_FORMULA_ENGINE

• SERIALIZATION_ENGINE

• VALIDATION_ENGINE

• CACHE_ENGINE

• ERROR_ENGINE

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

Enable Streaming Export

Enable Batch Export

Enable Dynamic Array Export

Enable Shared Formula Export

Enable Named Formula Export

Enable Compatibility Mode

Enable Formula Validation

Enable Incremental Save

Enable Formula Compression

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365

• Hỗ trợ xuất XLSX, XLS, XLSM, XLSB

• Hỗ trợ xuất ODS/FODS

• Hỗ trợ Shared Formula

• Hỗ trợ Array Formula

• Hỗ trợ Dynamic Array Formula

• Hỗ trợ LET() và LAMBDA()

• Hỗ trợ Structured Reference

• Hỗ trợ Named Formula

• Hỗ trợ External Reference

• Ghi đúng chuẩn OOXML và ODF

• Không mất dữ liệu công thức khi Export

• Streaming Writer hiệu năng cao

• Hỗ trợ Workbook trên 10 triệu công thức

• Multi-thread Safe

• Enterprise Ready

• Production Ready
