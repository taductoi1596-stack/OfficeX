import os

path = "c:/Users/taduc/.gemini/antigravity-ide/scratch/OfficeX/apps/excel/src/renderer/App.tsx"

with open(path, "r", encoding="utf-8") as f:
    data = f.read()

search_str = """        }
      },
      {
        id: 'EXCEL.EDIT.CLEAR_ALL', name: 'Clear All', handler: () => {"""

replacement_str = """        }
      },
      {
        id: 'EXCEL.DATA.FILTER_BY_VALUE', name: 'Filter by Value', handler: () => {
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          const map = sheet.getCellsMap();
          const targetCell = map.get(`${ac.row},${ac.col}`);
          const targetValue = targetCell ? (targetCell.value || '') : '';
          
          setRowHeights(prev => {
            const next = { ...prev };
            let maxRow = 100;
            map.forEach((cell, key) => {
              if (cell.col === ac.col && cell.row > maxRow) maxRow = cell.row;
            });
            if (maxRow > 1000) maxRow = 1000;
            for (let r = 1; r <= maxRow; r++) {
               if (r === ac.row) {
                  if (next[r] === 0) delete next[r];
                  continue;
               }
               const cell = map.get(`${r},${ac.col}`);
               const cellVal = cell ? (cell.value || '') : '';
               if (cellVal !== targetValue) {
                 next[r] = 0;
               } else {
                 if (next[r] === 0) delete next[r];
               }
            }
            return next;
          });
        }
      },
      {
        id: 'EXCEL.DATA.FILTER_BY_COLOR', name: 'Filter by Color', handler: () => {
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          const map = sheet.getCellsMap();
          const targetCell = map.get(`${ac.row},${ac.col}`);
          const targetColor = targetCell && targetCell.format ? (targetCell.format.backgroundColor || '') : '';
          
          setRowHeights(prev => {
            const next = { ...prev };
            let maxRow = 100;
            map.forEach((cell) => { if (cell.col === ac.col && cell.row > maxRow) maxRow = cell.row; });
            if (maxRow > 1000) maxRow = 1000;
            for (let r = 1; r <= maxRow; r++) {
               if (r === ac.row) {
                  if (next[r] === 0) delete next[r];
                  continue;
               }
               const cell = map.get(`${r},${ac.col}`);
               const cellColor = cell && cell.format ? (cell.format.backgroundColor || '') : '';
               if (cellColor !== targetColor) {
                 next[r] = 0;
               } else {
                 if (next[r] === 0) delete next[r];
               }
            }
            return next;
          });
        }
      },
      {
        id: 'EXCEL.DATA.FILTER_BY_TEXT_COLOR', name: 'Filter by Text Color', handler: () => {
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          const map = sheet.getCellsMap();
          const targetCell = map.get(`${ac.row},${ac.col}`);
          const targetColor = targetCell && targetCell.format ? (targetCell.format.color || '') : '';
          
          setRowHeights(prev => {
            const next = { ...prev };
            let maxRow = 100;
            map.forEach((cell) => { if (cell.col === ac.col && cell.row > maxRow) maxRow = cell.row; });
            if (maxRow > 1000) maxRow = 1000;
            for (let r = 1; r <= maxRow; r++) {
               if (r === ac.row) {
                  if (next[r] === 0) delete next[r];
                  continue;
               }
               const cell = map.get(`${r},${ac.col}`);
               const cellColor = cell && cell.format ? (cell.format.color || '') : '';
               if (cellColor !== targetColor) {
                 next[r] = 0;
               } else {
                 if (next[r] === 0) delete next[r];
               }
            }
            return next;
          });
        }
      },
      {
        id: 'EXCEL.DATA.FILTER_BY_ICON', name: 'Filter by Icon', handler: () => {
          console.log("Filter by Icon clicked");
        }
      },
      {
        id: 'EXCEL.EDIT.CLEAR_ALL', name: 'Clear All', handler: () => {"""

data = data.replace(search_str, replacement_str)

with open(path, "w", encoding="utf-8") as f:
    f.write(data)
