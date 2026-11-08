import os

path = "c:/Users/taduc/.gemini/antigravity-ide/scratch/OfficeX/apps/excel/src/renderer/App.tsx"

with open(path, "r", encoding="utf-8") as f:
    data = f.read()

data = data.replace(
    "sheet.setCellValue(ac.row, ac.col, pasteText);",
    "calcEngine.updateCell(sheet, ac.row, ac.col, pasteText);"
)
data = data.replace(
    "sheet.setCellValue(cbMinR + r, cbMinC + c, '');",
    "calcEngine.updateCell(sheet, cbMinR + r, cbMinC + c, '');"
)
data = data.replace(
    "sheet.setCellValue(destR, destC, src.value);",
    "calcEngine.updateCell(sheet, destR, destC, String(src.value || ''));"
)
data = data.replace(
    "sheet.setCellValue(r, c, data.formula || data.value || '');",
    "calcEngine.updateCell(sheet, r, c, String(data.formula || data.value || ''));"
)
data = data.replace(
    "sheet.setCellValue(r, c, '');",
    "calcEngine.updateCell(sheet, r, c, '');"
)
data = data.replace(
    "sheet.setCellValue(ac.row, ac.col, '');",
    "calcEngine.updateCell(sheet, ac.row, ac.col, '');"
)
data = data.replace(
    "sheet.setCellValue(r, c, srcCell.formula || srcCell.value || '');",
    "calcEngine.updateCell(sheet, r, c, String(srcCell.formula || srcCell.value || ''));"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(data)
