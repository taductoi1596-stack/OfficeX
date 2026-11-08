Mục tiêu

INFORMATION_ENGINE chịu trách nhiệm thực thi toàn bộ các hàm thông tin (Information Functions) trong OfficeX Excel.

Engine này triển khai đầy đủ các Information Functions theo Microsoft Excel 365, bao gồm kiểm tra kiểu dữ liệu, trạng thái ô, trạng thái workbook, thông tin công thức, tham chiếu và môi trường tính toán.

Không trực tiếp phân tích công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Chức năng chính

• Thực thi Information Functions
• Kiểm tra kiểu dữ liệu
• Kiểm tra trạng thái ô
• Kiểm tra công thức
• Kiểm tra lỗi
• Kiểm tra tham chiếu
• Kiểm tra Workbook
• Kiểm tra Worksheet
• Kiểm tra Dynamic Array
• Kiểm tra Spill
• Kiểm tra Named Range
• Kiểm tra Table
• Kiểm tra Cell Metadata
• Information Cache
• Metadata Query

────────────────────────────────────────

Nhóm hàm Information

Type Detection

TYPE()

ISNUMBER()

ISTEXT()

ISNONTEXT()

ISLOGICAL()

ISBLANK()

ISREF()

ISFORMULA()

ISOMITTED()

────────────────────────────────────────

Error Detection

ISERROR()

ISERR()

ISNA()

ERROR.TYPE()

────────────────────────────────────────

Value Detection

N()

NA()

SHEET()

SHEETS()

CELL()

INFO()

────────────────────────────────────────

Dynamic Array

ISFORMULA()

ISREF()

SPILL Detection

Dynamic Array Detection

────────────────────────────────────────

Workbook Information

Workbook Name

Worksheet Name

Worksheet Count

Workbook Path

External Workbook

Workbook Status

────────────────────────────────────────

Worksheet Information

Sheet Name

Sheet Index

Used Range

Row Count

Column Count

Visibility

Protection Status

────────────────────────────────────────

Cell Information

Address

Formula

Value

Format

Style

Comment

Note

Hyperlink

Validation

Conditional Format

Merge Status

Hidden Status

Locked Status

Spill Owner

Dynamic Array

────────────────────────────────────────

Table Information

Table Name

Column Name

Row Count

Column Count

Structured Reference

Header

Totals Row

────────────────────────────────────────

Named Range Information

Name

Scope

Reference

Formula

Visibility

────────────────────────────────────────

Supported Data Types

Blank

Number

Text

Boolean

Date

Time

Currency

Percentage

Array

Dynamic Array

Reference

Error

Lambda

────────────────────────────────────────

Supported Errors

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

TYPE() Return Values

1 → Number

2 → Text

4 → Logical

16 → Error

64 → Array

128 → Dynamic Array

────────────────────────────────────────

CELL() Information

address

col

color

contents

filename

format

parentheses

prefix

protect

row

type

width

────────────────────────────────────────

INFO() Information

directory

numfile

origin

osversion

release

recalc

system

memavail

memused

totmem

────────────────────────────────────────

Validation

• Invalid Cell

• Invalid Sheet

• Invalid Workbook

• Invalid Named Range

• Invalid Reference

• Invalid Function

• Invalid Metadata

────────────────────────────────────────

Optimization

• Metadata Cache

• Workbook Cache

• Worksheet Cache

• Cell Cache

• Fast Property Lookup

• Lazy Metadata Loading

• Incremental Metadata Update

────────────────────────────────────────

Cache

Information Cache

Metadata Cache

Workbook Cache

Worksheet Cache

Cell Cache

Formula Cache

────────────────────────────────────────

API

Initialize()

Execute()

GetCellInfo()

GetWorkbookInfo()

GetWorksheetInfo()

GetTableInfo()

GetNamedRangeInfo()

GetType()

IsNumber()

IsText()

IsLogical()

IsBlank()

IsReference()

IsFormula()

IsError()

ErrorType()

Validate()

ClearCache()

────────────────────────────────────────

Events

InformationRequested

CellInformationRead

WorkbookInformationRead

WorksheetInformationRead

MetadataUpdated

InformationCached

ValidationFailed

CacheHit

CacheMiss

────────────────────────────────────────

Dependencies

• FUNCTION_ENGINE
• REFERENCE_ENGINE
• NAME_MANAGER
• SPILL_ENGINE
• ARRAY_ENGINE
• EVALUATOR_ENGINE
• CACHE_ENGINE
• VALIDATION_ENGINE
• ERROR_ENGINE
• DOCUMENT_ENGINE

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

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ đầy đủ các Information Functions
• Hỗ trợ TYPE()
• Hỗ trợ CELL()
• Hỗ trợ INFO()
• Hỗ trợ ISNUMBER(), ISTEXT(), ISBLANK(), ISREF(), ISFORMULA()
• Hỗ trợ ERROR.TYPE()
• Hỗ trợ Dynamic Arrays
• Hỗ trợ Spill Detection
• Hỗ trợ Named Range
• Hỗ trợ Structured Reference
• Hỗ trợ Workbook Metadata
• Hỗ trợ High Performance Metadata Lookup
• Hỗ trợ Multi-thread Query
• Enterprise Ready
• Production Ready
