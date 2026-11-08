export type FormulaFunction = (...args: any[]) => any;
export declare class FunctionRegistry {
    private functions;
    private volatileFlags;
    constructor();
    register(name: string, func: FormulaFunction, isVolatile?: boolean): void;
    getFunction(name: string): FormulaFunction;
    isVolatile(name: string): boolean;
    private registerDefaults;
}
//# sourceMappingURL=FunctionRegistry.d.ts.map