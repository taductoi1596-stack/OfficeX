# CALCULATION_ENGINE.md

Điều phối toàn bộ quá trình tính toán trong OfficeX Excel.

Là Core Engine chịu trách nhiệm thực thi mọi công thức, hàm và biểu thức trong Workbook.

Không có giao diện người dùng.

Không phụ thuộc Ribbon hoặc UI.

Chịu trách nhiệm:

- Tính toán công thức (Formula Evaluation)
- Thực thi hơn 600 hàm Excel
- Quản lý Dependency Graph
- Quản lý Calculation Chain
- Recalculate tự động
- Recalculate thủ công
- Recalculate theo Sheet
- Recalculate theo Range
- Recalculate theo Cell
- Dynamic Array
- Spill Range
- Circular Reference Detection
- Iterative Calculation
- Multi-thread Calculation
- GPU Acceleration (nếu khả dụng)
- Formula Cache
- Dependency Cache
- Error Propagation
- Cross Sheet Calculation
- Cross Workbook Calculation
- Named Range Evaluation
- LAMBDA
- LET
- Volatile Functions
- Precision Control
- Incremental Calculation

Các nhóm hàm phải hỗ trợ:

- Math
- Logical
- Lookup & Reference
- Text
- Date & Time
- Statistical
- Financial
- Engineering
- Database
- Information
- Dynamic Arrays

Các hàm tiêu biểu:

SUM
AVERAGE
COUNT
MAX
MIN
IF
IFS
AND
OR
NOT
XLOOKUP
XMATCH
INDEX
MATCH
FILTER
SORT
UNIQUE
SEQUENCE
LET
LAMBDA
TEXTJOIN
CONCAT
LEFT
RIGHT
MID
LEN
TODAY
NOW
DATE
TIME
NETWORKDAYS
WORKDAY
PMT
NPV
IRR
RAND
RANDBETWEEN

API chính:

Initialize()
Calculate()
Recalculate()
CalculateCell()
CalculateRange()
CalculateWorksheet()
CalculateWorkbook()
RegisterFunction()
UnregisterFunction()
ClearCache()
GetDependencies()
SetCalculationMode()
EnableParallel()
DisableParallel()

Các chế độ tính toán:

Automatic
Automatic Except Data Tables
Manual
Partial
Background

Các lỗi phải hỗ trợ:

#DIV/0!
#N/A
#NAME?
#NULL!
#NUM!
#REF!
#VALUE!
#SPILL!
#CALC!
#FIELD!
#BLOCKED!

Sự kiện:

CalculationStarted
CalculationFinished
CalculationCancelled
CellCalculated
FormulaChanged
DependencyUpdated
CircularReferenceDetected
SpillCreated
CalculationError

Phụ thuộc:

FORMULA_ENGINE
FUNCTION_ENGINE
DEPENDENCY_ENGINE
CELL_ENGINE
WORKBOOK_ENGINE
SHEET_ENGINE
NAME_MANAGER
CACHE_ENGINE
MEMORY_ENGINE
THREAD_ENGINE
PARSER_ENGINE
TOKENIZER_ENGINE
EXPRESSION_ENGINE

Không phụ thuộc:

Ribbon
UI
Viewport
Render Engine
Printer
Mouse
Keyboard

Yêu cầu:

- Tương thích Microsoft Excel 365
- Hỗ trợ Dynamic Arrays
- Hỗ trợ LAMBDA và LET
- Hỗ trợ Circular Reference
- Hỗ trợ Incremental Recalculation
- Hỗ trợ Multi-thread Calculation
- Hỗ trợ GPU Acceleration
- Hỗ trợ Workbook lớn (1.048.576 hàng × 16.384 cột)
- Tối ưu hiệu năng với Formula Cache và Dependency Cache
- Enterprise Ready
- Production Ready
