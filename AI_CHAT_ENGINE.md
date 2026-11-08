# AI_CHAT_ENGINE.md

Version: 1.0

Module: AI Chat Engine

Engine Level: Core Engine

Status: Enterprise Core

Priority: ⭐⭐⭐⭐⭐

Frozen: YES

Production Ready: YES

---

# Objective

AI_CHAT_ENGINE is responsible for all conversational AI features
inside OfficeX.

It manages conversations between users and AI.

Supports local LLMs such as Qwen3 8B.

Supports streaming.

Supports document-aware conversations.

Supports multiple conversations simultaneously.

This engine NEVER communicates directly with AI providers.

AI_PROVIDER_ENGINE performs inference.

---

# Architecture

Ribbon

↓

AI Sidebar

↓

AI_CHAT_ENGINE

↓

AI_ENGINE

↓

AI_PROVIDER_ENGINE

↓

Qwen3 8B

Ollama

LM Studio

vLLM

---

# Responsibilities

Conversation Management

Streaming Chat

Chat History

Conversation Tree

Session Restore

Chat Context

Prompt Assembly

Conversation Search

Conversation Export

Conversation Import

Pinned Conversations

Conversation Rename

Conversation Delete

Conversation Archive

Conversation Branch

Conversation Merge

Conversation Synchronization

---

# Supported Chat Modes

General Chat

Document Chat

Selection Chat

Page Chat

Section Chat

Table Chat

Chart Chat

Image Chat

Equation Chat

Comment Chat

Header/Footer Chat

Plugin Chat

Developer Chat

OpenXML Chat

Code Chat

Translation Chat

Writing Assistant

Research Assistant

Meeting Assistant

Knowledge Base Chat

---

# Conversation Manager

Create Conversation

Delete Conversation

Rename Conversation

Archive Conversation

Restore Conversation

Pin Conversation

Duplicate Conversation

Branch Conversation

Merge Conversation

Clear Conversation

---

# Message Manager

User Message

Assistant Message

System Message

Developer Message

Plugin Message

Tool Message

Hidden Context

Streaming Tokens

Markdown Message

Rich Text Message

OpenXML Message

Image Message

Table Message

Chart Message

File Attachment

---

# Session Manager

Create Session

Close Session

Resume Session

Pause Session

Save Session

Restore Session

Workspace Session

Project Session

---

# Context Manager

Current Document

Current Selection

Current Paragraph

Current Page

Current Section

Current Cursor

Current Style

Current Metadata

Comments

Track Changes

Headers

Footers

Bookmarks

Hyperlinks

Tables

Charts

Images

SmartArt

Equations

---

# Prompt Builder

System Prompt

Developer Prompt

Conversation History

Document Context

Selection Context

User Prompt

Plugin Prompt

Tool Prompt

---

# Streaming Manager

Start Stream

Receive Tokens

Pause

Resume

Cancel

Retry

Finish

---

# Conversation Memory

Short Term Memory

Long Term Memory

Pinned Facts

Document Facts

Conversation Summary

Context Compression

Sliding Window

Memory Cleanup

---

# Conversation Search

Keyword Search

Semantic Search

Date Search

Document Search

Tag Search

Pinned Search

---

# Attachments

Text

Images

Tables

Charts

SmartArt

Equations

PDF

DOCX

Markdown

OpenXML

JSON

CSV

---

# Chat Sidebar

Conversation List

Search

Pinned Chats

Recent Chats

New Chat

Delete Chat

Rename Chat

Export Chat

Import Chat

Settings

---

# AI Actions

Insert Response

Replace Selection

Append Below

Copy Response

Create Comment

Generate Table

Generate SmartArt

Generate Outline

Generate Timeline

Generate Summary

Generate Image Prompt

Generate Metadata

Create Bookmark

Create Footnote

Create Citation

---

# APIs

Chat.Initialize()

Chat.New()

Chat.Open()

Chat.Close()

Chat.Send()

Chat.Stream()

Chat.Cancel()

Chat.Stop()

Chat.Retry()

Chat.Delete()

Chat.Rename()

Chat.Archive()

Chat.Restore()

Chat.Export()

Chat.Import()

Chat.Search()

Chat.Pin()

Chat.Unpin()

Chat.GetHistory()

Chat.Clear()

---

# Events

ChatCreated

ChatOpened

ChatClosed

MessageSent

MessageReceived

StreamingStarted

StreamingStopped

TokenReceived

ConversationArchived

ConversationDeleted

ConversationRestored

ConversationRenamed

ChatError

---

# Chat Commands

WORD.AI.CHAT

WORD.AI.NEW_CHAT

WORD.AI.CLEAR_CHAT

WORD.AI.EXPORT_CHAT

WORD.AI.IMPORT_CHAT

WORD.AI.DELETE_CHAT

WORD.AI.RENAME_CHAT

WORD.AI.PIN_CHAT

WORD.AI.SEARCH_CHAT

WORD.AI.RETRY

WORD.AI.STOP

WORD.AI.COPY

WORD.AI.INSERT

WORD.AI.REPLACE

WORD.AI.APPEND

---

# Error Codes

CHAT_NOT_FOUND

SESSION_EXPIRED

MESSAGE_TOO_LONG

TOKEN_LIMIT

STREAM_CANCELLED

STREAM_TIMEOUT

INVALID_CONTEXT

INVALID_ATTACHMENT

PROVIDER_OFFLINE

MODEL_UNAVAILABLE

UNKNOWN_ERROR

---

# Performance

Streaming

Incremental Rendering

Async

Multi-thread

Conversation Cache

Memory Cache

Lazy Loading

GPU Friendly

CPU Fallback

---

# Security

Local AI First

No Internet Required

Conversation Encryption

Permission Check

Sensitive Data Filter

Workspace Isolation

Plugin Sandbox

---

# Dependencies

Depends On

AI_ENGINE

AI_PROVIDER_ENGINE

AI_CONTEXT_ENGINE

AI_PROMPT_ENGINE

AI_MEMORY_ENGINE

AI_STREAM_ENGINE

DOCUMENT_ENGINE

TEXT_ENGINE

COMMENT_ENGINE

TRACK_CHANGES_ENGINE

PLUGIN_ENGINE

Uses

CACHE_ENGINE

HISTORY_ENGINE

SEARCH_ENGINE

Does NOT depend on

Ribbon

Layout Engine

Render Engine

Viewport Engine

Mouse

Keyboard

---

# Enterprise Requirements

✔ Microsoft Copilot Style

✔ Local Qwen3 8B Ready

✔ Ollama Ready

✔ LM Studio Ready

✔ Streaming Response

✔ Multi Conversation

✔ Conversation Search

✔ Conversation Branch

✔ Conversation Export

✔ Conversation Import

✔ Undo/Redo Compatible

✔ Track Changes Compatible

✔ OpenXML Compatible

✔ Plugin Ready

✔ Enterprise Ready

✔ Production Ready

---

# Version Policy

Current Version

1.0

Frozen

YES

Breaking Changes

Not Allowed

Extension

Plugin SDK Only

End of AI_CHAT_ENGINE.md
