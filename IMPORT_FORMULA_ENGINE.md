Mục tiêu

IMPORT_FORMULA_ENGINE chịu trách nhiệm nhập (Import), chuyển đổi và khôi phục toàn bộ công thức từ các định dạng bảng tính vào OfficeX Excel.

Engine này đảm bảo công thức từ XLSX, XLS, XLSM, XLSB, ODS, CSV (nếu có công thức), XML Spreadsheet và các định dạng tương thích khác được chuyển đổi chính xác sang Formula AST nội bộ của OfficeX mà không làm mất dữ liệu.

Engine này không trực tiếp thực thi công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Workbook File

↓

IMPORT_FORMULA_ENGINE

↓

File Reader

↓

Formula Extractor

↓

Formula Converter

↓

Compatibility Layer

↓

FORMULA_ENGINE

↓

Calculation Engine

────────────────────────────────────────

Mục tiêu thiết kế

Workbook

↓

Read File

↓

Extract Formula

↓

Normalize Formula

↓

Convert Formula

↓

Formula AST

↓

Calculation Engine

────────────────────────────────────────

Chức năng chính

• Import Formula

• Parse Formula

• Formula Normalization

• Formula Conversion

• Shared Formula Import

• Array Formula Import

• Dynamic Array Import

• Named Formula Import

• Table Formula Import

• External Reference Import

• Structured Reference Import

• Compatibility Conversion

• Formula Validation

• Batch Import

• Incremental Import

────────────────────────────────────────

Định dạng hỗ trợ

XLSX

XLS

XLSM

XLSB

ODS

FODS

SpreadsheetML

CSV (Formula Mode)

XML Spreadsheet 2003

Template (.xltx)

Macro Workbook (.xlsm)

────────────────────────────────────────

Nguồn Formula

Workbook

Worksheet

Named Range

Excel Table

Pivot Table

External Workbook

Shared Formula

Array Formula

Dynamic Array

Lambda Formula

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

Import Process

Open Workbook

↓

Read Workbook Structure

↓

Read Worksheets

↓

Extract Formula

↓

Normalize

↓

Compatibility Check

↓

Validate

↓

Build AST

↓

Dependency Graph

↓

Calculation Chain

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

Reference Conversion

A1

R1C1

Absolute Reference

Relative Reference

Mixed Reference

3D Reference

External Reference

Structured Reference

Named Reference

────────────────────────────────────────

Dynamic Array Import

FILTER()

SORT()

SORTBY()

UNIQUE()

SEQUENCE()

RANDARRAY()

TAKE()

DROP()

CHOOSECOLS()

CHOOSEROWS()

TOCOL()

TOROW()

WRAPROWS()

WRAPCOLS()

VSTACK()

HSTACK()

MAKEARRAY()

MAP()

REDUCE()

SCAN()

BYROW()

BYCOL()

────────────────────────────────────────

Shared Formula Import

Master Formula

Shared Index

Shared Range

Expand Formula

Synchronize References

────────────────────────────────────────

Array Formula Import

Legacy Array Formula

Reference Range

Array Constant

Curly Brace Formula

────────────────────────────────────────

Named Formula Import

Workbook Scope

Worksheet Scope

Named Range

Hidden Name

Named Lambda

────────────────────────────────────────

Validation

Syntax Validation

Reference Validation

Function Validation

Compatibility Validation

Dependency Validation

Named Range Validation

Dynamic Array Validation

────────────────────────────────────────

Error Handling

Unsupported Function

Corrupted Formula

Broken Reference

Missing Sheet

Missing Workbook

External Link Missing

Unsupported Dynamic Array

Invalid Shared Formula

Invalid Array Formula

────────────────────────────────────────

Optimization

• Batch Formula Import

• Parallel Worksheet Import

• Streaming Import

• Incremental Import

• Formula Deduplication

• Shared Formula Expansion

• Compatibility Cache

• Lazy Formula Parsing

────────────────────────────────────────

Cache

Import Cache

Formula Cache

Workbook Cache

Worksheet Cache

Shared Formula Cache

Compatibility Cache

────────────────────────────────────────

Memory Management

Streaming Buffer

Import Buffer

Formula Pool

Object Pool

Shared Buffer

Zero Copy

────────────────────────────────────────

API

Initialize()

ImportWorkbook()

ImportWorksheet()

ImportFormula()

ImportNamedFormula()

ImportSharedFormula()

ImportArrayFormula()

ImportDynamicArray()

ImportTableFormula()

NormalizeFormula()

ConvertFormula()

Validate()

GenerateReport()

ClearCache()

Shutdown()

────────────────────────────────────────

Events

ImportStarted

WorkbookImported

WorksheetImported

FormulaImported

SharedFormulaImported

ArrayFormulaImported

DynamicArrayImported

NamedFormulaImported

CompatibilityWarning

ValidationPassed

ValidationFailed

ImportCompleted

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

• VALIDATION_ENGINE

• OPENXML_FORMULA_ENGINE

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

Enable Batch Import

Enable Streaming Import

Enable Compatibility Mode

Enable Dynamic Array Import

Enable Shared Formula Import

Enable Named Formula Import

Enable Formula Validation

Enable Incremental Import

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365

• Hỗ trợ nhập XLSX, XLS, XLSM, XLSB

• Hỗ trợ nhập ODS/FODS

• Hỗ trợ Shared Formula

• Hỗ trợ Array Formula

• Hỗ trợ Dynamic Array Formula

• Hỗ trợ LET() và LAMBDA()

• Hỗ trợ Structured Reference

• Hỗ trợ Named Formula

• Chuyển đổi Formula sang AST nội bộ

• Tự động xử lý tương thích giữa các phiên bản Excel

• Báo cáo lỗi và cảnh báo khi import

• Hỗ trợ Workbook trên 10 triệu công thức

• Multi-thread Safe

• Enterprise Ready

• Production Ready
