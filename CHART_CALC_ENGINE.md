Mục tiêu

CHART_CALC_ENGINE chịu trách nhiệm tính toán toàn bộ dữ liệu phục vụ Chart trong OfficeX Excel.

Engine này chuyển đổi dữ liệu từ Worksheet, Table, PivotTable hoặc Dynamic Array thành Chart Data Series, Axis, Category và các giá trị thống kê để CHART_RENDER_ENGINE hiển thị.

Đây là Data Processing Engine.

Không trực tiếp vẽ biểu đồ.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365.

────────────────────────────────────────

Kiến trúc

Workbook

↓

Worksheet

↓

Range / Table / Pivot

↓

CHART_CALC_ENGINE

↓

Series Engine

↓

Axis Engine

↓

Statistics Engine

↓

Chart Data Model

↓

CHART_RENDER_ENGINE

────────────────────────────────────────

Mục tiêu thiết kế

Worksheet Data

↓

Extract

↓

Normalize

↓

Calculate

↓

Series

↓

Axis

↓

Chart Model

↓

Render

────────────────────────────────────────

Chức năng chính

• Data Extraction
• Series Calculation
• Axis Calculation
• Category Generation
• Value Generation
• Dynamic Range Update
• Chart Statistics
• Trendline Calculation
• Error Bar Calculation
• Forecast Calculation
• Histogram Calculation
• Box Plot Calculation
• Pareto Calculation
• Waterfall Calculation
• Funnel Calculation
• Bubble Scaling
• Scatter Calculation
• Radar Calculation
• Surface Grid Calculation

────────────────────────────────────────

Chart Types

Column
Bar
Line
Area
Pie
Doughnut
Scatter
Bubble
Radar
Surface
Stock
Histogram
Pareto
Waterfall
Treemap
Sunburst
Box & Whisker
Funnel
Map
Combo

────────────────────────────────────────

Data Sources

Worksheet Range
Excel Table
Pivot Table
Named Range
Dynamic Array
Formula Result
External Workbook
Power Query
Database
CSV
JSON

────────────────────────────────────────

Series Engine

Primary Series
Secondary Series
Multiple Series
Series Group
Series Label
Series Formula
Series Visibility
Series Ordering

────────────────────────────────────────

Axis Engine

Primary Axis
Secondary Axis
Category Axis
Value Axis
Date Axis
Logarithmic Axis
Custom Scale
Auto Scale

────────────────────────────────────────

Category Calculation

Text Category
Date Category
Numeric Category
Grouped Category
Hierarchical Category

────────────────────────────────────────

Value Calculation

SUM
AVERAGE
COUNT
MIN
MAX
MEDIAN
PERCENTILE
Running Total
Moving Average
Weighted Average

────────────────────────────────────────

Trendline Support

Linear
Polynomial
Logarithmic
Power
Exponential
Moving Average
Custom Equation
R² Calculation

────────────────────────────────────────

Error Bar Calculation

Standard Error
Standard Deviation
Percentage
Fixed Value
Custom Value
Positive
Negative

────────────────────────────────────────

Forecast

Linear Forecast
Exponential Forecast
Seasonal Forecast
Confidence Interval
Prediction Range

────────────────────────────────────────

Histogram

Bucket Size
Automatic Bucket
Overflow Bucket
Underflow Bucket
Frequency
Distribution

────────────────────────────────────────

Pareto

Frequency
Sorted Frequency
Cumulative Percentage
80/20 Analysis

────────────────────────────────────────

Waterfall

Increase
Decrease
Subtotal
Grand Total
Running Balance

────────────────────────────────────────

Bubble Chart

Bubble Radius
Bubble Area
Bubble Scaling
Bubble Color
Bubble Size

────────────────────────────────────────

Scatter Chart

X Values
Y Values
Multiple Series
Regression Line
Correlation

────────────────────────────────────────

Radar Chart

Angle Calculation
Radius Calculation
Series Overlay
Filled Radar

────────────────────────────────────────

Surface Chart

Grid Matrix
Height Map
Interpolation
Contour Lines

────────────────────────────────────────

Dynamic Updates

Insert Row
Delete Row
Insert Column
Delete Column
Resize Table
Resize Dynamic Array
Pivot Refresh
Workbook Refresh

────────────────────────────────────────

Statistics

Maximum
Minimum
Average
Median
Mode
Variance
Standard Deviation
Percentile
Quartile
Correlation
Regression

────────────────────────────────────────

Validation

Empty Range
Invalid Range
Broken Reference
Unsupported Chart
Missing Series
Axis Error
Category Error
Dynamic Array Error

────────────────────────────────────────

Optimization

• Incremental Calculation
• Parallel Series Calculation
• Vectorized Calculation
• Shared Data Cache
• Lazy Statistics
• Cached Axis
• Cached Series
• Dynamic Update Only
• Background Calculation

────────────────────────────────────────

Cache

Series Cache
Axis Cache
Statistics Cache
Category Cache
Trendline Cache
Histogram Cache
Pivot Cache

────────────────────────────────────────

Memory Management

Series Pool
Axis Pool
Statistics Pool
Shared Buffer
Memory Pool
Zero Copy

────────────────────────────────────────

API

Initialize()
Calculate()
CalculateSeries()
CalculateAxis()
CalculateCategories()
CalculateValues()
CalculateTrendline()
CalculateErrorBars()
CalculateHistogram()
CalculatePareto()
CalculateForecast()
Refresh()
Validate()
ExportData()
ClearCache()
Shutdown()

────────────────────────────────────────

Events

CalculationStarted
CalculationCompleted
SeriesCalculated
AxisCalculated
StatisticsCalculated
TrendlineCalculated
ChartUpdated
PivotUpdated
ValidationPassed
ValidationFailed

────────────────────────────────────────

Dependencies

• RANGE_ENGINE
• TABLE_ENGINE
• CELL_ENGINE
• FORMULA_ENGINE
• CALCULATION_ENGINE
• PIVOT_ENGINE
• DYNAMIC_ARRAY_ENGINE
• CACHE_ENGINE
• MEMORY_ENGINE
• PERFORMANCE_ENGINE
• VALIDATION_ENGINE

────────────────────────────────────────

Không phụ thuộc

• Ribbon
• UI
• CHART_RENDER_ENGINE
• Printer
• Mouse
• Keyboard

────────────────────────────────────────

Cấu hình

Enable Dynamic Update
Enable Trendline
Enable Forecast
Enable Histogram
Enable Pareto
Enable Statistics Cache
Enable Parallel Calculation
Enable Incremental Refresh
Enable Pivot Integration

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365
• Hỗ trợ toàn bộ loại biểu đồ Excel
• Hỗ trợ nhiều Data Series
• Hỗ trợ Dynamic Array
• Hỗ trợ Pivot Chart
• Hỗ trợ Trendline, Error Bars và Forecast
• Tự động cập nhật khi dữ liệu thay đổi
• Tối ưu cho Workbook lớn với hàng triệu điểm dữ liệu
• Multi-thread Safe
• Enterprise Ready
• Production Ready
