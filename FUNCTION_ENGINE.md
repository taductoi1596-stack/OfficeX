Mục tiêu

FUNCTION_ENGINE chịu trách nhiệm thực thi toàn bộ hàm trong OfficeX Excel.

Đây là Engine thực hiện việc tính toán các hàm sau khi FORMULA_ENGINE đã phân tích công thức và CALCULATION_ENGINE yêu cầu thực thi.

FUNCTION_ENGINE phải tương thích hoàn toàn với Microsoft Excel 365.

Hỗ trợ hơn 600 hàm Excel.

Không phụ thuộc giao diện người dùng.

Chức năng chính

• Đăng ký hàm
• Tra cứu hàm
• Thực thi hàm
• Kiểm tra tham số
• Chuyển đổi kiểu dữ liệu
• Kiểm tra lỗi
• Trả kết quả
• Hỗ trợ Dynamic Array
• Hỗ trợ Spill
• Hỗ trợ Lambda
• Hỗ trợ LET
• Hỗ trợ Custom Function
• Hỗ trợ Volatile Function
• Hỗ trợ Async Function
• Hỗ trợ Recursive Function
• Hỗ trợ Nested Function
• Hỗ trợ Array Function

Nhóm hàm

• Math Functions
• Statistical Functions
• Financial Functions
• Date & Time Functions
• Logical Functions
• Lookup & Reference Functions
• Text Functions
• Information Functions
• Database Functions
• Engineering Functions
• Cube Functions
• Web Functions
• Dynamic Array Functions
• Compatibility Functions

Math Functions

SUM

SUMIF

SUMIFS

PRODUCT

ABS

ROUND

ROUNDUP

ROUNDDOWN

INT

MOD

POWER

SQRT

PI

RAND

RANDBETWEEN

CEILING

FLOOR

MROUND

SIGN

SIN

COS

TAN

ASIN

ACOS

ATAN

EXP

LN

LOG

LOG10

FACT

GCD

LCM

Logical Functions

IF

IFS

IFERROR

IFNA

AND

OR

NOT

XOR

SWITCH

CHOOSE

Lookup & Reference

XLOOKUP

XMATCH

LOOKUP

VLOOKUP

HLOOKUP

MATCH

INDEX

OFFSET

INDIRECT

ADDRESS

ROW

COLUMN

ROWS

COLUMNS

AREAS

CHOOSECOLS

CHOOSEROWS

Text Functions

LEFT

RIGHT

MID

LEN

TRIM

TEXT

TEXTJOIN

CONCAT

CONCATENATE

LOWER

UPPER

PROPER

REPLACE

SUBSTITUTE

SEARCH

FIND

EXACT

TEXTAFTER

TEXTBEFORE

TEXTSPLIT

Date & Time

TODAY

NOW

DATE

TIME

YEAR

MONTH

DAY

HOUR

MINUTE

SECOND

DATEDIF

EDATE

EOMONTH

NETWORKDAYS

WORKDAY

WEEKDAY

WEEKNUM

ISOWEEKNUM

Statistical

AVERAGE

AVERAGEIF

AVERAGEIFS

COUNT

COUNTA

COUNTBLANK

COUNTIF

COUNTIFS

MAX

MIN

MEDIAN

MODE

MODE.SNGL

MODE.MULT

RANK

RANK.AVG

RANK.EQ

PERCENTILE

QUARTILE

STDEV

STDEV.P

STDEV.S

VAR

VAR.P

VAR.S

Financial

PMT

PV

FV

RATE

NPER

NPV

XNPV

IRR

XIRR

MIRR

SLN

DB

DDB

PRICE

YIELD

Information

ISBLANK

ISNUMBER

ISTEXT

ISLOGICAL

ISFORMULA

ISREF

ISERROR

ISERR

ISNA

ERROR.TYPE

TYPE

CELL

INFO

NA

Database

DSUM

DAVERAGE

DCOUNT

DCOUNTA

DMAX

DMIN

DGET

DPRODUCT

DSTDEV

DVAR

Engineering

CONVERT

BIN2DEC

DEC2BIN

DEC2HEX

HEX2DEC

HEX2BIN

OCT2DEC

COMPLEX

IMABS

IMAGINARY

IMREAL

IMSUM

IMPRODUCT

Dynamic Array

FILTER

SORT

SORTBY

UNIQUE

SEQUENCE

RANDARRAY

TAKE

DROP

EXPAND

TOCOL

TOROW

WRAPROWS

WRAPCOLS

HSTACK

VSTACK

CHOOSECOLS

CHOOSEROWS

Lambda

LAMBDA

LET

MAP

REDUCE

SCAN

MAKEARRAY

BYROW

BYCOL

Hàm Volatile

NOW

TODAY

RAND

RANDBETWEEN

OFFSET

INDIRECT

CELL

INFO

Hàm Compatibility

Toàn bộ hàm tương thích từ Excel 2007

Excel 2010

Excel 2013

Excel 2016

Excel 2019

Excel 2021

Excel 365

API

Initialize()

Register()

Unregister()

Execute()

ExecuteArray()

ExecuteLambda()

ValidateArguments()

ConvertArguments()

GetFunction()

Exists()

GetCategory()

GetDescription()

GetSignature()

Events

FunctionRegistered

FunctionExecuted

FunctionError

FunctionRemoved

ArrayFunctionExecuted

LambdaExecuted

SpillGenerated

Dependencies

FUNCTION_REGISTRY

ERROR_ENGINE

ARRAY_ENGINE

LAMBDA_ENGINE

VOLATILE_ENGINE

REFERENCE_ENGINE

EXPRESSION_ENGINE

CACHE_ENGINE

CALCULATION_ENGINE

Không phụ thuộc

Ribbon

UI

Viewport

Printer

Mouse

Keyboard

Yêu cầu

• Hỗ trợ hơn 600 hàm Excel
• Tương thích Microsoft Excel 365
• Dynamic Array đầy đủ
• LAMBDA đầy đủ
• LET đầy đủ
• Spill đầy đủ
• Volatile Functions
• Multi-thread Ready
• GPU Ready
• Enterprise Ready
• Production Ready
