Mục tiêu

GPU_CALC_ENGINE chịu trách nhiệm tăng tốc Calculation Engine bằng GPU (CUDA, DirectCompute, OpenCL, Vulkan Compute, Metal Compute) nhằm xử lý Workbook cực lớn với hàng triệu công thức và hàng tỷ phép tính.

Engine này không thay thế CALCULATION_ENGINE mà hoạt động như một Acceleration Layer, tự động quyết định phép tính nào nên chạy trên GPU và phép tính nào nên chạy trên CPU.

Hoàn toàn tương thích Microsoft Excel 365.

Không phụ thuộc giao diện người dùng.

────────────────────────────────────────

Kiến trúc

Workbook

↓

CALCULATION_ENGINE

↓

GPU_CALC_ENGINE

↓

GPU Scheduler

↓

Kernel Builder

↓

GPU Memory Manager

↓

GPU Driver

↓

CUDA / DirectCompute / OpenCL / Vulkan

↓

GPU

↓

Calculation Result

────────────────────────────────────────

Mục tiêu thiết kế

CPU

↓

Formula Parse

Dependency Graph

Calculation Chain

↓

GPU

↓

Massive Parallel Calculation

↓

Result

↓

CPU Merge

────────────────────────────────────────

Chức năng chính

• GPU Formula Execution

• Massive Parallel Calculation

• Matrix Computation

• Dynamic Array Acceleration

• Lookup Acceleration

• Statistics Acceleration

• Financial Acceleration

• Engineering Functions

• Math Functions

• Vector Processing

• SIMD Processing

• Batch Formula Execution

• GPU Scheduler

• GPU Memory Manager

• Kernel Compiler

• Kernel Cache

• GPU Profiling

────────────────────────────────────────

GPU Backends

CUDA

OpenCL

DirectCompute

Vulkan Compute

Metal Compute

CPU Fallback

────────────────────────────────────────

GPU Detection

Detect GPU

Detect VRAM

Detect Compute Capability

Detect CUDA

Detect OpenCL

Detect Vulkan

Detect Driver Version

Detect Device Count

────────────────────────────────────────

Supported Vendors

NVIDIA

AMD

Intel

Apple Silicon

Microsoft WARP (Fallback)

────────────────────────────────────────

GPU Tasks

Math Calculation

Statistics

Financial

Engineering

Dynamic Array

Matrix

Lookup

Sorting

Filtering

Aggregation

Reduction

Scan

Map

Vector Arithmetic

────────────────────────────────────────

Supported Functions

SUM()

AVERAGE()

COUNT()

MIN()

MAX()

PRODUCT()

SUMPRODUCT()

MMULT()

MDETERM()

MINVERSE()

FILTER()

SORT()

UNIQUE()

MAP()

SCAN()

REDUCE()

SEQUENCE()

RANDARRAY()

XLOOKUP()

XMATCH()

LINEST()

TREND()

FORECAST()

PMT()

PV()

IRR()

NPV()

────────────────────────────────────────

Parallel Execution

One Cell

↓

CPU

Large Array

↓

GPU

Matrix

↓

GPU

Lookup Millions Rows

↓

GPU

────────────────────────────────────────

Kernel Types

Math Kernel

Lookup Kernel

Statistics Kernel

Financial Kernel

Engineering Kernel

Matrix Kernel

Reduction Kernel

Scan Kernel

Sorting Kernel

Filtering Kernel

────────────────────────────────────────

GPU Scheduler

Task Queue

Kernel Queue

Priority Queue

Execution Queue

Completion Queue

Retry Queue

────────────────────────────────────────

Memory Management

VRAM Pool

Pinned Memory

Unified Memory

Host Buffer

Device Buffer

Memory Pool

Zero Copy

Shared Buffer

────────────────────────────────────────

Memory Transfer

CPU → GPU

GPU → CPU

GPU → GPU

Pinned Transfer

Async Transfer

Batch Transfer

Compression

────────────────────────────────────────

Kernel Cache

Compiled Kernel

Binary Cache

PTX Cache

Shader Cache

OpenCL Cache

Pipeline Cache

────────────────────────────────────────

Execution Modes

CPU Only

GPU Only

Hybrid

Automatic

Background

Async

────────────────────────────────────────

Optimization

• Massive Parallelism

• SIMD

• Warp Optimization

• Occupancy Optimization

• Shared Memory

• Constant Memory

• Texture Cache

• Kernel Fusion

• Batch Execution

• Lazy Transfer

• Zero Copy

• Async Execution

• Multi GPU

────────────────────────────────────────

Multi GPU

GPU 1

GPU 2

GPU N

Automatic Load Balance

Device Selection

Peer To Peer Copy

────────────────────────────────────────

Performance Monitoring

GPU Usage

VRAM Usage

Kernel Time

Transfer Time

Execution Time

Occupancy

Throughput

Bandwidth

Temperature

Power Usage

────────────────────────────────────────

Validation

• GPU Not Available

• Driver Not Installed

• VRAM Overflow

• Kernel Compilation Failed

• Device Lost

• Unsupported Instruction

• Timeout

• Invalid Kernel

• Invalid Memory

────────────────────────────────────────

Fallback Strategy

GPU Failure

↓

Retry

↓

CPU Calculation

↓

Merge Result

↓

Continue Workbook

────────────────────────────────────────

API

Initialize()

DetectGPU()

CreateContext()

CompileKernel()

LoadKernel()

ExecuteKernel()

UploadData()

DownloadData()

AllocateMemory()

ReleaseMemory()

Synchronize()

Cancel()

Flush()

GetGPUInfo()

GetStatistics()

Optimize()

Shutdown()

────────────────────────────────────────

Events

GPUDetected

GPUInitialized

KernelCompiled

KernelLoaded

KernelStarted

KernelCompleted

MemoryAllocated

MemoryReleased

TransferStarted

TransferCompleted

GPUCalculationStarted

GPUCalculationCompleted

GPUFallbackActivated

ValidationFailed

────────────────────────────────────────

Dependencies

• CALCULATION_ENGINE

• MULTITHREAD_ENGINE

• ARRAY_ENGINE

• DYNAMIC_ARRAY_ENGINE

• LOOKUP_ENGINE

• CACHE_ENGINE

• MEMORY_ENGINE

• PERFORMANCE_ENGINE

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

Enable GPU Acceleration

Enable CUDA

Enable OpenCL

Enable Vulkan Compute

Enable Multi GPU

Auto Select Device

GPU Memory Limit

Kernel Cache Size

Maximum Concurrent Kernels

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365

• Hỗ trợ NVIDIA CUDA

• Hỗ trợ AMD OpenCL

• Hỗ trợ Intel OpenCL

• Hỗ trợ DirectCompute

• Hỗ trợ Vulkan Compute

• Hỗ trợ Apple Metal

• Hỗ trợ Multi GPU

• Hỗ trợ Hybrid CPU + GPU

• Tự động chuyển sang CPU khi GPU lỗi

• Tối ưu Dynamic Arrays

• Tối ưu Matrix Calculation

• Tối ưu Statistics và Financial Functions

• Hỗ trợ Workbook trên 10 triệu công thức

• Hỗ trợ tính toán hàng tỷ phép toán song song

• Enterprise Ready

• Production Ready
