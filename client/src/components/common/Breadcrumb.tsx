import { Link } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="container mx-auto px-4 py-2 text-sm">
      <ul className="flex flex-wrap items-center text-gray-600">
        {items.map((item, index) => (
          <li key={index}>
            {item.href && !item.active ? (
              <Link href={item.href}>
                <a className="hover:text-[#BB1919]">{item.label}</a>
              </Link>
            ) : (
              <span className="text-[#BB1919]">{item.label}</span>
            )}
            {index < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
