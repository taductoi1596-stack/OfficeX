Mục tiêu

RECALC_ENGINE chịu trách nhiệm quản lý toàn bộ quá trình Recalculation (tính toán lại) của OfficeX Excel.

Đây là Engine trung tâm quyết định khi nào một ô, một vùng hoặc toàn bộ Workbook cần được tính toán lại sau khi dữ liệu thay đổi.

Engine này triển khai cơ chế Dirty Cell, Dirty Range, Dependency Tracking, Incremental Recalculation và Smart Recalculation tương đương Microsoft Excel 365.

Không trực tiếp thực thi công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Workbook

↓

Cell Changed

↓

RECALC_ENGINE

↓

Dirty Manager

↓

Dependency Graph

↓

Calculation Chain

↓

CALCULATION_ENGINE

↓

Updated Result

────────────────────────────────────────

Chức năng chính

• Dirty Cell Management

• Dirty Range Management

• Smart Recalculation

• Incremental Recalculation

• Partial Recalculation

• Full Workbook Recalculation

• Dependency Tracking

• Change Propagation

• Calculation Scheduling

• Background Recalculation

• Parallel Recalculation

• Circular Reference Detection

• Recalc Statistics

• Recalc Queue

• Batch Update

────────────────────────────────────────

Các chế độ Recalculation

Automatic

Automatic Except Data Tables

Manual

Calculate Sheet

Calculate Workbook

Calculate Selection

Background Recalculation

────────────────────────────────────────

Dirty Objects

Dirty Cell

Dirty Range

Dirty Row

Dirty Column

Dirty Worksheet

Dirty Workbook

Dirty Table

Dirty Dynamic Array

Dirty Spill Range

Dirty Named Range

────────────────────────────────────────

Dirty Cell

Một ô được đánh dấu Dirty khi:

• Giá trị thay đổi

• Công thức thay đổi

• Định dạng ảnh hưởng công thức

• Named Range thay đổi

• External Workbook thay đổi

• Dynamic Array thay đổi

────────────────────────────────────────

Dirty Range

Một vùng được Dirty khi:

• Paste

• Delete

• Insert

• Fill

• Spill Resize

• Table Resize

• Sort

• Filter

────────────────────────────────────────

Incremental Recalculation

Chỉ tính lại:

Dirty Cell

↓

Các ô phụ thuộc

↓

Các ô phụ thuộc tiếp theo

↓

Hoàn thành

Không tính lại Workbook.

────────────────────────────────────────

Smart Recalculation

Ví dụ

A1 = 10

↓

B1=A1+1

↓

C1=B1+1

↓

Thay đổi A1

↓

Dirty:

A1

B1

C1

↓

Không tính lại các ô khác.

────────────────────────────────────────

Calculation Levels

Cell Level

Range Level

Worksheet Level

Workbook Level

Global Level

────────────────────────────────────────

Calculation Queue

Pending Queue

Ready Queue

Running Queue

Completed Queue

Failed Queue

Retry Queue

────────────────────────────────────────

Dependency Propagation

Cell Changed

↓

Dependency Graph

↓

Mark Dirty

↓

Calculation Queue

↓

Execute

↓

Clear Dirty Flag

────────────────────────────────────────

Batch Update

Suspend Calculation

Batch Edit

Mark Dirty

Resume Calculation

Incremental Recalculation

────────────────────────────────────────

Parallel Recalculation

Independent Branches

↓

Worker Thread 1

Worker Thread 2

Worker Thread 3

Worker Thread N

↓

Merge Result

────────────────────────────────────────

Background Recalculation

Low Priority

Idle CPU

Async Queue

Progress Reporting

Cancel Support

────────────────────────────────────────

Circular Reference

Detect Cycle

Iteration Mode

Maximum Iteration

Maximum Change

Convergence Detection

────────────────────────────────────────

Supported Triggers

Cell Edit

Formula Edit

Paste

Delete

Insert

Undo

Redo

Sort

Filter

Named Range Changed

Table Changed

Worksheet Changed

Workbook Changed

External Workbook Changed

Macro Update

API Update

────────────────────────────────────────

Optimization

• Dirty Cell Only

• Dirty Range Only

• Incremental Calculation

• Branch Pruning

• Parallel Scheduling

• Cache Reuse

• Dependency Pruning

• Topological Ordering

• Async Background Calculation

────────────────────────────────────────

Statistics

Dirty Cells

Dirty Ranges

Calculation Time

Queue Length

Average Recalc Time

Peak Recalc Time

Recalc Count

Thread Utilization

────────────────────────────────────────

Validation

• Circular Dependency

• Invalid Reference

• Invalid Dependency Graph

• Infinite Loop

• Invalid Dirty State

• Queue Corruption

────────────────────────────────────────

API

Initialize()

MarkDirty()

MarkDirtyCell()

MarkDirtyRange()

MarkDirtyWorksheet()

MarkDirtyWorkbook()

Recalculate()

RecalculateCell()

RecalculateRange()

RecalculateWorksheet()

RecalculateWorkbook()

SuspendCalculation()

ResumeCalculation()

CancelCalculation()

BuildQueue()

ClearDirty()

ClearQueue()

Statistics()

────────────────────────────────────────

Events

CellMarkedDirty

RangeMarkedDirty

WorksheetMarkedDirty

WorkbookMarkedDirty

RecalculationStarted

RecalculationCompleted

RecalculationCancelled

BackgroundCalculationStarted

BackgroundCalculationCompleted

CircularReferenceDetected

QueueBuilt

QueueFinished

────────────────────────────────────────

Dependencies

• CALCULATION_ENGINE

• DEPENDENCY_ENGINE

• CALCULATION_CHAIN

• CACHE_ENGINE

• FORMULA_ENGINE

• REFERENCE_ENGINE

• ARRAY_ENGINE

• DYNAMIC_ARRAY_ENGINE

• SPILL_ENGINE

• PERFORMANCE_ENGINE

• VALIDATION_ENGINE

• MEMORY_ENGINE

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

• Smart Recalculation

• Dirty Cell Management

• Dirty Range Management

• Incremental Recalculation

• Parallel Recalculation

• Background Recalculation

• Batch Update

• Circular Reference Detection

• Manual/Automatic Calculation Mode

• Recalculation Queue

• Hỗ trợ Workbook trên 10 triệu công thức

• Lock-Free Scheduling

• Multi-thread Safe

• Enterprise Ready

• Production Ready
