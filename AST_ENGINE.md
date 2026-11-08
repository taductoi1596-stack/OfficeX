Mục tiêu

AST_ENGINE chịu trách nhiệm quản lý toàn bộ Abstract Syntax Tree (AST) của công thức trong OfficeX Excel.

Đây là tầng trung gian giữa PARSER_ENGINE và EVALUATOR_ENGINE.

AST_ENGINE không trực tiếp phân tích cú pháp và không trực tiếp tính toán công thức.

Nhiệm vụ của Engine là lưu trữ, quản lý, tối ưu, clone, serialize và cung cấp Formula AST cho các Engine khác.

Tương thích hoàn toàn với Microsoft Excel 365.

Không phụ thuộc giao diện người dùng.

────────────────────────────────────────

Chức năng chính

• Tạo AST
• Quản lý AST
• Clone AST
• Copy AST
• Merge AST
• Split AST
• Xóa AST
• Cập nhật AST
• Chuẩn hóa AST
• Tối ưu AST
• Serialize AST
• Deserialize AST
• Validate AST
• So sánh AST
• Hash AST
• Cache AST
• Theo dõi thay đổi AST
• Version hóa AST

────────────────────────────────────────

Node Types

RootNode

FormulaNode

FunctionCallNode

UnaryExpressionNode

BinaryExpressionNode

ComparisonNode

LogicalNode

NumberNode

StringNode

BooleanNode

DateNode

ErrorNode

ReferenceNode

CellReferenceNode

RangeReferenceNode

SheetReferenceNode

WorkbookReferenceNode

StructuredReferenceNode

NamedRangeNode

ArrayNode

ArrayConstantNode

DynamicArrayNode

LambdaNode

LETNode

SpillNode

IntersectionNode

UnionNode

ParenthesisNode

────────────────────────────────────────

AST Structure

Formula

↓

Expression

↓

BinaryExpression

├── Left Node

├── Operator

└── Right Node

Ví dụ

=SUM(A1:A10)+100

AST

Root

└── BinaryExpression(+)

     ├── FunctionCall(SUM)

     │      └── Range(A1:A10)

     └── Number(100)

────────────────────────────────────────

Supported Formula

Arithmetic Formula

Logical Formula

Comparison Formula

Reference Formula

Array Formula

Dynamic Array Formula

Structured Reference

Named Range

Lambda Formula

LET Formula

Spill Formula

External Workbook Formula

────────────────────────────────────────

AST Operations

Create

Clone

Copy

Move

Merge

Split

Replace Node

Insert Node

Delete Node

Normalize

Optimize

Hash

Compare

Serialize

Deserialize

────────────────────────────────────────

Tree Traversal

Depth First Search

Breadth First Search

Pre-order

Post-order

In-order

Reverse Traversal

────────────────────────────────────────

Optimization

• Constant Folding
• Dead Node Removal
• Expression Simplification
• Node Reuse
• Tree Flattening
• Tree Compression
• Duplicate Node Elimination
• Immutable Node Sharing

────────────────────────────────────────

Validation

• Invalid Node
• Invalid Parent
• Invalid Child
• Invalid Tree
• Circular Node
• Missing Root
• Missing Expression
• Invalid Function Node
• Invalid Reference Node

────────────────────────────────────────

Cache

• AST Cache
• Node Cache
• Tree Cache
• Hash Cache
• Serialization Cache

────────────────────────────────────────

Serialization

JSON

Binary

OpenXML

Internal Binary Format

────────────────────────────────────────

Versioning

AST Version

Node Version

Formula Version

History Snapshot

Undo Snapshot

Redo Snapshot

────────────────────────────────────────

API

Initialize()

CreateTree()

DestroyTree()

CloneTree()

CloneNode()

InsertNode()

RemoveNode()

ReplaceNode()

MoveNode()

FindNode()

FindParent()

FindChildren()

Traverse()

Normalize()

Optimize()

Validate()

Serialize()

Deserialize()

Compare()

Hash()

ClearCache()

────────────────────────────────────────

Events

TreeCreated

TreeUpdated

TreeDeleted

NodeInserted

NodeRemoved

NodeReplaced

TreeOptimized

TreeValidated

TreeSerialized

TreeDeserialized

────────────────────────────────────────

Dependencies

• PARSER_ENGINE
• TOKENIZER_ENGINE
• CACHE_ENGINE
• VALIDATION_ENGINE
• SERIALIZATION_ENGINE

────────────────────────────────────────

Không phụ thuộc

• Ribbon
• UI
• Calculation Engine
• Evaluator Engine
• Function Engine
• Workbook Engine
• Render Engine
• Viewport
• Printer
• Mouse
• Keyboard

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ toàn bộ Formula AST
• Hỗ trợ Dynamic Arrays
• Hỗ trợ LET()
• Hỗ trợ LAMBDA()
• Hỗ trợ Structured Reference
• Hỗ trợ Named Range
• Hỗ trợ External Workbook
• Hỗ trợ Spill Operator (#)
• Hỗ trợ Implicit Intersection (@)
• Hỗ trợ Immutable AST
• Hỗ trợ AST Versioning
• Hỗ trợ Incremental AST Update
• Hỗ trợ Serialization
• Hỗ trợ Constant Folding
• Hiệu năng O(n)
• Enterprise Ready
• Production Ready
