import React from 'react';
import {
  DocumentBorderConfig,
  DocumentDecorationConfig,
  IslamicDecorationStyle,
  DecorationIntensityLevel,
  PageBorderPreset,
} from '../../types';

export interface DocumentDecorationsProps {
  borderConfig?: DocumentBorderConfig;
  decorationConfig?: DocumentDecorationConfig;
  // Backward compatibility props
  template?: string;
  borderType?: string;
  borderColor?: string;
  borderWidth?: number;
  intensity?: string;
}

export type DecorationTemplate = PageBorderPreset | string;
export type BorderType = 'full' | 'corners' | 'partial' | 'none' | string;
export type DecorationIntensity = DecorationIntensityLevel | string;

export const DocumentDecorations: React.FC<DocumentDecorationsProps> = ({
  borderConfig,
  decorationConfig,
  template,
  borderType,
  borderColor: propBorderColor,
  borderWidth: propBorderWidth,
  intensity: propIntensity,
}) => {
  // Resolve border settings
  const borderPreset: PageBorderPreset = borderConfig?.preset || (borderType === 'none' ? 'none' : 'moroccan');
  const borderThickness = borderConfig?.thickness ?? propBorderWidth ?? 1.5;
  const borderColor = borderConfig?.color || propBorderColor || '#065f46';
  const borderInsetMm = borderConfig?.insetMm ?? 6;
  const borderScope = borderConfig?.scope || (borderType as any) || 'full';

  // Resolve decoration settings
  const decStyle: IslamicDecorationStyle = decorationConfig?.style || (template as any) || 'moroccan_geometric';
  const decIntensity: DecorationIntensityLevel = decorationConfig?.intensity || (propIntensity as any) || 'light';

  // Opacity map for decoration intensity
  const intensityMap: Record<DecorationIntensityLevel, number> = {
    none: 0,
    light: 0.25,
    medium: 0.65,
    strong: 1.0,
  };

  const decOpacity = intensityMap[decIntensity] ?? 0.25;

  if (borderPreset === 'none' && decIntensity === 'none') {
    return null;
  }

  // Common Corner 8-Point Islamic Star (خاتم إسلامي)
  const renderIslamicStarCorner = (size = 36) => (
    <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
      {/* 8-pointed star */}
      <polygon points="20,2 24,14 36,10 28,20 36,30 24,26 20,38 16,26 4,30 12,20 4,10 16,14" opacity="0.9" />
      <circle cx="20" cy="20" r="4" fill="#FFFFFF" />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  );

  // Moroccan Geometric Interlaced Corner
  const renderMoroccanGeometricCorner = () => (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
      <path d="M2 38 L2 2 L38 2" />
      <path d="M7 38 L7 7 L38 7" strokeWidth="0.8" opacity="0.6" />
      <polygon points="16,4 20,8 16,12 12,8" fill="currentColor" />
      <polygon points="4,16 8,20 4,24 0,20" fill="currentColor" />
      <rect x="10" y="10" width="8" height="8" fill="currentColor" opacity="0.85" />
    </svg>
  );

  // Zellij Star Motif
  const renderZellijMotif = () => (
    <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
      <path d="M0 0 L40 0 L40 4 L4 4 L4 40 L0 40 Z" />
      <polygon points="16,8 24,8 28,16 24,24 16,24 8,16" opacity="0.85" />
      <polygon points="16,10 22,10 25,16 22,22 16,22 10,16" fill="#FFFFFF" />
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </svg>
  );

  // Classic Arabesque Floral Corner
  const renderArabesqueCorner = () => (
    <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
      <path d="M0 0 C22 0 40 18 40 40 L36 40 C36 21 21 6 0 6 Z" />
      <path d="M6 6 C20 6 34 20 34 34 L31 34 C31 22 22 13 6 13 Z" opacity="0.6" />
      <circle cx="15" cy="15" r="3.5" />
    </svg>
  );

  // Academic Dignified Seal Corner
  const renderAcademicCorner = () => (
    <svg viewBox="0 0 40 40" fill="currentColor" className="w-full h-full">
      <path d="M0 0 L40 0 L40 6 L6 6 L6 40 L0 40 Z" />
      <rect x="10" y="10" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polygon points="16,11 21,16 16,21 11,16" fill="currentColor" />
    </svg>
  );

  const getCornerRenderer = () => {
    switch (decStyle) {
      case 'moroccan_zellij':
        return renderZellijMotif;
      case 'moroccan_geometric':
      case 'geometric':
        return renderMoroccanGeometricCorner;
      case 'academic_official':
      case 'academic_green':
        return renderAcademicCorner;
      case 'corner_ornaments':
        return renderArabesqueCorner;
      case 'classic_islamic':
      case 'simple_islamic':
      default:
        return renderIslamicStarCorner;
    }
  };

  const CornerComponent = getCornerRenderer();

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {/* ---------------- 1. PAGE BORDERS ---------------- */}
      {borderPreset !== 'none' && borderScope !== 'none' && (
        <div
          style={{
            position: 'absolute',
            top: `${borderInsetMm}mm`,
            bottom: `${borderInsetMm}mm`,
            left: `${borderInsetMm}mm`,
            right: `${borderInsetMm}mm`,
          }}
          className="pointer-events-none"
        >
          {/* Preset: SIMPLE */}
          {borderPreset === 'simple' && (
            <div
              className="w-full h-full rounded-xs"
              style={{
                border: `${borderThickness}px solid ${borderColor}`,
              }}
            />
          )}

          {/* Preset: ISLAMIC (Double Border with inner decorative margin) */}
          {borderPreset === 'islamic' && (
            <div
              className="w-full h-full rounded-xs p-1"
              style={{
                border: `${borderThickness * 1.3}px solid ${borderColor}`,
              }}
            >
              <div
                className="w-full h-full rounded-xs"
                style={{
                  border: `${Math.max(0.75, borderThickness * 0.6)}px solid ${borderColor}`,
                  opacity: 0.85,
                }}
              />
            </div>
          )}

          {/* Preset: MOROCCAN (Outer stroke + dashed inner + corner alignment) */}
          {borderPreset === 'moroccan' && (
            <div
              className="w-full h-full rounded-xs p-1.5"
              style={{
                border: `${borderThickness * 1.5}px solid ${borderColor}`,
              }}
            >
              <div
                className="w-full h-full rounded-xs"
                style={{
                  border: `${borderThickness * 0.75}px solid ${borderColor}`,
                }}
              />
            </div>
          )}

          {/* Preset: ACADEMIC (Authoritative clean double lines) */}
          {borderPreset === 'academic' && (
            <div
              className="w-full h-full rounded-xs p-1"
              style={{
                border: `${borderThickness * 1.4}px solid ${borderColor}`,
              }}
            >
              <div
                className="w-full h-full rounded-xs"
                style={{
                  border: `1px solid ${borderColor}`,
                  opacity: 0.7,
                }}
              />
            </div>
          )}

          {/* Preset: DECORATIVE (Triple ornamental lines) */}
          {borderPreset === 'decorative' && (
            <div
              className="w-full h-full rounded-xs p-1"
              style={{
                border: `${borderThickness}px solid ${borderColor}`,
              }}
            >
              <div
                className="w-full h-full rounded-xs p-1"
                style={{
                  border: `0.75px dashed ${borderColor}`,
                  opacity: 0.75,
                }}
              >
                <div
                  className="w-full h-full rounded-xs"
                  style={{
                    border: `0.75px solid ${borderColor}`,
                    opacity: 0.5,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- 2. ISLAMIC DECORATIONS ---------------- */}
      {decIntensity !== 'none' && decOpacity > 0 && (
        <>
          {/* Top Banner Ornamentation (for top_only or full styles) */}
          {(decStyle === 'top_only' || decStyle === 'classic_islamic' || decStyle === 'moroccan_geometric') && (
            <div
              style={{
                position: 'absolute',
                top: `${borderInsetMm + 1}mm`,
                left: '25%',
                right: '25%',
                height: '5px',
                color: borderColor,
                opacity: decOpacity,
              }}
              className="flex items-center justify-center overflow-hidden"
            >
              <svg viewBox="0 0 240 12" fill="none" stroke="currentColor" className="w-full h-full">
                <line x1="0" y1="6" x2="105" y2="6" strokeWidth="1" />
                <polygon points="120,0 124,6 120,12 116,6" fill="currentColor" />
                <circle cx="110" cy="6" r="2" fill="currentColor" />
                <circle cx="130" cy="6" r="2" fill="currentColor" />
                <line x1="135" y1="6" x2="240" y2="6" strokeWidth="1" />
              </svg>
            </div>
          )}

          {/* Bottom Banner Ornamentation (for bottom_only or full styles) */}
          {(decStyle === 'bottom_only' || decStyle === 'classic_islamic' || decStyle === 'moroccan_geometric') && (
            <div
              style={{
                position: 'absolute',
                bottom: `${borderInsetMm + 1}mm`,
                left: '25%',
                right: '25%',
                height: '5px',
                color: borderColor,
                opacity: decOpacity,
              }}
              className="flex items-center justify-center overflow-hidden"
            >
              <svg viewBox="0 0 240 12" fill="none" stroke="currentColor" className="w-full h-full">
                <line x1="0" y1="6" x2="105" y2="6" strokeWidth="1" />
                <polygon points="120,0 124,6 120,12 116,6" fill="currentColor" />
                <circle cx="110" cy="6" r="2" fill="currentColor" />
                <circle cx="130" cy="6" r="2" fill="currentColor" />
                <line x1="135" y1="6" x2="240" y2="6" strokeWidth="1" />
              </svg>
            </div>
          )}

          {/* Four Corner Accents (Unless top_only or bottom_only) */}
          {decStyle !== 'top_only' && decStyle !== 'bottom_only' && (
            <>
              {/* Top-Right Corner */}
              <div
                style={{
                  position: 'absolute',
                  top: `${borderInsetMm}mm`,
                  right: `${borderInsetMm}mm`,
                  width: '32px',
                  height: '32px',
                  color: borderColor,
                  opacity: decOpacity,
                }}
              >
                {CornerComponent()}
              </div>

              {/* Top-Left Corner */}
              <div
                style={{
                  position: 'absolute',
                  top: `${borderInsetMm}mm`,
                  left: `${borderInsetMm}mm`,
                  width: '32px',
                  height: '32px',
                  color: borderColor,
                  opacity: decOpacity,
                  transform: 'scaleX(-1)',
                }}
              >
                {CornerComponent()}
              </div>

              {/* Bottom-Right Corner */}
              <div
                style={{
                  position: 'absolute',
                  bottom: `${borderInsetMm}mm`,
                  right: `${borderInsetMm}mm`,
                  width: '32px',
                  height: '32px',
                  color: borderColor,
                  opacity: decOpacity,
                  transform: 'scaleY(-1)',
                }}
              >
                {CornerComponent()}
              </div>

              {/* Bottom-Left Corner */}
              <div
                style={{
                  position: 'absolute',
                  bottom: `${borderInsetMm}mm`,
                  left: `${borderInsetMm}mm`,
                  width: '32px',
                  height: '32px',
                  color: borderColor,
                  opacity: decOpacity,
                  transform: 'scale(-1, -1)',
                }}
              >
                {CornerComponent()}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
