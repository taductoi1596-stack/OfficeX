import type { DocModel, DocPara, DocRun, Caret, SelRange, RunFmt, ParaFmt, SmartArtNode, SmartArtObject } from './DocumentTypes';
import { Measurer } from '../layout/Measurer';

let _uid = 0;
export const uid = () => `_${++_uid}`;

export function defaultDoc(): DocModel {
  return {
    paras: [{ id: uid(), runs: [{ id: uid(), text: '', fmt: {} }], fmt: {} }],
    sections: [{
      id: crypto.randomUUID(),
      startParaIdx: 0,
      endParaIdx: 0,
      pageSetup: { width: 816, height: 1056, marginTop: 96, marginBottom: 96, marginLeft: 96, marginRight: 96 }
    }]
  };
}

export function paraText(para: DocPara): string {
  if (!para || !para.runs) return '';
  return para.runs.map(r => r.text).join('');
}
export function paraLen(p: DocPara)  { return paraText(p).length; }

export function findRunAt(para: DocPara, offset: number) {
  let rs = 0;
  for (let ri = 0; ri < para.runs.length; ri++) {
    if (offset <= rs + para.runs[ri].text.length) return { ri, rs };
    rs += para.runs[ri].text.length;
  }
  return { ri: para.runs.length - 1, rs };
}

export function insertText(doc: DocModel, caret: Caret, text: string): { doc: DocModel; caret: Caret } {
  const para = doc.paras[caret.paraIdx];
  const { ri, rs } = findRunAt(para, caret.charOffset);
  const run = para.runs[ri];
  const at  = caret.charOffset - rs;
  const newRuns = para.runs.map((r, i) =>
    i === ri ? { ...r, text: r.text.slice(0, at) + text + r.text.slice(at) } : r);
  let newPara: DocPara = { ...para, runs: newRuns };
  let newParas = doc.paras.map((p, i) => i === caret.paraIdx ? newPara : p);

  // Auto-expand table column width when text length exceeds column width
  if (para.fmt?.tableId && para.fmt?.tableColIdx !== undefined && para.fmt?.tableColWidths?.length) {
    const tableId = para.fmt.tableId;
    const colIdx = para.fmt.tableColIdx;
    const colWidths = para.fmt.tableColWidths;
    const fullText = newRuns.map(r => r.text).join('');
    const fmt = newRuns[0]?.fmt ?? {};
    const textW = Measurer.get().measure(fullText, fmt) + (para.fmt.tableCellPadding || 8) * 2 + 16;

    if (textW > (colWidths[colIdx] || 0)) {
      const updatedWidths = [...colWidths];
      updatedWidths[colIdx] = Math.ceil(textW);
      newParas = newParas.map(p => {
        if (p.fmt?.tableId === tableId) {
          return { ...p, fmt: { ...p.fmt, tableColWidths: updatedWidths } };
        }
        return p;
      });
    }
  }

  return {
    doc:   { ...doc, paras: newParas },
    caret: { paraIdx: caret.paraIdx, charOffset: caret.charOffset + text.length },
  };
}

export function splitPara(doc: DocModel, caret: Caret): { doc: DocModel; caret: Caret } {
  const para = doc.paras[caret.paraIdx];
  const before: DocRun[] = [], after: DocRun[] = [];
  let rs = 0;
  for (const run of para.runs) {
    const re = rs + run.text.length;
    if (caret.charOffset <= rs)      after.push({ ...run, id: uid() });
    else if (caret.charOffset >= re) before.push({ ...run, id: uid() });
    else {
      const at = caret.charOffset - rs;
      before.push({ ...run, id: uid(), text: run.text.slice(0, at) });
      after.push({ ...run, id: uid(), text: run.text.slice(at) });
    }
    rs = re;
  }
  const lastFmt = para.runs[para.runs.length - 1]?.fmt ?? {};
  if (!before.length) before.push({ id: uid(), text: '', fmt: lastFmt });
  if (!after.length)  after.push({ id: uid(), text: '', fmt: lastFmt });

  const pB: DocPara = { ...para, id: uid(), runs: before };
  const pA: DocPara = { id: uid(), runs: after, fmt: { ...para.fmt, pageBreak: undefined, listType: para.fmt.listType } };
  return {
    doc:   { ...doc, paras: [...doc.paras.slice(0, caret.paraIdx), pB, pA, ...doc.paras.slice(caret.paraIdx + 1)] },
    caret: { paraIdx: caret.paraIdx + 1, charOffset: 0 },
  };
}

