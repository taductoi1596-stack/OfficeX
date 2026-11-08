Mục tiêu

VOLATILE_ENGINE chịu trách nhiệm quản lý toàn bộ Volatile Functions trong OfficeX Excel.

Volatile Function là các hàm luôn được tính lại mỗi khi Workbook thực hiện Recalculation, kể cả khi dữ liệu đầu vào không thay đổi.

Engine này tương thích hoàn toàn với Microsoft Excel 365.

Không trực tiếp thực hiện phép tính.

Không phụ thuộc giao diện người dùng.

Chức năng chính

• Quản lý Volatile Functions
• Đăng ký Volatile Function
• Hủy đăng ký Volatile Function
• Đánh dấu Cell Volatile
• Theo dõi Dependency
• Theo dõi Workbook State
• Theo dõi Calculation Cycle
• Quản lý Automatic Recalculation
• Quản lý Manual Recalculation
• Quản lý Background Recalculation
• Quản lý Session State
• Quản lý Random Seed
• Quản lý Time Source
• Quản lý Locale
• Quản lý Time Zone
• Quản lý Cache
• Tối ưu hiệu năng Volatile Calculation

Volatile Functions

NOW()

TODAY()

RAND()

RANDBETWEEN()

OFFSET()

INDIRECT()

CELL()

INFO()

AREAS()

ROWS()

COLUMNS()

RANDARRAY()

Các loại Volatile

• Time Function
• Random Function
• Reference Function
• Information Function
• Session Function
• Dynamic Volatile Function
• Plugin Volatile Function
• AI Volatile Function

Nguồn kích hoạt Recalculation

• Workbook Open
• Workbook Save
• Workbook Load
• Cell Edited
• Formula Changed
• Worksheet Changed
• Named Range Changed
• Table Changed
• PivotTable Changed
• External Link Changed
• Data Refresh
• Manual Recalculate
• Automatic Recalculate
• Full Recalculate
• Plugin Updated

Time Functions

NOW()

TODAY()

Time Zone

Locale Time

UTC

Random Functions

RAND()

RANDBETWEEN()

RANDARRAY()

Random Generator

• Seed
• Secure Seed
• Session Seed
• Workbook Seed

Reference Functions

OFFSET()

INDIRECT()

Reference Update

Dynamic Reference

External Reference

Information Functions

CELL()

INFO()

AREAS()

ROWS()

COLUMNS()

Calculation Modes

• Automatic
• Automatic Except Data Tables
• Manual
• Full Calculation
• Partial Calculation
• Background Calculation

Cache

• Volatile Cache
• Time Cache
• Random Cache
• Reference Cache
• Session Cache

Optimization

• Dirty Tracking
• Smart Recalculate
• Incremental Recalculation
• Parallel Scheduling
• Background Refresh

Validation

• Function Validation
• Random Validation
• Time Validation
• Reference Validation
• Cache Validation

API

Initialize()

Register()

Unregister()

IsVolatile()

Execute()

MarkCell()

MarkRange()

MarkWorkbook()

Refresh()

RefreshTime()

RefreshRandom()

SetSeed()

GetSeed()

Enable()

Disable()

ClearCache()

GetState()

Events

VolatileRegistered

VolatileRemoved

VolatileExecuted

WorkbookRecalculated

TimeChanged

RandomGenerated

ReferenceUpdated

CacheCleared

SessionStarted

SessionEnded

Dependencies

• FUNCTION_ENGINE
• FUNCTION_REGISTRY
• CALCULATION_ENGINE
• DEPENDENCY_ENGINE
• REFERENCE_ENGINE
• CACHE_ENGINE
• MEMORY_ENGINE
• VALIDATION_ENGINE
• ERROR_ENGINE

Không phụ thuộc

• Ribbon
• UI
• Viewport
• Render Engine
• Printer
• Mouse
• Keyboard

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ toàn bộ Volatile Functions
• Hỗ trợ Automatic Recalculation
• Hỗ trợ Manual Recalculation
• Hỗ trợ Random Generator
• Hỗ trợ Time Functions
• Hỗ trợ Dynamic References
• Hỗ trợ Smart Recalculation
• Hỗ trợ Multi-thread Ready
• Hỗ trợ Incremental Recalculation
• Enterprise Ready
• Production Ready
