Mục tiêu

MULTITHREAD_ENGINE chịu trách nhiệm quản lý toàn bộ hệ thống tính toán đa luồng (Multi-threaded Calculation Engine) của OfficeX Excel.

Đây là Engine chuyên phân phối công việc tính toán giữa nhiều CPU Core nhằm tăng tốc Calculation Engine, hỗ trợ Workbook cực lớn với hàng triệu công thức.

Engine hoạt động tương đương Microsoft Excel Multi-threaded Calculation.

Không trực tiếp thực thi công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Workbook

↓

RECALC_ENGINE

↓

MULTITHREAD_ENGINE

↓

Task Scheduler

↓

Thread Pool

↓

Worker Threads

↓

CALCULATION_ENGINE

↓

Merge Result

────────────────────────────────────────

Chức năng chính

• Multi-thread Calculation

• Thread Pool Management

• Task Scheduler

• Job Queue

• Dependency-aware Scheduling

• Parallel Formula Evaluation

• Parallel Worksheet Calculation

• Parallel Workbook Calculation

• Dynamic Thread Allocation

• CPU Core Detection

• Load Balancing

• Background Worker

• Task Merge

• Task Synchronization

• Thread Statistics

• Cancellation

• Progress Reporting

────────────────────────────────────────

Core Components

Thread Pool

Worker Manager

Task Scheduler

Job Queue

Task Dispatcher

Dependency Scheduler

Load Balancer

Merge Engine

Synchronization Manager

CPU Monitor

Performance Monitor

────────────────────────────────────────

Worker Threads

Worker 1

Worker 2

Worker 3

Worker N

Auto Scale

Pinned Thread

Background Thread

────────────────────────────────────────

Calculation Tasks

Cell Calculation

Range Calculation

Worksheet Calculation

Workbook Calculation

Dynamic Array Calculation

Lookup Calculation

Financial Calculation

Statistics Calculation

Math Calculation

Engineering Calculation

────────────────────────────────────────

Scheduling Strategy

FIFO

Priority Queue

Dependency Graph

Topological Order

Critical Path

Round Robin

Work Stealing

Adaptive Scheduling

────────────────────────────────────────

Load Balancing

Equal Distribution

Dynamic Distribution

CPU Usage Monitoring

Memory-aware Distribution

Large Formula Split

Heavy Task Detection

Worker Migration

────────────────────────────────────────

Dependency-aware Scheduling

Independent Branch

↓

Run Parallel

Dependent Branch

↓

Wait Dependency

↓

Continue

────────────────────────────────────────

Task Types

Light Task

Normal Task

Heavy Task

Background Task

Async Task

System Task

Priority Task

────────────────────────────────────────

Execution Modes

Single Thread

Multi Thread

Automatic

Manual

Background

Async

Hybrid

────────────────────────────────────────

CPU Support

Single Core

Dual Core

Quad Core

8 Core

16 Core

32 Core

64 Core

Logical Processor

NUMA Ready

────────────────────────────────────────

Memory Management

Shared Memory

Local Buffer

Thread-local Cache

Memory Pool

Copy-on-Write

Zero Copy

Reference Counting

────────────────────────────────────────

Synchronization

Mutex

Spin Lock

Read Write Lock

Atomic Operation

Lock-free Queue

Barrier

Semaphore

Condition Variable

────────────────────────────────────────

Task Queue

Pending Queue

Ready Queue

Running Queue

Waiting Queue

Completed Queue

Cancelled Queue

Retry Queue

────────────────────────────────────────

Parallel Operations

Formula Evaluation

Dependency Resolution

Lookup

Dynamic Array

Sorting

Filtering

Aggregation

Statistics

Financial

Engineering

────────────────────────────────────────

Optimization

• Thread Pool Reuse

• Work Stealing

• Lock-free Queue

• SIMD Ready

• CPU Affinity

• Cache Friendly Scheduling

• NUMA Optimization

• Dynamic Scaling

• Incremental Scheduling

• Branch Parallelism

────────────────────────────────────────

Monitoring

CPU Usage

Core Usage

Worker Status

Queue Length

Task Latency

Execution Time

Average Throughput

Peak Throughput

Memory Usage

Thread Count

────────────────────────────────────────

Validation

• Invalid Thread

• Deadlock Detection

• Race Condition Detection

• Queue Overflow

• Invalid Task

• Invalid Dependency

• Thread Timeout

• Worker Failure

────────────────────────────────────────

API

Initialize()

CreateThreadPool()

DestroyThreadPool()

SubmitTask()

SubmitBatch()

Dispatch()

Execute()

Pause()

Resume()

Cancel()

Wait()

Synchronize()

MergeResult()

ResizeThreadPool()

GetWorkerStatus()

GetStatistics()

Optimize()

Shutdown()

────────────────────────────────────────

Events

ThreadPoolCreated

ThreadStarted

ThreadStopped

TaskSubmitted

TaskStarted

TaskCompleted

TaskCancelled

TaskFailed

WorkerBusy

WorkerIdle

DeadlockDetected

LoadBalanced

MergeCompleted

OptimizationCompleted

────────────────────────────────────────

Dependencies

• CALCULATION_ENGINE

• RECALC_ENGINE

• DEPENDENCY_ENGINE

• CALCULATION_CHAIN

• CACHE_ENGINE

• MEMORY_ENGINE

• PERFORMANCE_ENGINE

• VALIDATION_ENGINE

• ERROR_ENGINE

• ARRAY_ENGINE

• DYNAMIC_ARRAY_ENGINE

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

Thread Safety

• Lock-free Read

• Atomic Update

• Thread-safe Cache

• Thread-safe Formula Evaluation

• Concurrent Workbook Calculation

• Safe Memory Sharing

• Safe Task Scheduling

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365

• Hỗ trợ Multi-threaded Calculation

• Hỗ trợ Thread Pool

• Hỗ trợ Work Stealing Scheduler

• Hỗ trợ Dynamic Thread Scaling

• Hỗ trợ Dependency-aware Scheduling

• Hỗ trợ Lock-free Queue

• Hỗ trợ Background Calculation

• Hỗ trợ Async Calculation

• Hỗ trợ NUMA

• Hỗ trợ SIMD

• Hỗ trợ Workbook trên 10 triệu công thức

• Tự động phát hiện số CPU Core

• Tối ưu CPU Cache

• Enterprise Ready

• Production Ready
