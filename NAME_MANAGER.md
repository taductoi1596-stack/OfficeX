Mục tiêu

NAME_MANAGER chịu trách nhiệm quản lý toàn bộ Named Range, Named Formula và Named Lambda trong OfficeX Excel.

Engine này tương thích hoàn toàn với Microsoft Excel 365 và chuẩn Office Open XML (OOXML).

Đây là trung tâm quản lý mọi đối tượng được đặt tên trong Workbook.

Không trực tiếp thực hiện tính toán.

Không phụ thuộc giao diện người dùng.

────────────────────────────────────────

Chức năng chính

• Tạo Named Range
• Tạo Named Formula
• Tạo Named Lambda
• Chỉnh sửa Name
• Đổi tên Name
• Xóa Name
• Tra cứu Name
• Kiểm tra Name
• Resolve Name
• Quản lý Scope
• Quản lý Visibility
• Quản lý Category
• Quản lý Comment
• Quản lý Metadata
• Theo dõi Dependency
• Đồng bộ với Formula
• Đồng bộ với Workbook
• Serialize Name
• Import/Export Name

────────────────────────────────────────

Đối tượng quản lý

• Named Range
• Named Formula
• Named Lambda
• Constant Name
• Dynamic Name
• Hidden Name
• Built-in Name
• Workbook Name
• Worksheet Name

────────────────────────────────────────

Named Range

Ví dụ

Sales

Price

TaxRate

EmployeeList

ExchangeRate

────────────────────────────────────────

Named Formula

Ví dụ

=SUM(A1:A100)

=TODAY()

=A1*0.1

=IF(A1>0,TRUE,FALSE)

────────────────────────────────────────

Named Lambda

Ví dụ

DOUBLE(x)

SQUARE(x)

VAT(amount)

DISCOUNT(price,rate)

Sau khi đăng ký

=DOUBLE(A1)

=SQUARE(B2)

────────────────────────────────────────

Constant Name

PI = 3.1415926535

VAT = 0.08

DISCOUNT = 0.15

────────────────────────────────────────

Dynamic Named Range

OFFSET()

INDEX()

FILTER()

UNIQUE()

SORT()

SEQUENCE()

Dynamic Array Reference

────────────────────────────────────────

Built-in Names

Print_Area

Print_Titles

Database

Criteria

Extract

Sheet_Title

FilterDatabase

Auto_Open

Auto_Close

────────────────────────────────────────

Scope

Workbook Scope

Worksheet Scope

Private Scope

Global Scope

────────────────────────────────────────

Visibility

Visible

Hidden

VeryHidden

System

────────────────────────────────────────

Name Rules

• Phải bắt đầu bằng chữ cái, dấu gạch dưới (_) hoặc dấu gạch chéo ngược (\)
• Không được bắt đầu bằng số
• Không được trùng địa chỉ ô (ví dụ: A1, XFD10)
• Không chứa khoảng trắng
• Cho phép dấu chấm (.)
• Phân biệt Scope nhưng không phân biệt chữ hoa/thường trong cùng Scope
• Tối đa 255 ký tự
• Hỗ trợ Unicode

────────────────────────────────────────

Metadata

Name

Type

Scope

Formula

Reference

Comment

Category

Created Time

Modified Time

Owner

Visibility

UUID

Version

────────────────────────────────────────

Reference Types

Cell

Range

Worksheet

Workbook

External Workbook

Structured Reference

Dynamic Array

Lambda

Formula

────────────────────────────────────────

Lookup

Lookup By Name

Lookup By Scope

Lookup By Formula

Lookup By Reference

Lookup By Category

────────────────────────────────────────

Dependency

Name → Formula

Name → Range

Name → Lambda

Name → Workbook

Name → Sheet

Dependency Tracking

Dependency Update

────────────────────────────────────────

Validation

• Duplicate Name
• Invalid Name
• Invalid Scope
• Invalid Formula
• Invalid Lambda
• Invalid Reference
• Circular Named Formula
• Broken Reference

────────────────────────────────────────

Import / Export

XLSX

XLS

ODS

CSV Metadata

JSON

XML

OOXML Defined Names

────────────────────────────────────────

Cache

Name Cache

Scope Cache

Formula Cache

Reference Cache

Lookup Cache

────────────────────────────────────────

API

Initialize()

Create()

Update()

Rename()

Delete()

Find()

FindByScope()

FindByReference()

Resolve()

ResolveFormula()

ResolveLambda()

ResolveRange()

Exists()

Validate()

Import()

Export()

Serialize()

Deserialize()

ClearCache()

────────────────────────────────────────

Events

NameCreated

NameUpdated

NameDeleted

NameRenamed

ScopeChanged

FormulaChanged

ReferenceChanged

NameResolved

ImportCompleted

ExportCompleted

ValidationFailed

────────────────────────────────────────

Dependencies

• REFERENCE_ENGINE
• FORMULA_ENGINE
• LAMBDA_ENGINE
• FUNCTION_ENGINE
• DEPENDENCY_ENGINE
• VALIDATION_ENGINE
• CACHE_ENGINE
• SERIALIZATION_ENGINE
• OPENXML_FORMULA_ENGINE

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
• Hỗ trợ Workbook Scope và Worksheet Scope
• Hỗ trợ Named Range
• Hỗ trợ Named Formula
• Hỗ trợ Named Lambda
• Hỗ trợ Dynamic Named Range
• Hỗ trợ Built-in Names
• Hỗ trợ Unicode
• Hỗ trợ OOXML Defined Names
• Lookup hiệu năng O(1)
• Tự động cập nhật khi Sheet hoặc Workbook thay đổi
• Enterprise Ready
• Production Ready
