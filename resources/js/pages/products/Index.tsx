import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal, 
    Eye, 
    Edit, 
    Copy, 
    Trash2,
    ToggleLeft,
    ToggleRight,
    Package,
    TrendingUp,
    ShoppingCart,
    DollarSign
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useSweetAlert } from '@/hooks/use-sweet-alert';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    badge: string | null;
    is_active: boolean;
    sort_order: number;
    category: {
        id: number;
        name: string;
        type: string;
        icon: string;
    };
    details: Array<{
        id: number;
        size: string;
        price: number;
        price_display: string;
        servings: string;
    }>;
    created_at: string;
    updated_at: string;
}

interface Category {
    id: number;
    name: string;
    type: string;
    icon: string;
}

interface Props {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    categories: Category[];
    filters: {
        category_id?: string;
        status?: string;
        search?: string;
        sort?: string;
        order?: string;
    };
    badges: Record<string, string>;
}

export default function Index({ products, categories, filters, badges }: Props) {
    const { showConfirm } = useSweetAlert();
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('products.index'), {
            ...filters,
            search: searchTerm,
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(route('products.index'), {
            ...filters,
            [key]: value === 'all' ? '' : value,
        });
    };

    const handleDelete = async (product: Product) => {
        const result = await showConfirm(
            'Xóa sản phẩm',
            `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`
        );
        
        if (result.isConfirmed) {
            router.delete(route('products.destroy', product.id));
        }
    };

    const handleToggleStatus = (product: Product) => {
        router.patch(route('products.toggle-status', product.id));
    };

    const handleDuplicate = (product: Product) => {
        router.post(route('products.duplicate', product.id));
    };

    const getBadgeVariant = (badge: string | null) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            'new': 'default',
            'hot': 'destructive',
            'bestseller': 'secondary',
            'trending': 'outline',
        };
        return variants[badge || ''] || 'outline';
    };

    const getMinPrice = (details: Product['details']) => {
        if (!details.length) return 'Liên hệ';
        const minPrice = Math.min(...details.map(d => d.price));
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(minPrice);
    };

    // Stats
    const totalProducts = products.total;
    const activeProducts = products.data.filter(p => p.is_active).length;
    const inactiveProducts = products.data.filter(p => !p.is_active).length;

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Sản phẩm', href: route('products.index') },
            ]}
        >
            <Head title="Quản lý sản phẩm" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto animate-slide-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <Package className="w-8 h-8" />
                                Quản Lý Sản Phẩm
                            </h1>
                            <p className="text-indigo-100 text-lg">Quản lý danh sách sản phẩm, giá cả và thông tin chi tiết</p>
                        </div>
                        <Link 
                            href={route('products.create')}
                            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 hover-lift flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Thêm Sản Phẩm
                        </Link>
                    </div>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 right-8 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { 
                            title: 'Tổng Sản Phẩm', 
                            value: totalProducts.toString(), 
                            change: '+12', 
                            icon: Package, 
                            color: 'indigo',
                            description: 'Tổng số sản phẩm trong hệ thống'
                        },
                        { 
                            title: 'Đang Bán', 
                            value: activeProducts.toString(), 
                            change: '+5', 
                            icon: TrendingUp, 
                            color: 'green',
                            description: 'Sản phẩm đang hoạt động'
                        },
                        { 
                            title: 'Tạm Dừng', 
                            value: inactiveProducts.toString(), 
                            change: '-2', 
                            icon: ShoppingCart, 
                            color: 'orange',
                            description: 'Sản phẩm tạm ngưng bán'
                        },
                        { 
                            title: 'Danh Mục', 
                            value: categories.length.toString(), 
                            change: '+1', 
                            icon: DollarSign, 
                            color: 'purple',
                            description: 'Số danh mục sản phẩm'
                        }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div 
                                key={stat.title}
                                className={`bg-gradient-to-br ${
                                    stat.color === 'indigo' ? 'from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30' :
                                    stat.color === 'green' ? 'from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30' :
                                    stat.color === 'orange' ? 'from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30' :
                                    'from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30'
                                } rounded-2xl p-6 card-hover border border-white/50 dark:border-gray-800/50 shadow-lg backdrop-blur-sm`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 bg-gradient-to-r ${
                                        stat.color === 'indigo' ? 'from-indigo-400 to-indigo-600' :
                                        stat.color === 'green' ? 'from-green-400 to-green-600' :
                                        stat.color === 'orange' ? 'from-orange-400 to-orange-600' :
                                        'from-purple-400 to-purple-600'
                                    } rounded-xl shadow-lg hover-lift`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className={`text-sm font-medium ${
                                        stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                    }`}>{stat.change}</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{stat.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                    <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Filter className="w-5 h-5 text-indigo-500" />
                            Bộ Lọc & Tìm Kiếm
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Tìm kiếm và lọc sản phẩm theo tiêu chí
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                    />
                                </div>
                            </form>

                            {/* Category Filter */}
                            <Select 
                                value={filters.category_id || 'all'} 
                                onValueChange={(value) => handleFilterChange('category_id', value)}
                            >
                                <SelectTrigger className="w-[200px] bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl">
                                    <SelectValue placeholder="Chọn danh mục" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.icon} {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Status Filter */}
                            <Select 
                                value={filters.status || 'all'} 
                                onValueChange={(value) => handleFilterChange('status', value)}
                            >
                                <SelectTrigger className="w-[150px] bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="active">Đang bán</SelectItem>
                                    <SelectItem value="inactive">Tạm dừng</SelectItem>
                                </SelectContent>
                            </Select>

                            <button 
                                type="submit" 
                                onClick={handleSearch}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover-lift flex items-center gap-2 shadow-lg"
                            >
                                <Search className="w-4 h-4" />
                                Tìm kiếm
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products List */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                    <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Package className="w-5 h-5 text-indigo-500" />
                                    Danh Sách Sản Phẩm
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Tổng cộng {products.total} sản phẩm được tìm thấy
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {products.data.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {products.data.map((product, index) => (
                                    <Link
                                        key={product.id}
                                        href={route('products.edit', product.id)}
                                        className="block bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-6 hover:bg-gray-100/70 dark:hover:bg-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-200 hover-lift border border-gray-200/30 dark:border-gray-700/30 cursor-pointer group"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-2xl">{product.image}</span>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-sm">{product.category.icon}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {product.category.name}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200 mb-2 flex items-center gap-2">
                                                    {product.name}
                                                    <Edit className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity duration-200" />
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                                                    {product.description}
                                                </p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button 
                                                        variant="ghost" 
                                                        className="h-8 w-8 p-0"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('products.show', product.id)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Xem chi tiết
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('products.edit', product.id)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Chỉnh sửa
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDuplicate(product);
                                                    }}>
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Sao chép
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleStatus(product);
                                                    }}>
                                                        {product.is_active ? (
                                                            <>
                                                                <ToggleLeft className="mr-2 h-4 w-4" />
                                                                Tạm dừng
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ToggleRight className="mr-2 h-4 w-4" />
                                                                Kích hoạt
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(product);
                                                        }}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Xóa
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="space-y-3">
                                            {/* Price */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-300">Giá từ:</span>
                                                <span className="font-semibold text-green-600">
                                                    {getMinPrice(product.details)}
                                                </span>
                                            </div>

                                            {/* Badges */}
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {product.badge && (
                                                    <Badge variant={getBadgeVariant(product.badge)}>
                                                        {badges[product.badge]}
                                                    </Badge>
                                                )}
                                                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                                    {product.is_active ? 'Đang bán' : 'Tạm dừng'}
                                                </Badge>
                                            </div>

                                            {/* Sizes */}
                                            <div>
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {product.details.length} kích thước
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Package className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Chưa có sản phẩm nào</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    Tạo sản phẩm đầu tiên để bắt đầu bán hàng
                                </p>
                                <Link 
                                    href={route('products.create')}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover-lift flex items-center gap-2 shadow-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm sản phẩm đầu tiên
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg p-6">
                        <div className="flex items-center justify-center gap-2">
                            {products.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={link.active ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : ''}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
} 