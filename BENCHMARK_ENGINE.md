Mục tiêu

BENCHMARK_ENGINE chịu trách nhiệm đo lường, đánh giá và so sánh hiệu năng của toàn bộ Calculation Engine trong OfficeX Excel.

Engine này cung cấp bộ Benchmark chuẩn để đánh giá tốc độ tính toán, khả năng mở rộng, mức sử dụng CPU, GPU, RAM và khả năng xử lý Workbook cực lớn, đồng thời so sánh kết quả với Microsoft Excel 365 và các phiên bản OfficeX trước đó.

Engine này không trực tiếp thực thi công thức trong môi trường sản xuất.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Benchmark Suite

↓

BENCHMARK_ENGINE

↓

Benchmark Runner

↓

Scenario Generator

↓

Measurement Engine

↓

Statistics Collector

↓

Comparison Engine

↓

Benchmark Report

────────────────────────────────────────

Mục tiêu thiết kế

Benchmark Case

↓

Execute

↓

Collect Metrics

↓

Analyze

↓

Compare

↓

Generate Report

────────────────────────────────────────

Chức năng chính

• Formula Benchmark
• Function Benchmark
• Workbook Benchmark
• Worksheet Benchmark
• Dynamic Array Benchmark
• Lookup Benchmark
• Matrix Benchmark
• Financial Benchmark
• Statistics Benchmark
• Engineering Benchmark
• Thread Benchmark
• GPU Benchmark
• Cache Benchmark
• Memory Benchmark
• IO Benchmark
• Regression Benchmark
• Compatibility Benchmark

────────────────────────────────────────

Benchmark Categories

Formula
Function
Calculation
Dependency
Reference
Lookup
Dynamic Array
Lambda
Memory
GPU
CPU
Thread
Cache
Serialization
Import
Export

────────────────────────────────────────

Formula Benchmark

Arithmetic Formula
Logical Formula
Nested Formula
Large Formula
Complex Formula
Recursive Formula

────────────────────────────────────────

Function Benchmark

SUM()
AVERAGE()
COUNT()
IF()
XLOOKUP()
INDEX()
MATCH()
FILTER()
SORT()
UNIQUE()
LET()
LAMBDA()
MMULT()
PMT()
TEXT()
TODAY()
RAND()

────────────────────────────────────────

Workbook Benchmark

Small Workbook
Medium Workbook
Large Workbook
Huge Workbook
Enterprise Workbook

────────────────────────────────────────

Worksheet Benchmark

1 Worksheet
10 Worksheets
100 Worksheets
1000 Worksheets

────────────────────────────────────────

Cell Benchmark

1 Cell
100 Cells
1,000 Cells
100,000 Cells
1,000,000 Cells
10,000,000 Cells

────────────────────────────────────────

Dynamic Array Benchmark

FILTER()
SORT()
UNIQUE()
SORTBY()
SEQUENCE()
RANDARRAY()
TAKE()
DROP()
MAP()
SCAN()
REDUCE()

────────────────────────────────────────

Lookup Benchmark

XLOOKUP
VLOOKUP
HLOOKUP
INDEX + MATCH
XMATCH
Binary Search
Linear Search

────────────────────────────────────────

Matrix Benchmark

MMULT
MINVERSE
MDETERM
Matrix Addition
Matrix Multiplication
Large Matrix

────────────────────────────────────────

Performance Metrics

Execution Time
Average Time
Maximum Time
Minimum Time
Median Time
P95 Time
P99 Time
Throughput
Latency
CPU Usage
GPU Usage
RAM Usage
VRAM Usage
Cache Hit Ratio
Thread Utilization
Memory Bandwidth

────────────────────────────────────────

Scalability Test

10 Cells
100 Cells
1,000 Cells
10,000 Cells
100,000 Cells
1 Million Cells
10 Million Cells
100 Million Cells

────────────────────────────────────────

Thread Benchmark

Single Thread
Dual Thread
Quad Thread
8 Threads
16 Threads
32 Threads
Automatic Scaling

────────────────────────────────────────

GPU Benchmark

CUDA
OpenCL
DirectCompute
Vulkan Compute
Hybrid CPU + GPU
GPU Fallback

