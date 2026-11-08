Mục tiêu

PIVOT_ENGINE chịu trách nhiệm xây dựng, quản lý, tính toán và cập nhật Pivot Table của OfficeX Excel.

Engine này cung cấp toàn bộ khả năng phân tích dữ liệu đa chiều tương đương Microsoft Excel PivotTable, bao gồm Pivot Cache, Grouping, Calculated Field, Calculated Item, Drill Down, Filter, Sort, Slicer, Timeline và Refresh Data.

Đây là một Data Analysis Engine.

Không trực tiếp thực thi Formula Engine.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Workbook

↓

Worksheet

↓

Data Source

↓

PIVOT_ENGINE

↓

Pivot Cache

↓

Aggregation Engine

↓

Grouping Engine

↓

Filter Engine

↓

Sort Engine

↓

Pivot Renderer

↓

Worksheet

────────────────────────────────────────

Mục tiêu thiết kế

Raw Data

↓

Pivot Cache

↓

Aggregation

↓

Grouping

↓

Sorting

↓

Filtering

↓

Pivot Table

↓

Visualization

────────────────────────────────────────

Chức năng chính

• Pivot Table
• Pivot Cache
• Pivot Refresh
• Data Aggregation
• Grouping
• Sorting
• Filtering
• Calculated Field
• Calculated Item
• Multiple Consolidation Range
• Pivot Drill Down
• Expand / Collapse
• Pivot Layout
• Pivot Formatting
• Pivot Refresh All
• Pivot Statistics
• Pivot Validation

────────────────────────────────────────

Pivot Components

Pivot Cache
Pivot Table
Pivot Field
Pivot Item
Pivot Cell
Pivot Area
Pivot Header
Pivot Grand Total
Pivot Subtotal
Pivot Data Body

────────────────────────────────────────

Field Types

Row Field
Column Field
Value Field
Filter Field
Page Field
Calculated Field
Calculated Item
Hidden Field

────────────────────────────────────────

Supported Aggregations

SUM
COUNT
COUNTA
AVERAGE
MIN
MAX
PRODUCT
MEDIAN
MODE
VAR
VARP
STDEV
STDEVP
DISTINCT COUNT
CUSTOM AGGREGATE

────────────────────────────────────────

Grouping

Date Group
Year
Quarter
Month
Week
Day
Hour
Minute
Second
Number Group
Text Group
Manual Group
Custom Group

────────────────────────────────────────

Filtering

Label Filter
Value Filter
Date Filter
Top 10
Bottom 10
Between
Equals
Contains
Begins With
Ends With
Custom Filter

────────────────────────────────────────

Sorting

Ascending
Descending
By Label
By Value
Manual
Custom Order

────────────────────────────────────────

Calculated Field

Formula Support
Arithmetic
Logical
Reference Other Fields
Aggregation Formula
Dynamic Calculation

────────────────────────────────────────

Calculated Item

Custom Item
Reference Existing Items
Custom Aggregation
Dynamic Evaluation

────────────────────────────────────────

Pivot Cache

Create Cache
Refresh Cache
Update Cache
Reuse Cache
Shared Cache
Compressed Cache
Incremental Cache

────────────────────────────────────────

Refresh

Refresh Pivot
Refresh Cache
Refresh Workbook
Auto Refresh
Manual Refresh
Incremental Refresh
Background Refresh

────────────────────────────────────────

Drill Features

Drill Down
Drill Up
Expand
Collapse
Expand All
Collapse All
Show Detail
Hide Detail

────────────────────────────────────────

Layout Modes

Compact Form
Outline Form
Tabular Form
Classic Pivot
Repeat Item Labels
Merge Labels

────────────────────────────────────────

Formatting

Pivot Style
Custom Style
Number Format
Conditional Format
Subtotal Style
Grand Total Style
Alternate Row
Alternate Column

────────────────────────────────────────

Slicer Support

Slicer Connection
Multiple Slicer
Cross Filter
Slicer Cache
Slicer Refresh

────────────────────────────────────────

Timeline Support

Year
Quarter
Month
Week
Day
Timeline Cache

────────────────────────────────────────

Supported Data Sources

Worksheet Range
Excel Table
Named Range
Power Query Output
External Workbook
CSV
Database
SQL Server
MySQL
PostgreSQL
SQLite
ODBC
OData
JSON
XML
REST API

────────────────────────────────────────

Validation

Missing Field
Duplicate Field
Invalid Aggregation
Broken Cache
Invalid Group
Circular Reference
Missing Source
Invalid Formula

────────────────────────────────────────

Optimization

• Incremental Refresh
• Shared Pivot Cache
• Lazy Aggregation
• Parallel Aggregation
• Background Refresh
• Memory Compression
• Dictionary Encoding
• Cache Reuse
• Vectorized Aggregation
• Multi-thread Calculation

────────────────────────────────────────

Memory Management

Pivot Cache Pool
Aggregation Cache
Dictionary Cache
Group Cache
Filter Cache
Shared Buffer
Memory Compression

────────────────────────────────────────

API

Initialize()
CreatePivot()
DeletePivot()
Refresh()
RefreshAll()
CreateCache()
LoadCache()
SaveCache()
AddField()
RemoveField()
MoveField()
AddCalculatedField()
AddCalculatedItem()
Group()
Ungroup()
Sort()
Filter()
Expand()
Collapse()
DrillDown()
DrillUp()
Validate()
Export()
Import()
Shutdown()

────────────────────────────────────────

Events

PivotCreated
PivotDeleted
CacheCreated
CacheLoaded
RefreshStarted
RefreshCompleted
GroupingCompleted
SortingCompleted
FilteringCompleted
CalculatedFieldAdded
CalculatedItemAdded
ValidationPassed
ValidationFailed

────────────────────────────────────────

Dependencies

• TABLE_ENGINE
• RANGE_ENGINE
• CELL_ENGINE
• FORMULA_ENGINE
• FUNCTION_ENGINE
• CALCULATION_ENGINE
• CACHE_ENGINE
• MEMORY_ENGINE
• SERIALIZATION_ENGINE
• IMPORT_ENGINE
• EXPORT_ENGINE
• VALIDATION_ENGINE

────────────────────────────────────────

Không phụ thuộc

• Ribbon
• UI
• Viewport
• Printer
• Mouse
• Keyboard

────────────────────────────────────────

Cấu hình

Enable Shared Cache
Enable Background Refresh
Enable Parallel Aggregation
Enable Incremental Refresh
Enable Calculated Fields
Enable Calculated Items
Enable Slicer
Enable Timeline
Enable Memory Compression

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ đầy đủ PivotTable
• Hỗ trợ Pivot Cache
• Hỗ trợ Calculated Field
• Hỗ trợ Calculated Item
• Hỗ trợ Drill Down / Drill Up
• Hỗ trợ Slicer và Timeline
• Hỗ trợ Refresh tự động
• Hỗ trợ nhiều nguồn dữ liệu
• Hỗ trợ hàng trăm triệu bản ghi thông qua Cache
• Multi-thread Safe
• Enterprise Ready
• Production Ready
