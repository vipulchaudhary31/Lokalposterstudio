// Compact template JSON schema used for export.
// This keeps the downloaded files small while this file documents
// the meaning of each short key for your dev team.

export type CompactTemplateJSON = {
  /** aspectRatio: e.g. "1080:1350" */
  ar: string;
  /** isProfileTemplate: true = Self (Profile), false = Wishes (Upload) */
  t: boolean;
  /** primaryCategories: Self/Wishes tags */
  pc: string[];
  /** languageTags */
  lg: string[];
  /** backgroundImage (data URL) or null */
  bg: string | null;
  /** mediaType: "image" | "video" */
  mt: 'image' | 'video';
  /** Image (photo) placeholder */
  ip: {
    /** x position (% of canvas width, 0–100) */
    x: number;
    /** y position (% of canvas height, 0–100) */
    y: number;
    /** diameter (% of canvas width, 0–100) */
    d: number;
    /** shape: "circle" | "square" */
    sh: 'circle' | 'square';
    /** cornerRadius (only for square), in design px */
    cr?: number;
    /** hasBackground flag (used by consumer to decide cutout vs. full) */
    hb: boolean;
    /** strokeWidth around photo (design px) */
    sw: number;
    /** strokeColor (normalized hex) */
    sc: string;
  };
  /** Name/text placeholder */
  np: {
    /** y position (% of canvas height, 0–100) */
    y: number;
    /** height (% of canvas height, 0–100) */
    h: number;
    /** styling configuration */
    st: {
      ts: {
        /** text color */
        c: string;
        /** fontSize (design px) */
        fs: number;
        /** fontWeight (numeric) */
        fw: number;
        /** letterSpacing (design px) */
        ls: number;
        /** React Native compatible shadow object */
        shRn: unknown;
        /** React Native stroke/shadow array */
        stRn: unknown;
        /** textAlignment: "left" | "center" | "right" */
        ta: 'left' | 'center' | 'right';
      };
    };
  };
};

// Human-readable mapping for dev docs / tooling.
export const TEMPLATE_KEY_MAP = {
  ar: 'aspectRatio',
  t: 'isProfileTemplate',
  pc: 'primaryCategories',
  lg: 'languageTags',
  bg: 'backgroundImage',
  mt: 'mediaType',
  ip: 'imagePlaceholder',
  np: 'namePlaceholder',
  ip_x: 'imagePlaceholder.x',
  ip_y: 'imagePlaceholder.y',
  ip_d: 'imagePlaceholder.diameter',
  ip_sh: 'imagePlaceholder.shape',
  ip_cr: 'imagePlaceholder.cornerRadius',
  ip_hb: 'imagePlaceholder.hasBackground',
  ip_sw: 'imagePlaceholder.strokeWidth',
  ip_sc: 'imagePlaceholder.strokeColor',
  np_y: 'namePlaceholder.y',
  np_h: 'namePlaceholder.height',
  np_st_ts_c: 'namePlaceholder.styling.textStyle.color',
  np_st_ts_fs: 'namePlaceholder.styling.textStyle.fontSize',
  np_st_ts_fw: 'namePlaceholder.styling.textStyle.fontWeight',
  np_st_ts_ls: 'namePlaceholder.styling.textStyle.letterSpacing',
  np_st_ts_shRn: 'namePlaceholder.styling.textStyle.textShadowRN',
  np_st_ts_stRn: 'namePlaceholder.styling.textStyle.textStrokeRNShadows',
  np_st_ts_ta: 'namePlaceholder.styling.textStyle.textAlignment',
} as const;