────────────────────────────────────────

Memory Benchmark

Allocation Speed
Release Speed
Pool Efficiency
Fragmentation
Peak Memory
Compression Ratio

────────────────────────────────────────

Cache Benchmark

Formula Cache
Calculation Cache
Lookup Cache
AST Cache
Dependency Cache
Named Range Cache

────────────────────────────────────────

Stress Benchmark

Large Workbook
Massive Lookup
Large Dynamic Arrays
Deep Dependency Graph
Heavy Financial Calculation
Heavy Matrix Calculation

────────────────────────────────────────

Regression Benchmark

Current Version

↓

Previous Version

↓

Compare

↓

Performance Delta

────────────────────────────────────────

Compatibility Benchmark

Microsoft Excel 365
OfficeX Previous Release
LibreOffice Calc
Apache OpenOffice

────────────────────────────────────────

Benchmark Reports

Summary
Execution Statistics
Performance Charts
CPU Statistics
GPU Statistics
Memory Statistics
Cache Statistics
Comparison Result
Scalability Result
Optimization Suggestions

────────────────────────────────────────

Export Formats

JSON
CSV
XML
HTML
Markdown
PDF

────────────────────────────────────────

Optimization Suggestions

Enable Cache
Enable GPU
Enable Multi-thread
Optimize Formula
Reduce Dependency
Optimize Lookup
Optimize Dynamic Array
Optimize Memory Pool

────────────────────────────────────────

Automation

Nightly Benchmark
CI/CD Benchmark
Release Benchmark
Regression Benchmark
Scheduled Benchmark
Continuous Benchmark

────────────────────────────────────────

Optimization

• Parallel Benchmark Execution
• Incremental Benchmark
• Cached Benchmark Data
• Adaptive Sampling
• Background Benchmark
• Distributed Benchmark

────────────────────────────────────────

Cache

Benchmark Cache
Scenario Cache
Statistics Cache
Workbook Cache
Formula Cache

────────────────────────────────────────

API

Initialize()
RunBenchmark()
RunWorkbookBenchmark()
RunWorksheetBenchmark()
RunFormulaBenchmark()
RunFunctionBenchmark()
RunMemoryBenchmark()
RunCacheBenchmark()
RunThreadBenchmark()
RunGPUBenchmark()
RunStressBenchmark()
RunRegressionBenchmark()
CompareResults()
GenerateReport()
ExportReport()
ClearResults()
Shutdown()

────────────────────────────────────────

Events

BenchmarkStarted
BenchmarkCompleted
ScenarioStarted
ScenarioCompleted
WorkbookBenchmarked
FormulaBenchmarked
MemoryBenchmarked
GPUBenchmarked
RegressionCompared
PerformanceImproved
PerformanceDegraded
ReportGenerated

────────────────────────────────────────

Dependencies

• CALCULATION_ENGINE
• PERFORMANCE_ENGINE
• PROFILING_ENGINE
• MEMORY_ENGINE
• CACHE_ENGINE
• MULTITHREAD_ENGINE
• GPU_CALC_ENGINE
• DYNAMIC_ARRAY_ENGINE
• LOOKUP_ENGINE
• VALIDATION_ENGINE
• TEST_ENGINE
• DIAGNOSTICS_ENGINE

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

Enable Automatic Benchmark
Enable Regression Benchmark
Enable GPU Benchmark
Enable Thread Benchmark
Enable Stress Benchmark
Enable Memory Benchmark
Enable Cache Benchmark
Enable Scheduled Benchmark
Enable Performance Comparison

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365
• Benchmark hơn 600 hàm Excel
• Benchmark Workbook lên tới 10 triệu công thức
• Hỗ trợ CPU Benchmark
• Hỗ trợ GPU Benchmark
• Hỗ trợ Multi-thread Benchmark
• Hỗ trợ Dynamic Array Benchmark
• Hỗ trợ Lookup Benchmark
• Hỗ trợ Regression Benchmark
• So sánh hiệu năng giữa các phiên bản
• Xuất báo cáo nhiều định dạng
• Tích hợp CI/CD
• Multi-thread Safe
• Enterprise Ready
• Production Ready
