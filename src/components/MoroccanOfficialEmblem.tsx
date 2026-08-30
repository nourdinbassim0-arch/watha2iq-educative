import React, { useState, useEffect } from 'react';

export const OFFICIAL_EMBLEM_STORAGE_KEY = 'wathaiqi_official_kingdom_emblem';

interface MoroccanOfficialEmblemProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showMotto?: boolean;
  language?: 'ar' | 'fr' | 'en';
}

export const MoroccanOfficialEmblem: React.FC<MoroccanOfficialEmblemProps> = ({
  className = '',
  size = 'md',
  showMotto = true,
  language = 'ar',
}) => {
  const [emblemUrl, setEmblemUrl] = useState<string | null>(() => {
    return localStorage.getItem(OFFICIAL_EMBLEM_STORAGE_KEY);
  });

  useEffect(() => {
    const handleUpdate = () => {
      setEmblemUrl(localStorage.getItem(OFFICIAL_EMBLEM_STORAGE_KEY));
    };

    window.addEventListener('officialEmblemUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('officialEmblemUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const sizeMap = {
    xs: { imgHeight: 'h-8 max-w-[60px]', titleSize: 'text-[7px]', subSize: 'text-[6px]' },
    sm: { imgHeight: 'h-12 max-w-[80px]', titleSize: 'text-[9px]', subSize: 'text-[7px]' },
    md: { imgHeight: 'h-16 max-w-[110px]', titleSize: 'text-[10px]', subSize: 'text-[8px]' },
    lg: { imgHeight: 'h-20 max-w-[140px]', titleSize: 'text-xs', subSize: 'text-[9px]' },
    xl: { imgHeight: 'h-28 max-w-[180px]', titleSize: 'text-sm', subSize: 'text-[10px]' },
  };

  const { imgHeight, titleSize, subSize } = sizeMap[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* 1. If Owner uploaded official emblem image */}
      {emblemUrl ? (
        <img
          src={emblemUrl}
          alt="الشعار الرسمي للمملكة المغربية"
          className={`${imgHeight} w-auto object-contain drop-shadow-xs transition-all`}
        />
      ) : (
        /* 2. Standard Official Typographic Crest Placeholder (No AI-generated fake symbol) */
        <div className="flex flex-col items-center justify-center p-2 rounded-xl border border-emerald-800/30 bg-emerald-50/40 text-emerald-900 shadow-2xs">
          <span className="font-serif font-black text-xs sm:text-sm text-[#065F46] tracking-wider">
            🇲🇦
          </span>
          <span className="text-[9px] font-bold text-slate-700 mt-0.5">
            الشعار الرسمي للمملكة المغربية
          </span>
        </div>
      )}

      {/* Official Kingdom Label and Ministry Hierarchy */}
      {showMotto && (
        <div className="mt-1 flex flex-col items-center">
          <span className={`font-black text-[#065F46] leading-tight font-serif ${titleSize}`}>
            {language === 'ar' ? 'المملكة المغربية' : language === 'fr' ? 'Royaume du Maroc' : 'Kingdom of Morocco'}
          </span>
          <span className={`${subSize} text-[#78350F] font-semibold tracking-tight`}>
            {language === 'ar'
              ? 'وزارة التربية الوطنية والتعليم الأولي والرياضة'
              : language === 'fr'
              ? "Ministère de l'Éducation Nationale"
              : 'Ministry of National Education'}
          </span>
        </div>
      )}
    </div>
  );
};
