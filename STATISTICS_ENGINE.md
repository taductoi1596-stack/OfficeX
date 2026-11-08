Mục tiêu

STATISTICS_ENGINE chịu trách nhiệm thực thi toàn bộ các hàm thống kê trong OfficeX Excel.

Engine này triển khai đầy đủ các Statistical Functions theo Microsoft Excel 365, bao gồm thống kê mô tả, phân phối xác suất, suy luận thống kê, hồi quy, dự báo và phân tích dữ liệu.

Không trực tiếp phân tích công thức.

Không phụ thuộc giao diện người dùng.

────────────────────────────────────────

Chức năng chính

• Thực thi Statistical Functions
• Descriptive Statistics
• Probability Distribution
• Regression
• Correlation
• Hypothesis Testing
• Forecast
• Ranking
• Sampling
• Variance Analysis
• Normal Distribution
• Binomial Distribution
• Poisson Distribution
• Student Distribution
• Chi Square
• Confidence Interval
• Statistical Cache
• Precision Calculation

────────────────────────────────────────

Nhóm hàm thống kê

Average

AVERAGE()

AVERAGEA()

AVERAGEIF()

AVERAGEIFS()

GEOMEAN()

HARMEAN()

TRIMMEAN()

────────────────────────────────────────

Count

COUNT()

COUNTA()

COUNTBLANK()

COUNTIF()

COUNTIFS()

COUNTUNIQUE()

────────────────────────────────────────

Maximum / Minimum

MAX()

MAXA()

MAXIFS()

MIN()

MINA()

MINIFS()

LARGE()

SMALL()

────────────────────────────────────────

Median

MEDIAN()

MODE.SNGL()

MODE.MULT()

PERCENTILE.EXC()

PERCENTILE.INC()

QUARTILE.EXC()

QUARTILE.INC()

────────────────────────────────────────

Variance

VAR.S()

VAR.P()

VARA()

VARPA()

DEVSQ()

AVEDEV()

────────────────────────────────────────

Standard Deviation

STDEV.S()

STDEV.P()

STDEVA()

STDEVPA()

────────────────────────────────────────

Correlation

CORREL()

PEARSON()

RSQ()

COVARIANCE.P()

COVARIANCE.S()

SLOPE()

INTERCEPT()

STEYX()

LINEST()

LOGEST()

TREND()

GROWTH()

FORECAST()

FORECAST.LINEAR()

FORECAST.ETS()

FORECAST.ETS.SEASONALITY()

FORECAST.ETS.CONFINT()

FORECAST.ETS.STAT()

────────────────────────────────────────

Probability

PROB()

BINOM.DIST()

BINOM.DIST.RANGE()

BINOM.INV()

HYPGEOM.DIST()

NEGBINOM.DIST()

POISSON.DIST()

EXPON.DIST()

WEIBULL.DIST()

GAMMA.DIST()

BETA.DIST()

LOGNORM.DIST()

NORM.DIST()

NORM.S.DIST()

NORM.INV()

NORM.S.INV()

────────────────────────────────────────

Student Distribution

T.DIST()

T.DIST.2T()

T.DIST.RT()

T.INV()

T.INV.2T()

T.TEST()

────────────────────────────────────────

Chi Square

CHISQ.DIST()

CHISQ.DIST.RT()

CHISQ.INV()

CHISQ.INV.RT()

CHISQ.TEST()

────────────────────────────────────────

F Distribution

F.DIST()

F.DIST.RT()

F.INV()

F.INV.RT()

F.TEST()

────────────────────────────────────────

Confidence

CONFIDENCE.NORM()

CONFIDENCE.T()

STANDARDIZE()

Z.TEST()

FISHER()

FISHERINV()

────────────────────────────────────────

Ranking

RANK.EQ()

RANK.AVG()

PERCENTRANK.EXC()

PERCENTRANK.INC()

PERCENTILE.EXC()

PERCENTILE.INC()

────────────────────────────────────────

Sampling

Sampling Mean

Sampling Variance

Sampling Standard Deviation

Random Sampling

Bootstrap Ready

────────────────────────────────────────

Data Types

Number

Array

Dynamic Array

Range

Logical

Text

Date

Time

Blank

Error

────────────────────────────────────────

Algorithms

Arithmetic Mean

Geometric Mean

Harmonic Mean

Least Squares Regression

Pearson Correlation

Covariance

Maximum Likelihood

Normal Approximation

Linear Regression

Time Series Forecast

────────────────────────────────────────

Precision

IEEE-754

Excel Compatible Precision

High Precision Decimal

Numerical Stability

────────────────────────────────────────

Validation

• Empty Dataset
• Invalid Sample Size
• Invalid Probability
• Invalid Distribution
• Divide By Zero
• Overflow
• Underflow
• Invalid Parameter
• Invalid Confidence Level

────────────────────────────────────────

Optimization

• Vectorized Statistics
• Cached Results
• Parallel Aggregation
• Incremental Statistics
• Streaming Statistics
• SIMD Ready
• Multi-thread Calculation

────────────────────────────────────────

Cache

Statistics Cache

Distribution Cache

Regression Cache

Forecast Cache

Probability Cache

────────────────────────────────────────

API

Initialize()

Execute()

CalculateAverage()

CalculateMedian()

CalculateMode()

CalculateVariance()

CalculateStandardDeviation()

CalculateCorrelation()

CalculateRegression()

CalculateForecast()

CalculateProbability()

CalculateDistribution()

CalculateConfidence()

CalculateRanking()

Validate()

ClearCache()

────────────────────────────────────────

Events

StatisticsStarted

StatisticsCompleted

DistributionCalculated

RegressionCalculated

ForecastCalculated

ProbabilityCalculated

ConfidenceCalculated

RankingCalculated

ValidationFailed

CacheHit

CacheMiss

────────────────────────────────────────

Dependencies

• FUNCTION_ENGINE
• EXPRESSION_ENGINE
• EVALUATOR_ENGINE
• ARRAY_ENGINE
• MATH_ENGINE
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
• Hỗ trợ đầy đủ hơn 120 hàm thống kê
• Hỗ trợ Descriptive Statistics
• Hỗ trợ Regression Analysis
• Hỗ trợ Correlation
• Hỗ trợ Probability Distribution
• Hỗ trợ Forecast Functions
• Hỗ trợ Ranking Functions
• Hỗ trợ Dynamic Arrays
• Hỗ trợ Multi-thread Calculation
• Hỗ trợ High Precision Statistics
• Hỗ trợ Streaming Dataset
• Enterprise Ready
• Production Ready
