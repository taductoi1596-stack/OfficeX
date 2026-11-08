import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChartData } from '@officex/spreadsheet-core';
import { X, GripVertical } from 'lucide-react';

const CHART_COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
  '#F97316', '#6366F1'
];

// ── SVG Chart Renderers ─────────────────────────────────────────
function BarChart({ chart, w, h }: { chart: ChartData, w: number, h: number }) {
  const series = chart.series || [];
  const labels = chart.labels || [];
  const pad = { top: 30, right: 20, bottom: 40, left: 50 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const allVals = series.flatMap(s => s.values);
  const maxVal = Math.max(...allVals, 0.01);
  const groupCount = Math.max(...series.map(s => s.values.length));
  const barW = (cw / groupCount) / (series.length + 0.5);
  const gridLines = 5;

  return (
    <svg width={w} height={h}>
      {/* Grid */}
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const yy = pad.top + (ch / gridLines) * i;
        const val = Math.round(maxVal - (maxVal / gridLines) * i);
        return (
          <g key={i}>
            {chart.showGrid !== false && <line x1={pad.left} y1={yy} x2={w - pad.right} y2={yy} stroke="#e2e8f0" strokeWidth={1} />}
            <text x={pad.left - 6} y={yy + 4} fontSize={9} fill="#64748b" textAnchor="end">{val}</text>
          </g>
        );
      })}
      {/* Bars */}
      {Array.from({ length: groupCount }).map((_, gi) => {
        const gx = pad.left + (cw / groupCount) * gi + barW * 0.25;
        return series.map((s, si) => {
          const val = s.values[gi] || 0;
          const bh = (val / maxVal) * ch;
          const x = gx + si * barW;
          const y = pad.top + ch - bh;
          const color = s.color || CHART_COLORS[si % CHART_COLORS.length];
          return (
            <g key={`${gi}-${si}`}>
              <rect x={x} y={y} width={barW - 2} height={bh} fill={color} rx={2} opacity={0.9}>
                <title>{s.name}: {val}</title>
              </rect>
            </g>
          );
        });
      })}
      {/* X Labels */}
      {labels.map((lbl, i) => {
        const gx = pad.left + (cw / groupCount) * i + (cw / groupCount) / 2;
        return <text key={i} x={gx} y={h - pad.bottom + 14} fontSize={9} fill="#64748b" textAnchor="middle">{lbl}</text>;
      })}
      {/* Axes */}
      <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + ch} stroke="#94a3b8" strokeWidth={1} />
      <line x1={pad.left} y1={pad.top + ch} x2={w - pad.right} y2={pad.top + ch} stroke="#94a3b8" strokeWidth={1} />
    </svg>
  );
}

function LineChart({ chart, w, h }: { chart: ChartData, w: number, h: number }) {
  const series = chart.series || [];
  const pad = { top: 30, right: 20, bottom: 40, left: 50 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const allVals = series.flatMap(s => s.values);
  const maxVal = Math.max(...allVals, 0.01);
  const minVal = Math.min(...allVals, 0);
  const range = maxVal - minVal || 1;
  const pointCount = Math.max(...series.map(s => s.values.length));
  const isArea = chart.type === 'area';
  const gridLines = 5;

  return (
    <svg width={w} height={h}>
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const yy = pad.top + (ch / gridLines) * i;
        const val = Math.round(maxVal - (range / gridLines) * i);
        return (
          <g key={i}>
            {chart.showGrid !== false && <line x1={pad.left} y1={yy} x2={w - pad.right} y2={yy} stroke="#e2e8f0" strokeWidth={1} />}
            <text x={pad.left - 6} y={yy + 4} fontSize={9} fill="#64748b" textAnchor="end">{val}</text>
          </g>
        );
      })}
      {series.map((s, si) => {
        const color = s.color || CHART_COLORS[si % CHART_COLORS.length];
        const pts = s.values.map((v, i) => {
          const x = pad.left + (cw / Math.max(pointCount - 1, 1)) * i;
          const y = pad.top + ch - ((v - minVal) / range) * ch;
          return [x, y];
        });
        const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
        const areaD = pts.length > 0
          ? `${pathD} L${pts[pts.length - 1][0]},${pad.top + ch} L${pts[0][0]},${pad.top + ch} Z`
          : '';
        return (
          <g key={si}>
            {isArea && <path d={areaD} fill={color} opacity={0.2} />}
            <path d={pathD} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {pts.map((p, i) => (
              <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill={color} stroke="white" strokeWidth={1.5}>
                <title>{s.name}: {s.values[i]}</title>
              </circle>
            ))}
          </g>
        );
      })}
      {(chart.labels || []).map((lbl, i) => {
        const x = pad.left + (cw / Math.max(pointCount - 1, 1)) * i;
        return <text key={i} x={x} y={h - pad.bottom + 14} fontSize={9} fill="#64748b" textAnchor="middle">{lbl}</text>;
      })}
      <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + ch} stroke="#94a3b8" strokeWidth={1} />
      <line x1={pad.left} y1={pad.top + ch} x2={w - pad.right} y2={pad.top + ch} stroke="#94a3b8" strokeWidth={1} />
    </svg>
  );
}

