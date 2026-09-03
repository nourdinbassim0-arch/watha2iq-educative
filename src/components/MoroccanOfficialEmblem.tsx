import React, { useState, useEffect } from 'react';

export const OFFICIAL_EMBLEM_STORAGE_KEY = 'wathaiqi_official_kingdom_emblem';

export interface MoroccanOfficialEmblemProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  customWidthMm?: number;
  customHeightMm?: number;
  customLogoUrl?: string;
  showMotto?: boolean;
  language?: 'ar' | 'fr' | 'en';
}

export const MoroccanOfficialEmblem: React.FC<MoroccanOfficialEmblemProps> = ({
  className = '',
  size = 'md',
  customWidthMm,
  customHeightMm,
  customLogoUrl,
  showMotto = true,
  language = 'ar',
}) => {
  const [storedEmblemUrl, setStoredEmblemUrl] = useState<string | null>(() => {
    return localStorage.getItem(OFFICIAL_EMBLEM_STORAGE_KEY);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setStoredEmblemUrl(localStorage.getItem(OFFICIAL_EMBLEM_STORAGE_KEY));
    };

    window.addEventListener('officialEmblemUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('officialEmblemUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const activeLogoUrl = customLogoUrl || storedEmblemUrl;

  // Size definitions for balanced document proportions
  const sizeStyles: Record<string, { heightPx: number; titleSize: string; subSize: string; svgScale: string }> = {
    xs: { heightPx: 44, titleSize: 'text-[8px]', subSize: 'text-[7px]', svgScale: 'w-10 h-10' },
    sm: { heightPx: 64, titleSize: 'text-[9px]', subSize: 'text-[7.5px]', svgScale: 'w-14 h-14' },
    md: { heightPx: 92, titleSize: 'text-[11px]', subSize: 'text-[9px]', svgScale: 'w-20 h-20' }, // Default: balanced & prominent
    lg: { heightPx: 120, titleSize: 'text-xs', subSize: 'text-[10px]', svgScale: 'w-26 h-26' },
    xl: { heightPx: 148, titleSize: 'text-sm', subSize: 'text-[11px]', svgScale: 'w-32 h-32' },
  };

  const currentSizeConfig = sizeStyles[size] || sizeStyles.md;

  const customStyle: React.CSSProperties = {};
  if (size === 'custom') {
    if (customWidthMm) customStyle.width = `${customWidthMm}mm`;
    if (customHeightMm) customStyle.height = `${customHeightMm}mm`;
    if (!customWidthMm && !customHeightMm) customStyle.height = '92px';
  } else {
    customStyle.height = `${currentSizeConfig.heightPx}px`;
  }

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* 1. If custom uploaded logo image is provided */}
      {activeLogoUrl ? (
        <img
          src={activeLogoUrl}
          alt="شعار المؤسسة / الشعار الرسمي"
          style={customStyle}
          className="w-auto max-w-full object-contain drop-shadow-xs transition-all"
        />
      ) : (
        /* 2. Authentic Vector SVG of the Kingdom of Morocco Coat of Arms (شعار المملكة المغربية) */
        <div style={customStyle} className="flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-auto max-w-full drop-shadow-xs"
            aria-label="شعار المملكة المغربية الرسمي"
          >
            {/* Background Halo for legibility */}
            <circle cx="100" cy="100" r="94" fill="#FFFFFF" fillOpacity="0.8" />

            {/* Royal Crown at the Top */}
            <g id="royal-crown">
              {/* Crown Base & Jewels */}
              <path
                d="M75 42 Q100 38 125 42 L121 48 Q100 45 79 48 Z"
                fill="#D97706"
                stroke="#92400E"
                strokeWidth="1.2"
              />
              <circle cx="85" cy="45" r="1.5" fill="#EF4444" />
              <circle cx="100" cy="44" r="1.8" fill="#10B981" />
              <circle cx="115" cy="45" r="1.5" fill="#EF4444" />

              {/* Crown Arches & Peaks */}
              <path
                d="M75 42 C70 30, 85 24, 90 32 C95 20, 105 20, 110 32 C115 24, 130 30, 125 42"
                fill="#FBBF24"
                stroke="#B45309"
                strokeWidth="1.5"
              />
              <path
                d="M82 42 Q100 24 118 42"
                fill="none"
                stroke="#D97706"
                strokeWidth="1.5"
              />

              {/* Star at Apex of the Crown */}
              <polygon
                points="100,14 102,20 108,20 103,24 105,30 100,26 95,30 97,24 92,20 98,20"
                fill="#10B981"
                stroke="#065F46"
                strokeWidth="0.8"
              />
            </g>

            {/* Left Atlas Lion Supporter */}
            <g id="left-lion" fill="#B45309" stroke="#78350F" strokeWidth="1">
              {/* Mane & Head */}
              <path d="M52 64 C40 70 38 90 48 106 C44 114 46 128 54 136 C58 132 60 124 58 116 C66 112 70 100 68 88 C70 76 62 62 52 64 Z" fill="#D97706" />
              {/* Crown/Head details */}
              <circle cx="56" cy="74" r="2" fill="#78350F" />
              <path d="M48 84 Q58 84 56 92" stroke="#78350F" strokeWidth="1.2" fill="none" />
              {/* Paw resting on shield */}
              <path d="M64 96 C68 96 74 98 76 102 C74 105 68 106 64 102 Z" fill="#FBBF24" />
              {/* Rear body & Tail */}
              <path d="M48 116 C38 126 36 142 42 152 C46 150 48 144 48 138 C40 146 36 130 46 118" fill="#B45309" />
            </g>

            {/* Right Atlas Lion Supporter */}
            <g id="right-lion" fill="#B45309" stroke="#78350F" strokeWidth="1">
              {/* Mane & Head (Mirrored) */}
              <path d="M148 64 C160 70 162 90 152 106 C156 114 154 128 146 136 C142 132 140 124 142 116 C134 112 130 100 132 88 C130 76 138 62 148 64 Z" fill="#D97706" />
              {/* Eye & Details */}
              <circle cx="144" cy="74" r="2" fill="#78350F" />
              <path d="M152 84 Q142 84 144 92" stroke="#78350F" strokeWidth="1.2" fill="none" />
              {/* Paw resting on shield */}
              <path d="M136 96 C132 96 126 98 124 102 C126 105 132 106 136 102 Z" fill="#FBBF24" />
              {/* Rear body & Tail */}
              <path d="M152 116 C162 126 164 142 158 152 C154 150 152 144 152 138 C160 146 164 130 154 118" fill="#B45309" />
            </g>

            {/* Central Heraldic Shield */}
            <g id="central-shield">
              {/* Shield Outer Gold Border */}
              <path
                d="M68 54 Q100 50 132 54 L132 104 C132 132 100 148 100 148 C100 148 68 132 68 104 Z"
                fill="#FEF3C7"
                stroke="#B45309"
                strokeWidth="2.5"
              />

              {/* Inner Shield (Green & Red field) */}
              <path
                d="M72 58 Q100 54 128 58 L128 103 C128 128 100 143 100 143 C100 143 72 128 72 103 Z"
                fill="#DC2626"
              />

              {/* Rising Sun Field (Gules & Or) */}
              <path
                d="M72 58 Q100 54 128 58 L128 92 C118 90 108 88 100 88 C92 88 82 90 72 92 Z"
                fill="#FBBF24"
              />

              {/* Sun Rays */}
              <g stroke="#D97706" strokeWidth="1.5">
                <line x1="100" y1="88" x2="100" y2="60" />
                <line x1="100" y1="88" x2="82" y2="64" />
                <line x1="100" y1="88" x2="118" y2="64" />
                <line x1="100" y1="88" x2="74" y2="76" />
                <line x1="100" y1="88" x2="126" y2="76" />
              </g>

              {/* Atlas Mountains Peak */}
              <polygon
                points="72,96 88,84 100,90 112,82 128,96 128,104 72,104"
                fill="#047857"
              />
              <polygon
                points="84,86 100,98 116,84 128,94 128,103 72,103 72,94"
                fill="#065F46"
              />

              {/* Green Pentagram - Seal of Solomon (النجمة الخماسية المغربية) */}
              <polygon
                points="100,102 104,115 117,115 106,123 111,136 100,128 89,136 94,123 83,115 96,115"
                fill="#10B981"
                stroke="#064E3B"
                strokeWidth="1.2"
              />
              {/* Interlaced star inner lines */}
              <g stroke="#047857" strokeWidth="0.8">
                <line x1="100" y1="102" x2="111" y2="136" />
                <line x1="100" y1="102" x2="89" y2="136" />
                <line x1="83" y1="115" x2="117" y2="115" />
                <line x1="83" y1="115" x2="106" y2="123" />
                <line x1="117" y1="115" x2="94" y2="123" />
              </g>
            </g>

            {/* Golden Ribbon Scroll with Qur'anic Verse (إن تنصروا الله ينصركم) */}
            <g id="bottom-ribbon">
              {/* Ribbon Ends */}
              <path
                d="M40 162 L52 148 L64 162 L48 166 Z"
                fill="#D97706"
                stroke="#92400E"
                strokeWidth="1"
              />
              <path
                d="M160 162 L148 148 L136 162 L152 166 Z"
                fill="#D97706"
                stroke="#92400E"
                strokeWidth="1"
              />

              {/* Main Ribbon Banner */}
              <path
                d="M48 152 Q100 144 152 152 Q156 164 150 166 Q100 156 50 166 Q44 164 48 152 Z"
                fill="#FDE68A"
                stroke="#B45309"
                strokeWidth="1.5"
              />

              {/* Ribbon Folds */}
              <path d="M50 166 L60 155" stroke="#92400E" strokeWidth="1" />
              <path d="M150 166 L140 155" stroke="#92400E" strokeWidth="1" />

              {/* Motto: إن تنصروا الله ينصركم */}
              <text
                x="100"
                y="161.5"
                textAnchor="middle"
                fontSize="6.8"
                fontWeight="900"
                fontFamily="Amiri, serif, traditional arabic"
                fill="#78350F"
                letterSpacing="0.2"
              >
                إِنْ تَنصُرُوا اللَّهَ يَنصُرْكُمْ
              </text>
            </g>
          </svg>
        </div>
      )}

      {/* Official Kingdom & Ministry Hierarchy Titles */}
      {showMotto && (
        <div className="mt-1.5 flex flex-col items-center leading-tight">
          <span className={`font-black text-[#065F46] font-serif tracking-wide ${currentSizeConfig.titleSize}`}>
            {language === 'ar' ? 'المملكة المغربية' : language === 'fr' ? 'Royaume du Maroc' : 'Kingdom of Morocco'}
          </span>
          <span className={`${currentSizeConfig.subSize} text-[#78350F] font-bold tracking-tight mt-0.5`}>
            {language === 'ar'
              ? 'وزارة التربية الوطنية والتعليم الأولي والرياضة'
              : language === 'fr'
              ? "Ministère de l'Éducation Nationale, du Préscolaire et des Sports"
              : 'Ministry of National Education, Preschool and Sports'}
          </span>
        </div>
      )}
    </div>
  );
};

