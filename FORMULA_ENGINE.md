Mục tiêu

FORMULA_ENGINE chịu trách nhiệm quản lý toàn bộ công thức trong OfficeX Excel.

Đây là tầng trung gian giữa giao diện Excel và CALCULATION_ENGINE.

FORMULA_ENGINE chịu trách nhiệm:

• Nhập công thức
• Chỉnh sửa công thức
• Phân tích cú pháp công thức
• Xây dựng Formula AST
• Kiểm tra cú pháp
• Chuẩn hóa công thức
• Quản lý Formula Token
• Quản lý Formula Reference
• Quản lý Named Formula
• Quản lý Dynamic Array Formula
• Quản lý Array Formula
• Quản lý Shared Formula
• Quản lý Spill Formula
• Quản lý Structured Reference
• Quản lý Formula Metadata
• Chuyển đổi công thức giữa A1 và R1C1
• Theo dõi thay đổi công thức
• Thông báo CALCULATION_ENGINE khi công thức thay đổi

Các loại công thức

• A1 Formula
• R1C1 Formula
• Array Formula
• Dynamic Array Formula
• Shared Formula
• Named Formula
• Lambda Formula
• LET Formula
• Structured Reference Formula
• External Reference Formula
• Cross Workbook Formula
• Cross Sheet Formula
• Table Formula

Định dạng hỗ trợ

=A1+B1

=SUM(A1:A100)

=IF(A1>10,"YES","NO")

=XLOOKUP(...)

=FILTER(...)

=LAMBDA(...)

=LET(...)

Các thành phần chính

• Formula Input Manager
• Formula Editor
• Formula Validator
• Formula Parser
• Formula AST Builder
• Formula Reference Manager
• Formula Metadata Manager
• Formula Cache
• Formula Formatter
• Formula Serializer
• Formula Deserializer
• Formula History
• Formula Undo/Redo
• Formula Clipboard

API

Initialize()

CreateFormula()

EditFormula()

DeleteFormula()

Parse()

Validate()

Normalize()

BuildAST()

Serialize()

Deserialize()

ConvertA1ToR1C1()

ConvertR1C1ToA1()

UpdateReferences()

NotifyCalculation()

ClearCache()

Undo()

Redo()

Sự kiện

FormulaCreated

FormulaChanged

FormulaDeleted

FormulaParsed

FormulaValidated

FormulaError

FormulaNormalized

ReferenceChanged

ASTCreated

CalculationRequested

Lỗi hỗ trợ

Invalid Formula

Invalid Function

Invalid Reference

Circular Reference

Invalid Name

Invalid Token

Invalid Range

Spill Error

Parse Error

Syntax Error

Phụ thuộc

TOKENIZER_ENGINE

PARSER_ENGINE

AST_ENGINE

REFERENCE_ENGINE

NAME_MANAGER

FUNCTION_REGISTRY

ERROR_ENGINE

SERIALIZATION_ENGINE

CACHE_ENGINE

Không phụ thuộc

Ribbon

UI

Viewport

Render Engine

Printer

Mouse

Keyboard

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ hơn 600 hàm Excel
• Hỗ trợ Dynamic Arrays
• Hỗ trợ LET()
• Hỗ trợ LAMBDA()
• Hỗ trợ Structured References
• Hỗ trợ A1 và R1C1
• Hỗ trợ Cross Workbook Formula
• Hỗ trợ Shared Formula
• Hỗ trợ Spill Formula
• Formula Cache tốc độ cao
• Undo/Redo đầy đủ
• Enterprise Ready
• Production Ready
