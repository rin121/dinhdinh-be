import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <div className="bg-gradient-to-br from-pink-50/20 via-purple-50/20 to-blue-50/20 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 min-h-screen">
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
    </div>
);
