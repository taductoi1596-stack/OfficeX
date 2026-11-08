Mục tiêu

OPENXML_FORMULA_ENGINE chịu trách nhiệm đọc, ghi, chuyển đổi và đồng bộ toàn bộ công thức Excel theo chuẩn Office Open XML (OOXML - ISO/IEC 29500).

Engine này đảm bảo OfficeX Excel có thể mở, chỉnh sửa và lưu tệp XLSX với khả năng tương thích gần như tuyệt đối với Microsoft Excel 365, bao gồm Formula, Shared Formula, Array Formula, Dynamic Array Formula, Table Formula, Named Formula và Calculation Metadata.

Engine này không trực tiếp thực thi công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

XLSX Package

↓

ZIP Package Reader

↓

Workbook.xml

↓

Worksheet.xml

↓

OPENXML_FORMULA_ENGINE

↓

Formula Parser

↓

FORMULA_ENGINE

↓

Calculation Engine

↓

OPENXML_FORMULA_ENGINE

↓

OOXML Writer

↓

XLSX Package

────────────────────────────────────────

Mục tiêu thiết kế

OOXML Formula

↓

Read

↓

Normalize

↓

Parse

↓

Calculation Engine

↓

Serialize

↓

OOXML Formula

────────────────────────────────────────

Chức năng chính

• Read Formula from OOXML

• Write Formula to OOXML

• Parse Cell Formula

• Parse Shared Formula

• Parse Array Formula

• Parse Dynamic Array Formula

• Parse Table Formula

• Parse Named Formula

• Parse External Formula

• Parse 3D Reference

• Parse Structured Reference

• Convert Formula

• Normalize Formula

• Validate Formula

• Formula Compatibility

• Formula Migration

────────────────────────────────────────

Các loại Formula hỗ trợ

Normal Formula

Shared Formula

Array Formula

Dynamic Array Formula

Table Formula

Structured Reference Formula

Named Formula

External Formula

3D Formula

Lambda Formula

LET Formula

────────────────────────────────────────

OOXML Files

xl/workbook.xml

xl/worksheets/sheet*.xml

xl/calcChain.xml

xl/sharedStrings.xml

xl/styles.xml

xl/externalLinks/

xl/tables/

xl/workbook.xml.rels

[Content_Types].xml

────────────────────────────────────────

Cell Formula

<c>

<f>

<v>

t

ref

si

aca

bx

ca

────────────────────────────────────────

Formula Attributes

t="normal"

t="shared"

t="array"

t="dataTable"

t="dynamic"

ref

si

aca

ca

bx

────────────────────────────────────────

Shared Formula

Master Formula

Shared Index

Reference Range

Expansion

Synchronization

────────────────────────────────────────

Array Formula

Legacy Array

Reference Range

Curly Braces

Static Array

────────────────────────────────────────

Dynamic Array

Spill Formula

Anchor Cell

Spill Range

Resize

#SPILL!

Implicit Intersection

────────────────────────────────────────

Structured Reference

Excel Table

Column Reference

Row Reference

Header

Totals

Special Items

────────────────────────────────────────

Named Formula

Workbook Scope

Worksheet Scope

Named Range

Named Lambda

Hidden Name

────────────────────────────────────────

External Formula

External Workbook

Linked Workbook

Cross Workbook Reference

External Name

────────────────────────────────────────

Reference Types

A1

R1C1

Absolute

Relative

Mixed

3D Reference

Structured Reference

Named Reference

────────────────────────────────────────

Calculation Metadata

calcChain.xml

Calculation ID

Dirty State

Recalc Mode

Dependency

Calculation Version

────────────────────────────────────────

Compatibility

Excel 2007

Excel 2010

Excel 2013

Excel 2016

Excel 2019

Excel 2021

Microsoft 365

────────────────────────────────────────

Validation

Formula Syntax

Shared Formula Integrity

Array Integrity

Dynamic Array Integrity

Reference Integrity

Workbook Integrity

Schema Validation

ISO 29500 Validation

────────────────────────────────────────

Conversion

Internal AST

↓

OOXML Formula

↓

Internal AST

No Information Loss

────────────────────────────────────────

Optimization

• Streaming XML Reader

• Streaming XML Writer

• Incremental Save

• Formula Deduplication

• Shared Formula Compression

• Lazy Parsing

• Parallel Worksheet Loading

• Cached XML Nodes

• Incremental XML Update

────────────────────────────────────────

Cache

Formula XML Cache

Shared Formula Cache

Reference Cache

Table Cache

Named Formula Cache

Relationship Cache

────────────────────────────────────────

Memory Management

Streaming Buffer

XML Pool

Shared String Cache

Relationship Cache

Zero Copy Reader

Copy-on-Write

────────────────────────────────────────

API

Initialize()

ReadFormula()

WriteFormula()

ReadWorksheet()

WriteWorksheet()

ReadWorkbook()

WriteWorkbook()

ReadCalcChain()

WriteCalcChain()

NormalizeFormula()

ConvertFormula()

Validate()

Import()

Export()

Shutdown()

────────────────────────────────────────

Events

WorkbookOpened

WorkbookSaved

FormulaLoaded

FormulaSaved

SharedFormulaLoaded

ArrayFormulaLoaded

DynamicArrayLoaded

CalcChainLoaded

CompatibilityWarning

ValidationPassed

ValidationFailed

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

• CALCULATION_CHAIN

• SERIALIZATION_ENGINE

• VALIDATION_ENGINE

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

Enable Shared Formula

Enable Dynamic Array

Enable Table Formula

Enable CalcChain

Enable Incremental XML Save

Enable Streaming Reader

Enable Streaming Writer

Enable Compatibility Mode

Enable Strict OOXML Validation

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365

• Tuân thủ ISO/IEC 29500 (OOXML)

• Đọc/Ghi đầy đủ XLSX Formula

• Hỗ trợ Shared Formula

• Hỗ trợ Array Formula

• Hỗ trợ Dynamic Array Formula

• Hỗ trợ Structured Reference

• Hỗ trợ Named Formula

• Hỗ trợ LET() và LAMBDA()

• Hỗ trợ calcChain.xml

• Không mất dữ liệu công thức khi lưu

• Streaming XML hiệu năng cao

• Hỗ trợ Workbook trên 10 triệu công thức

• Multi-thread Safe

• Enterprise Ready

• Production Ready
