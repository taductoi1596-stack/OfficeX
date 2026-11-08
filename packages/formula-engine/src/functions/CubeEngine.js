/**
 * CUBE ENGINE
 *
 * Excel Cube functions.
 * Note: Cube functions typically require an active OLAP connection.
 * Without one, they return an error state.
 */
export class CubeEngine {
    static registerFunctions(registry) {
        registry.register('CUBEKPIMEMBER', (connection, kpi_name, kpi_property, caption = null) => {
            return '#N/A';
        });
        registry.register('CUBEMEMBER', (connection, member_expression, caption = null) => {
            return '#N/A';
        });
        registry.register('CUBEMEMBERPROPERTY', (connection, member_expression, property) => {
            return '#N/A';
        });
        registry.register('CUBERANKEDMEMBER', (connection, set_expression, rank, caption = null) => {
            return '#N/A';
        });
        registry.register('CUBESET', (connection, set_expression, caption = null, sort_order = null, sort_by = null) => {
            return '#N/A';
        });
        registry.register('CUBESETCOUNT', (set) => {
            return '#N/A';
        });
        registry.register('CUBEVALUE', (connection, ...member_expressions) => {
            return '#N/A';
        });
    }
}
//# sourceMappingURL=CubeEngine.js.map