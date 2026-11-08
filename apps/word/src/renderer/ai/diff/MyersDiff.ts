/**
 * MyersDiff.ts
 *
 * Implements the standard O(ND) Myers diff algorithm to compute the shortest
 * edit script between two arrays of tokens (characters, words, or lines).
 */

export type DiffOperation = 'insert' | 'delete' | 'equal';

export interface DiffHunk<T> {
  operation: DiffOperation;
  items: T[];
}

export class MyersDiff {
  /**
   * Compares two arrays and returns an array of DiffHunks.
   */
  static diff<T>(oldArr: T[], newArr: T[], isEqual: (a: T, b: T) => boolean = (a, b) => a === b): DiffHunk<T>[] {
    const N = oldArr.length;
    const M = newArr.length;
    const max = N + M;
    const v = new Int32Array(2 * max + 1);
    const trace: Int32Array[] = [];

    v[max + 1] = 0;

    let d = 0;
    let found = false;
    for (d = 0; d <= max; d++) {
      const vCopy = new Int32Array(v);
      trace.push(vCopy);

      for (let k = -d; k <= d; k += 2) {
        let x = 0;
        let y = 0;

        if (k === -d || (k !== d && v[max + k - 1] < v[max + k + 1])) {
          x = v[max + k + 1];
        } else {
          x = v[max + k - 1] + 1;
        }

        y = x - k;

        while (x < N && y < M && isEqual(oldArr[x], newArr[y])) {
          x++;
          y++;
        }

        v[max + k] = x;

        if (x >= N && y >= M) {
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) return []; // Should not happen

    // Backtrack to find the shortest edit script
    let x = N;
    let y = M;
    const script: { x: number, y: number, prevX: number, prevY: number }[] = [];

    for (let dLevel = d; dLevel > 0; dLevel--) {
      const vState = trace[dLevel - 1];
      const k = x - y;
      let prevK = 0;

      if (k === -dLevel || (k !== dLevel && vState[max + k - 1] < vState[max + k + 1])) {
        prevK = k + 1;
      } else {
        prevK = k - 1;
      }

      const prevX = vState[max + prevK];
      const prevY = prevX - prevK;

      while (x > prevX && y > prevY) {
        script.push({ x: x - 1, y: y - 1, prevX: x - 1, prevY: y - 1 });
        x--;
        y--;
      }

      script.push({ x, y, prevX, prevY });
      x = prevX;
      y = prevY;
    }

    while (x > 0 && y > 0) {
      script.push({ x: x - 1, y: y - 1, prevX: x - 1, prevY: y - 1 });
      x--;
      y--;
    }

    script.reverse();

    // Group the edits into hunks
    const hunks: DiffHunk<T>[] = [];
    let currentOp: DiffOperation | null = null;
    let currentItems: T[] = [];

    const commitHunk = () => {
      if (currentOp && currentItems.length > 0) {
        hunks.push({ operation: currentOp, items: currentItems });
        currentItems = [];
      }
    };

    let cx = 0;
    let cy = 0;

    for (const step of script) {
      if (step.x === step.prevX && step.y === step.prevY) {
        if (currentOp !== 'equal') {
          commitHunk();
          currentOp = 'equal';
        }
        currentItems.push(oldArr[cx]);
        cx++;
        cy++;
      } else if (step.x > step.prevX) {
        if (currentOp !== 'delete') {
          commitHunk();
          currentOp = 'delete';
        }
        currentItems.push(oldArr[cx]);
        cx++;
      } else if (step.y > step.prevY) {
        if (currentOp !== 'insert') {
          commitHunk();
          currentOp = 'insert';
        }
        currentItems.push(newArr[cy]);
        cy++;
      }
    }

    // Flush any remaining matches
    while (cx < N && cy < M && isEqual(oldArr[cx], newArr[cy])) {
      if (currentOp !== 'equal') {
        commitHunk();
        currentOp = 'equal';
      }
      currentItems.push(oldArr[cx]);
      cx++;
      cy++;
    }

    // Flush trailing deletes
    while (cx < N) {
      if (currentOp !== 'delete') {
        commitHunk();
        currentOp = 'delete';
      }
      currentItems.push(oldArr[cx]);
      cx++;
    }

    // Flush trailing inserts
    while (cy < M) {
      if (currentOp !== 'insert') {
        commitHunk();
        currentOp = 'insert';
      }
      currentItems.push(newArr[cy]);
      cy++;
    }

    commitHunk();
    return hunks;
  }
}