export function delBack(doc: DocModel, caret: Caret): { doc: DocModel; caret: Caret } {
  if (caret.charOffset === 0) {
    if (caret.paraIdx === 0) return { doc, caret };
    const prev = doc.paras[caret.paraIdx - 1];
    const curr = doc.paras[caret.paraIdx];

    // Prevent merging across different table cells or table boundaries
    const isCurrTable = !!curr.fmt?.tableId;
    const isPrevTable = !!prev.fmt?.tableId;
    if (isCurrTable || isPrevTable) {
      if (curr.fmt?.tableId !== prev.fmt?.tableId || curr.fmt?.tableCellId !== prev.fmt?.tableCellId) {
        return { doc, caret };
      }
    }

    const prevLen = paraLen(prev);
    const merged: DocPara = { ...prev, id: uid(), runs: [...prev.runs, ...curr.runs] };
    return {
      doc:   { ...doc, paras: [...doc.paras.slice(0, caret.paraIdx - 1), merged, ...doc.paras.slice(caret.paraIdx + 1)] },
      caret: { paraIdx: caret.paraIdx - 1, charOffset: prevLen },
    };
  }
  const para = doc.paras[caret.paraIdx];
  const { ri, rs } = findRunAt(para, caret.charOffset);
  const run = para.runs[ri];
  const at  = caret.charOffset - rs - 1;
  const newText = run.text.slice(0, at) + run.text.slice(at + 1);
  let newRuns = para.runs.map((r, i) => i === ri ? { ...r, text: newText } : r).filter(r => r.text !== '');
  if (!newRuns.length) newRuns = [{ id: uid(), text: '', fmt: run.fmt }];
  return {
    doc:   { ...doc, paras: doc.paras.map((p, i) => i === caret.paraIdx ? { ...p, runs: newRuns } : p) },
    caret: { paraIdx: caret.paraIdx, charOffset: caret.charOffset - 1 },
  };
}

export function delFwd(doc: DocModel, caret: Caret): { doc: DocModel; caret: Caret } {
  const curr = doc.paras[caret.paraIdx];
  const len = paraLen(curr);
  if (caret.charOffset >= len) {
    if (caret.paraIdx >= doc.paras.length - 1) return { doc, caret };
    const next = doc.paras[caret.paraIdx + 1];

    // Prevent merging across different table cells or table boundaries
    const isCurrTable = !!curr.fmt?.tableId;
    const isNextTable = !!next.fmt?.tableId;
    if (isCurrTable || isNextTable) {
      if (curr.fmt?.tableId !== next.fmt?.tableId || curr.fmt?.tableCellId !== next.fmt?.tableCellId) {
        return { doc, caret };
      }
    }

    const merged: DocPara = { ...curr, id: uid(), runs: [...curr.runs, ...next.runs] };
    return {
      doc:   { ...doc, paras: [...doc.paras.slice(0, caret.paraIdx), merged, ...doc.paras.slice(caret.paraIdx + 2)] },
      caret,
    };
  }
  return delBack(doc, { paraIdx: caret.paraIdx, charOffset: caret.charOffset + 1 });
}

export type NormSel = { startPara: number; startChar: number; endPara: number; endChar: number };

export function normalizeSel(sel: SelRange): NormSel {
  const { anchor, focus } = sel;
  const before = anchor.paraIdx < focus.paraIdx
               || (anchor.paraIdx === focus.paraIdx && anchor.charOffset <= focus.charOffset);
  const start = before ? anchor : focus;
  const end   = before ? focus  : anchor;
  return { startPara: start.paraIdx, startChar: start.charOffset,
           endPara:   end.paraIdx,   endChar:   end.charOffset };
}

export function applyRunFmtInPara(para: DocPara, from: number, to: number, fmt: Partial<RunFmt>): DocPara {
  if (from >= to) return para;
  const newRuns: DocRun[] = [];
  let cp = 0;
  for (const run of para.runs) {
    const re    = cp + run.text.length;
    const olFrom = Math.max(from, cp);
    const olTo   = Math.min(to, re);
    if (olFrom >= olTo) {
      newRuns.push(run);
    } else {
      if (cp < olFrom)  newRuns.push({ ...run, id: uid(), text: run.text.slice(0, olFrom - cp) });
      newRuns.push({ ...run, id: uid(), text: run.text.slice(olFrom - cp, olTo - cp), fmt: { ...run.fmt, ...fmt } });
      if (re  > olTo)   newRuns.push({ ...run, id: uid(), text: run.text.slice(olTo - cp) });
    }
    cp = re;
  }
  return { ...para, runs: newRuns.filter(r => r.text !== '') };
}

