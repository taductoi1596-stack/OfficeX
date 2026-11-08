import { CommandDefinition } from '../CommandDispatcher';
import { InsertChartEngine } from './InsertChartEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertChartCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.CHART', 'Chart', () => InsertChartEngine.Chart('column')),
      cmd('WORD.INSERT.CHART_COLUMN', 'Column', () => InsertChartEngine.Chart('column')),
      cmd('WORD.INSERT.CHART_BAR', 'Bar', () => InsertChartEngine.Chart('bar')),
      cmd('WORD.INSERT.CHART_LINE', 'Line', () => InsertChartEngine.Chart('line')),
      cmd('WORD.INSERT.CHART_PIE', 'Pie', () => InsertChartEngine.Chart('pie')),
      cmd('WORD.INSERT.CHART_AREA', 'Area', () => InsertChartEngine.Chart('area')),
      cmd('WORD.INSERT.CHART_SCATTER', 'Scatter', () => InsertChartEngine.Chart('scatter')),
      cmd('WORD.INSERT.CHART_RADAR', 'Radar', () => InsertChartEngine.Chart('radar')),
      cmd('WORD.INSERT.CHART_COMBO', 'Combo', () => InsertChartEngine.Chart('combo')),
      cmd('WORD.INSERT.CHART_MAP', 'Map', () => InsertChartEngine.Chart('map')),
      cmd('WORD.INSERT.CHART_HISTOGRAM', 'Histogram', () => InsertChartEngine.Chart('histogram')),
      cmd('WORD.INSERT.CHART_WATERFALL', 'Waterfall', () => InsertChartEngine.Chart('waterfall')),

      // CHART
      cmd('WORD.INSERT.CHART', 'Insert Chart', () => InsertChartEngine.Chart('dialog')),
      cmd('WORD.INSERT.CHART.DIALOG', 'Open Chart Dialog', () => InsertChartEngine.Chart('dialog')),
      cmd('WORD.INSERT.CHART.TEMPLATE', 'Insert From Template', () => InsertChartEngine.Chart('template')),
      cmd('WORD.INSERT.CHART.BLANK', 'Blank Chart', () => InsertChartEngine.Chart('blank')),

      // COLUMN CHART
      cmd('WORD.INSERT.CHART.COLUMN', 'Column Chart', () => InsertChartEngine.ColumnChart('clustered')),
      cmd('WORD.INSERT.CHART.COLUMN.CLUSTERED', 'Clustered Column', () => InsertChartEngine.ColumnChart('clustered')),
      cmd('WORD.INSERT.CHART.COLUMN.STACKED', 'Stacked Column', () => InsertChartEngine.ColumnChart('stacked')),
      cmd('WORD.INSERT.CHART.COLUMN.STACKED100', '100% Stacked Column', () => InsertChartEngine.ColumnChart('stacked100')),
      cmd('WORD.INSERT.CHART.COLUMN.THREED', '3D Column', () => InsertChartEngine.ColumnChart('3d')),

      // BAR CHART
      cmd('WORD.INSERT.CHART.BAR', 'Bar Chart', () => InsertChartEngine.BarChart('clustered')),
      cmd('WORD.INSERT.CHART.BAR.CLUSTERED', 'Clustered Bar', () => InsertChartEngine.BarChart('clustered')),
      cmd('WORD.INSERT.CHART.BAR.STACKED', 'Stacked Bar', () => InsertChartEngine.BarChart('stacked')),
      cmd('WORD.INSERT.CHART.BAR.THREED', '3D Bar', () => InsertChartEngine.BarChart('3d')),

      // LINE CHART
      cmd('WORD.INSERT.CHART.LINE', 'Line Chart', () => InsertChartEngine.LineChart('default')),
      cmd('WORD.INSERT.CHART.LINE.MARKER', 'Line With Markers', () => InsertChartEngine.LineChart('marker')),
      cmd('WORD.INSERT.CHART.LINE.STACKED', 'Stacked Line', () => InsertChartEngine.LineChart('stacked')),
      cmd('WORD.INSERT.CHART.LINE.THREED', '3D Line', () => InsertChartEngine.LineChart('3d')),

      // PIE CHART
      cmd('WORD.INSERT.CHART.PIE', 'Pie Chart', () => InsertChartEngine.PieChart('default')),
      cmd('WORD.INSERT.CHART.PIE.THREED', '3D Pie', () => InsertChartEngine.PieChart('3d')),
      cmd('WORD.INSERT.CHART.PIE.EXPLODED', 'Exploded Pie', () => InsertChartEngine.PieChart('exploded')),
      cmd('WORD.INSERT.CHART.PIE.OFPIE', 'Pie Of Pie', () => InsertChartEngine.PieChart('ofpie')),

      // DOUGHNUT
      cmd('WORD.INSERT.CHART.DOUGHNUT', 'Doughnut Chart', () => InsertChartEngine.Chart('doughnut')),
      cmd('WORD.INSERT.CHART.DOUGHNUT.MULTI', 'Multi Ring Doughnut', () => InsertChartEngine.Chart('doughnut', 'multi')),

      // AREA
      cmd('WORD.INSERT.CHART.AREA', 'Area Chart', () => InsertChartEngine.Chart('area')),
      cmd('WORD.INSERT.CHART.AREA.STACKED', 'Stacked Area', () => InsertChartEngine.Chart('area', 'stacked')),
      cmd('WORD.INSERT.CHART.AREA.THREED', '3D Area', () => InsertChartEngine.Chart('area', '3d')),

      // SCATTER
      cmd('WORD.INSERT.CHART.SCATTER', 'Scatter Chart', () => InsertChartEngine.ScatterChart('default')),
      cmd('WORD.INSERT.CHART.SCATTER.LINE', 'Scatter With Lines', () => InsertChartEngine.ScatterChart('line')),
      cmd('WORD.INSERT.CHART.SCATTER.SMOOTH', 'Smooth Scatter', () => InsertChartEngine.ScatterChart('smooth')),

      // BUBBLE
      cmd('WORD.INSERT.CHART.BUBBLE', 'Bubble Chart', () => InsertChartEngine.Chart('bubble')),
      cmd('WORD.INSERT.CHART.BUBBLE.THREED', '3D Bubble', () => InsertChartEngine.Chart('bubble', '3d')),

      // RADAR
      cmd('WORD.INSERT.CHART.RADAR', 'Radar Chart', () => InsertChartEngine.Chart('radar')),
      cmd('WORD.INSERT.CHART.RADAR.FILL', 'Filled Radar', () => InsertChartEngine.Chart('radar', 'fill')),

      // SURFACE
      cmd('WORD.INSERT.CHART.SURFACE', 'Surface Chart', () => InsertChartEngine.Chart('surface')),
      cmd('WORD.INSERT.CHART.SURFACE.WIREFRAME', 'Wireframe Surface', () => InsertChartEngine.Chart('surface', 'wireframe')),

      // STOCK
      cmd('WORD.INSERT.CHART.STOCK', 'Stock Chart', () => InsertChartEngine.Chart('stock')),
      cmd('WORD.INSERT.CHART.STOCK.OPENHIGHLOW', 'Open High Low Close', () => InsertChartEngine.Chart('stock', 'openhighlow')),

      // OTHERS
      cmd('WORD.INSERT.CHART.HISTOGRAM', 'Histogram', () => InsertChartEngine.Chart('histogram')),
      cmd('WORD.INSERT.CHART.PARETO', 'Pareto', () => InsertChartEngine.Chart('histogram', 'pareto')),
      cmd('WORD.INSERT.CHART.WATERFALL', 'Waterfall', () => InsertChartEngine.Chart('waterfall')),
      cmd('WORD.INSERT.CHART.FUNNEL', 'Funnel', () => InsertChartEngine.Chart('funnel')),
      cmd('WORD.INSERT.CHART.TREEMAP', 'Treemap', () => InsertChartEngine.Chart('treemap')),
      cmd('WORD.INSERT.CHART.SUNBURST', 'Sunburst', () => InsertChartEngine.Chart('sunburst')),

      // COMBO
      cmd('WORD.INSERT.CHART.COMBO', 'Combo Chart', () => InsertChartEngine.ComboChart('default')),
      cmd('WORD.INSERT.CHART.COMBO.CUSTOM', 'Custom Combo', () => InsertChartEngine.ComboChart('custom')),

      // PIVOT
      cmd('WORD.INSERT.CHART.PIVOT', 'Pivot Chart', () => InsertChartEngine.Chart('pivot')),

      // AI
      cmd('WORD.INSERT.CHART.AI', 'Generate AI Chart', () => InsertChartEngine.GenerateAI('generate')),
      cmd('WORD.INSERT.CHART.AI.RECOMMEND', 'Recommend Best Chart', () => InsertChartEngine.GenerateAI('recommend')),
      cmd('WORD.INSERT.CHART.AI.CONVERT', 'Convert Table To Chart', () => InsertChartEngine.GenerateAI('convert')),

      // EXCEL
      cmd('WORD.INSERT.CHART.EXCEL', 'Linked Excel Chart', () => InsertChartEngine.Excel('link')),
      cmd('WORD.INSERT.CHART.EXCEL.EMBED', 'Embedded Excel Chart', () => InsertChartEngine.Excel('embed')),
      cmd('WORD.INSERT.CHART.EXCEL.REFRESH', 'Refresh Excel Data', () => InsertChartEngine.Excel('refresh')),

      // DATA
      cmd('WORD.INSERT.CHART.DATA', 'Edit Data', () => InsertChartEngine.ImportData('edit')),
      cmd('WORD.INSERT.CHART.DATA.IMPORT', 'Import CSV', () => InsertChartEngine.ImportData('csv')),
      cmd('WORD.INSERT.CHART.DATA.EXCEL', 'Import Excel', () => InsertChartEngine.ImportData('excel')),
      cmd('WORD.INSERT.CHART.DATA.JSON', 'Import JSON', () => InsertChartEngine.ImportData('json')),
      cmd('WORD.INSERT.CHART.DATA.XML', 'Import XML', () => InsertChartEngine.ImportData('xml')),
      cmd('WORD.INSERT.CHART.DATA.API', 'Import API', () => InsertChartEngine.ImportData('api')),

      // STYLE
      cmd('WORD.INSERT.CHART.STYLE', 'Chart Style', () => InsertChartEngine.Style('style')),
      cmd('WORD.INSERT.CHART.COLOR', 'Chart Colors', () => InsertChartEngine.Style('color')),
      cmd('WORD.INSERT.CHART.FONT', 'Chart Font', () => InsertChartEngine.Style('font')),
      cmd('WORD.INSERT.CHART.BACKGROUND', 'Chart Background', () => InsertChartEngine.Style('background')),
      cmd('WORD.INSERT.CHART.BORDER', 'Chart Border', () => InsertChartEngine.Style('border')),

      // ELEMENTS
      cmd('WORD.INSERT.CHART.TITLE', 'Chart Title', () => InsertChartEngine.Element('title')),
      cmd('WORD.INSERT.CHART.AXIS', 'Axis', () => InsertChartEngine.Element('axis')),
      cmd('WORD.INSERT.CHART.LEGEND', 'Legend', () => InsertChartEngine.Element('legend')),
      cmd('WORD.INSERT.CHART.DATALABEL', 'Data Labels', () => InsertChartEngine.Element('datalabel')),
      cmd('WORD.INSERT.CHART.GRIDLINE', 'Gridlines', () => InsertChartEngine.Element('gridline')),
      cmd('WORD.INSERT.CHART.TRENDLINE', 'Trendline', () => InsertChartEngine.Element('trendline')),
      cmd('WORD.INSERT.CHART.ERRORBAR', 'Error Bars', () => InsertChartEngine.Element('errorbar')),
    ];
  }
}
