Mục tiêu

FUNCTION_REGISTRY là trung tâm đăng ký, quản lý và tra cứu toàn bộ hàm trong OfficeX Excel.

Engine này không trực tiếp thực hiện tính toán.

Nó chỉ chịu trách nhiệm quản lý metadata của hàm và cung cấp thông tin cho FUNCTION_ENGINE.

Mọi hàm Excel, hàm mở rộng và hàm người dùng (UDF) đều phải được đăng ký tại đây.

Không phụ thuộc giao diện người dùng.

Chức năng chính

• Đăng ký hàm
• Hủy đăng ký hàm
• Tra cứu hàm
• Quản lý danh mục hàm
• Quản lý metadata
• Quản lý chữ ký hàm (Function Signature)
• Quản lý số lượng tham số
• Quản lý kiểu tham số
• Quản lý kiểu dữ liệu trả về
• Quản lý mô tả hàm
• Quản lý ví dụ sử dụng
• Quản lý từ khóa tìm kiếm
• Quản lý phiên bản hàm
• Quản lý khả năng tương thích
• Quản lý hàm nội bộ
• Quản lý hàm Plugin
• Quản lý hàm AI
• Quản lý User Defined Function (UDF)
• Quản lý hàm bất đồng bộ (Async)
• Quản lý Volatile Function
• Quản lý Dynamic Array Function
• Quản lý Lambda Function

Loại hàm

• Built-in Function
• Custom Function
• User Defined Function
• Plugin Function
• AI Function
• Internal Function
• Async Function
• Volatile Function
• Dynamic Array Function
• Lambda Function

Danh mục hàm

• Math
• Logical
• Lookup & Reference
• Text
• Date & Time
• Statistical
• Financial
• Database
• Engineering
• Information
• Dynamic Array
• Compatibility
• Cube
• Web
• Custom

Metadata của mỗi hàm

• Function ID
• Function Name
• Display Name
• Localized Name
• Category
• Description
• Syntax
• Signature
• Return Type
• Parameter Count
• Parameter Types
• Optional Parameters
• Supports Array
• Supports Dynamic Array
• Supports Spill
• Supports Async
• Supports Lambda
• Is Volatile
• Is Thread Safe
• Is GPU Enabled
• Excel Version
• Introduced Version
• Deprecated
• Examples
• Keywords

API

Initialize()

Register()

RegisterBuiltin()

RegisterCustom()

RegisterPlugin()

RegisterAI()

RegisterLambda()

Unregister()

Exists()

Find()

FindById()

FindByName()

FindByCategory()

FindByKeyword()

GetFunction()

GetMetadata()

GetDescription()

GetSignature()

GetExamples()

GetParameterInfo()

GetReturnType()

GetCategory()

GetFunctionCount()

GetAllFunctions()

GetCategories()

Refresh()

Clear()

Events

RegistryInitialized

FunctionRegistered

FunctionUpdated

FunctionRemoved

RegistryReloaded

PluginLoaded

PluginUnloaded

CustomFunctionAdded

CustomFunctionRemoved

Validation Rules

• Không cho phép trùng Function ID.
• Không cho phép trùng Function Name.
• Kiểm tra Signature hợp lệ.
• Kiểm tra Parameter Type.
• Kiểm tra Return Type.
• Kiểm tra Version Compatibility.
• Kiểm tra Plugin Conflict.

Tìm kiếm

• Theo tên
• Theo ID
• Theo Category
• Theo Keyword
• Theo Version
• Theo Return Type
• Theo Parameter Count
• Theo Plugin
• Theo UDF

Phụ thuộc

• SERIALIZATION_ENGINE
• VALIDATION_ENGINE
• CACHE_ENGINE
• PLUGIN_ENGINE
• CUSTOM_FUNCTION_ENGINE

Không phụ thuộc

• Ribbon
• UI
• Viewport
• Render Engine
• Printer
• Mouse
• Keyboard
• CALCULATION_ENGINE
• FUNCTION_ENGINE

Yêu cầu

• Quản lý hơn 600 hàm Excel
• Hỗ trợ Plugin Function
• Hỗ trợ User Defined Function
• Hỗ trợ AI Function
• Hỗ trợ Dynamic Array Function
• Hỗ trợ Lambda Function
• Hỗ trợ đa ngôn ngữ
• Tra cứu O(1) bằng Hash Map
• Hỗ trợ mở rộng không cần sửa mã nguồn
• Enterprise Ready
• Production Ready