export function applyRunFmt(doc: DocModel, sel: SelRange | null, caret: Caret, fmt: Partial<RunFmt>): DocModel {
  if (!sel) {
    const para = doc.paras[caret.paraIdx];
    const { ri } = findRunAt(para, caret.charOffset);
    const newRuns = para.runs.map((r, i) => i === ri ? { ...r, fmt: { ...r.fmt, ...fmt } } : r);
    return { ...doc, paras: doc.paras.map((p, i) => i === caret.paraIdx ? { ...p, runs: newRuns } : p) };
  }
  const { startPara, startChar, endPara, endChar } = normalizeSel(sel);
  let newParas = [...doc.paras];
  for (let pi = startPara; pi <= endPara; pi++) {
    const from = pi === startPara ? startChar : 0;
    const to   = pi === endPara   ? endChar   : paraLen(doc.paras[pi]);
    newParas[pi] = applyRunFmtInPara(newParas[pi], from, to, fmt);
  }
  return { ...doc, paras: newParas };
}

export function applyParaFmt(doc: DocModel, sel: SelRange | null, caret: Caret, fmt: Partial<ParaFmt>): DocModel {
  const startPara = sel ? normalizeSel(sel).startPara : caret.paraIdx;
  const endPara   = sel ? normalizeSel(sel).endPara   : caret.paraIdx;
  return {
    ...doc,
    paras: doc.paras.map((p, i) =>
      i >= startPara && i <= endPara ? { ...p, fmt: { ...p.fmt, ...fmt } } : p),
  };
}

export function getRunFmtAt(doc: DocModel, caret: Caret): RunFmt {
  const para = doc.paras[caret.paraIdx];
  if (!para) return {};
  const { ri } = findRunAt(para, Math.max(0, caret.charOffset - 1));
  return para.runs[ri]?.fmt ?? {};
}

export function getParaFmtAt(doc: DocModel, caret: Caret): ParaFmt {
  return doc.paras[caret.paraIdx]?.fmt ?? {};
}

export function isFmtActive(doc: DocModel, sel: SelRange | null, caret: Caret, prop: keyof RunFmt): boolean {
  if (!sel || (sel.anchor.paraIdx === sel.focus.paraIdx && sel.anchor.charOffset === sel.focus.charOffset)) {
    return !!getRunFmtAt(doc, caret)[prop];
  }
  const { startPara, startChar, endPara, endChar } = normalizeSel(sel);
  for (let pi = startPara; pi <= endPara; pi++) {
    const para = doc.paras[pi];
    const from = pi === startPara ? startChar : 0;
    const to   = pi === endPara   ? endChar   : paraLen(para);
    let cp = 0;
    for (const run of para.runs) {
      const re = cp + run.text.length;
      if (Math.max(from, cp) < Math.min(to, re) && !(run.fmt as any)[prop as string]) return false;
      cp = re;
    }
  }
  return true;
}

