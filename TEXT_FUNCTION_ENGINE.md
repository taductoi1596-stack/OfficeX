Mục tiêu

TEXT_FUNCTION_ENGINE chịu trách nhiệm thực thi toàn bộ các hàm xử lý chuỗi trong OfficeX Excel.

Engine này triển khai đầy đủ các Text Functions theo Microsoft Excel 365, bao gồm xử lý Unicode, chuỗi nhiều ngôn ngữ, chuyển đổi định dạng, tìm kiếm, thay thế, nối chuỗi, tách chuỗi và làm sạch dữ liệu.

Không trực tiếp phân tích công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Chức năng chính

• Thực thi Text Functions
• Unicode Processing
• UTF-8 / UTF-16 Support
• String Comparison
• String Search
• String Replace
• String Split
• String Join
• String Trim
• String Format
• Text Normalization
• Regular Expression (nếu được bật)
• Wildcard Matching
• Case Conversion
• Number ↔ Text Conversion
• Date ↔ Text Conversion
• Text Cache
• String Optimization

────────────────────────────────────────

Nhóm hàm xử lý chuỗi

Length

LEN()

LENB()

────────────────────────────────────────

Extract

LEFT()

LEFTB()

RIGHT()

RIGHTB()

MID()

MIDB()

TEXTBEFORE()

TEXTAFTER()

TEXTSPLIT()

────────────────────────────────────────

Search

FIND()

FINDB()

SEARCH()

SEARCHB()

EXACT()

────────────────────────────────────────

Replace

REPLACE()

REPLACEB()

SUBSTITUTE()

────────────────────────────────────────

Join

CONCAT()

CONCATENATE()

TEXTJOIN()

────────────────────────────────────────

Case

UPPER()

LOWER()

PROPER()

────────────────────────────────────────

Clean

TRIM()

CLEAN()

VALUE()

NUMBERVALUE()

────────────────────────────────────────

Convert

TEXT()

FIXED()

DOLLAR()

BAHTTEXT()

ROMAN()

ARABIC()

────────────────────────────────────────

Character

CHAR()

UNICHAR()

CODE()

UNICODE()

────────────────────────────────────────

Repeat

REPT()

────────────────────────────────────────

Dynamic Array Text

TEXTSPLIT()

TEXTJOIN()

TOCOL()

TOROW()

FILTER()

UNIQUE()

SORT()

────────────────────────────────────────

Supported Character Sets

ASCII

Unicode

UTF-8

UTF-16

UTF-32

Emoji

CJK

Vietnamese

RTL Languages

────────────────────────────────────────

Normalization

NFC

NFD

NFKC

NFKD

Whitespace Normalize

Unicode Normalize

────────────────────────────────────────

Wildcard Support

*

?

~

Pattern Matching

────────────────────────────────────────

Regular Expression

(Option)

Match

Replace

Split

Extract

Named Group

────────────────────────────────────────

String Comparison

Case Sensitive

Case Insensitive

Culture Invariant

Locale Aware

Unicode Aware

────────────────────────────────────────

Formatting

Currency

Percentage

Date

Time

Scientific

Custom Format

Locale Format

────────────────────────────────────────

Conversions

Number → Text

Text → Number

Boolean → Text

Date → Text

Time → Text

Text → Date

Text → Time

────────────────────────────────────────

Validation

• Invalid Unicode
• Invalid UTF Encoding
• Invalid Character
• Invalid Format
• Invalid Locale
• Invalid Number
• Invalid Date
• Invalid Time
• Overflow
• Underflow

────────────────────────────────────────

Optimization

• String Cache
• Interned String
• Zero Copy Slice
• Lazy Concatenation
• SIMD Text Processing
• Incremental Text Processing
• Parallel String Operations

────────────────────────────────────────

Cache

String Cache

Unicode Cache

Format Cache

Search Cache

Regex Cache

Locale Cache

────────────────────────────────────────

API

Initialize()

Execute()

Search()

Replace()

Split()

Join()

Trim()

Normalize()

Compare()

Convert()

Format()

Encode()

Decode()

Validate()

ClearCache()

────────────────────────────────────────

Events

TextProcessed

StringJoined

StringSplit

StringReplaced

SearchCompleted

NormalizationCompleted

FormatApplied

ValidationFailed

CacheHit

CacheMiss

────────────────────────────────────────

Dependencies

• FUNCTION_ENGINE
• EXPRESSION_ENGINE
• EVALUATOR_ENGINE
• ARRAY_ENGINE
• DATE_TIME_ENGINE
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
• Hỗ trợ đầy đủ hơn 50 hàm xử lý chuỗi
• Hỗ trợ Unicode đầy đủ
• Hỗ trợ UTF-8 / UTF-16
• Hỗ trợ TEXTSPLIT() và TEXTJOIN()
• Hỗ trợ Wildcard Matching
• Hỗ trợ Regular Expression (tùy chọn)
• Hỗ trợ Locale Aware Comparison
• Hỗ trợ Dynamic Arrays
• Hỗ trợ High Performance String Processing
• Hỗ trợ Multi-thread Processing
• Enterprise Ready
• Production Ready
