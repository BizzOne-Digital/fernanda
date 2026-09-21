export const SITE_FACEBOOK_URL =
  "https://www.facebook.com/share/1CDyErC1J1/?mibextid=wwXIfr";

export const SITE_THREADS_URL =
  "https://www.threads.com/@vaseaux?igshid=NTc4MTIwNjQ2YQ==";

/** Public Facebook + Threads links (shown in footer and contact). */
export function getPublicSocialLinks() {
  return {
    facebook: SITE_FACEBOOK_URL,
    threads: SITE_THREADS_URL,
  };
}
