import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
    ArrowLeft, 
    Plus, 
    Trash2, 
    Save,
    Package,
    DollarSign,
    ChefHat,
    AlertTriangle,
    GripVertical
} from 'lucide-react';
import InputError from '@/components/input-error';

interface Category {
    id: number;
    name: string;
    type: string;
    icon: string;
}

interface Props {
    categories: Category[];
    badges: Record<string, string>;
    ingredientTypes: Record<string, string>;
    allergenSeverities: Record<string, string>;
    commonAllergens: Record<string, { icon: string; severity: string }>;
    sizeOptions: Record<string, string>;
}

interface ProductDetail {
    size: string;
    price: number;
    price_display: string;
    servings: string;
    description: string;
    is_available: boolean;
    sort_order: number;
}

interface Ingredient {
    name: string;
    description: string;
    type: string;
    is_main: boolean;
    sort_order: number;
}

interface Allergen {
    name: string;
    description: string;
    severity: string;
    icon: string;
    sort_order: number;
}

export default function Create({ categories, badges, ingredientTypes, allergenSeverities, commonAllergens, sizeOptions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        slug: '',
        description: '',
        long_description: '',
        image: '🍰',
        badge: '',
        category_id: '',
        gallery: ['🍰'],
        is_active: true,
        sort_order: 0,
        details: [{
            size: 'S (6-inch)',
            price: 0,
            price_display: '',
            servings: 'Dành cho 4-6 người ăn',
            description: '',
            is_available: true,
            sort_order: 0,
        }] as ProductDetail[],
        ingredients: [] as Ingredient[],
        allergens: [] as Allergen[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('products.store'));
    };

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        setData(prev => ({
            ...prev,
            name,
            slug: name.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
        }));
    };

    // Product Details functions
    const addDetail = () => {
        setData('details', [...data.details, {
            size: 'M (8-inch)',
            price: 0,
            price_display: '',
            servings: 'Dành cho 8-10 người ăn',
            description: '',
            is_available: true,
            sort_order: data.details.length,
        }]);
    };

    const updateDetail = (index: number, field: keyof ProductDetail, value: any) => {
        const newDetails = [...data.details];
        newDetails[index] = { ...newDetails[index], [field]: value };
        
        // Auto-format price display
        if (field === 'price' && value > 0) {
            newDetails[index].price_display = new Intl.NumberFormat('vi-VN').format(value) + 'đ';
        }
        
        setData('details', newDetails);
    };

    const removeDetail = (index: number) => {
        if (data.details.length > 1) {
            setData('details', data.details.filter((_, i) => i !== index));
        }
    };

    // Ingredients functions
    const addIngredient = () => {
        setData('ingredients', [...data.ingredients, {
            name: '',
            description: '',
            type: 'main',
            is_main: false,
            sort_order: data.ingredients.length,
        }]);
    };

    const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
        const newIngredients = [...data.ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setData('ingredients', newIngredients);
    };

    const removeIngredient = (index: number) => {
        setData('ingredients', data.ingredients.filter((_, i) => i !== index));
    };

    // Allergens functions
    const addAllergen = () => {
        setData('allergens', [...data.allergens, {
            name: '',
            description: '',
            severity: 'moderate',
            icon: '⚠️',
            sort_order: data.allergens.length,
        }]);
    };

    const addCommonAllergen = (allergenName: string) => {
        const allergenInfo = commonAllergens[allergenName];
        const newAllergen: Allergen = {
            name: allergenName,
            description: '',
            severity: allergenInfo.severity,
            icon: allergenInfo.icon,
            sort_order: data.allergens.length,
        };
        setData('allergens', [...data.allergens, newAllergen]);
    };

    const updateAllergen = (index: number, field: keyof Allergen, value: any) => {
        const newAllergens = [...data.allergens];
        newAllergens[index] = { ...newAllergens[index], [field]: value };
        setData('allergens', newAllergens);
    };

    const removeAllergen = (index: number) => {
        setData('allergens', data.allergens.filter((_, i) => i !== index));
    };

    return (
        <AppLayout>
            <Head title="Thêm sản phẩm mới" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button variant="outline" asChild>
                        <Link href={route('products.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Quay lại
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Thêm sản phẩm mới</h1>
                        <p className="text-muted-foreground">
                            Tạo sản phẩm mới với đầy đủ thông tin chi tiết
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Thông tin cơ bản
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Tên sản phẩm *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Nhập tên sản phẩm..."
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="ten-san-pham"
                                    />
                                    <InputError message={errors.slug} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả ngắn *</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Mô tả ngắn gọn về sản phẩm..."
                                    rows={3}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="long_description">Mô tả chi tiết</Label>
                                <Textarea
                                    id="long_description"
                                    value={data.long_description}
                                    onChange={(e) => setData('long_description', e.target.value)}
                                    placeholder="Mô tả chi tiết về sản phẩm..."
                                    rows={5}
                                />
                                <InputError message={errors.long_description} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="image">Emoji/Icon</Label>
                                    <Input
                                        id="image"
                                        value={data.image}
                                        onChange={(e) => setData('image', e.target.value)}
                                        placeholder="🍰"
                                    />
                                    <InputError message={errors.image} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category_id">Danh mục *</Label>
                                    <Select value={data.category_id.toString()} onValueChange={(value) => setData('category_id', parseInt(value))}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.icon} {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="badge">Badge</Label>
                                    <Select value={data.badge} onValueChange={(value) => setData('badge', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn badge" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Không có</SelectItem>
                                            {Object.entries(badges).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.badge} />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', !!checked)}
                                />
                                <Label htmlFor="is_active">Kích hoạt sản phẩm</Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Details */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Thông tin giá và kích thước
                                </CardTitle>
                                <Button type="button" onClick={addDetail} size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm kích thước
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.details.map((detail, index) => (
                                <Card key={index} className="border-dashed">
                                    <CardContent className="pt-4">
                                        <div className="flex items-start justify-between mb-4">
                                            <h4 className="font-medium">Kích thước #{index + 1}</h4>
                                            {data.details.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeDetail(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Kích thước *</Label>
                                                <Select 
                                                    value={detail.size} 
                                                    onValueChange={(value) => updateDetail(index, 'size', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(sizeOptions).map(([key, label]) => (
                                                            <SelectItem key={key} value={key}>
                                                                {label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors[`details.${index}.size`]} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Giá (VNĐ) *</Label>
                                                <Input
                                                    type="number"
                                                    value={detail.price}
                                                    onChange={(e) => updateDetail(index, 'price', parseFloat(e.target.value) || 0)}
                                                    placeholder="250000"
                                                />
                                                <InputError message={errors[`details.${index}.price`]} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Hiển thị giá</Label>
                                                <Input
                                                    value={detail.price_display}
                                                    onChange={(e) => updateDetail(index, 'price_display', e.target.value)}
                                                    placeholder="250.000đ"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Phục vụ</Label>
                                                <Input
                                                    value={detail.servings}
                                                    onChange={(e) => updateDetail(index, 'servings', e.target.value)}
                                                    placeholder="Dành cho 4-6 người ăn"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center space-x-2">
                                            <Checkbox
                                                checked={detail.is_available}
                                                onCheckedChange={(checked) => updateDetail(index, 'is_available', !!checked)}
                                            />
                                            <Label>Có sẵn</Label>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Ingredients */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <ChefHat className="h-5 w-5" />
                                    Nguyên liệu
                                </CardTitle>
                                <Button type="button" onClick={addIngredient} size="sm">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm nguyên liệu
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.ingredients.map((ingredient, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    
                                    <div className="grid flex-1 gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Input
                                                value={ingredient.name}
                                                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                                                placeholder="Tên nguyên liệu"
                                            />
                                            <InputError message={errors[`ingredients.${index}.name`]} />
                                        </div>

                                        <div className="space-y-2">
                                            <Select 
                                                value={ingredient.type} 
                                                onValueChange={(value) => updateIngredient(index, 'type', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(ingredientTypes).map(([key, label]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={ingredient.is_main}
                                                onCheckedChange={(checked) => updateIngredient(index, 'is_main', !!checked)}
                                            />
                                            <Label>Nguyên liệu chính</Label>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeIngredient(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            {data.ingredients.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    Chưa có nguyên liệu nào. Nhấn "Thêm nguyên liệu" để bắt đầu.
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Allergens */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5" />
                                    Chất gây dị ứng
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button type="button" onClick={addAllergen} size="sm">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Thêm tự do
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Common Allergens */}
                            <div>
                                <Label className="text-sm font-medium">Chất gây dị ứng phổ biến:</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Object.keys(commonAllergens).map((allergenName) => (
                                        <Badge
                                            key={allergenName}
                                            variant="outline"
                                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                            onClick={() => addCommonAllergen(allergenName)}
                                        >
                                            {commonAllergens[allergenName].icon} {allergenName}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Added Allergens */}
                            {data.allergens.map((allergen, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                    <div className="text-2xl">{allergen.icon}</div>
                                    
                                    <div className="grid flex-1 gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Input
                                                value={allergen.name}
                                                onChange={(e) => updateAllergen(index, 'name', e.target.value)}
                                                placeholder="Tên chất gây dị ứng"
                                            />
                                            <InputError message={errors[`allergens.${index}.name`]} />
                                        </div>

                                        <div className="space-y-2">
                                            <Select 
                                                value={allergen.severity} 
                                                onValueChange={(value) => updateAllergen(index, 'severity', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(allergenSeverities).map(([key, label]) => (
                                                        <SelectItem key={key} value={key}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Input
                                                value={allergen.icon}
                                                onChange={(e) => updateAllergen(index, 'icon', e.target.value)}
                                                placeholder="🥚"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeAllergen(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}

                            {data.allergens.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    Chưa có chất gây dị ứng nào. Nhấn vào các badge phía trên hoặc "Thêm tự do".
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4">
                        <Button type="button" variant="outline" asChild>
                            <Link href={route('products.index')}>
                                Hủy bỏ
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing} className="btn-primary">
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? 'Đang lưu...' : 'Lưu sản phẩm'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
} 