import os

path = "c:/Users/taduc/.gemini/antigravity-ide/scratch/OfficeX/apps/excel/src/renderer/App.tsx"

with open(path, "r", encoding="utf-8") as f:
    data = f.read()

# 1. Add import PivotTableDialog
search_import = "import { InsertFunctionDialog } from './InsertFunctionDialog';"
replace_import = "import { InsertFunctionDialog } from './InsertFunctionDialog';\nimport { PivotTableDialog } from './PivotTableDialog';"

if search_import in data:
    data = data.replace(search_import, replace_import)

# 2. Add state isPivotTableOpen
search_state = "const [isInsertFunctionOpen, setIsInsertFunctionOpen] = useState(false);"
replace_state = "const [isInsertFunctionOpen, setIsInsertFunctionOpen] = useState(false);\n  const [isPivotTableOpen, setIsPivotTableOpen] = useState(false);"

if search_state in data:
    data = data.replace(search_state, replace_state)

# 3. Add command EXCEL.INSERT.PIVOT_TABLE
search_cmd = "{ id: 'EXCEL.VIEW.OPEN_INSERT_FUNCTION', name: 'Open Insert Function Dialog', handler: () => setIsInsertFunctionOpen(true) },"
replace_cmd = "{ id: 'EXCEL.VIEW.OPEN_INSERT_FUNCTION', name: 'Open Insert Function Dialog', handler: () => setIsInsertFunctionOpen(true) },\n      { id: 'EXCEL.INSERT.PIVOT_TABLE', name: 'Open Pivot Table Dialog', handler: () => setIsPivotTableOpen(true) },"

if search_cmd in data:
    data = data.replace(search_cmd, replace_cmd)

# 4. Render PivotTableDialog
search_render = """      {/* Insert Function Dialog */}
      {isInsertFunctionOpen && (
        <InsertFunctionDialog 
          onClose={() => setIsInsertFunctionOpen(false)} 
        />
      )}"""
replace_render = """      {/* Insert Function Dialog */}
      {isInsertFunctionOpen && (
        <InsertFunctionDialog 
          onClose={() => setIsInsertFunctionOpen(false)} 
        />
      )}
      
      {/* Pivot Table Dialog */}
      {isPivotTableOpen && (
        <PivotTableDialog 
          onClose={() => setIsPivotTableOpen(false)} 
        />
      )}"""

if search_render in data:
    data = data.replace(search_render, replace_render)

with open(path, "w", encoding="utf-8") as f:
    f.write(data)
