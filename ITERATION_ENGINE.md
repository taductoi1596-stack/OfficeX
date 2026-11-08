Mục tiêu

ITERATION_ENGINE chịu trách nhiệm phát hiện, quản lý và thực thi các phép tính lặp (Iterative Calculation) trong OfficeX Excel.

Engine này xử lý Circular Reference theo cách tương thích với Microsoft Excel 365.

Cho phép Workbook tiếp tục tính toán khi người dùng bật Iterative Calculation.

Không trực tiếp thực hiện tính toán công thức.

Không phụ thuộc giao diện người dùng.

Chức năng chính

• Phát hiện Circular Reference
• Quản lý Iterative Calculation
• Theo dõi vòng lặp
• Giới hạn số lần lặp
• Kiểm tra sai số hội tụ
• Theo dõi trạng thái hội tụ
• Phát hiện Divergence
• Phát hiện Infinite Loop
• Hỗ trợ Recursive Formula
• Hỗ trợ Recursive Lambda
• Quản lý Circular Chain
• Quản lý Circular Graph
• Hỗ trợ Incremental Iteration
• Hỗ trợ Background Iteration
• Hỗ trợ Multi-thread Iteration
• Hỗ trợ Iteration Cache

Đối tượng quản lý

• Cell
• Range
• Formula
• Array Formula
• Dynamic Array
• Named Formula
• Lambda Formula
• Workbook
• Worksheet

Circular Reference

• Direct Circular Reference
• Indirect Circular Reference
• Self Reference
• Recursive Formula
• Recursive Lambda
• Cross Sheet Circular Reference
• Cross Workbook Circular Reference

Iterative Calculation

• Enable Iteration
• Disable Iteration
• Maximum Iterations
• Maximum Change
• Convergence Detection
• Divergence Detection
• Stop Condition
• Resume Calculation
• Restart Calculation

Trạng thái Iteration

• Ready
• Running
• Converged
• Diverged
• Cancelled
• Timeout
• Failed
• Completed

Convergence

• Absolute Error
• Relative Error
• Delta Comparison
• Stable Result
• Maximum Change Threshold

Divergence

• Infinite Growth
• Infinite Oscillation
• NaN
• Overflow
• Invalid Result

Stop Conditions

• Maximum Iterations Reached
• Converged
• Diverged
• User Cancelled
• Workbook Closed
• Formula Deleted

Iteration Settings

• Maximum Iterations
• Maximum Change
• Enable Multi-thread
• Enable Background Calculation
• Enable Cache
• Enable Auto Stop

Cache

• Iteration Cache
• Result Cache
• Circular Graph Cache
• State Cache

Validation

• Circular Graph Validation
• Recursion Depth
• Iteration Limit
• Convergence Validation
• Formula Validation
• Lambda Validation

API

Initialize()

Enable()

Disable()

DetectCircularReference()

BuildCircularGraph()

StartIteration()

StopIteration()

RestartIteration()

PauseIteration()

ResumeIteration()

SetMaximumIterations()

SetMaximumChange()

GetCurrentIteration()

GetIterationState()

GetConvergence()

GetCircularChain()

Validate()

ClearCache()

Events

IterationStarted

IterationCompleted

IterationPaused

IterationResumed

IterationCancelled

IterationFailed

CircularReferenceDetected

CircularReferenceResolved

ConvergenceDetected

DivergenceDetected

MaximumIterationReached

MaximumChangeReached

SettingsChanged

Phụ thuộc

• CALCULATION_ENGINE
• DEPENDENCY_ENGINE
• CALCULATION_CHAIN
• FORMULA_ENGINE
• LAMBDA_ENGINE
• CACHE_ENGINE
• VALIDATION_ENGINE
• ERROR_ENGINE
• MEMORY_ENGINE
• PERFORMANCE_ENGINE

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
• Hỗ trợ Circular Reference đầy đủ
• Hỗ trợ Iterative Calculation
• Hỗ trợ Recursive Formula
• Hỗ trợ Recursive Lambda
• Hỗ trợ Convergence Detection
• Hỗ trợ Divergence Detection
• Hỗ trợ Multi-thread Iteration
• Hỗ trợ Background Iteration
• Hỗ trợ Incremental Iteration
• Hỗ trợ Iteration Cache
• Tối ưu hiệu năng cho Workbook lớn
• Enterprise Ready
• Production Ready
