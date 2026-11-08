Mục tiêu

SPILL_ENGINE chịu trách nhiệm quản lý toàn bộ Spill Range, Spill Reference và Spill Error trong OfficeX Excel.

Đây là Engine chuyên xử lý cơ chế Dynamic Array Spill của Microsoft Excel 365.

Engine này không trực tiếp tính toán công thức mà quản lý vùng kết quả được "tràn" từ Dynamic Array.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Chức năng chính

• Tạo Spill Range
• Mở rộng Spill Range
• Thu nhỏ Spill Range
• Xóa Spill Range
• Cập nhật Spill Range
• Theo dõi Spill Dependency
• Quản lý Spill Reference
• Quản lý Spill Owner
• Phát hiện Spill Conflict
• Phát hiện Spill Error
• Resolve Spill Reference (#)
• Kiểm tra vùng trống
• Đồng bộ Spill khi dữ liệu thay đổi
• Tự động Re-Spill
• Cache Spill
• Serialize Spill

────────────────────────────────────────

Đối tượng quản lý

• Spill Range
• Spill Owner
• Spill Cell
• Dynamic Array
• Array Formula
• Spill Reference
• Spill Dependency

────────────────────────────────────────

Spill Sources

FILTER()

UNIQUE()

SORT()

SORTBY()

SEQUENCE()

RANDARRAY()

TAKE()

DROP()

TOCOL()

TOROW()

WRAPROWS()

WRAPCOLS()

CHOOSECOLS()

CHOOSEROWS()

HSTACK()

VSTACK()

MAKEARRAY()

MAP()

REDUCE()

SCAN()

BYROW()

BYCOL()

LAMBDA()

────────────────────────────────────────

Spill Range

Ví dụ

A1#

A1:C10

D5:H20

Entire Spill Area

────────────────────────────────────────

Spill Owner

Ô chứa công thức Dynamic Array.

Ví dụ

A1

=FILTER(...)

A1 là Spill Owner.

Các ô A2:A100 chỉ là Spill Result.

────────────────────────────────────────

Spill Reference

Ví dụ

=A1#

=SUM(A1#)

=ROWS(A1#)

=COLUMNS(A1#)

────────────────────────────────────────

Spill Operations

Create

Expand

Shrink

Move

Copy

Delete

Refresh

Resolve

Merge

Split

Validate

────────────────────────────────────────

Spill Errors

#SPILL!

Nguyên nhân

• Ô bị chặn
• Có dữ liệu trong vùng Spill
• Merge Cell
• Spill vượt giới hạn Sheet
• Spill vào Table
• Không xác định kích thước
• Circular Spill
• Bộ nhớ không đủ

────────────────────────────────────────

Spill Validation

• Empty Target Area
• Worksheet Boundary
• Table Conflict
• Merge Cell Conflict
• Hidden Object Conflict
• Protection Conflict
• Circular Dependency
• Memory Availability

────────────────────────────────────────

Dynamic Resize

Data tăng

↓

Spill tự mở rộng

Data giảm

↓

Spill tự thu nhỏ

Formula thay đổi

↓

Re-Spill

────────────────────────────────────────

Dependency

Spill Owner

↓

Spill Range

↓

Dependent Formula

↓

Calculation Engine

────────────────────────────────────────

Cache

Spill Cache

Range Cache

Owner Cache

Reference Cache

Dependency Cache

────────────────────────────────────────

Optimization

• Incremental Spill Update
• Partial Spill Refresh
• Cached Spill Resolution
• Lazy Spill Expansion
• Fast Range Lookup
• Zero Copy Spill Mapping

────────────────────────────────────────

Validation

• Invalid Spill
• Invalid Owner
• Invalid Reference
• Invalid Dynamic Array
• Circular Spill
• Out Of Worksheet
• Protected Sheet
• Table Conflict
• Merge Conflict
• Duplicate Spill

────────────────────────────────────────

API

Initialize()

CreateSpill()

DeleteSpill()

ResizeSpill()

Expand()

Shrink()

Refresh()

Resolve()

ResolveReference()

FindOwner()

FindRange()

Validate()

Move()

Copy()

Merge()

Split()

ClearCache()

────────────────────────────────────────

Events

SpillCreated

SpillExpanded

SpillShrunk

SpillDeleted

SpillRefreshed

SpillReferenceResolved

SpillConflictDetected

SpillValidationFailed

DynamicArrayUpdated

────────────────────────────────────────

Dependencies

• ARRAY_ENGINE
• DYNAMIC_ARRAY_ENGINE
• REFERENCE_ENGINE
• CALCULATION_ENGINE
• DEPENDENCY_ENGINE
• CACHE_ENGINE
• VALIDATION_ENGINE
• ERROR_ENGINE
• MEMORY_ENGINE

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
• Hỗ trợ toàn bộ Dynamic Array Spill
• Hỗ trợ Spill Operator (#)
• Hỗ trợ Automatic Re-Spill
• Hỗ trợ Spill Error Detection
• Hỗ trợ Spill Reference
• Hỗ trợ Incremental Spill Update
• Hỗ trợ Dynamic Resize
• Hỗ trợ Workbook lớn
• Lookup Spill O(1)
• Enterprise Ready
• Production Ready
