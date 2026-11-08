import React, { forwardRef } from 'react';

export const HorizontalRuler = forwardRef<HTMLDivElement, {
  zoom: number;
  pageWidth: number;
  marginLeft: number;
  marginRight: number;
}>(({ zoom, pageWidth, marginLeft, marginRight }, ref) => {
  const scaledWidth = pageWidth * zoom;
  
  const scaledMarginLeft = marginLeft * zoom;
  const scaledMarginRight = marginRight * zoom;
  const scaledPrintableWidth = (pageWidth - marginLeft - marginRight) * zoom;

  return (
    <div 
      ref={ref}
      style={{
        height: 14,
        background: '#f3f4f6',
        borderBottom: '1px solid #d1d5db',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <div style={{
        position: 'relative',
        width: scaledWidth,
        height: '100%',
        flexShrink: 0,
      }}>
        {/* Left Margin */}
        <div style={{ position: 'absolute', left: 0, width: scaledMarginLeft, height: '100%', background: '#e5e7eb' }} />
        
        {/* Printable Area */}
        <div style={{ position: 'absolute', left: scaledMarginLeft, width: scaledPrintableWidth, height: '100%', background: '#ffffff' }} />
        
        {/* Right Margin */}
        <div style={{ position: 'absolute', left: scaledWidth - scaledMarginRight, width: scaledMarginRight, height: '100%', background: '#e5e7eb' }} />

        {/* Ruler ticks: Render a repeating background pattern or SVG */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0, top: 0, bottom: 0,
          backgroundImage: `repeating-linear-gradient(to right, transparent, transparent ${12 * zoom - 1}px, #9ca3af ${12 * zoom - 1}px, #9ca3af ${12 * zoom}px)`,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          left: 0, right: 0, top: 0, bottom: 0,
          backgroundImage: `repeating-linear-gradient(to right, transparent, transparent ${96 * zoom - 1}px, #6b7280 ${96 * zoom - 1}px, #6b7280 ${96 * zoom}px)`,
          pointerEvents: 'none'
        }} />
      </div>
    </div>
  );
});

HorizontalRuler.displayName = 'HorizontalRuler';
