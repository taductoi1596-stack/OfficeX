Mục tiêu

ARRAY_ENGINE chịu trách nhiệm quản lý và thực thi toàn bộ Array Formula, Dynamic Array và Spill Range trong OfficeX Excel.

Engine này triển khai hành vi tương thích với Microsoft Excel 365, bao gồm các công thức trả về nhiều giá trị, cơ chế Spill và các hàm Dynamic Array.

Không trực tiếp quản lý giao diện người dùng.

Không phụ thuộc Ribbon hoặc UI.

Chức năng chính

• Thực thi Array Formula
• Thực thi Dynamic Array Formula
• Quản lý Spill Range
• Tự động mở rộng Spill
• Tự động thu nhỏ Spill
• Phát hiện Spill Conflict
• Hỗ trợ Legacy Array Formula
• Hỗ trợ CSE Formula (Ctrl+Shift+Enter)
• Hỗ trợ Dynamic Array Functions
• Hỗ trợ Nested Arrays
• Hỗ trợ Array Constants
• Hỗ trợ Multi-Dimensional Array
• Hỗ trợ Implicit Intersection
• Hỗ trợ Explicit Spill Operator (#)
• Theo dõi Spill Dependency
• Đồng bộ Spill Range
• Tự động cập nhật khi dữ liệu thay đổi
• Tối ưu bộ nhớ cho Array lớn
• Hỗ trợ Incremental Recalculation

Loại Array

• Legacy Array Formula
• Dynamic Array Formula
• Constant Array
• Horizontal Array
• Vertical Array
• Two-Dimensional Array
• Nested Array
• Spill Array
• Lambda Array
• Generated Array

Dynamic Array Functions

• FILTER
• SORT
• SORTBY
• UNIQUE
• SEQUENCE
• RANDARRAY
• TAKE
• DROP
• CHOOSECOLS
• CHOOSEROWS
• TOCOL
• TOROW
• WRAPROWS
• WRAPCOLS
• HSTACK
• VSTACK
• EXPAND
• MAKEARRAY
• MAP
• REDUCE
• SCAN
• BYROW
• BYCOL

Spill Range

• Tạo Spill Range
• Mở rộng Spill Range
• Thu hẹp Spill Range
• Xóa Spill Range
• Đồng bộ Spill Range
• Theo dõi Spill Dependency
• Kiểm tra vùng trống
• Phát hiện xung đột Spill

Array Constant

Ví dụ:

={1,2,3}

={1;2;3}

={1,2;3,4}

={TRUE,FALSE}

={"A","B","C"}

Implicit Intersection

• Hỗ trợ toán tử @
• Tương thích Excel cũ
• Chuyển đổi Legacy Formula

Explicit Spill

• Hỗ trợ toán tử #

Ví dụ:

=A1#

=FILTER(A1:A100,B1:B100>0)#

Array Operations

• Create
• Resize
• Expand
• Shrink
• Merge
• Split
• Copy
• Move
• Delete
• Refresh
• Validate

Spill Errors

• #SPILL!
• Blocked Spill
• Unknown Spill Size
• Spill Into Table
• Spill Out Of Bounds
• Circular Spill
• Memory Overflow

Array Cache

• Spill Cache
• Array Cache
• Dynamic Cache
• Result Cache

API

Initialize()

CreateArray()

CreateDynamicArray()

CreateLegacyArray()

CreateSpill()

ExpandSpill()

ShrinkSpill()

DeleteSpill()

Refresh()

Validate()

Calculate()

Update()

Copy()

Move()

Merge()

Split()

GetArray()

GetSpill()

GetRange()

ClearCache()

Events

ArrayCreated

ArrayUpdated

ArrayDeleted

DynamicArrayCreated

SpillCreated

SpillExpanded

SpillShrunk

SpillDeleted

SpillConflictDetected

ArrayCalculated

ArrayRefreshed

Validation

• Kiểm tra Spill Range hợp lệ
• Kiểm tra Blocked Spill
• Kiểm tra Circular Spill
• Kiểm tra Array Dimension
• Kiểm tra Array Type
• Kiểm tra Memory Limit
• Kiểm tra Workbook Boundary

Phụ thuộc

• CALCULATION_ENGINE
• FUNCTION_ENGINE
• DEPENDENCY_ENGINE
• SPILL_ENGINE
• REFERENCE_ENGINE
• CACHE_ENGINE
• MEMORY_ENGINE
• VALIDATION_ENGINE
• SERIALIZATION_ENGINE

Không phụ thuộc

• Ribbon
• UI
• Viewport
• Render Engine
• Printer
• Mouse
• Keyboard

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ Dynamic Arrays đầy đủ
• Hỗ trợ Legacy Array Formula
• Hỗ trợ Spill Range
• Hỗ trợ Implicit Intersection (@)
• Hỗ trợ Spill Operator (#)
• Hỗ trợ Array Constant
• Hỗ trợ Multi-Dimensional Array
• Hỗ trợ Incremental Recalculation
• Tối ưu hiệu năng cho Array lớn
• Enterprise Ready
• Production Ready