export function deleteSelection(doc: DocModel, sel: SelRange): { doc: DocModel; caret: Caret } {
  const { startPara, startChar, endPara, endChar } = normalizeSel(sel);
  
  const firstPara = doc.paras[startPara];
  const lastPara  = doc.paras[endPara];

  if (!firstPara || !lastPara) {
    console.warn('[DocumentEngine] deleteSelection out of bounds!', { startPara, endPara, len: doc.paras.length });
    return { doc, caret: { paraIdx: 0, charOffset: 0 } };
  }

  if (startPara === endPara) {
    const txt = paraText(firstPara).slice(0, startChar) + paraText(firstPara).slice(endChar);
    const lastFmt = firstPara.runs?.[0]?.fmt ?? {};
    const newPara: DocPara = { ...firstPara, runs: txt ? [{ id: uid(), text: txt, fmt: lastFmt }] : [{ id: uid(), text: '', fmt: lastFmt }] };
    return {
      doc:   { ...doc, paras: doc.paras.map((p, i) => i === startPara ? newPara : p) },
      caret: { paraIdx: startPara, charOffset: startChar },
    };
  }

  // Check if table cells are involved in multi-paragraph selection
  const hasTableParas = doc.paras.slice(startPara, endPara + 1).some(p => !!p.fmt?.tableId);
  const differentCells = firstPara.fmt?.tableCellId !== lastPara.fmt?.tableCellId || firstPara.fmt?.tableId !== lastPara.fmt?.tableId;

  if (hasTableParas && differentCells) {
    // Preserve table cell structure! Clear content inside cells instead of deleting cell paragraphs.
    const newParas = doc.paras.map((p, i) => {
      if (i < startPara || i > endPara) return p;

      if (p.fmt?.tableId) {
        // It's a table cell paragraph: preserve fmt and structure, clear text appropriately
        const fullText = paraText(p);
        let remainingText = '';
        if (i === startPara) {
          remainingText = fullText.slice(0, startChar);
        } else if (i === endPara) {
          remainingText = fullText.slice(endChar);
        } else {
          remainingText = '';
        }
        const fmt = p.runs?.[0]?.fmt ?? {};
        return {
          ...p,
          runs: remainingText ? [{ id: uid(), text: remainingText, fmt }] : [{ id: uid(), text: '', fmt }]
        };
      } else {
        // Non-table paragraph in between: mark for deletion or clear
        if (i === startPara) {
          const remainingText = paraText(p).slice(0, startChar);
          const fmt = p.runs?.[0]?.fmt ?? {};
          return { ...p, runs: remainingText ? [{ id: uid(), text: remainingText, fmt }] : [{ id: uid(), text: '', fmt }] };
        } else if (i === endPara) {
          const remainingText = paraText(p).slice(endChar);
          const fmt = p.runs?.[0]?.fmt ?? {};
          return { ...p, runs: remainingText ? [{ id: uid(), text: remainingText, fmt }] : [{ id: uid(), text: '', fmt }] };
        }
        return null;
      }
    }).filter(Boolean) as DocPara[];

    return { doc: { ...doc, paras: newParas }, caret: { paraIdx: startPara, charOffset: startChar } };
  }

  const firstTxt  = paraText(firstPara).slice(0, startChar);
  const lastTxt   = paraText(lastPara).slice(endChar);
  const mergedFmt = firstPara.runs?.[0]?.fmt ?? {};
  const mergedRuns: DocRun[] = [{ id: uid(), text: firstTxt + lastTxt, fmt: mergedFmt }].filter(r => r.text !== '');
  const merged: DocPara = { ...firstPara, id: uid(), runs: mergedRuns.length ? mergedRuns : [{ id: uid(), text: '', fmt: mergedFmt }] };

  const newParas = [...doc.paras.slice(0, startPara), merged, ...doc.paras.slice(endPara + 1)];
  return { doc: { ...doc, paras: newParas }, caret: { paraIdx: startPara, charOffset: startChar } };
}

export function createSmartArt(doc: DocModel, type: string, subType: string): { doc: DocModel, smartArtId: string } {
  const saId = uid();
  const rootId = uid();
  let nodes: Record<string, SmartArtNode> = {};
  let rootNodes: string[] = [];

  if (type === 'cycle') {
    const n1 = uid(), n2 = uid(), n3 = uid(), n4 = uid(), n5 = uid();
    rootNodes = [n1, n2, n3, n4, n5];
    nodes = {
      [n1]: { id: n1, text: 'Text', children: [], parent: null },
      [n2]: { id: n2, text: 'Text', children: [], parent: null },
      [n3]: { id: n3, text: 'Text', children: [], parent: null },
      [n4]: { id: n4, text: 'Text', children: [], parent: null },
      [n5]: { id: n5, text: 'Text', children: [], parent: null }
    };
  } else if (type === 'process') {
    const n1 = uid(), n2 = uid(), n3 = uid();
    rootNodes = [n1, n2, n3];
    nodes = {
      [n1]: { id: n1, text: 'Step 1', children: [], parent: null },
      [n2]: { id: n2, text: 'Step 2', children: [], parent: null },
      [n3]: { id: n3, text: 'Step 3', children: [], parent: null }
    };
  } else if (type === 'list') {
    const n1 = uid(), n2 = uid(), n3 = uid();
    rootNodes = [n1, n2, n3];
    nodes = {
      [n1]: { id: n1, text: 'Item 1', children: [], parent: null },
      [n2]: { id: n2, text: 'Item 2', children: [], parent: null },
      [n3]: { id: n3, text: 'Item 3', children: [], parent: null }
    };
  } else {
    // hierarchy and default
    nodes = { [rootId]: { id: rootId, text: 'Text', children: [], parent: null } };
    rootNodes = [rootId];
  }

  const sa: SmartArtObject = {
    id: saId, type, subType, nodes, rootNodes
  };

  return {
    doc: { ...doc, smartArts: { ...(doc.smartArts || {}), [saId]: sa } },
    smartArtId: saId
  };
}

