import Link from "next/link";

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com/graphique", // TODO: replace with your real handle
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Twitter / X",
    href: "https://x.com/graphique", // TODO: replace with your real handle
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 4l7.5 9.5L4.5 20h2.2l6-6.8 4.6 6.8H21l-7.8-10L20 4h-2.2l-5.6 6.3L7.8 4H4z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/graphique", // TODO: replace with your real handle
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M14 9h2.5V6H14c-1.9 0-3.5 1.6-3.5 3.5V12H8v3h2.5v6h3v-6H16l.5-3h-3V9.7c0-.4.3-.7.5-.7z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/#collection" },
  { label: "Cart", href: "/cart" },
];

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="relative border-t border-cyan-accent/25 bg-space-card/60 px-6 pb-10 pt-16 sm:px-10 lg:px-[110px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/60 to-transparent" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 sm:grid-cols-3">
        <div>
          <p className="text-[22px] font-extrabold tracking-[3px] text-cyan-accent">
            GRAPHIQUE MERCH
          </p>
          <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-white/70">
            Wear the Graphique universe — cosmic-inspired merchandise for
            creators, dreamers, and visual storytellers.
          </p>
          <div className="mt-5 flex gap-4">
            {SOCIALS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-accent/40 text-white/80 transition-all duration-200 hover:border-cyan-accent hover:text-cyan-accent hover:shadow-[0_0_16px_rgba(0,229,255,0.6)]"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[15px] font-bold tracking-[1.5px] text-white">
            QUICK LINKS
          </p>
          <ul className="mt-4 flex flex-col gap-3">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-[14px] text-white/70 transition-colors hover:text-cyan-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[15px] font-bold tracking-[1.5px] text-white">
            CONTACT
          </p>
          <ul className="mt-4 flex flex-col gap-3 text-[14px] text-white/70">
            {/* TODO: replace with your real contact details */}
            <li>
              <a href="mailto:hello@graphique.com" className="transition-colors hover:text-cyan-accent">
                hello@graphique.com
              </a>
            </li>
            <li>
              <a href="tel:+911234567890" className="transition-colors hover:text-cyan-accent">
                +91 12345 67890
              </a>
            </li>
            <li>Chennai, India</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-6 text-center text-[12px] text-white/40">
        © {new Date().getFullYear()} Graphique Merch. All rights reserved.
      </div>
    </footer>
  );
}
