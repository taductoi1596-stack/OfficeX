Mục tiêu

DYNAMIC_ARRAY_ENGINE chịu trách nhiệm quản lý và thực thi toàn bộ cơ chế Dynamic Array trong OfficeX Excel.

Engine này triển khai đầy đủ Dynamic Array Engine theo Microsoft Excel 365, bao gồm FILTER(), SORT(), UNIQUE(), TAKE(), DROP(), CHOOSECOLS(), CHOOSEROWS(), VSTACK(), HSTACK(), WRAPROWS(), WRAPCOLS(), TOCOL(), TOROW(), EXPAND(), MAKEARRAY(), MAP(), REDUCE(), SCAN(), BYROW(), BYCOL(), SEQUENCE(), RANDARRAY() và toàn bộ Spill Array.

Engine này là lớp điều phối Dynamic Array.

Không trực tiếp parse Formula.

Không phụ thuộc UI.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Mục tiêu kiến trúc

Formula

↓

FORMULA_ENGINE

↓

FUNCTION_ENGINE

↓

DYNAMIC_ARRAY_ENGINE

↓

ARRAY_ENGINE

↓

SPILL_ENGINE

↓

CALCULATION_ENGINE

────────────────────────────────────────

Chức năng chính

• Dynamic Array Evaluation

• Array Expansion

• Spill Management

• Array Broadcasting

• Shape Validation

• Resize Dynamic Array

• Array Transformation

• Array Filtering

• Array Sorting

• Array Deduplication

• Array Mapping

• Array Reduction

• Array Scanning

• Array Stack

• Array Wrap

• Array Slice

• Array Projection

• Array Cache

• Incremental Update

────────────────────────────────────────

Các hàm hỗ trợ

FILTER()

SORT()

SORTBY()

UNIQUE()

TAKE()

DROP()

EXPAND()

CHOOSEROWS()

CHOOSECOLS()

TOCOL()

TOROW()

WRAPROWS()

WRAPCOLS()

VSTACK()

HSTACK()

SEQUENCE()

RANDARRAY()

MAKEARRAY()

MAP()

REDUCE()

SCAN()

BYROW()

BYCOL()

LET()

LAMBDA()

────────────────────────────────────────

Dynamic Array Types

One Dimension Array

Two Dimension Array

Rectangular Array

Jagged Array (Internal)

Spill Array

Virtual Array

Lazy Array

Generated Array

────────────────────────────────────────

Supported Sources

Worksheet Range

Named Range

Excel Table

Structured Reference

External Workbook

Lambda

Formula Result

Array Constant

────────────────────────────────────────

Array Operations

Create

Resize

Expand

Shrink

Append

Prepend

Slice

Merge

Split

Transpose

Broadcast

Flatten

Project

Map

Reduce

Scan

────────────────────────────────────────

Array Broadcasting

Scalar

↓

Entire Array

Single Row

↓

Multiple Rows

Single Column

↓

Multiple Columns

Array

↓

Array

────────────────────────────────────────

Filtering

FILTER()

Multiple Conditions

Nested FILTER

Boolean Mask

Dynamic Filter

────────────────────────────────────────

Sorting

SORT()

SORTBY()

Ascending

Descending

Multi Key Sort

Stable Sort

────────────────────────────────────────

Unique

UNIQUE()

Distinct Rows

Distinct Columns

Exactly Once

────────────────────────────────────────

Slice

TAKE()

DROP()

Head

Tail

Middle

Negative Index

────────────────────────────────────────

Projection

CHOOSECOLS()

CHOOSEROWS()

Column Projection

Row Projection

────────────────────────────────────────

Stack

VSTACK()

HSTACK()

Multiple Arrays

Mixed Sizes

Automatic Expansion

────────────────────────────────────────

Wrap

WRAPROWS()

WRAPCOLS()

Column Wrap

Row Wrap

────────────────────────────────────────

Flatten

TOCOL()

TOROW()

Ignore Blank

Ignore Error

Scan Order

────────────────────────────────────────

Generator

SEQUENCE()

RANDARRAY()

MAKEARRAY()

────────────────────────────────────────

Functional Programming

MAP()

REDUCE()

SCAN()

BYROW()

BYCOL()

LAMBDA()

LET()

────────────────────────────────────────

Supported Data Types

Number

Text

Boolean

Date

Time

Currency

Error

Reference

Array

Dynamic Array

Lambda

────────────────────────────────────────

Validation

• Invalid Array

• Invalid Dimension

• Shape Mismatch

• Invalid Spill

• Invalid Lambda

• Invalid Reference

• Invalid Generator

• Memory Overflow

• Circular Array

────────────────────────────────────────

Optimization

• Lazy Evaluation

• Incremental Array Update

• SIMD Processing

• Vectorized Array Operations

• Parallel Array Execution

• Copy-On-Write

• Zero Copy Array

• Automatic Shape Inference

────────────────────────────────────────

Cache

Dynamic Array Cache

Spill Cache

Lambda Cache

Shape Cache

Projection Cache

Filter Cache

Sort Cache

────────────────────────────────────────

Memory Management

Virtual Array

Reference Counting

Copy On Write

Shared Buffer

Memory Pool

Garbage Collection Ready

────────────────────────────────────────

API

Initialize()

Execute()

CreateArray()

Resize()

Expand()

Shrink()

Filter()

Sort()

SortBy()

Unique()

Take()

Drop()

ProjectRows()

ProjectColumns()

StackVertical()

StackHorizontal()

WrapRows()

WrapColumns()

FlattenRow()

FlattenColumn()

GenerateSequence()

GenerateRandom()

GenerateArray()

Map()

Reduce()

Scan()

Validate()

Optimize()

ClearCache()

────────────────────────────────────────

Events

DynamicArrayCreated

DynamicArrayUpdated

DynamicArrayResized

DynamicArrayExpanded

DynamicArrayShrunk

DynamicArrayFiltered

DynamicArraySorted

DynamicArrayUniqueApplied

DynamicArrayMapped

DynamicArrayReduced

DynamicArrayScanned

SpillUpdated

ValidationFailed

CacheHit

CacheMiss

────────────────────────────────────────

Dependencies

• FUNCTION_ENGINE

• ARRAY_ENGINE

• SPILL_ENGINE

• LAMBDA_ENGINE

• CALCULATION_ENGINE

• REFERENCE_ENGINE

• CACHE_ENGINE

• MEMORY_ENGINE

• VALIDATION_ENGINE

• ERROR_ENGINE

• PERFORMANCE_ENGINE

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

• Hỗ trợ đầy đủ toàn bộ Dynamic Array Functions

• Hỗ trợ FILTER()

• Hỗ trợ SORT() / SORTBY()

• Hỗ trợ UNIQUE()

• Hỗ trợ TAKE() / DROP()

• Hỗ trợ EXPAND()

• Hỗ trợ TOCOL() / TOROW()

• Hỗ trợ CHOOSECOLS() / CHOOSEROWS()

• Hỗ trợ WRAPROWS() / WRAPCOLS()

• Hỗ trợ VSTACK() / HSTACK()

• Hỗ trợ MAKEARRAY()

• Hỗ trợ MAP()

• Hỗ trợ REDUCE()

• Hỗ trợ SCAN()

• Hỗ trợ BYROW() / BYCOL()

• Hỗ trợ LET()

• Hỗ trợ LAMBDA()

• Hỗ trợ Spill Array đầy đủ

• Hỗ trợ Lazy Evaluation

• Hỗ trợ Vectorized Processing

• Hỗ trợ Multi-thread Execution

• Hỗ trợ Workbook hàng triệu ô

• Enterprise Ready

• Production Ready