export function addSmartArtNode(doc: DocModel, saId: string, parentNodeId: string): DocModel {
  const sa = doc.smartArts?.[saId];
  if (!sa) return doc;
  
  const newId = uid();
  const newNode: SmartArtNode = {
    id: newId,
    text: 'Text',
    children: [],
    parent: parentNodeId
  };

  const parent = sa.nodes[parentNodeId];
  if (!parent) return doc;

  let newNodes = { ...sa.nodes, [newId]: newNode };
  let newRootNodes = [...sa.rootNodes];

  if (sa.type === 'hierarchy') {
    newNodes[parentNodeId] = { ...parent, children: [...parent.children, newId] };
  } else {
    // For list, process, cycle, we just add it as a root node sibling after the selected node
    newNode.parent = null;
    const parentIndex = newRootNodes.indexOf(parentNodeId);
    if (parentIndex !== -1) {
      newRootNodes.splice(parentIndex + 1, 0, newId);
    } else {
      newRootNodes.push(newId);
    }
  }

  return {
    ...doc,
    smartArts: { ...doc.smartArts, [saId]: { ...sa, nodes: newNodes, rootNodes: newRootNodes } }
  };
}

export function deleteSmartArtNode(doc: DocModel, saId: string, nodeId: string): DocModel {
  const sa = doc.smartArts?.[saId];
  if (!sa) return doc;

  const node = sa.nodes[nodeId];
  if (!node) return doc;

  let newNodes = { ...sa.nodes };
  let newRootNodes = [...sa.rootNodes];

  const deleteRecursive = (nId: string) => {
    const n = newNodes[nId];
    if (!n) return;
    n.children.forEach(deleteRecursive);
    delete newNodes[nId];
  };
  deleteRecursive(nodeId);

  if (node.parent) {
    const parent = newNodes[node.parent];
    if (parent) {
      newNodes[node.parent] = { ...parent, children: parent.children.filter(id => id !== nodeId) };
    }
  } else {
    newRootNodes = newRootNodes.filter(id => id !== nodeId);
  }

  return {
    ...doc,
    smartArts: { ...doc.smartArts, [saId]: { ...sa, nodes: newNodes, rootNodes: newRootNodes } }
  };
}

export function deleteSmartArt(doc: DocModel, saId: string): DocModel {
  const newSmartArts = { ...doc.smartArts };
  delete newSmartArts[saId];
  
  const newParas = doc.paras.map(p => {
    const newRuns = p.runs.filter(r => r.fmt.inlineSmartArtId !== saId);
    return newRuns.length !== p.runs.length ? { ...p, runs: newRuns } : p;
  });

  return { ...doc, paras: newParas, smartArts: newSmartArts };
}

export function promoteSmartArtNode(doc: DocModel, saId: string, nodeId: string): DocModel {
  // Simplification for Phase 2: just move it up the tree
  // Actually, a full promote/demote implementation for arbitrary trees is complex.
  // We'll leave it as a no-op placeholder for this phase or just console.log.
  console.log('Promote', saId, nodeId);
  return doc;
}

export function demoteSmartArtNode(doc: DocModel, saId: string, nodeId: string): DocModel {
  console.log('Demote', saId, nodeId);
  return doc;
}

export const DocumentEngine = {
  uid,
  defaultDoc,
  paraText,
  paraLen,
  findRunAt,
  insertText,
  splitPara,
  delBack,
  delFwd,
  normalizeSel,
  applyRunFmtInPara,
  applyRunFmt,
  applyParaFmt,
  getRunFmtAt,
  getParaFmtAt,
  isFmtActive,
  deleteSelection,
  createSmartArt,
  addSmartArtNode,
  promoteSmartArtNode,
  demoteSmartArtNode
};
