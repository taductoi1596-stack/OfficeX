Mục tiêu

PROFILING_ENGINE chịu trách nhiệm đo lường, phân tích và ghi nhận hiệu năng thực thi của từng công thức, hàm, vùng dữ liệu, Worksheet và Workbook trong OfficeX Excel.

Engine này cung cấp khả năng Formula Profiling tương tự Performance Analyzer của Microsoft Excel, giúp xác định chính xác công thức chậm, hàm tốn tài nguyên, Dependency Graph phức tạp và các điểm nghẽn (Bottleneck) trong Calculation Engine.

Engine này chỉ thu thập và phân tích dữ liệu thực thi.

Không trực tiếp tính toán công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Workbook

↓

Calculation Engine

↓

PROFILING_ENGINE

↓

Runtime Collector

↓

Profiler

↓

Performance Analyzer

↓

Statistics Database

↓

Report Generator

────────────────────────────────────────

Mục tiêu thiết kế

Formula

↓

Execute

↓

Collect Runtime

↓

Analyze

↓

Statistics

↓

Optimization Report

────────────────────────────────────────

Chức năng chính

• Formula Profiling

• Function Profiling

• Workbook Profiling

• Worksheet Profiling

• Range Profiling

• Cell Profiling

• Dynamic Array Profiling

• Lookup Profiling

• Dependency Profiling

• Thread Profiling

• Memory Profiling

• GPU Profiling

• Cache Profiling

• IO Profiling

• Benchmark Recording

• Timeline Recording

• Runtime Statistics

────────────────────────────────────────

Profiler Modules

Runtime Collector

Execution Timer

Statistics Collector

Memory Sampler

CPU Sampler

GPU Sampler

Dependency Profiler

Cache Profiler

Timeline Recorder

Hotspot Analyzer

Report Generator

────────────────────────────────────────

Profiling Targets

Workbook

Worksheet

Table

Pivot Table

Named Range

Formula

Cell

Range

Dynamic Array

Lambda

Lookup

Matrix

Function

Calculation Chain

────────────────────────────────────────

Runtime Metrics

Execution Time

CPU Time

GPU Time

Wall Time

Idle Time

Memory Usage

Peak Memory

VRAM Usage

Cache Hits

Cache Misses

Dependency Depth

Thread Count

Queue Time

Synchronization Time

────────────────────────────────────────

Formula Metrics

Formula Length

Formula Complexity

Operator Count

Function Count

Nested Depth

Reference Count

Dependency Count

Execution Count

Average Time

Maximum Time

Minimum Time

────────────────────────────────────────

Function Metrics

Function Name

Call Count

Average Duration

Maximum Duration

Minimum Duration

Memory Allocation

CPU Usage

GPU Usage

Failure Count

────────────────────────────────────────

Dependency Metrics

Dependency Depth

Dependency Width

Graph Complexity

Circular Dependency

Longest Chain

Most Referenced Cell

────────────────────────────────────────

Dynamic Array Metrics

Spill Size

Resize Count

Expansion Time

Memory Consumption

Calculation Time

────────────────────────────────────────

Lookup Metrics

Lookup Size

Lookup Time

Cache Hit Ratio

Cache Miss Ratio

Binary Search Count

Linear Search Count

────────────────────────────────────────

Memory Metrics

Heap Usage

Pool Usage

Fragmentation

Allocation Count

Allocation Size

Garbage Collection Time

Leak Warning

────────────────────────────────────────

Thread Metrics

Worker Count

Thread Usage

CPU Core Usage

Synchronization Delay

Queue Wait Time

Deadlock Detection

────────────────────────────────────────

GPU Metrics

GPU Usage

Kernel Time

Transfer Time

VRAM Usage

Occupancy

Fallback Count

────────────────────────────────────────

Timeline Recording

Calculation Start

↓

Formula Execution

↓

Dependency Update

↓

Cache Update

↓

Calculation Finish

────────────────────────────────────────

Hotspot Detection

Slow Formula

Heavy Lookup

Large Spill

Deep Dependency

Large Matrix

Memory Intensive Formula

Frequent Recalculation

────────────────────────────────────────

Reports

Workbook Performance Report

Worksheet Performance Report

Formula Report

Function Report

Memory Report

GPU Report

CPU Report

Cache Report

Dependency Report

Timeline Report

────────────────────────────────────────

Export Formats

JSON

CSV

XML

HTML

Markdown

Binary Profile

────────────────────────────────────────

Optimization Suggestions

Simplify Formula

Reduce Dependencies

Replace Volatile Function

Optimize Lookup

Reduce Nested Functions

Convert to Dynamic Array

Enable Cache

Enable Parallel Calculation

Move to GPU

────────────────────────────────────────

Optimization

• Low-overhead Sampling

• Incremental Profiling

• Background Profiling

• Parallel Statistics Collection

• Cached Metrics

• Adaptive Sampling

• Timeline Compression

────────────────────────────────────────

Cache

Profile Cache

Statistics Cache

Timeline Cache

Memory Cache

Formula Cache

────────────────────────────────────────

API

Initialize()

StartProfiling()

StopProfiling()

PauseProfiling()

ResumeProfiling()

ProfileWorkbook()

ProfileWorksheet()

ProfileFormula()

ProfileFunction()

CollectMetrics()

GenerateReport()

ExportReport()

ClearStatistics()

Reset()

Shutdown()

────────────────────────────────────────

Events

ProfilingStarted

ProfilingStopped

FormulaProfiled

FunctionProfiled

WorkbookProfiled

WorksheetProfiled

HotspotDetected

MemoryWarning

PerformanceWarning

TimelineRecorded

ReportGenerated

────────────────────────────────────────

Dependencies

• CALCULATION_ENGINE

• PERFORMANCE_ENGINE

• MULTITHREAD_ENGINE

• GPU_CALC_ENGINE

• MEMORY_ENGINE

• CACHE_ENGINE

• DEPENDENCY_ENGINE

• DYNAMIC_ARRAY_ENGINE

• LOOKUP_ENGINE

• VALIDATION_ENGINE

• ERROR_ENGINE

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

Cấu hình

Enable Formula Profiling

Enable Function Profiling

Enable Timeline Recording

Enable Memory Profiling

Enable GPU Profiling

Enable Thread Profiling

Enable Background Profiling

Enable Adaptive Sampling

Enable Auto Report

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365

• Đo hiệu năng từng công thức và từng hàm

• Ghi nhận CPU, GPU, RAM, VRAM

• Phân tích Dependency Graph

• Phát hiện Hotspot và Bottleneck

• Xuất báo cáo chi tiết nhiều định dạng

• Hỗ trợ Profiling thời gian thực

• Hỗ trợ Workbook trên 10 triệu công thức

• Multi-thread Safe

• Enterprise Ready

• Production Ready
