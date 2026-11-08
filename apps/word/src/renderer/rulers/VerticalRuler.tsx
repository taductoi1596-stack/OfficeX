import React, { forwardRef } from 'react';

export const VerticalRuler = forwardRef<HTMLDivElement, {
  zoom: number;
  pageHeight: number;
  marginTop: number;
  marginBottom: number;
  pageCount: number;
  pageGap: number;
}>(({ zoom, pageHeight, marginTop, marginBottom, pageCount, pageGap }, ref) => {
  const scaledHeight = pageHeight * zoom;
  const scaledMarginTop = marginTop * zoom;
  const scaledMarginBottom = marginBottom * zoom;
  const scaledPrintableHeight = (pageHeight - marginTop - marginBottom) * zoom;
  const scaledGap = pageGap * zoom;

  const totalHeight = pageCount * (scaledHeight + scaledGap);

  return (
    <div 
      ref={ref}
      style={{
        width: 14,
        background: '#f3f4f6',
        borderRight: '1px solid #d1d5db',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'relative',
        height: totalHeight,
        width: '100%',
        paddingTop: 24, // Matches CanvasEditor.tsx padding-top
      }}>
        {Array.from({ length: pageCount }).map((_, i) => {
          const top = i * (scaledHeight + scaledGap);
          return (
            <div key={i} style={{ position: 'absolute', top, left: 0, width: '100%', height: scaledHeight }}>
              {/* Top Margin */}
              <div style={{ position: 'absolute', top: 0, width: '100%', height: scaledMarginTop, background: '#e5e7eb' }} />
              
              {/* Printable Area */}
              <div style={{ position: 'absolute', top: scaledMarginTop, width: '100%', height: scaledPrintableHeight, background: '#ffffff' }} />
              
              {/* Bottom Margin */}
              <div style={{ position: 'absolute', top: scaledHeight - scaledMarginBottom, width: '100%', height: scaledMarginBottom, background: '#e5e7eb' }} />
              
              {/* Vertical Ruler ticks */}
              <div style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0, right: 0,
                backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent ${12 * zoom - 1}px, #9ca3af ${12 * zoom - 1}px, #9ca3af ${12 * zoom}px)`,
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0, right: 0,
                backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent ${96 * zoom - 1}px, #6b7280 ${96 * zoom - 1}px, #6b7280 ${96 * zoom}px)`,
                pointerEvents: 'none'
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
});

VerticalRuler.displayName = 'VerticalRuler';
