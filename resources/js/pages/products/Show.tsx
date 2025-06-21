import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
    ArrowLeft, 
    Edit, 
    Package, 
    DollarSign, 
    ChefHat, 
    AlertTriangle,
    Calendar,
    Tag,
    Eye,
    EyeOff
} from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    long_description: string;
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
        description: string;
        is_available: boolean;
        sort_order: number;
    }>;
    ingredients: Array<{
        id: number;
        name: string;
        description: string;
        type: string;
        is_main: boolean;
        sort_order: number;
    }>;
    allergens: Array<{
        id: number;
        name: string;
        description: string;
        severity: string;
        icon: string;
        sort_order: number;
    }>;
    created_at: string;
    updated_at: string;
}

interface Props {
    product: Product;
}

export default function Show({ product }: Props) {
    const getBadgeVariant = (badge: string | null) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            'new': 'default',
            'hot': 'destructive',
            'bestseller': 'secondary',
            'trending': 'outline',
        };
        return variants[badge || ''] || 'outline';
    };

    const getSeverityColor = (severity: string) => {
        const colors: Record<string, string> = {
            'mild': 'text-yellow-600',
            'moderate': 'text-orange-600',
            'severe': 'text-red-600',
        };
        return colors[severity] || 'text-gray-600';
    };

    const getMinMaxPrice = () => {
        if (!product.details.length) return { min: 0, max: 0 };
        const prices = product.details.map(d => d.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices)
        };
    };

    const { min, max } = getMinMaxPrice();
    const priceRange = min === max 
        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(min)
        : `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(min)} - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(max)}`;

    return (
        <AppLayout>
            <Head title={`${product.name} - Chi tiết sản phẩm`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" asChild>
                            <Link href={route('products.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Quay lại
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl">{product.image}</span>
                                <h1 className="text-3xl font-bold gradient-text">{product.name}</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">
                                    {product.category.icon} {product.category.name}
                                </Badge>
                                {product.badge && (
                                    <Badge variant={getBadgeVariant(product.badge)}>
                                        {product.badge}
                                    </Badge>
                                )}
                                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                    {product.is_active ? (
                                        <>
                                            <Eye className="mr-1 h-3 w-3" />
                                            Đang bán
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="mr-1 h-3 w-3" />
                                            Tạm dừng
                                        </>
                                    )}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <Button asChild className="btn-primary">
                        <Link href={route('products.edit', product.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Thông tin cơ bản
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2">Mô tả ngắn</h3>
                                    <p className="text-muted-foreground">{product.description}</p>
                                </div>

                                {product.long_description && (
                                    <div>
                                        <h3 className="font-medium mb-2">Mô tả chi tiết</h3>
                                        <p className="text-muted-foreground whitespace-pre-wrap">
                                            {product.long_description}
                                        </p>
                                    </div>
                                )}

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h3 className="font-medium mb-2">Slug</h3>
                                        <code className="bg-muted px-2 py-1 rounded text-sm">
                                            {product.slug}
                                        </code>
                                    </div>
                                    <div>
                                        <h3 className="font-medium mb-2">Thứ tự sắp xếp</h3>
                                        <span className="text-muted-foreground">{product.sort_order}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Thông tin giá và kích thước
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {product.details.map((detail, index) => (
                                        <div key={detail.id} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-medium">{detail.size}</h4>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={detail.is_available ? 'default' : 'secondary'}>
                                                        {detail.is_available ? 'Có sẵn' : 'Hết hàng'}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="grid gap-3 md:grid-cols-2">
                                                <div>
                                                    <span className="text-sm text-muted-foreground">Giá:</span>
                                                    <div className="font-semibold text-green-600">
                                                        {detail.price_display || new Intl.NumberFormat('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND'
                                                        }).format(detail.price)}
                                                    </div>
                                                </div>

                                                <div>
                                                    <span className="text-sm text-muted-foreground">Phục vụ:</span>
                                                    <div>{detail.servings}</div>
                                                </div>
                                            </div>

                                            {detail.description && (
                                                <div className="mt-3">
                                                    <span className="text-sm text-muted-foreground">Ghi chú:</span>
                                                    <div className="text-sm">{detail.description}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ingredients */}
                        {product.ingredients.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ChefHat className="h-5 w-5" />
                                        Nguyên liệu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {product.ingredients.map((ingredient) => (
                                            <div key={ingredient.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{ingredient.name}</span>
                                                        {ingredient.is_main && (
                                                            <Badge variant="outline" className="text-xs">
                                                                Chính
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {ingredient.description && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {ingredient.description}
                                                        </p>
                                                    )}
                                                    <Badge variant="outline" className="text-xs mt-1">
                                                        {ingredient.type}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Allergens */}
                        {product.allergens.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5" />
                                        Chất gây dị ứng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        {product.allergens.map((allergen) => (
                                            <div key={allergen.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                                <span className="text-2xl">{allergen.icon}</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{allergen.name}</span>
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`text-xs ${getSeverityColor(allergen.severity)}`}
                                                        >
                                                            {allergen.severity}
                                                        </Badge>
                                                    </div>
                                                    {allergen.description && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {allergen.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thống kê nhanh</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Khoảng giá:</span>
                                    <span className="font-semibold text-green-600">{priceRange}</span>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Số kích thước:</span>
                                    <span className="font-medium">{product.details.length}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Nguyên liệu:</span>
                                    <span className="font-medium">{product.ingredients.length}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Chất gây dị ứng:</span>
                                    <span className="font-medium">{product.allergens.length}</span>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Trạng thái:</span>
                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                        {product.is_active ? 'Đang bán' : 'Tạm dừng'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Thông tin thời gian
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <span className="text-sm text-muted-foreground">Ngày tạo:</span>
                                    <div className="text-sm">
                                        {new Date(product.created_at).toLocaleString('vi-VN')}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-sm text-muted-foreground">Cập nhật lần cuối:</span>
                                    <div className="text-sm">
                                        {new Date(product.updated_at).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Thao tác</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button asChild className="w-full">
                                    <Link href={route('products.edit', product.id)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Chỉnh sửa sản phẩm
                                    </Link>
                                </Button>

                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={`/products/${product.slug}`} target="_blank">
                                        <Eye className="mr-2 h-4 w-4" />
                                        Xem trên website
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 