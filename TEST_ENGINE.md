Mục tiêu

TEST_ENGINE chịu trách nhiệm kiểm thử toàn bộ Calculation Engine của OfficeX Excel nhằm đảm bảo mọi phép tính, công thức, hàm và quá trình tính toán luôn chính xác, ổn định và tương thích với Microsoft Excel 365.

Engine này cung cấp hệ thống Unit Test, Integration Test, Regression Test, Compatibility Test, Stress Test và Automated Test cho toàn bộ Calculation Engine.

Engine này không trực tiếp thực thi công thức trong môi trường sản xuất.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Source Code

↓

Calculation Engine

↓

TEST_ENGINE

↓

Test Runner

↓

Test Framework

↓

Test Database

↓

Test Report

────────────────────────────────────────

Mục tiêu thiết kế

Test Case

↓

Execute

↓

Collect Result

↓

Compare Expected Result

↓

Generate Report

↓

Regression Database

────────────────────────────────────────

Chức năng chính

• Unit Test

• Integration Test

• Regression Test

• Compatibility Test

• Functional Test

• Performance Test

• Stress Test

• Load Test

• Random Formula Test

• Formula Validation Test

• Dynamic Array Test

• Lookup Test

• Financial Test

• Statistics Test

• Engineering Test

• OOXML Compatibility Test

• Automated Test

────────────────────────────────────────

Test Categories

Formula Test

Function Test

Dependency Test

Calculation Test

Reference Test

Named Range Test

Dynamic Array Test

Lambda Test

Lookup Test

Memory Test

Cache Test

GPU Test

Thread Test

Performance Test

Serialization Test

────────────────────────────────────────

Unit Test

Single Formula

Single Function

Single Reference

Single Dependency

Single AST

Single Worksheet

────────────────────────────────────────

Integration Test

Formula Engine

+

Parser

+

AST

+

Calculation Engine

+

Dependency Engine

+

Evaluator

+

Cache

────────────────────────────────────────

Regression Test

Workbook Regression

Worksheet Regression

Formula Regression

Function Regression

Compatibility Regression

Performance Regression

────────────────────────────────────────

Compatibility Test

Excel 2007

Excel 2010

Excel 2013

Excel 2016

Excel 2019

Excel 2021

Microsoft 365

LibreOffice Calc

Apache OpenOffice

────────────────────────────────────────

Supported Formula Tests

Arithmetic

Logical

Lookup

Date & Time

Financial

Statistics

Engineering

Text

Information

Dynamic Arrays

Lambda

LET

────────────────────────────────────────

Stress Test

1 Million Formulas

10 Million Formulas

Large Dynamic Arrays

Large Lookup Tables

Large Dependency Graph

Large Workbook

────────────────────────────────────────

Performance Test

Calculation Time

Formula Throughput

Function Throughput

Memory Usage

CPU Usage

GPU Usage

Thread Scaling

Cache Hit Ratio

────────────────────────────────────────

Random Test

Random Formula Generator

Random Function Generator

Random Workbook Generator

Random Dependency Graph

Random Named Range

────────────────────────────────────────

Validation Test

Syntax Validation

Semantic Validation

Reference Validation

Dependency Validation

Type Validation

Compatibility Validation

────────────────────────────────────────

Expected Results

Correct Value

Expected Error

Expected Spill

Expected Dynamic Array

Expected Lookup

Expected Exception

────────────────────────────────────────

Comparison Engine

Expected Value

↓

Actual Value

↓

Tolerance Check

↓

Pass

or

Fail

────────────────────────────────────────

Error Detection

Wrong Result

Unexpected Error

Crash

Memory Leak

Timeout

Incorrect Dependency

Incorrect Spill

Incorrect Reference

────────────────────────────────────────

Test Reports

Summary

Passed Tests

Failed Tests

Skipped Tests

Execution Time

Coverage

Regression Result

Compatibility Result

Performance Result

────────────────────────────────────────

Coverage

Formula Coverage

Function Coverage

Engine Coverage

Branch Coverage

Line Coverage

Dependency Coverage

────────────────────────────────────────

Automation

Continuous Testing

Nightly Test

Pre-release Test

CI/CD Test

Automatic Regression

Automatic Report

────────────────────────────────────────

Export Formats

JSON

XML

CSV

HTML

Markdown

JUnit XML

────────────────────────────────────────

Optimization

• Parallel Test Execution

• Incremental Regression Test

• Cached Test Data

• Randomized Testing

• Distributed Testing

• Background Test Execution

────────────────────────────────────────

Cache

Test Cache

Regression Cache

Expected Result Cache

Workbook Cache

Formula Cache

────────────────────────────────────────

API

Initialize()

RunAllTests()

RunUnitTests()

RunIntegrationTests()

RunRegressionTests()

RunPerformanceTests()

RunStressTests()

RunCompatibilityTests()

RunRandomTests()

GenerateReport()

ExportReport()

ClearResults()

Shutdown()

────────────────────────────────────────

Events

TestStarted

TestCompleted

TestPassed

TestFailed

RegressionStarted

RegressionCompleted

PerformanceTestStarted

StressTestStarted

CompatibilityTestCompleted

CoverageUpdated

ReportGenerated

────────────────────────────────────────

Dependencies

• CALCULATION_ENGINE

• FORMULA_ENGINE

• FUNCTION_ENGINE

• TOKENIZER_ENGINE

• PARSER_ENGINE

• AST_ENGINE

• EVALUATOR_ENGINE

• DEPENDENCY_ENGINE

• REFERENCE_ENGINE

• CACHE_ENGINE

• MEMORY_ENGINE

• PERFORMANCE_ENGINE

• VALIDATION_ENGINE

• SERIALIZATION_ENGINE

• OPENXML_FORMULA_ENGINE

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

Enable Unit Test

Enable Integration Test

Enable Regression Test

Enable Compatibility Test

Enable Performance Test

Enable Stress Test

Enable Random Test

Enable Automatic Report

Enable Parallel Testing

Enable CI/CD Mode

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365

• Kiểm thử hơn 600 hàm Excel

• Hỗ trợ Unit Test, Integration Test và Regression Test

• Kiểm thử Dynamic Array, LET(), LAMBDA()

• Kiểm thử Workbook lớn trên 10 triệu công thức

• Hỗ trợ Benchmark và Stress Test

• Xuất báo cáo chi tiết nhiều định dạng

• Tích hợp CI/CD

• Multi-thread Safe

• Enterprise Ready

• Production Ready
