export type Crumb = {
  label: string;
  href?: string;
};

import Link from "next/link";

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (!item.href || isLast) {
          return (
            <span key={`${item.label}-${index}`} className="breadcrumb-item">
              {item.label}
            </span>
          );
        }

        return (
          <Link key={`${item.label}-${index}`} className="breadcrumb-item" href={item.href}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
