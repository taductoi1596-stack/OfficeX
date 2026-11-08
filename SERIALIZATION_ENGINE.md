Mục tiêu

SERIALIZATION_ENGINE chịu trách nhiệm lưu và khôi phục toàn bộ trạng thái của Calculation Engine trong OfficeX Excel.

Engine này đảm bảo toàn bộ Formula AST, Dependency Graph, Calculation Chain, Cache, Dynamic Array, Named Range và các trạng thái Runtime có thể được Serialize và Deserialize nhanh chóng để hỗ trợ Save, AutoSave, Recovery, Undo/Redo và Resume Calculation.

Không trực tiếp thực thi công thức.

Không phụ thuộc giao diện người dùng.

Tương thích hoàn toàn Microsoft Excel 365 và chuẩn OOXML.

────────────────────────────────────────

Kiến trúc

Workbook

↓

Calculation Engine

↓

SERIALIZATION_ENGINE

↓

Serializer

↓

Binary Writer

↓

JSON Writer

↓

OOXML Writer

↓

Storage

↓

Deserializer

↓

Calculation Engine

────────────────────────────────────────

Mục tiêu thiết kế

Runtime Objects

↓

Serialize

↓

Binary / OOXML / JSON

↓

Disk / Memory

↓

Deserialize

↓

Restore Runtime

────────────────────────────────────────

Chức năng chính

• Formula Serialization

• Formula Deserialization

• AST Serialization

• Dependency Graph Serialization

• Calculation Chain Serialization

• Cache Serialization

• Dynamic Array Serialization

• Spill Serialization

• Lambda Serialization

• Named Range Serialization

• Memory Snapshot

• Runtime Snapshot

• Incremental Snapshot

• Recovery Snapshot

• Undo Snapshot

• Redo Snapshot

• Compression

• Version Compatibility

────────────────────────────────────────

Các thành phần Serialize

Workbook State

Worksheet State

Calculation State

Formula AST

Dependency Graph

Calculation Chain

Dynamic Arrays

Spill Ranges

Lookup Cache

Formula Cache

Calculation Cache

Validation Cache

Metadata

Runtime Configuration

────────────────────────────────────────

Supported Formats

Binary

JSON

XML

OOXML

ZIP Package

Memory Buffer

Snapshot File

────────────────────────────────────────

OOXML Support

Workbook.xml

Worksheet.xml

SharedStrings.xml

Styles.xml

CalcChain.xml

DefinedNames.xml

ExternalLinks.xml

Relationships

Content Types

────────────────────────────────────────

Snapshot Types

Full Snapshot

Incremental Snapshot

Memory Snapshot

AutoSave Snapshot

Recovery Snapshot

Undo Snapshot

Redo Snapshot

Checkpoint Snapshot

────────────────────────────────────────

Runtime Objects

Formula

AST

Reference

Dependency

Calculation Queue

Dirty Cells

Dirty Ranges

Named Range

Lambda

Dynamic Array

Spill Range

Lookup Table

────────────────────────────────────────

Compression

LZ4

ZSTD

ZIP

Deflate

Delta Compression

Dictionary Compression

────────────────────────────────────────

Version Compatibility

Version Detection

Backward Compatibility

Forward Compatibility

Schema Upgrade

Migration

────────────────────────────────────────

Recovery

Unexpected Shutdown

Power Failure

Crash Recovery

Partial Recovery

Memory Recovery

Auto Recovery

────────────────────────────────────────

Incremental Save

Changed Formula

Changed Cache

Changed Dependency

Changed Dynamic Array

Changed Metadata

Only Serialize Changes

────────────────────────────────────────

Validation

Checksum

CRC32

SHA256

File Integrity

Schema Validation

Object Validation

Reference Validation

────────────────────────────────────────

Optimization

• Incremental Serialization

• Parallel Serialization

• Background Save

• Zero Copy Buffer

• Memory Mapping

• Streaming Writer

• Streaming Reader

• Compression Pipeline

• Lazy Deserialization

────────────────────────────────────────

Cache

Serialization Cache

Object Cache

Snapshot Cache

Compression Cache

Metadata Cache

────────────────────────────────────────

Memory Management

Shared Buffer

Memory Pool

Copy-on-Write

Zero Copy

Mapped Memory

Pinned Buffer

────────────────────────────────────────

API

Initialize()

Serialize()

Deserialize()

SerializeWorkbook()

SerializeWorksheet()

SerializeFormula()

SerializeAST()

SerializeDependency()

SerializeCache()

SerializeSnapshot()

LoadSnapshot()

SaveSnapshot()

Compress()

Decompress()

Validate()

Export()

Import()

Shutdown()

────────────────────────────────────────

Events

SerializationStarted

SerializationCompleted

DeserializationStarted

DeserializationCompleted

SnapshotCreated

SnapshotLoaded

RecoveryStarted

RecoveryCompleted

CompressionStarted

CompressionCompleted

ValidationPassed

ValidationFailed

────────────────────────────────────────

Dependencies

• CALCULATION_ENGINE

• FORMULA_ENGINE

• AST_ENGINE

• DEPENDENCY_ENGINE

• CALCULATION_CHAIN

• CACHE_ENGINE

• DYNAMIC_ARRAY_ENGINE

• SPILL_ENGINE

• MEMORY_ENGINE

• VALIDATION_ENGINE

• OPENXML_FORMULA_ENGINE

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

Cấu hình

Enable Auto Snapshot

Enable Incremental Save

Enable Compression

Enable Background Serialization

Enable Recovery Snapshot

Enable Memory Mapping

Enable Checksum

Enable Version Compatibility

Enable Streaming Mode

────────────────────────────────────────

Yêu cầu

• Tương thích Microsoft Excel 365

• Tương thích chuẩn OOXML

• Serialize toàn bộ Runtime Calculation State

• Hỗ trợ Formula AST

• Hỗ trợ Dependency Graph

• Hỗ trợ Calculation Chain

• Hỗ trợ Dynamic Arrays

• Hỗ trợ Spill Range

• Hỗ trợ Cache Snapshot

• Hỗ trợ Incremental Serialization

• Hỗ trợ Background Save

• Hỗ trợ Crash Recovery

• Hỗ trợ Undo/Redo Snapshot

• Hỗ trợ Compression tốc độ cao

• Hỗ trợ Workbook trên 10 triệu công thức

• Multi-thread Safe

• Enterprise Ready

• Production Ready
