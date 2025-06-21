import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    const { showDeleteConfirmation } = useSweetAlert();
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

    const handleDelete = (product: Product) => {
        showDeleteConfirmation({
            title: 'Xóa sản phẩm',
            text: `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`,
            onConfirm: () => {
                router.delete(route('products.destroy', product.id));
            }
        });
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
        <AppLayout>
            <Head title="Quản lý sản phẩm" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Quản lý sản phẩm</h1>
                        <p className="text-muted-foreground">
                            Quản lý danh sách sản phẩm, giá cả và thông tin chi tiết
                        </p>
                    </div>
                    <Button asChild className="btn-primary">
                        <Link href={route('products.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Thêm sản phẩm
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="card-hover">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{totalProducts}</div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Đang bán</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{activeProducts}</div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Tạm dừng</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{inactiveProducts}</div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Danh mục</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Bộ lọc
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 md:flex-row md:items-end">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Tìm kiếm sản phẩm..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </form>

                            {/* Category Filter */}
                            <Select 
                                value={filters.category_id || 'all'} 
                                onValueChange={(value) => handleFilterChange('category_id', value)}
                            >
                                <SelectTrigger className="w-[200px]">
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
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="active">Đang bán</SelectItem>
                                    <SelectItem value="inactive">Tạm dừng</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button type="submit" onClick={handleSearch}>
                                <Search className="mr-2 h-4 w-4" />
                                Tìm kiếm
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Products Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {products.data.map((product) => (
                        <Card key={product.id} className="card-hover animate-slide-in-up">
                            <CardHeader>
                                <div className="flex items-start justify-between">
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
                                        <CardTitle className="text-lg">{product.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {product.description}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
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
                                            <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                                                <Copy className="mr-2 h-4 w-4" />
                                                Sao chép
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleToggleStatus(product)}>
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
                                                onClick={() => handleDelete(product)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Xóa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {/* Price */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Giá từ:</span>
                                        <span className="font-semibold text-green-600">
                                            {getMinPrice(product.details)}
                                        </span>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex items-center gap-2">
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
                                        <span className="text-sm text-muted-foreground">
                                            {product.details.length} kích thước
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {products.data.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Chưa có sản phẩm nào</h3>
                            <p className="text-muted-foreground mb-4">
                                Tạo sản phẩm đầu tiên để bắt đầu bán hàng
                            </p>
                            <Button asChild>
                                <Link href={route('products.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm sản phẩm đầu tiên
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {products.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
} 