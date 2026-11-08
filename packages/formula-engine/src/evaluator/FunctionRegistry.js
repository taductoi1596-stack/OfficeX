import { MathEngine } from '../functions/MathEngine';
import { LogicalEngine } from '../functions/LogicalEngine';
import { TextFunctionEngine } from '../functions/TextFunctionEngine';
import { DateTimeEngine } from '../functions/DateTimeEngine';
import { LookupEngine } from '../functions/LookupEngine';
import { FinancialEngine } from '../functions/FinancialEngine';
import { StatisticalEngine } from '../functions/StatisticalEngine';
import { DatabaseEngine } from '../functions/DatabaseEngine';
import { InformationEngine } from '../functions/InformationEngine';
import { EngineeringEngine } from '../functions/EngineeringEngine';
import { CubeEngine } from '../functions/CubeEngine';
export class FunctionRegistry {
    functions = new Map();
    volatileFlags = new Set();
    constructor() {
        this.registerDefaults();
    }
    register(name, func, isVolatile = false) {
        const upperName = name.toUpperCase();
        this.functions.set(upperName, func);
        if (isVolatile) {
            this.volatileFlags.add(upperName);
        }
    }
    getFunction(name) {
        const fn = this.functions.get(name.toUpperCase());
        if (!fn) {
            throw new Error(`#NAME? Unknown function: ${name}`);
        }
        return fn;
    }
    isVolatile(name) {
        return this.volatileFlags.has(name.toUpperCase());
    }
    registerDefaults() {
        // We delegate to the specific function engines
        MathEngine.registerFunctions(this);
        LogicalEngine.registerFunctions(this);
        TextFunctionEngine.registerFunctions(this);
        DateTimeEngine.registerFunctions(this);
        LookupEngine.registerFunctions(this);
        FinancialEngine.registerFunctions(this);
        StatisticalEngine.registerFunctions(this);
        DatabaseEngine.registerFunctions(this);
        InformationEngine.registerFunctions(this);
        EngineeringEngine.registerFunctions(this);
        CubeEngine.registerFunctions(this);
    }
}
//# sourceMappingURL=FunctionRegistry.js.map