import os

path = "c:/Users/taduc/.gemini/antigravity-ide/scratch/OfficeX/apps/excel/src/renderer/App.tsx"

with open(path, "r", encoding="utf-8") as f:
    data = f.read()

search_cmd = "{ id: 'EXCEL.INSERT.PIVOT_TABLE', name: 'Open Pivot Table Dialog', handler: () => setIsPivotTableOpen(true) },"
replace_cmd = "{ id: 'EXCEL.INSERT.PIVOT_TABLE', name: 'Open Pivot Table Dialog', handler: () => { console.log('PIVOT HANDLER CALLED'); setIsPivotTableOpen(true); } },"

if search_cmd in data:
    data = data.replace(search_cmd, replace_cmd)

with open(path, "w", encoding="utf-8") as f:
    f.write(data)
