/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOCIAL_GITHUB?: string;
  readonly VITE_SOCIAL_LINKEDIN?: string;
  readonly VITE_SOCIAL_TWITTER?: string;
  readonly VITE_SOCIAL_INSTAGRAM?: string;
  readonly VITE_SOCIAL_FACEBOOK?: string;
  readonly VITE_SOCIAL_YOUTUBE?: string;
  readonly VITE_SOCIAL_WHATSAPP?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
