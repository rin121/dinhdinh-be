import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Settings, ChefHat, Package, Users, BarChart3 } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Bánh Kem',
        href: '/cakes',
        icon: ChefHat,
    },
    {
        title: 'Đơn Hàng',
        href: '/orders',
        icon: Package,
    },
    {
        title: 'Khách Hàng',
        href: '/customers',
        icon: Users,
    },
    {
        title: 'Báo Cáo',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Cài Đặt',
        href: '/general-settings',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r border-pink-100/50 dark:border-pink-900/20">
            <SidebarHeader className="border-b border-pink-100/50 dark:border-pink-900/20">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-950/50 dark:hover:to-purple-950/50 transition-all duration-300">
                            <Link href="/dashboard" prefetch>
                                <div className="flex items-center gap-3 animate-scale-in">
                                    <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover-lift">
                                        <span className="text-white font-bold text-xl animate-float">🍰</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-xl gradient-text">DinhDinh</span>
                                        <span className="text-xs text-muted-foreground">Cake Management</span>
                                    </div>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-gradient-to-b from-pink-50/30 via-purple-50/20 to-blue-50/10 dark:from-pink-950/20 dark:via-purple-950/10 dark:to-blue-950/5">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-pink-100/50 dark:border-pink-900/20 bg-gradient-to-r from-pink-50/50 to-purple-50/30 dark:from-pink-950/30 dark:to-purple-950/20">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
