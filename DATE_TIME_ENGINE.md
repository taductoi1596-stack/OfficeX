Mục tiêu

DATE_TIME_ENGINE chịu trách nhiệm thực thi toàn bộ các hàm ngày và thời gian trong OfficeX Excel.

Engine này triển khai đầy đủ các Date & Time Functions theo Microsoft Excel 365, bao gồm xử lý lịch, ngày tháng, giờ phút giây, múi giờ, tuần, quý, năm tài chính, khoảng thời gian và tính toán lịch.

Không trực tiếp phân tích công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Chức năng chính

• Thực thi Date Functions
• Thực thi Time Functions
• Calendar Calculation
• Date Arithmetic
• Time Arithmetic
• Business Calendar
• ISO Calendar
• Fiscal Calendar
• Leap Year
• Time Zone Support
• Date Validation
• Date Parsing
• Date Formatting
• Serial Date Conversion
• Unix Timestamp Conversion
• OOXML Date Support
• Cache Date Calculation

────────────────────────────────────────

Nhóm hàm ngày giờ

Current Date & Time

TODAY()

NOW()

────────────────────────────────────────

Date Construction

DATE()

DATEVALUE()

TIME()

TIMEVALUE()

────────────────────────────────────────

Date Parts

DAY()

MONTH()

YEAR()

HOUR()

MINUTE()

SECOND()

────────────────────────────────────────

Week Functions

WEEKDAY()

WEEKNUM()

ISOWEEKNUM()

────────────────────────────────────────

Working Days

WORKDAY()

WORKDAY.INTL()

NETWORKDAYS()

NETWORKDAYS.INTL()

────────────────────────────────────────

Month Functions

EOMONTH()

EDATE()

────────────────────────────────────────

Difference

DATEDIF()

DAYS()

DAYS360()

YEARFRAC()

────────────────────────────────────────

Time Calculation

TIME()

TIMEVALUE()

HOUR()

MINUTE()

SECOND()

────────────────────────────────────────

Dynamic Date

SEQUENCE()

FILTER()

SORT()

UNIQUE()

Dynamic Calendar

────────────────────────────────────────

Supported Calendars

Gregorian Calendar

ISO-8601 Calendar

Fiscal Calendar

Business Calendar

Custom Calendar

────────────────────────────────────────

Supported Date Range

1900 Date System

1904 Date System

OOXML Date System

Excel Serial Number

Unix Timestamp

UTC

Local Time

────────────────────────────────────────

Leap Year

Leap Year Detection

February 29

Century Rule

400-Year Rule

────────────────────────────────────────

Business Calendar

Working Day

Holiday

Weekend

Custom Weekend

Regional Holiday

Fiscal Year

────────────────────────────────────────

Date Formats

dd/mm/yyyy

mm/dd/yyyy

yyyy-mm-dd

dd-mmm-yyyy

mmmm dd, yyyy

ISO-8601

RFC3339

Unix Timestamp

OOXML Date

────────────────────────────────────────

Time Formats

hh:mm

hh:mm:ss

hh:mm:ss.fff

12 Hour

24 Hour

AM/PM

Milliseconds

────────────────────────────────────────

Time Zone

UTC

GMT

Local Time

Offset Time

DST Ready

Regional Time Zone

────────────────────────────────────────

Conversions

Date → Serial

Serial → Date

Time → Serial

Serial → Time

Unix → Date

Date → Unix

UTC → Local

Local → UTC

────────────────────────────────────────

Validation

• Invalid Date
• Invalid Time
• Invalid Leap Year
• Invalid Month
• Invalid Day
• Invalid Serial
• Invalid Time Zone
• Overflow
• Underflow

────────────────────────────────────────

Optimization

• Cached Date Calculation

• Cached Holiday Table

• Cached Time Zone

• Incremental Calendar Calculation

• Vectorized Date Processing

• Parallel Date Calculation

────────────────────────────────────────

Cache

Date Cache

Time Cache

Holiday Cache

Week Cache

Calendar Cache

Time Zone Cache

────────────────────────────────────────

API

Initialize()

Execute()

CalculateDate()

CalculateTime()

CalculateDifference()

CalculateBusinessDay()

CalculateWeek()

CalculateMonth()

CalculateYear()

ConvertSerial()

ConvertUnix()

ConvertUTC()

Validate()

Format()

Parse()

ClearCache()

────────────────────────────────────────

Events

DateCalculated

TimeCalculated

BusinessDayCalculated

HolidayResolved

TimeZoneChanged

DateConverted

TimeConverted

ValidationFailed

CacheHit

CacheMiss

────────────────────────────────────────

Dependencies

• FUNCTION_ENGINE
• EXPRESSION_ENGINE
• EVALUATOR_ENGINE
• MATH_ENGINE
• ARRAY_ENGINE
• CACHE_ENGINE
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

• Hỗ trợ đầy đủ hơn 40 hàm Date & Time

• Hỗ trợ 1900 và 1904 Date System

• Hỗ trợ ISO-8601

• Hỗ trợ Business Calendar

• Hỗ trợ Fiscal Calendar

• Hỗ trợ Holiday Calendar

• Hỗ trợ Time Zone

• Hỗ trợ Leap Year

• Hỗ trợ Unix Timestamp

• Hỗ trợ OOXML Date Format

• Hỗ trợ Dynamic Arrays

• Hỗ trợ Multi-thread Calculation

• Hỗ trợ High Precision Time

• Enterprise Ready

• Production Ready
