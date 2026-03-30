import { type ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: ReactNode;
  icon?: React.ElementType;
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-8 relative">
      {/* Linha decorativa sutil */}
      <div className="absolute -top-4 left-0 w-20 h-0.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full" />
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-sm mb-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-primary-600 transition-colors">
            <HomeIcon className="h-4 w-4" />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1.5">
              <ChevronRightIcon className="h-4 w-4 text-gray-300" />
              {crumb.href ? (
                <Link href={crumb.href} className="text-gray-500 hover:text-primary-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      
      {/* Título e Ações */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="w-12 h-12 rounded-sm bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0">
              <Icon className="h-6 w-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
