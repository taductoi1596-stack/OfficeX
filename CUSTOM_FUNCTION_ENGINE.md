Mục tiêu

CUSTOM_FUNCTION_ENGINE chịu trách nhiệm tạo, quản lý và thực thi các hàm do người dùng, Plugin hoặc AI định nghĩa trong OfficeX Excel.

Engine này mở rộng FUNCTION_ENGINE nhưng không thay thế các hàm tích hợp của Excel.

Hỗ trợ User Defined Functions (UDF), Plugin Functions, Script Functions và AI Functions.

Không phụ thuộc giao diện người dùng.

Chức năng chính

• Tạo hàm người dùng (User Defined Function)
• Chỉnh sửa hàm
• Xóa hàm
• Đăng ký hàm
• Hủy đăng ký hàm
• Thực thi hàm
• Nạp hàm từ Plugin
• Nạp hàm từ Script
• Nạp hàm từ AI
• Quản lý Namespace
• Quản lý phiên bản hàm
• Kiểm tra tham số
• Kiểm tra kiểu dữ liệu
• Kiểm tra quyền thực thi
• Hỗ trợ Async Function
• Hỗ trợ Dynamic Array
• Hỗ trợ Spill
• Hỗ trợ Lambda Wrapper
• Hỗ trợ Recursive Function
• Hỗ trợ Cache
• Hỗ trợ Hot Reload

Nguồn hàm

• User Defined Function (UDF)
• Plugin Function
• JavaScript Function
• TypeScript Function
• Python Function
• Lua Function
• AI Function
• Macro Function
• Internal Extension Function

Kiểu hàm

• Scalar Function
• Array Function
• Dynamic Array Function
• Volatile Function
• Async Function
• Recursive Function
• Lambda Function

Metadata của hàm

• Function ID
• Function Name
• Display Name
• Namespace
• Category
• Description
• Author
• Version
• Created Date
• Modified Date
• Signature
• Return Type
• Parameter Count
• Parameter Types
• Optional Parameters
• Supports Array
• Supports Dynamic Array
• Supports Spill
• Supports Async
• Supports Recursion
• Supports GPU
• Is Volatile
• Is Thread Safe
• Is Sandbox
• Permission Level

Định dạng khai báo

• JavaScript
• TypeScript
• Python
• Lua
• JSON Definition
• YAML Definition

Ví dụ

=MYSUM(A1:A10)

=DISCOUNT(A1,B1)

=AI_TRANSLATE(A1)

=GET_WEATHER("Hanoi")

=MYFILTER(A1:A100)

=PLUGIN.STOCKPRICE("MSFT")

API

Initialize()

CreateFunction()

RegisterFunction()

RegisterPluginFunction()

RegisterScriptFunction()

RegisterAIFunction()

UpdateFunction()

DeleteFunction()

Execute()

ExecuteAsync()

Validate()

Compile()

Reload()

Unload()

Enable()

Disable()

GetFunction()

GetMetadata()

GetAllFunctions()

Events

FunctionCreated

FunctionRegistered

FunctionUpdated

FunctionDeleted

FunctionExecuted

FunctionFailed

PluginLoaded

PluginUnloaded

FunctionReloaded

SandboxViolation

Quản lý Namespace

• USER.*
• PLUGIN.*
• AI.*
• SCRIPT.*
• INTERNAL.*

Sandbox

• Không cho phép truy cập trực tiếp hệ điều hành nếu chưa cấp quyền
• Giới hạn bộ nhớ
• Giới hạn CPU
• Giới hạn thời gian thực thi
• Chặn vòng lặp vô hạn
• Chặn truy cập trái phép tới Workbook
• Kiểm tra mã độc trước khi đăng ký

Cache

• Function Cache
• Result Cache
• Parameter Cache
• Compilation Cache

Bảo mật

• Code Signing
• Permission Control
• Sandbox Execution
• Trusted Plugin
• Trusted Script
• Secure Loading

Phụ thuộc

• FUNCTION_ENGINE
• FUNCTION_REGISTRY
• CALCULATION_ENGINE
• VALIDATION_ENGINE
• CACHE_ENGINE
• PLUGIN_ENGINE
• SCRIPT_ENGINE
• AI_ENGINE
• SECURITY_ENGINE
• SERIALIZATION_ENGINE

Không phụ thuộc

• Ribbon
• UI
• Viewport
• Render Engine
• Printer
• Mouse
• Keyboard

Yêu cầu

• Hỗ trợ User Defined Function (UDF)
• Hỗ trợ Plugin Function
• Hỗ trợ AI Function
• Hỗ trợ JavaScript, TypeScript, Python và Lua
• Hỗ trợ Dynamic Array
• Hỗ trợ Async Function
• Hỗ trợ Volatile Function
• Hỗ trợ Sandbox
• Hỗ trợ Hot Reload
• Hỗ trợ Namespace
• Tương thích Microsoft Excel UDF ở mức tối đa có thể
• Enterprise Ready
• Production Ready
