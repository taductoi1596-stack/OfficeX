Mục tiêu

FINANCIAL_ENGINE chịu trách nhiệm thực thi toàn bộ các hàm tài chính trong OfficeX Excel.

Engine này triển khai đầy đủ các Financial Functions theo Microsoft Excel 365, bao gồm các phép tính về khoản vay, đầu tư, khấu hao, trái phiếu, chứng khoán, dòng tiền và phân tích tài chính doanh nghiệp.

Không trực tiếp phân tích công thức.

Không phụ thuộc giao diện người dùng.

────────────────────────────────────────

Chức năng chính

• Thực thi Financial Functions
• Time Value of Money
• Loan Calculation
• Investment Analysis
• Cash Flow Analysis
• Bond Calculation
• Security Calculation
• Depreciation Calculation
• Treasury Functions
• Interest Rate Calculation
• Discount Rate Calculation
• Yield Calculation
• Amortization
• Financial Schedule
• Currency Precision
• Financial Validation
• Financial Cache

────────────────────────────────────────

Nhóm hàm tài chính

Loan Functions

PMT()

IPMT()

PPMT()

CUMIPMT()

CUMPRINC()

ISPMT()

────────────────────────────────────────

Present / Future Value

PV()

FV()

NPER()

RATE()

RRI()

PDURATION()

FVSCHEDULE()

────────────────────────────────────────

Investment

NPV()

XNPV()

IRR()

XIRR()

MIRR()

ROI()

────────────────────────────────────────

Cash Flow

NPV

XNPV

IRR

XIRR

MIRR

Cash Flow Schedule

────────────────────────────────────────

Depreciation

SLN()

SYD()

DB()

DDB()

VDB()

AMORDEGRC()

AMORLINC()

────────────────────────────────────────

Bond Functions

PRICE()

PRICEDISC()

PRICEMAT()

YIELD()

YIELDDISC()

YIELDMAT()

DISC()

DURATION()

MDURATION()

ACCRINT()

ACCRINTM()

COUPDAYBS()

COUPDAYS()

COUPDAYSNC()

COUPNCD()

COUPNUM()

COUPPCD()

INTRATE()

RECEIVED()

TBILLEQ()

TBILLPRICE()

TBILLYIELD()

────────────────────────────────────────

Security Functions

ODDFPRICE()

ODDFYIELD()

ODDLPRICE()

ODDLYIELD()

────────────────────────────────────────

Treasury

EFFECT()

NOMINAL()

DOLLARDE()

DOLLARFR()

INTRATE()

DISC()

────────────────────────────────────────

Currency

Currency Precision

Currency Rounding

Exchange Rate

Locale Currency

Multi Currency Ready

────────────────────────────────────────

Financial Calendar

Daily

Monthly

Quarterly

Semi Annual

Annual

Custom Period

────────────────────────────────────────

Day Count Convention

30/360

Actual/360

Actual/365

Actual/Actual

European 30/360

────────────────────────────────────────

Interest Types

Simple Interest

Compound Interest

Effective Interest

Nominal Interest

Variable Interest

Fixed Interest

────────────────────────────────────────

Cash Flow Types

Positive Cash Flow

Negative Cash Flow

Periodic Cash Flow

Irregular Cash Flow

Discounted Cash Flow

────────────────────────────────────────

Financial Precision

Decimal Precision

Banker's Rounding

IEEE-754 Compatible

Excel Compatible Precision

────────────────────────────────────────

Validation

• Invalid Interest Rate
• Invalid Period
• Invalid Cash Flow
• Invalid Investment
• Invalid Date
• Invalid Bond
• Invalid Security
• Divide By Zero
• Overflow
• Financial Domain Error

────────────────────────────────────────

Optimization

• Cached Financial Result
• Incremental Financial Calculation
• Parallel Financial Evaluation
• Vectorized Cash Flow
• High Precision Math
• Financial Memoization

────────────────────────────────────────

Cache

Financial Cache

Interest Cache

Cash Flow Cache

Bond Cache

Investment Cache

────────────────────────────────────────

API

Initialize()

Execute()

EvaluateLoan()

EvaluateInvestment()

EvaluateCashFlow()

EvaluateBond()

EvaluateSecurity()

EvaluateDepreciation()

EvaluateTreasury()

CalculatePMT()

CalculatePV()

CalculateFV()

CalculateNPV()

CalculateIRR()

CalculateXIRR()

CalculateYield()

CalculateDuration()

Validate()

ClearCache()

────────────────────────────────────────

Events

FinancialCalculationStarted

FinancialCalculationCompleted

LoanCalculated

InvestmentCalculated

CashFlowCalculated

BondCalculated

SecurityCalculated

DepreciationCalculated

ValidationFailed

CacheHit

CacheMiss

────────────────────────────────────────

Dependencies

• FUNCTION_ENGINE
• EXPRESSION_ENGINE
• EVALUATOR_ENGINE
• DATE_TIME_ENGINE
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
• Hỗ trợ đầy đủ hơn 60 hàm tài chính
• Hỗ trợ Loan Calculation
• Hỗ trợ Investment Analysis
• Hỗ trợ Cash Flow Analysis
• Hỗ trợ Bond Functions
• Hỗ trợ Treasury Functions
• Hỗ trợ Depreciation Functions
• Hỗ trợ Irregular Cash Flow
• Hỗ trợ Day Count Convention
• Hỗ trợ Multi Currency
• Hỗ trợ High Precision Financial Math
• Hỗ trợ Multi-thread Calculation
• Enterprise Ready
• Production Ready
