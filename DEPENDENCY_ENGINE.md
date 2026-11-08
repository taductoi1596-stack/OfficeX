Mục tiêu

DEPENDENCY_ENGINE chịu trách nhiệm xây dựng, duy trì và quản lý Dependency Graph trong OfficeX Excel.

Engine này theo dõi mọi mối quan hệ giữa ô, vùng dữ liệu, bảng, Named Range, Sheet và Workbook.

Đây là nền tảng để CALCULATION_ENGINE thực hiện Incremental Recalculation nhanh và chính xác.

Không thực hiện tính toán công thức.

Không phụ thuộc giao diện người dùng.

Chức năng chính

• Xây dựng Dependency Graph
• Cập nhật Dependency Graph
• Xóa Dependency
• Thêm Dependency
• Theo dõi Cell Dependency
• Theo dõi Range Dependency
• Theo dõi Sheet Dependency
• Theo dõi Workbook Dependency
• Theo dõi Named Range Dependency
• Theo dõi Table Dependency
• Theo dõi Dynamic Array Dependency
• Theo dõi Spill Dependency
• Theo dõi External Workbook Dependency
• Theo dõi Structured Reference
• Theo dõi Lambda Dependency
• Theo dõi Custom Function Dependency
• Phát hiện Circular Reference
• Xác định Dirty Cell
• Xác định Dirty Range
• Xác định Dirty Sheet
• Xác định Dirty Workbook
• Sinh Calculation Chain
• Hỗ trợ Incremental Update
• Hỗ trợ Dependency Cache

Đối tượng theo dõi

• Cell
• Range
• Worksheet
• Workbook
• Named Range
• Table
• PivotTable
• Chart Data
• Dynamic Array
• Spill Range
• Formula
• Custom Function
• External Link

Các loại Dependency

• Direct Dependency
• Indirect Dependency
• Parent Dependency
• Child Dependency
• Cross Sheet Dependency
• Cross Workbook Dependency
• Dynamic Array Dependency
• Spill Dependency
• Named Range Dependency
• Structured Reference Dependency
• External Data Dependency

Dependency Graph

• Directed Graph (DAG)
• Node = Cell / Range / Object
• Edge = Dependency
• Root Node
• Leaf Node

Thuật toán

• Topological Sort
• Cycle Detection
• Depth First Search (DFS)
• Breadth First Search (BFS)
• Strongly Connected Components
• Incremental Graph Update

Circular Reference

• Detect Circular Reference
• Highlight Circular Path
• Return Circular Chain
• Hỗ trợ Iterative Calculation
• Giới hạn số vòng lặp
• Ngưỡng sai số hội tụ

Dirty Tracking

• Dirty Cell
• Dirty Range
• Dirty Worksheet
• Dirty Workbook
• Dirty Dependency Tree

Cache

• Dependency Cache
• Graph Cache
• Node Cache
• Edge Cache

API

Initialize()

BuildGraph()

RebuildGraph()

UpdateGraph()

ClearGraph()

AddNode()

RemoveNode()

AddDependency()

RemoveDependency()

UpdateDependency()

FindDependencies()

FindDependents()

GetParents()

GetChildren()

GetNode()

GetEdge()

MarkDirty()

ClearDirty()

DetectCircularReference()

TopologicalSort()

GenerateCalculationChain()

ExportGraph()

ImportGraph()

ClearCache()

Events

GraphInitialized

GraphBuilt

GraphUpdated

NodeAdded

NodeRemoved

DependencyAdded

DependencyRemoved

DirtyMarked

DirtyCleared

CircularReferenceDetected

CalculationChainGenerated

GraphCleared

Validation

• Không cho phép Dependency trùng lặp
• Kiểm tra Node hợp lệ
• Kiểm tra Edge hợp lệ
• Kiểm tra Graph Integrity
• Kiểm tra Circular Reference
• Kiểm tra External Link
• Kiểm tra Named Range

Phụ thuộc

• FORMULA_ENGINE
• REFERENCE_ENGINE
• NAME_MANAGER
• CACHE_ENGINE
• VALIDATION_ENGINE
• CALCULATION_CHAIN
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

Yêu cầu

• Hỗ trợ hơn 17 tỷ ô trên nhiều Workbook
• Hỗ trợ Cross Workbook Dependency
• Hỗ trợ Dynamic Array
• Hỗ trợ Spill Range
• Hỗ trợ Structured Reference
• Hỗ trợ Incremental Graph Update
• Hỗ trợ Topological Sort
• Hỗ trợ Cycle Detection
• Hỗ trợ Dependency Cache
• Tối ưu bộ nhớ cho Workbook rất lớn
• Tương thích Microsoft Excel 365
• Enterprise Ready
• Production Ready
