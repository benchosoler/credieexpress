/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ADMIN_PASSWORD?: string;
  readonly SECURE_COOKIES?: string;
  readonly PORT?: string;
  /** Public site origin used to build the catalog URL encoded by the
   * magazine sheet-footer QR. Falls back to the production domain when
   * unset — see `MagazineSheet.tsx`. */
  readonly PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    isLoggedIn: boolean;
  }
}