function PieChart({ chart, w, h }: { chart: ChartData, w: number, h: number }) {
  const series = chart.series?.[0];
  const vals = series?.values || [1];
  const labels = chart.labels || vals.map((_, i) => `Series ${i + 1}`);
  const total = vals.reduce((a, b) => a + b, 0) || 1;
  const isDonut = chart.type === 'donut';
  const cx = w / 2;
  const cy = h / 2 - 10;
  const r = Math.min(cx, cy) - 20;
  const innerR = isDonut ? r * 0.55 : 0;

  let startAngle = -Math.PI / 2;
  const slices = vals.map((v, i) => {
    const angle = (v / total) * 2 * Math.PI;
    const endAngle = startAngle + angle;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const path = isDonut
      ? `M${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} L${ix1},${iy1} A${innerR},${innerR} 0 ${largeArc} 0 ${ix2},${iy2} Z`
      : `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
    const midAngle = startAngle + angle / 2;
    const lx = cx + (r + 12) * Math.cos(midAngle);
    const ly = cy + (r + 12) * Math.sin(midAngle);
    const pct = Math.round((v / total) * 100);
    const color = CHART_COLORS[i % CHART_COLORS.length];
    startAngle = endAngle;
    return { path, lx, ly, pct, color, label: labels[i], val: v };
  });

  return (
    <svg width={w} height={h}>
      {slices.map((s, i) => (
        <g key={i}>
          <path d={s.path} fill={s.color} stroke="white" strokeWidth={2} opacity={0.9}>
            <title>{s.label}: {s.val} ({s.pct}%)</title>
          </path>
          {s.pct >= 5 && (
            <text x={s.lx} y={s.ly} fontSize={9} fill="#1e293b" textAnchor="middle" dominantBaseline="middle" fontWeight="600">
              {s.pct}%
            </text>
          )}
        </g>
      ))}
      {isDonut && (
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight="700" fill="#1e293b">
          {total}
        </text>
      )}
      {/* Legend at bottom */}
      <g>
        {slices.map((s, i) => {
          const lx = 10 + (i % 3) * (w / 3);
          const ly = h - 20 + Math.floor(i / 3) * 14;
          return (
            <g key={i}>
              <rect x={lx} y={ly - 6} width={8} height={8} fill={s.color} rx={1} />
              <text x={lx + 11} y={ly + 1} fontSize={8} fill="#64748b">{s.label}</text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function ScatterChart({ chart, w, h }: { chart: ChartData, w: number, h: number }) {
  const series = chart.series || [];
  const pad = { top: 30, right: 20, bottom: 40, left: 50 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const allVals = series.flatMap(s => s.values);
  const maxVal = Math.max(...allVals, 0.01);
  const gridLines = 5;

  return (
    <svg width={w} height={h}>
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const yy = pad.top + (ch / gridLines) * i;
        return chart.showGrid !== false ? <line key={i} x1={pad.left} y1={yy} x2={w - pad.right} y2={yy} stroke="#e2e8f0" strokeWidth={1} /> : null;
      })}
      {series.map((s, si) => {
        const color = s.color || CHART_COLORS[si % CHART_COLORS.length];
        return s.values.map((v, i) => {
          const x = pad.left + (cw / Math.max(s.values.length - 1, 1)) * i;
          const y = pad.top + ch - (v / maxVal) * ch;
          return <circle key={`${si}-${i}`} cx={x} cy={y} r={5} fill={color} opacity={0.75} stroke="white" strokeWidth={1.5}>
            <title>{s.name}: {v}</title>
          </circle>;
        });
      })}
      <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + ch} stroke="#94a3b8" strokeWidth={1} />
      <line x1={pad.left} y1={pad.top + ch} x2={w - pad.right} y2={pad.top + ch} stroke="#94a3b8" strokeWidth={1} />
    </svg>
  );
}

function RadarChart({ chart, w, h }: { chart: ChartData, w: number, h: number }) {
  const series = chart.series || [];
  const labels = chart.labels || [];
  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(cx, cy) - 30;
  const N = Math.max(labels.length, 3);
  const allVals = series.flatMap(s => s.values);
  const maxVal = Math.max(...allVals, 1);

  const getPoint = (angle: number, val: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    const rr = (val / maxVal) * r;
    return [cx + rr * Math.cos(rad), cy + rr * Math.sin(rad)];
  };

  const angles = Array.from({ length: N }, (_, i) => (360 / N) * i);

  return (
    <svg width={w} height={h}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map(frac => (
        <polygon key={frac}
          points={angles.map(a => getPoint(a, maxVal * frac).join(',')).join(' ')}
          fill="none" stroke="#e2e8f0" strokeWidth={1}
        />
      ))}
      {/* Spokes */}
      {angles.map((a, i) => {
        const [x, y] = getPoint(a, maxVal);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth={1} />;
      })}
      {/* Labels */}
      {labels.map((lbl, i) => {
        const [x, y] = getPoint(angles[i], maxVal * 1.2);
        return <text key={i} x={x} y={y} fontSize={9} fill="#64748b" textAnchor="middle" dominantBaseline="middle">{lbl}</text>;
      })}
      {/* Series */}
      {series.map((s, si) => {
        const color = s.color || CHART_COLORS[si % CHART_COLORS.length];
        const pts = angles.map((a, i) => getPoint(a, s.values[i] || 0));
        const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ') + 'Z';
        return (
          <g key={si}>
            <path d={d} fill={color} opacity={0.25} />
            <path d={d} fill="none" stroke={color} strokeWidth={2} />
            {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={3} fill={color} stroke="white" strokeWidth={1} />)}
          </g>
        );
      })}
    </svg>
  );
}

function WaterfallChart({ chart, w, h }: { chart: ChartData, w: number, h: number }) {
  const series = chart.series?.[0];
  const vals = series?.values || [];
  const labels = chart.labels || vals.map((_, i) => `${i + 1}`);
  const pad = { top: 30, right: 20, bottom: 40, left: 55 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  let running = 0;
  const bars = vals.map((v, i) => {
    const base = running;
    running += v;
    return { base, val: v, end: running, i };
  });

  const allY = bars.flatMap(b => [b.base, b.end]);
  const minY = Math.min(...allY, 0);
  const maxY = Math.max(...allY, 0.01);
  const range = maxY - minY || 1;

  const toY = (v: number) => pad.top + ch - ((v - minY) / range) * ch;
  const barW = (cw / vals.length) - 4;

  return (
    <svg width={w} height={h}>
      {[0, 0.25, 0.5, 0.75, 1].map(frac => {
        const yy = pad.top + ch * (1 - frac);
        const val = Math.round(minY + range * frac);
        return (
          <g key={frac}>
            {chart.showGrid !== false && <line x1={pad.left} y1={yy} x2={w - pad.right} y2={yy} stroke="#e2e8f0" strokeWidth={1} />}
            <text x={pad.left - 6} y={yy + 4} fontSize={9} fill="#64748b" textAnchor="end">{val}</text>
          </g>
        );
      })}
      {bars.map((b, i) => {
        const x = pad.left + (cw / vals.length) * i + 2;
        const y1 = toY(Math.max(b.base, b.end));
        const y2 = toY(Math.min(b.base, b.end));
        const bh = Math.max(y2 - y1, 2);
        const color = b.val >= 0 ? '#10B981' : '#EF4444';
        return (
          <g key={i}>
            <rect x={x} y={y1} width={barW} height={bh} fill={color} rx={2} opacity={0.85}>
              <title>{labels[i]}: {b.val > 0 ? '+' : ''}{b.val}</title>
            </rect>
            {i > 0 && (
              <line x1={x - 2} y1={toY(b.base)} x2={x} y2={toY(b.base)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2" />
            )}
            <text x={x + barW / 2} y={b.val >= 0 ? y1 - 3 : y2 + 10} fontSize={8} fill="#1e293b" textAnchor="middle">
              {b.val > 0 ? '+' : ''}{b.val}
            </text>
          </g>
        );
      })}
      {labels.map((lbl, i) => {
        const x = pad.left + (cw / vals.length) * i + (cw / vals.length) / 2;
        return <text key={i} x={x} y={h - pad.bottom + 14} fontSize={9} fill="#64748b" textAnchor="middle">{lbl}</text>;
      })}
      <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + ch} stroke="#94a3b8" strokeWidth={1} />
      <line x1={pad.left} y1={pad.top + ch} x2={w - pad.right} y2={pad.top + ch} stroke="#94a3b8" strokeWidth={1} />
      {/* Zero line */}
      {minY < 0 && (
        <line x1={pad.left} y1={toY(0)} x2={w - pad.right} y2={toY(0)} stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 2" />
      )}
    </svg>
  );
}

function Legend({ series, w }: { series: ChartData['series'], w: number }) {
  if (!series || series.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '0 8px 6px', justifyContent: 'center' }}>
      {series.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#475569' }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: s.color || CHART_COLORS[i % CHART_COLORS.length] }} />
          {s.name}
        </div>
      ))}
    </div>
  );
}

function ChartRenderer({ chart }: { chart: ChartData }) {
  const w = chart.width - 4;
  const h = chart.height - (chart.showLegend !== false ? 52 : 32);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'white', borderRadius: 4, overflow: 'hidden' }}>
      {/* Title */}
      <div style={{ padding: '6px 10px 2px', fontWeight: 600, fontSize: 11, color: '#1e293b', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
        {chart.title || 'Biểu đồ'}
      </div>
      {/* Chart SVG */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {(chart.type === 'bar' || chart.type === 'column') && <BarChart chart={chart} w={w} h={h} />}
        {chart.type === 'bar-horizontal' && <BarChart chart={{ ...chart, type: 'bar' }} w={w} h={h} />}
        {chart.type === 'line' && <LineChart chart={chart} w={w} h={h} />}
        {chart.type === 'area' && <LineChart chart={chart} w={w} h={h} />}
        {chart.type === 'pie' && <PieChart chart={chart} w={w} h={h} />}
        {chart.type === 'donut' && <PieChart chart={chart} w={w} h={h} />}
        {chart.type === 'scatter' && <ScatterChart chart={chart} w={w} h={h} />}
        {chart.type === 'radar' && <RadarChart chart={chart} w={w} h={h} />}
        {chart.type === 'waterfall' && <WaterfallChart chart={chart} w={w} h={h} />}
        {chart.type === 'combo' && <LineChart chart={chart} w={w} h={h} />}
      </div>
      {/* Legend */}
      {chart.showLegend !== false && chart.type !== 'pie' && chart.type !== 'donut' && (
        <Legend series={chart.series} w={w} />
      )}
    </div>
  );
}

// ── Main Layer ──────────────────────────────────────────────────
export interface FloatingChartLayerProps {
  charts: ChartData[];
  zoom: number;
  onUpdateChart: (id: string, updates: Partial<ChartData>) => void;
  onDeleteChart: (id: string) => void;
}

export function FloatingChartLayer({ charts, zoom, onUpdateChart, onDeleteChart }: FloatingChartLayerProps) {
  const [activeChartId, setActiveChartId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ mx: number, my: number, ix: number, iy: number } | null>(null);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ mx: number, my: number, iw: number, ih: number, ix: number, iy: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeChartId) {
        onDeleteChart(activeChartId);
        setActiveChartId(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeChartId, onDeleteChart]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && activeChartId && dragStart) {
        const dx = (e.clientX - dragStart.mx) / zoom;
        const dy = (e.clientY - dragStart.my) / zoom;
        onUpdateChart(activeChartId, {
          x: Math.max(0, dragStart.ix + dx),
          y: Math.max(0, dragStart.iy + dy)
        });
      }
      if (isResizing && activeChartId && resizeStart) {
        const dx = (e.clientX - resizeStart.mx) / zoom;
        const dy = (e.clientY - resizeStart.my) / zoom;
        const newW = Math.max(200, resizeStart.iw + (isResizing.includes('e') ? dx : -dx));
        const newH = Math.max(150, resizeStart.ih + (isResizing.includes('s') ? dy : -dy));
        const updates: Partial<ChartData> = { width: newW, height: newH };
        if (isResizing.includes('w')) updates.x = resizeStart.ix + (resizeStart.iw - newW);
        if (isResizing.includes('n')) updates.y = resizeStart.iy + (resizeStart.ih - newH);
        onUpdateChart(activeChartId, updates);
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
      setDragStart(null);
      setResizeStart(null);
    };
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, activeChartId, dragStart, resizeStart, zoom, onUpdateChart]);

  useEffect(() => {
    const deselect = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.floating-chart')) setActiveChartId(null);
    };
    document.addEventListener('mousedown', deselect);
    return () => document.removeEventListener('mousedown', deselect);
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0, overflow: 'visible', zIndex: 35 }}>
      {charts.map(chart => {
        const isActive = activeChartId === chart.id;
        return (
          <div
            key={chart.id}
            className="floating-chart"
            style={{
              position: 'absolute',
              left: chart.x, top: chart.y,
              width: chart.width, height: chart.height,
              boxShadow: isActive
                ? '0 0 0 2px #107C41, 0 8px 24px rgba(0,0,0,0.15)'
                : '0 2px 12px rgba(0,0,0,0.12)',
              borderRadius: 6,
              overflow: 'hidden',
              cursor: isDragging && isActive ? 'grabbing' : 'grab',
              userSelect: 'none',
            }}
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).closest('.chart-resize-handle')) return;
              e.stopPropagation();
              setActiveChartId(chart.id);
              setIsDragging(true);
              setDragStart({ mx: e.clientX, my: e.clientY, ix: chart.x, iy: chart.y });
            }}
          >
            <ChartRenderer chart={chart} />

            {/* Delete button */}
            {isActive && (
              <button
                className="chart-resize-handle"
                style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 20, height: 20,
                  background: '#ef4444', border: 'none', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 10, color: 'white'
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => { e.stopPropagation(); onDeleteChart(chart.id); setActiveChartId(null); }}
              >
                <X size={11} />
              </button>
            )}

            {/* Resize handles */}
            {isActive && ['se', 'sw', 'ne', 'nw', 'e', 'w', 'n', 's'].map(handle => {
              const s: React.CSSProperties = {
                position: 'absolute', width: 9, height: 9,
                background: 'white', border: '1.5px solid #107C41',
                borderRadius: '50%', cursor: `${handle}-resize`, zIndex: 10
              };
              if (handle.includes('n')) s.top = -4;
              if (handle.includes('s')) s.bottom = -4;
              if (handle.includes('w')) s.left = -4;
              if (handle.includes('e')) s.right = -4;
              if (handle === 'n' || handle === 's') { s.left = '50%'; s.transform = 'translateX(-50%)'; }
              if (handle === 'e' || handle === 'w') { s.top = '50%'; s.transform = 'translateY(-50%)'; }
              return (
                <div
                  key={handle}
                  className="chart-resize-handle"
                  style={s}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsResizing(handle);
                    setActiveChartId(chart.id);
                    setResizeStart({ mx: e.clientX, my: e.clientY, iw: chart.width, ih: chart.height, ix: chart.x, iy: chart.y });
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
