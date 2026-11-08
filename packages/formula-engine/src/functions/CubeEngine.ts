/**
 * CUBE ENGINE
 *
 * Excel Cube functions.
 * Note: Cube functions typically require an active OLAP connection.
 * Without one, they return an error state.
 */

export class CubeEngine {
  public static registerFunctions(registry: any) {
    
    registry.register('CUBEKPIMEMBER', (connection: any, kpi_name: any, kpi_property: any, caption: any = null) => {
      return '#N/A';
    });

    registry.register('CUBEMEMBER', (connection: any, member_expression: any, caption: any = null) => {
      return '#N/A';
    });

    registry.register('CUBEMEMBERPROPERTY', (connection: any, member_expression: any, property: any) => {
      return '#N/A';
    });

    registry.register('CUBERANKEDMEMBER', (connection: any, set_expression: any, rank: any, caption: any = null) => {
      return '#N/A';
    });

    registry.register('CUBESET', (connection: any, set_expression: any, caption: any = null, sort_order: any = null, sort_by: any = null) => {
      return '#N/A';
    });

    registry.register('CUBESETCOUNT', (set: any) => {
      return '#N/A';
    });

    registry.register('CUBEVALUE', (connection: any, ...member_expressions: any[]) => {
      return '#N/A';
    });

  }
}
