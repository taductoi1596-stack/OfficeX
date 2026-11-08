import { ASTNodeType } from '../models/AST';
import { FunctionRegistry } from './FunctionRegistry';
export class Evaluator {
    functionRegistry;
    constructor(functionRegistry) {
        this.functionRegistry = functionRegistry || new FunctionRegistry();
    }
    evaluate(node, context) {
        switch (node.type) {
            case ASTNodeType.Number:
                return node.value;
            case ASTNodeType.String:
                return node.value;
            case ASTNodeType.Boolean:
                return node.value;
            case ASTNodeType.Error:
                return node.value;
            case ASTNodeType.Array: {
                const arrayNode = node;
                return arrayNode.elements.map(row => row.map(cell => this.evaluate(cell, context)));
            }
            case ASTNodeType.CellReference:
                return context.getCellValue(node.cellRef);
            case ASTNodeType.RangeReference: {
                const rangeNode = node;
                if (rangeNode.startRef.type === ASTNodeType.CellReference && rangeNode.endRef.type === ASTNodeType.CellReference) {
                    const start = rangeNode.startRef.cellRef;
                    const end = rangeNode.endRef.cellRef;
                    return context.getRangeValues(start, end);
                }
                throw new Error('#REF!');
            }
            case ASTNodeType.UnaryOp: {
                const unaryOp = node;
                const operand = this.evaluate(unaryOp.operand, context);
                if (typeof operand !== 'number')
                    throw new Error('#VALUE!');
                switch (unaryOp.operator) {
                    case '+': return operand;
                    case '-': return -operand;
                    case '%': return operand / 100;
                    default: throw new Error(`Unsupported unary operator ${unaryOp.operator}`);
                }
            }
            case ASTNodeType.BinaryOp: {
                const binOp = node;
                const left = this.evaluate(binOp.left, context);
                const right = this.evaluate(binOp.right, context);
                if (Array.isArray(left) || Array.isArray(right)) {
                    return this.broadcastBinaryOperation(left, right, binOp.operator);
                }
                else {
                    return this.applyBinaryOperation(left, right, binOp.operator);
                }
            }
            case ASTNodeType.FunctionCall: {
                const funcNode = node;
                const fn = this.functionRegistry.getFunction(funcNode.functionName);
                if (this.functionRegistry.isVolatile(funcNode.functionName) && context.setVolatile) {
                    context.setVolatile();
                }
                // Evaluate all arguments
                const evaluatedArgs = funcNode.arguments.map(arg => this.evaluate(arg, context));
                return fn(...evaluatedArgs);
            }
            default:
                throw new Error(`Unknown AST Node Type: ${node.type}`);
        }
    }
    applyBinaryOperation(left, right, operator) {
        try {
            switch (operator) {
                case '+':
                    if (typeof left !== 'number' || typeof right !== 'number')
                        return '#VALUE!';
                    return left + right;
                case '-':
                    if (typeof left !== 'number' || typeof right !== 'number')
                        return '#VALUE!';
                    return left - right;
                case '*':
                    if (typeof left !== 'number' || typeof right !== 'number')
                        return '#VALUE!';
                    return left * right;
                case '/':
                    if (typeof left !== 'number' || typeof right !== 'number')
                        return '#VALUE!';
                    if (right === 0)
                        return '#DIV/0!';
                    return left / right;
                case '^':
                    if (typeof left !== 'number' || typeof right !== 'number')
                        return '#VALUE!';
                    return Math.pow(left, right);
                case '&': return String(left) + String(right);
                case '=': return left === right;
                case '<>': return left !== right;
                case '<': return left < right;
                case '>': return left > right;
                case '<=': return left <= right;
                case '>=': return left >= right;
                default: return '#ERROR!';
            }
        }
        catch (e) {
            return e.message || '#ERROR!';
        }
    }
    broadcastBinaryOperation(left, right, operator) {
        const leftIsArray = Array.isArray(left);
        const rightIsArray = Array.isArray(right);
        // Normalize to 2D
        const leftArr = leftIsArray ? left : [[left]];
        const rightArr = rightIsArray ? right : [[right]];
        const maxRows = Math.max(leftArr.length, rightArr.length);
        const maxCols = Math.max(leftArr.reduce((m, r) => Math.max(m, r.length), 0), rightArr.reduce((m, r) => Math.max(m, r.length), 0));
        const result = [];
        for (let r = 0; r < maxRows; r++) {
            const row = [];
            for (let c = 0; c < maxCols; c++) {
                // Find corresponding element, or repeat if dimension is 1
                const lVal = leftIsArray
                    ? (leftArr[r % leftArr.length]?.[c % leftArr[r % leftArr.length].length] ?? '#N/A')
                    : left;
                const rVal = rightIsArray
                    ? (rightArr[r % rightArr.length]?.[c % rightArr[r % rightArr.length].length] ?? '#N/A')
                    : right;
                row.push(this.applyBinaryOperation(lVal, rVal, operator));
            }
            result.push(row);
        }
        return result;
    }
}
//# sourceMappingURL=Evaluator.js.map