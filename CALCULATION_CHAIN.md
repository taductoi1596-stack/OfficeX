Mục tiêu

CALCULATION_CHAIN chịu trách nhiệm xây dựng, tối ưu và quản lý thứ tự tính toán của toàn bộ Workbook trong OfficeX Excel.

Engine này nhận Dependency Graph từ DEPENDENCY_ENGINE và tạo ra chuỗi tính toán tối ưu để CALCULATION_ENGINE thực thi.

Không trực tiếp tính toán công thức.

Không phụ thuộc giao diện người dùng.

Chức năng chính

• Xây dựng Calculation Chain
• Cập nhật Calculation Chain
• Xóa Calculation Chain
• Tái tạo Calculation Chain
• Tối ưu thứ tự tính toán
• Sắp xếp Dependency
• Hỗ trợ Incremental Recalculation
• Hỗ trợ Dirty Cell
• Hỗ trợ Dirty Range
• Hỗ trợ Dirty Worksheet
• Hỗ trợ Dirty Workbook
• Hỗ trợ Dynamic Array
• Hỗ trợ Spill Range
• Hỗ trợ Array Formula
• Hỗ trợ Shared Formula
• Hỗ trợ Named Range
• Hỗ trợ External Workbook
• Hỗ trợ Multi-thread Scheduling
• Hỗ trợ Parallel Execution
• Hỗ trợ Background Calculation

Đối tượng quản lý

• Workbook
• Worksheet
• Cell
• Range
• Formula
• Dynamic Array
• Spill Range
• Named Range
• Table
• PivotTable
• External Link

Thành phần chính

• Chain Builder
• Chain Optimizer
• Chain Scheduler
• Dirty Chain Manager
• Dependency Resolver
• Incremental Chain Builder
• Parallel Scheduler
• Background Queue
• Chain Cache
• Execution Queue

Thuật toán

• Topological Sort
• DAG Traversal
• Breadth First Search
• Depth First Search
• Incremental Graph Update
• Parallel Scheduling
• Priority Queue
• Dependency Resolution
• Lazy Evaluation

Quản lý Dirty

• Dirty Cell
• Dirty Range
• Dirty Sheet
• Dirty Workbook
• Dirty Dependency Tree
• Dirty Formula
• Dirty Dynamic Array

Parallel Execution

• Independent Branch Detection
• Thread Scheduling
• Thread Pool
• Worker Queue
• CPU Core Balancing
• GPU Ready Scheduling

Calculation Priority

• Critical Formula
• User Edited Formula
• Visible Worksheet
• Background Worksheet
• External Workbook
• Volatile Function
• Dynamic Array
• Spill Range

Calculation Queue

• Pending
• Ready
• Running
• Waiting
• Completed
• Failed
• Cancelled

Incremental Recalculation

• Chỉ tính lại Cell bị ảnh hưởng
• Không tính lại toàn Workbook
• Tự động cập nhật Chain
• Tối ưu hiệu năng

Calculation Cache

• Chain Cache
• Dirty Cache
• Queue Cache
• Schedule Cache

API

Initialize()

BuildChain()

RebuildChain()

OptimizeChain()

UpdateChain()

ClearChain()

GenerateQueue()

Schedule()

ExecuteNext()

MarkDirty()

ClearDirty()

Pause()

Resume()

Cancel()

ExportChain()

ImportChain()

ClearCache()

GetChain()

GetQueue()

GetStatus()

Events

ChainCreated

ChainUpdated

ChainOptimized

ChainCleared

QueueGenerated

CalculationStarted

CalculationPaused

CalculationResumed

CalculationCompleted

CalculationCancelled

DirtyDetected

DependencyChanged

Validation

• Kiểm tra Chain hợp lệ
• Kiểm tra Circular Reference
• Kiểm tra Queue Integrity
• Kiểm tra Dependency
• Kiểm tra Duplicate Node
• Kiểm tra Execution Order

Phụ thuộc

• DEPENDENCY_ENGINE
• CALCULATION_ENGINE
• CACHE_ENGINE
• THREAD_ENGINE
• MEMORY_ENGINE
• PERFORMANCE_ENGINE
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
• FUNCTION_ENGINE
• FORMULA_ENGINE

Yêu cầu

• Hỗ trợ Workbook rất lớn
• Hỗ trợ hơn 1.048.576 hàng
• Hỗ trợ 16.384 cột
• Hỗ trợ Multi-thread Calculation
• Hỗ trợ Parallel Scheduling
• Hỗ trợ Incremental Recalculation
• Hỗ trợ Dynamic Array
• Hỗ trợ Spill Range
• Hỗ trợ Background Calculation
• Tối ưu tốc độ tính toán
• Tương thích Microsoft Excel 365
• Enterprise Ready
• Production Ready
