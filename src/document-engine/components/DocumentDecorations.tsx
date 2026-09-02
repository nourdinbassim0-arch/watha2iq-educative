import React from 'react';

export type DecorationTemplate = 'none' | 'minimal' | 'classic' | 'academic' | 'elegant' | 'geometric';
export type BorderType = 'none' | 'full' | 'partial' | 'corners';
export type DecorationIntensity = 'light' | 'medium' | 'strong';

export interface DocumentDecorationsProps {
  template?: DecorationTemplate;
  borderType?: BorderType;
  borderColor?: string;
  borderWidth?: number;
  intensity?: DecorationIntensity;
  widthMm?: number;
  heightMm?: number;
}

export const DocumentDecorations: React.FC<DocumentDecorationsProps> = ({
  template = 'classic',
  borderType = 'full',
  borderColor = '#065f46',
  borderWidth = 1.5,
  intensity = 'medium',
}) => {
  if (template === 'none' && borderType === 'none') {
    return null;
  }

  const opacityMap: Record<DecorationIntensity, number> = {
    light: 0.35,
    medium: 0.75,
    strong: 1.0,
  };

  const opacity = opacityMap[intensity] || 0.75;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* 1. FULL BORDER STYLES */}
      {borderType === 'full' && (
        <>
          {/* Outer Border */}
          <div
            className="absolute inset-3 rounded-xs pointer-events-none"
            style={{
              border: `${borderWidth}px solid ${borderColor}`,
              opacity: opacity,
            }}
          />

          {/* Inner Accent Line for Classic / Academic / Elegant */}
          {(template === 'classic' || template === 'academic' || template === 'elegant') && (
            <div
              className="absolute inset-4.5 rounded-xs pointer-events-none"
              style={{
                border: `0.75px solid ${borderColor}`,
                opacity: opacity * 0.6,
              }}
            />
          )}

          {/* Geometric Outer Double Border */}
          {template === 'geometric' && (
            <div
              className="absolute inset-5 rounded-xs pointer-events-none"
              style={{
                border: `1px dashed ${borderColor}`,
                opacity: opacity * 0.5,
              }}
            />
          )}
        </>
      )}

      {/* 2. PARTIAL BORDER (Top and Bottom Bands) */}
      {borderType === 'partial' && (
        <>
          <div
            className="absolute top-3 left-3 right-3"
            style={{
              borderTop: `${borderWidth * 1.5}px solid ${borderColor}`,
              borderBottom: `0.75px solid ${borderColor}`,
              paddingBottom: '2px',
              opacity: opacity,
            }}
          />
          <div
            className="absolute bottom-3 left-3 right-3"
            style={{
              borderBottom: `${borderWidth * 1.5}px solid ${borderColor}`,
              borderTop: `0.75px solid ${borderColor}`,
              paddingTop: '2px',
              opacity: opacity,
            }}
          />
        </>
      )}

      {/* 3. CORNER ORNAMENTS (SVG High-Res Vector Accents) */}
      {(borderType === 'corners' || borderType === 'full') && template !== 'none' && template !== 'minimal' && (
        <>
          {/* Top-Right Corner */}
          <div className="absolute top-2.5 right-2.5 w-8 h-8 pointer-events-none" style={{ color: borderColor, opacity }}>
            {template === 'classic' || template === 'academic' ? (
              <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
                <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" />
                <circle cx="16" cy="16" r="3.5" />
                <path d="M12 24 L24 12 M18 28 L28 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            ) : template === 'geometric' ? (
              <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                <path d="M2 38 L2 2 L38 2" />
                <path d="M8 38 L8 8 L38 8" strokeWidth="1" opacity="0.6" />
                <rect x="12" y="12" width="6" height="6" fill="currentColor" />
              </svg>
            ) : (
              /* Elegant */
              <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
                <path d="M0 0 C20 0 40 20 40 40 L36 40 C36 22 22 8 0 8 Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          </div>

          {/* Top-Left Corner */}
          <div className="absolute top-2.5 left-2.5 w-8 h-8 pointer-events-none transform -scale-x-100" style={{ color: borderColor, opacity }}>
            {template === 'classic' || template === 'academic' ? (
              <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
                <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" />
                <circle cx="16" cy="16" r="3.5" />
                <path d="M12 24 L24 12 M18 28 L28 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            ) : template === 'geometric' ? (
              <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                <path d="M2 38 L2 2 L38 2" />
                <path d="M8 38 L8 8 L38 8" strokeWidth="1" opacity="0.6" />
                <rect x="12" y="12" width="6" height="6" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
                <path d="M0 0 C20 0 40 20 40 40 L36 40 C36 22 22 8 0 8 Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          </div>

          {/* Bottom-Right Corner */}
          <div className="absolute bottom-2.5 right-2.5 w-8 h-8 pointer-events-none transform -scale-y-100" style={{ color: borderColor, opacity }}>
            {template === 'classic' || template === 'academic' ? (
              <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
                <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" />
                <circle cx="16" cy="16" r="3.5" />
                <path d="M12 24 L24 12 M18 28 L28 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            ) : template === 'geometric' ? (
              <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                <path d="M2 38 L2 2 L38 2" />
                <path d="M8 38 L8 8 L38 8" strokeWidth="1" opacity="0.6" />
                <rect x="12" y="12" width="6" height="6" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
                <path d="M0 0 C20 0 40 20 40 40 L36 40 C36 22 22 8 0 8 Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          </div>

          {/* Bottom-Left Corner */}
          <div className="absolute bottom-2.5 left-2.5 w-8 h-8 pointer-events-none transform -scale-x-100 -scale-y-100" style={{ color: borderColor, opacity }}>
            {template === 'classic' || template === 'academic' ? (
              <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
                <path d="M0 0 L40 0 L40 8 L8 8 L8 40 L0 40 Z" />
                <circle cx="16" cy="16" r="3.5" />
                <path d="M12 24 L24 12 M18 28 L28 18" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            ) : template === 'geometric' ? (
              <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                <path d="M2 38 L2 2 L38 2" />
                <path d="M8 38 L8 8 L38 8" strokeWidth="1" opacity="0.6" />
                <rect x="12" y="12" width="6" height="6" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
                <path d="M0 0 C20 0 40 20 40 40 L36 40 C36 22 22 8 0 8 Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            )}
          </div>
        </>
      )}

      {/* 4. TOP & BOTTOM CENTER EMBLEMS FOR ACADEMIC & ELEGANT */}
      {template === 'academic' && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-4 bg-white flex items-center gap-1.5" style={{ color: borderColor, opacity }}>
          <span className="w-6 h-px bg-current" />
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span className="w-6 h-px bg-current" />
        </div>
      )}
    </div>
  );
};
