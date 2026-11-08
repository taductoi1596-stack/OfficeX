Mục tiêu

DIAGNOSTICS_ENGINE chịu trách nhiệm chẩn đoán, phân tích và xác định nguyên nhân gây lỗi trong toàn bộ Calculation Engine của OfficeX Excel.

Engine này giúp lập trình viên, hệ thống AI và người dùng doanh nghiệp nhanh chóng xác định công thức lỗi, dependency lỗi, bottleneck, circular reference, lỗi dữ liệu và các vấn đề ảnh hưởng đến quá trình tính toán.

Đây là Engine phân tích và chẩn đoán.

Không trực tiếp thực thi công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Workbook

↓

Calculation Engine

↓

DIAGNOSTICS_ENGINE

↓

Diagnostic Analyzer

↓

Issue Detector

↓

Root Cause Analyzer

↓

Diagnostic Report

────────────────────────────────────────

Mục tiêu thiết kế

Workbook

↓

Collect Runtime Data

↓

Analyze

↓

Detect Issue

↓

Find Root Cause

↓

Generate Report

↓

Optimization Suggestion

────────────────────────────────────────

Chức năng chính

• Formula Diagnostics

• Calculation Diagnostics

• Dependency Diagnostics

• Reference Diagnostics

• Circular Reference Diagnostics

• Dynamic Array Diagnostics

• Spill Diagnostics

• Lookup Diagnostics

• Cache Diagnostics

• Memory Diagnostics

• Thread Diagnostics

• GPU Diagnostics

• Performance Diagnostics

• Workbook Health Check

• Formula Health Check

• Automatic Root Cause Analysis

• Diagnostic Report

────────────────────────────────────────

Diagnostic Modules

Formula Analyzer

Dependency Analyzer

Reference Analyzer

Memory Analyzer

Cache Analyzer

Performance Analyzer

GPU Analyzer

Thread Analyzer

Workbook Analyzer

Statistics Analyzer

Integrity Checker

Health Checker

────────────────────────────────────────

Formula Diagnostics

Syntax Error

Semantic Error

Invalid Function

Invalid Parameter

Invalid Reference

Invalid Range

Invalid Array

Invalid Lambda

────────────────────────────────────────

Dependency Diagnostics

Broken Dependency

Missing Dependency

Circular Dependency

Long Dependency Chain

Dependency Loop

Unused Dependency

────────────────────────────────────────

Reference Diagnostics

Broken Cell

Broken Range

Broken Sheet

Broken Workbook

Broken Table

Broken Named Range

Broken External Link

────────────────────────────────────────

Dynamic Array Diagnostics

Invalid Spill

Spill Blocked

Shape Mismatch

Array Overflow

Dynamic Resize Failure

────────────────────────────────────────

Lookup Diagnostics

Lookup Failure

Missing Key

Duplicate Key

Slow Lookup

Index Corruption

Lookup Cache Miss

────────────────────────────────────────

Calculation Diagnostics

Calculation Failure

Calculation Timeout

Partial Calculation

Dirty Cell Not Updated

Dirty Range Not Updated

Calculation Queue Error

────────────────────────────────────────

Performance Diagnostics

Slow Formula

Slow Worksheet

Slow Workbook

Large Array

Expensive Function

CPU Bottleneck

GPU Bottleneck

Memory Bottleneck

────────────────────────────────────────

Memory Diagnostics

Memory Leak

Memory Overflow

Fragmentation

Invalid Allocation

Dangling Pointer

Pool Exhausted

────────────────────────────────────────

Cache Diagnostics

Low Hit Rate

Cache Overflow

Cache Corruption

Cache Miss

Invalid Cache Entry

────────────────────────────────────────

Thread Diagnostics

Deadlock

Race Condition

Worker Timeout

Thread Starvation

Synchronization Failure

────────────────────────────────────────

GPU Diagnostics

GPU Not Available

GPU Driver Error

Kernel Failure

VRAM Overflow

Fallback To CPU

────────────────────────────────────────

Workbook Health Check

Workbook Integrity

Worksheet Integrity

Formula Integrity

Calculation Chain Integrity

Dependency Integrity

Metadata Integrity

External Link Integrity

────────────────────────────────────────

Health Levels

Healthy

Minor Warning

Warning

Serious Issue

Critical

Corrupted

────────────────────────────────────────

Root Cause Analysis

Formula Error

↓

Reference Error

↓

Dependency Error

↓

Memory Issue

↓

Performance Issue

↓

Generate Root Cause

────────────────────────────────────────

Supported Error Types

#NULL!

#DIV/0!

#VALUE!

#REF!

#NAME?

#NUM!

#N/A

#SPILL!

#CALC!

#FIELD!

#BLOCKED!

#CONNECT!

#GETTING_DATA

────────────────────────────────────────

Diagnostic Reports

Workbook Summary

Worksheet Summary

Formula Summary

Dependency Summary

Performance Summary

Memory Summary

Cache Summary

Optimization Suggestions

────────────────────────────────────────

Automatic Suggestions

Repair Formula

Repair Reference

Rebuild Dependency Graph

Rebuild Calculation Chain

Clear Cache

Optimize Formula

Optimize Lookup

Optimize Dynamic Array

────────────────────────────────────────

Optimization

• Incremental Diagnostics

• Background Diagnostics

• Parallel Diagnostics

• Cached Analysis

• Lazy Diagnostics

• Streaming Diagnostics

• Automatic Health Check

────────────────────────────────────────

Cache

Diagnostic Cache

Formula Analysis Cache

Dependency Cache

Health Cache

Performance Cache

────────────────────────────────────────

API

Initialize()

Analyze()

AnalyzeWorkbook()

AnalyzeWorksheet()

AnalyzeFormula()

AnalyzeDependency()

AnalyzeReference()

AnalyzeMemory()

AnalyzePerformance()

AnalyzeCache()

AnalyzeThread()

AnalyzeGPU()

GenerateReport()

ExportReport()

RepairSuggestion()

ClearCache()

Shutdown()

────────────────────────────────────────

Events

DiagnosticsStarted

DiagnosticsCompleted

IssueDetected

WarningDetected

CriticalIssueDetected

FormulaAnalyzed

DependencyAnalyzed

HealthCheckCompleted

OptimizationSuggested

RepairSuggested

ValidationFailed

────────────────────────────────────────

Dependencies

• CALCULATION_ENGINE

• FORMULA_ENGINE

• DEPENDENCY_ENGINE

• CALCULATION_CHAIN

• CACHE_ENGINE

• MEMORY_ENGINE

• PERFORMANCE_ENGINE

• VALIDATION_ENGINE

• RECALC_ENGINE

• MULTITHREAD_ENGINE

• GPU_CALC_ENGINE

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

Enable Background Diagnostics

Enable Automatic Health Check

Enable Root Cause Analysis

Enable Performance Analysis

Enable Memory Analysis

Enable GPU Analysis

Enable Thread Analysis

Enable Cache Analysis

Enable Auto Repair Suggestion

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365

• Phân tích toàn bộ Workbook

• Chẩn đoán Formula, Dependency, Reference

• Phát hiện Circular Reference

• Phát hiện Spill Error

• Phát hiện lỗi Dynamic Array

• Phân tích hiệu năng tính toán

• Phân tích CPU, GPU, RAM

• Sinh báo cáo chẩn đoán chi tiết

• Đưa ra gợi ý sửa lỗi tự động

• Hỗ trợ Workbook trên 10 triệu công thức

• Multi-thread Safe

• Enterprise Ready

• Production Ready
