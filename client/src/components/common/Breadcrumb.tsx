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
    <div className="container mx-auto px-4 py-3 mt-3 text-xs bg-[#F6F6F6]">
      <nav className="py-2" aria-label="Breadcrumb">
        <ul className="flex flex-wrap items-center text-gray-600">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {item.href && !item.active ? (
                <Link href={item.href}>
                  <span className="hover:text-[#BB1919] cursor-pointer">{item.label}</span>
                </Link>
              ) : (
                <span className="text-[#BB1919] font-medium">{item.label}</span>
              )}
              {index < items.length - 1 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">›</span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
