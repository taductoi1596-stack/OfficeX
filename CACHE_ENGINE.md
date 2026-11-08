Mục tiêu

CACHE_ENGINE chịu trách nhiệm quản lý toàn bộ bộ nhớ đệm (Cache) của hệ thống Calculation Engine trong OfficeX Excel.

Đây là Engine trung tâm giúp giảm số lần tính toán lặp lại, tăng tốc độ thực thi công thức và tối ưu hiệu năng khi làm việc với Workbook lớn.

Engine này không trực tiếp tính toán công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Workbook

↓

CALCULATION_ENGINE

↓

CACHE_ENGINE

↓

Formula Cache

↓

Result Cache

↓

Dependency Cache

↓

Memory Cache

────────────────────────────────────────

Chức năng chính

• Formula Cache

• Result Cache

• Calculation Cache

• Expression Cache

• Function Cache

• Reference Cache

• Dependency Cache

• Lookup Cache

• Array Cache

• Dynamic Array Cache

• Spill Cache

• Lambda Cache

• Workbook Cache

• Worksheet Cache

• Metadata Cache

• Serialization Cache

• Memory Pool

• Cache Statistics

• Cache Optimization

────────────────────────────────────────

Các loại Cache

Formula Cache

Calculation Cache

Result Cache

Expression Cache

Function Cache

Reference Cache

Dependency Cache

Named Range Cache

Lookup Cache

Dynamic Array Cache

Spill Cache

Lambda Cache

Date Cache

Text Cache

Math Cache

Statistics Cache

Financial Cache

Engineering Cache

Information Cache

Workbook Cache

Worksheet Cache

Cell Cache

Style Cache

Format Cache

Metadata Cache

────────────────────────────────────────

Formula Cache

Lưu AST của công thức

Ví dụ

=SUM(A1:A100)

↓

Parse một lần

↓

AST được lưu

↓

Các lần sau dùng lại

────────────────────────────────────────

Calculation Cache

Lưu kết quả tính toán

Ví dụ

SUM(A1:A100)

↓

1000

↓

Không tính lại nếu dữ liệu không đổi

────────────────────────────────────────

Expression Cache

Lưu kết quả biểu thức

Ví dụ

A1+B1

A1*B1

SIN(A1)

EXP(B2)

────────────────────────────────────────

Function Cache

Cache từng hàm

SUM()

AVERAGE()

VLOOKUP()

XLOOKUP()

FILTER()

UNIQUE()

SORT()

TEXTJOIN()

────────────────────────────────────────

Lookup Cache

Lookup Result

Lookup Index

Hash Table

Binary Search Index

────────────────────────────────────────

Reference Cache

Resolved Cell

Resolved Range

Resolved Workbook

Resolved Sheet

Resolved Table

Resolved Named Range

────────────────────────────────────────

Dependency Cache

Dependency Graph

Calculation Chain

Dirty Cell

Dirty Range

────────────────────────────────────────

Dynamic Array Cache

Dynamic Array Result

Spill Range

Array Shape

Lambda Result

────────────────────────────────────────

Workbook Cache

Workbook Metadata

Workbook Properties

Sheet Index

Shared Strings

Defined Names

────────────────────────────────────────

Worksheet Cache

Used Range

Column Width

Row Height

Hidden State

Protection State

────────────────────────────────────────

Metadata Cache

Cell Format

Style

Conditional Format

Comment

Hyperlink

Validation

────────────────────────────────────────

Memory Management

Memory Pool

Arena Allocator

Reference Counting

Shared Buffer

Copy On Write

Zero Copy

Lazy Allocation

Memory Compression

────────────────────────────────────────

Cache Policy

LRU

LFU

Adaptive Cache

Time To Live

Auto Cleanup

Manual Cleanup

Memory Threshold

────────────────────────────────────────

Cache Invalidation

Workbook Changed

Worksheet Changed

Cell Changed

Formula Changed

Named Range Changed

Reference Changed

Dynamic Array Changed

Spill Changed

Style Changed

External Workbook Changed

────────────────────────────────────────

Incremental Update

Dirty Cell

↓

Dirty Range

↓

Affected Formula

↓

Update Cache

↓

Recalculate

────────────────────────────────────────

Performance

Cache Hit

Cache Miss

Hit Ratio

Eviction Count

Memory Usage

Peak Memory

Average Lookup Time

────────────────────────────────────────

Optimization

• Zero Copy Cache

• Copy On Write

• Incremental Cache Update

• Parallel Cache Build

• SIMD Ready

• Lock Free Cache

• Shared Cache

• Multi-thread Cache

────────────────────────────────────────

Validation

• Invalid Cache

• Corrupted Cache

• Expired Cache

• Invalid Formula

• Invalid Reference

• Memory Overflow

• Cache Collision

────────────────────────────────────────

API

Initialize()

Get()

Put()

Update()

Remove()

Contains()

Invalidate()

InvalidateCell()

InvalidateRange()

InvalidateWorkbook()

InvalidateWorksheet()

Clear()

ClearFormulaCache()

ClearCalculationCache()

ClearReferenceCache()

ClearLookupCache()

ClearArrayCache()

Optimize()

CollectGarbage()

Statistics()

────────────────────────────────────────

Events

CacheCreated

CacheHit

CacheMiss

CacheUpdated

CacheRemoved

CacheInvalidated

CacheEvicted

MemoryLow

MemoryRecovered

OptimizationCompleted

────────────────────────────────────────

Dependencies

• CALCULATION_ENGINE

• FORMULA_ENGINE

• REFERENCE_ENGINE

• DEPENDENCY_ENGINE

• LOOKUP_ENGINE

• ARRAY_ENGINE

• DYNAMIC_ARRAY_ENGINE

• SPILL_ENGINE

• MEMORY_ENGINE

• PERFORMANCE_ENGINE

• VALIDATION_ENGINE

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

• Formula Cache tốc độ O(1)

• Calculation Cache tốc độ O(1)

• Lookup Cache tốc độ O(1)

• Dynamic Array Cache

• Spill Cache

• Incremental Cache Update

• Multi-thread Safe

• Lock-Free Read

• Memory Pool

• Copy-On-Write

• Zero Copy Buffer

• Hỗ trợ Workbook trên 10 triệu công thức

• Tự động Garbage Collection

• Tự động Cache Eviction

• Thống kê Cache Hit/Miss theo thời gian thực

• Enterprise Ready

• Production Ready
