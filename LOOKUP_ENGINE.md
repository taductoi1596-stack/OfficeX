Mục tiêu

LOOKUP_ENGINE chịu trách nhiệm tối ưu toàn bộ các phép tra cứu dữ liệu trong OfficeX Excel.

Đây là Engine chuyên biệt cho các hàm Lookup như XLOOKUP, XMATCH, INDEX, MATCH, VLOOKUP, HLOOKUP, LOOKUP và các phép tìm kiếm trong Table, Dynamic Array, Named Range, Structured Reference và External Workbook.

Engine được thiết kế để đạt hiệu năng tương đương hoặc cao hơn Microsoft Excel 365 khi làm việc với hàng triệu dòng dữ liệu.

Không trực tiếp quản lý công thức.

Không phụ thuộc giao diện người dùng.

────────────────────────────────────────

Chức năng chính

• XLOOKUP
• XMATCH
• INDEX
• MATCH
• VLOOKUP
• HLOOKUP
• LOOKUP
• OFFSET Lookup
• INDIRECT Lookup
• Table Lookup
• Structured Reference Lookup
• Named Range Lookup
• Dynamic Array Lookup
• Spill Lookup
• External Workbook Lookup
• Multi Column Lookup
• Multi Key Lookup
• Binary Search
• Linear Search
• Cached Lookup
• Parallel Lookup

────────────────────────────────────────

Các hàm hỗ trợ

XLOOKUP()

XMATCH()

INDEX()

MATCH()

VLOOKUP()

HLOOKUP()

LOOKUP()

OFFSET()

INDIRECT()

CHOOSE()

FILTER()

UNIQUE()

SORT()

SORTBY()

TAKE()

DROP()

TOCOL()

TOROW()

────────────────────────────────────────

Lookup Types

Exact Match

Approximate Match

Binary Search

Wildcard Search

Regex Search (nếu được bật)

Case Sensitive Lookup

Case Insensitive Lookup

First Match

Last Match

Nearest Match

Next Larger

Next Smaller

────────────────────────────────────────

Search Modes

Top To Bottom

Bottom To Top

Left To Right

Right To Left

Binary Ascending

Binary Descending

Parallel Search

Background Search

────────────────────────────────────────

Lookup Sources

Single Cell

Range

Entire Column

Entire Row

Named Range

Excel Table

Structured Reference

Dynamic Array

Spill Range

Worksheet

Workbook

External Workbook

────────────────────────────────────────

Structured Reference

Table1[Price]

Table1[Sales]

Table1[@Amount]

Table1[#All]

Table1[#Headers]

────────────────────────────────────────

Dynamic Array Lookup

FILTER()

UNIQUE()

SORT()

SORTBY()

SEQUENCE()

MAKEARRAY()

MAP()

REDUCE()

SCAN()

────────────────────────────────────────

Algorithms

Linear Search

Binary Search

Hash Lookup

Dictionary Lookup

Index Lookup

Trie Lookup

Parallel Search

Cache Lookup

Hybrid Lookup

────────────────────────────────────────

Performance Optimization

• Binary Search trên dữ liệu đã sắp xếp
• Hash Index cho Exact Match
• Lookup Cache
• Column Cache
• Range Cache
• Parallel Lookup
• SIMD Ready
• Incremental Lookup
• Lazy Lookup
• Zero Copy Lookup

────────────────────────────────────────

Cache

Lookup Cache

Index Cache

Hash Cache

Range Cache

Workbook Cache

External Workbook Cache

Dynamic Array Cache

────────────────────────────────────────

Lookup Result

Single Value

Array

Dynamic Array

Range

Reference

Error

────────────────────────────────────────

Supported Errors

#N/A

#REF!

#VALUE!

#NAME?

#SPILL!

#CALC!

Lookup Timeout

External Workbook Missing

Duplicate Match

Invalid Lookup Range

────────────────────────────────────────

Validation

• Lookup Array Empty
• Return Array Empty
• Invalid Index
• Invalid Match Mode
• Invalid Search Mode
• Invalid Range
• Invalid Workbook
• Invalid Structured Reference
• Invalid Named Range

────────────────────────────────────────

Index Manager

Build Index

Update Index

Delete Index

Refresh Index

Rebuild Index

Compact Index

────────────────────────────────────────

API

Initialize()

Lookup()

XLookup()

XMatch()

Index()

Match()

VLookup()

HLookup()

LookupValue()

ResolveReference()

BuildIndex()

UpdateIndex()

DeleteIndex()

RefreshCache()

ClearCache()

Validate()

────────────────────────────────────────

Events

LookupStarted

LookupCompleted

LookupFailed

IndexBuilt

IndexUpdated

CacheHit

CacheMiss

BinarySearchUsed

HashLookupUsed

ExternalWorkbookLoaded

────────────────────────────────────────

Dependencies

• REFERENCE_ENGINE
• ARRAY_ENGINE
• SPILL_ENGINE
• DYNAMIC_ARRAY_ENGINE
• FUNCTION_ENGINE
• DEPENDENCY_ENGINE
• CACHE_ENGINE
• MEMORY_ENGINE
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

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ XLOOKUP đầy đủ
• Hỗ trợ XMATCH đầy đủ
• Hỗ trợ INDEX/MATCH
• Hỗ trợ VLOOKUP/HLOOKUP
• Hỗ trợ Binary Search
• Hỗ trợ Hash Lookup
• Hỗ trợ Dynamic Array Lookup
• Hỗ trợ Spill Range
• Hỗ trợ Structured Reference
• Hỗ trợ External Workbook Lookup
• Hỗ trợ Multi-thread Lookup
• Lookup O(1) với Hash Index
• Lookup O(log n) với Binary Search
• Lookup O(n) với Linear Search
• Enterprise Ready
• Production Ready
