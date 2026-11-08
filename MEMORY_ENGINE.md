Mục tiêu

MEMORY_ENGINE chịu trách nhiệm quản lý toàn bộ bộ nhớ của Calculation Engine trong OfficeX Excel.

Đây là Engine trung tâm quản lý RAM, VRAM, Memory Pool, Object Lifetime, Shared Buffer và Garbage Collection nhằm đảm bảo Calculation Engine có thể xử lý Workbook cực lớn với hàng chục triệu ô mà không bị tràn bộ nhớ.

Engine này không trực tiếp tính toán công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Workbook

↓

CALCULATION_ENGINE

↓

MEMORY_ENGINE

↓

Memory Manager

↓

Memory Pool

↓

Buffer Manager

↓

Allocator

↓

Operating System

────────────────────────────────────────

Mục tiêu thiết kế

Workbook

↓

Objects

↓

Memory Pool

↓

Reference Manager

↓

Cache

↓

Garbage Collection

↓

Memory Release

────────────────────────────────────────

Chức năng chính

• Memory Allocation

• Memory Deallocation

• Memory Pool

• Arena Allocator

• Slab Allocator

• Buffer Manager

• Shared Memory

• Copy-on-Write

• Zero Copy Buffer

• Object Lifetime

• Reference Counting

• Smart Pointer

• Memory Compression

• Virtual Memory

• Memory Mapping

• Garbage Collection

• Leak Detection

• Memory Profiling

• Memory Statistics

────────────────────────────────────────

Memory Objects

Workbook

Worksheet

Cell

Range

Formula

AST

Dependency Graph

Calculation Chain

Dynamic Array

Spill Range

Lookup Cache

Style

Format

Comment

Hyperlink

Named Range

Lambda

Table

Chart

Pivot

────────────────────────────────────────

Memory Regions

Stack

Heap

Memory Pool

Shared Pool

Thread Local Storage

GPU Memory

Mapped Memory

Temporary Memory

Persistent Memory

────────────────────────────────────────

Memory Pool

Formula Pool

Cell Pool

AST Pool

Array Pool

String Pool

Object Pool

Cache Pool

Metadata Pool

Shared Pool

────────────────────────────────────────

Allocation Strategy

Arena Allocation

Slab Allocation

Buddy Allocation

Best Fit

First Fit

Pool Allocation

Linear Allocation

Fixed Block Allocation

────────────────────────────────────────

Reference Management

Reference Counting

Weak Reference

Shared Reference

Unique Reference

Object Ownership

Lifetime Tracking

────────────────────────────────────────

Buffer Management

Shared Buffer

Immutable Buffer

Resizable Buffer

Circular Buffer

Pinned Buffer

Zero Copy Buffer

GPU Buffer

────────────────────────────────────────

Copy Strategy

Deep Copy

Shallow Copy

Copy-on-Write

Move Semantics

Reference Sharing

────────────────────────────────────────

Memory Compression

Workbook Compression

Formula Compression

String Compression

Cache Compression

Metadata Compression

────────────────────────────────────────

Virtual Memory

Memory Mapping

Paging

Large Workbook Support

Out-of-Core Processing

Disk Buffer

────────────────────────────────────────

Garbage Collection

Automatic Cleanup

Reference Scan

Unused Object Detection

Cycle Detection

Deferred Cleanup

Background Cleanup

Manual Cleanup

────────────────────────────────────────

Leak Detection

Memory Leak

Buffer Leak

Reference Leak

Object Leak

Pool Leak

Cache Leak

────────────────────────────────────────

Optimization

• Memory Pool Reuse

• Object Reuse

• Zero Copy

• Copy-on-Write

• Shared Memory

• Lazy Allocation

• Lazy Loading

• Incremental Cleanup

• Background Garbage Collection

• Cache-aware Allocation

• NUMA Optimization

────────────────────────────────────────

Memory Statistics

Allocated Memory

Free Memory

Peak Memory

Current Usage

Fragmentation

Object Count

Pool Usage

GC Count

GC Time

Memory Bandwidth

────────────────────────────────────────

Monitoring

RAM Usage

Virtual Memory

Swap Usage

GPU Memory

Pool Usage

Fragmentation

Leak Status

Allocation Rate

────────────────────────────────────────

Validation

• Memory Overflow

• Out Of Memory

• Invalid Pointer

• Double Free

• Use After Free

• Memory Corruption

• Invalid Buffer

• Invalid Allocation

• Leak Detected

────────────────────────────────────────

API

Initialize()

Allocate()

AllocatePool()

AllocateBuffer()

Reallocate()

Free()

Release()

Acquire()

Retain()

Clone()

Move()

Compress()

MapMemory()

UnmapMemory()

CollectGarbage()

DetectLeak()

Optimize()

Statistics()

Shutdown()

────────────────────────────────────────

Events

MemoryAllocated

MemoryReleased

PoolCreated

PoolDestroyed

BufferCreated

BufferReleased

GarbageCollectionStarted

GarbageCollectionCompleted

MemoryCompressed

MemoryExpanded

LeakDetected

MemoryOverflow

OptimizationCompleted

────────────────────────────────────────

Dependencies

• CACHE_ENGINE

• CALCULATION_ENGINE

• ARRAY_ENGINE

• DYNAMIC_ARRAY_ENGINE

• GPU_CALC_ENGINE

• MULTITHREAD_ENGINE

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

Initial Memory Pool Size

Maximum Memory Pool Size

Enable Shared Memory

Enable Copy-on-Write

Enable Memory Compression

Enable Background GC

Enable Leak Detection

Enable Memory Mapping

Enable NUMA Optimization

Enable GPU Shared Memory

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365

• Hỗ trợ Workbook trên 10 triệu công thức

• Hỗ trợ Workbook trên 100 triệu ô

• Memory Pool tốc độ cao

• Zero Copy Buffer

• Copy-on-Write

• Shared Memory

• Automatic Garbage Collection

• Leak Detection

• Fragmentation Optimization

• Virtual Memory Support

• GPU Shared Memory

• Multi-thread Safe

• Lock-Free Allocation (Read)

• NUMA Aware

• Enterprise Ready

• Production Ready
