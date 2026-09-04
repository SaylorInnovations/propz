import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Propz home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="img">
          <path className="outer-trace" d="M9 40V9h16c9.1 0 15 5.3 15 13.5S34.1 36 25 36H18" />
          <path className="inner-trace" d="M15 31V16h10c4.5 0 7.5 2.5 7.5 6.5S29.5 29 25 29h-4" />
          <circle cx="40" cy="9" r="2.7" />
          <circle cx="9" cy="40" r="2.7" />
          <circle className="inner-node" cx="21" cy="29" r="2.2" />
        </svg>
      </span>
      <span className="brand-name">PROP<span>Z</span></span>
    </Link>
  );
}
