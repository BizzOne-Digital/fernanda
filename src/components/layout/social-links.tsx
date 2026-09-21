import { getPublicSocialLinks } from "@/lib/site/social-links";
import { cn } from "@/lib/utils/cn";

type SocialLinksProps = {
  className?: string;
  linkClassName?: string;
};

export function SocialLinks({ className, linkClassName }: SocialLinksProps) {
  const { facebook, threads } = getPublicSocialLinks();

  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-2", className)}>
      <li>
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          Facebook
        </a>
      </li>
      <li>
        <a
          href={threads}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          Threads
        </a>
      </li>
    </ul>
  );
}
