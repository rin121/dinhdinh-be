import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
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
    GripVertical,
    Upload,
    X,
    Eye
} from 'lucide-react';
import InputError from '@/components/input-error';

interface Category {
    id: number;
    name: string;
    type: string;
    icon: string;
}

interface Props {
    product: {
        id: number;
        name: string;
        slug: string;
        description: string;
        long_description?: string;
        image: string;
        badge?: string;
        category_id: number;
        gallery: string[];
        is_active: boolean;
        sort_order: number;
        details: ProductDetail[];
        ingredients: Ingredient[];
        allergens: Allergen[];
        images: any[];
    };
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

export default function Edit({ product, categories, badges, ingredientTypes, allergenSeverities, commonAllergens, sizeOptions }: Props) {
    console.log('🎯 Edit component rendered for product:', product.id);
    
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    
    const { data, setData, put, processing, errors, clearErrors } = useForm({
        name: product.name,
        slug: product.slug,
        description: product.description,
        long_description: product.long_description || '',
        image: product.image,
        badge: product.badge || '',
        category_id: product.category_id,
        gallery: product.gallery,
        is_active: product.is_active,
        sort_order: product.sort_order,
        details: product.details,
        ingredients: product.ingredients,
        allergens: product.allergens,
        images: [] as File[],
    });

    // Track if form has valid data to suppress errors
    const [suppressErrors, setSuppressErrors] = useState(false);
    
    // Clear any persisted errors on component mount
    useEffect(() => {
        // Debug: Log current state
        console.log('Product data:', product);
        console.log('Form data:', data);
        console.log('Current errors:', errors);
        
        // Check if form already has valid data from product
        const hasValidData = product.name && product.slug && product.description && product.category_id;
        setSuppressErrors(hasValidData);
        
        // Force clear all errors with a delay to ensure component is fully mounted
        const timer = setTimeout(() => {
            clearErrors();
            console.log('Errors cleared');
        }, 100);
        
        return () => clearTimeout(timer);
    }, [product.id]);

    const handleSubmit = (e: React.FormEvent) => {
        console.log('🚀 handleSubmit called!');
        e.preventDefault();
        
        // Log for debugging BEFORE submit
        console.log('📤 About to submit:', {
            selectedImages: selectedImages.length,
            images: selectedImages.map(f => ({ name: f.name, size: f.size, type: f.type })),
            productId: product.id,
            route: route('products.update', product.id),
            formData: data
        });
        
        // Update form data with selected images and image management data
        const updatedData = {
            ...data,
            images: selectedImages,
            images_data: {
                removed_images: removedImageIds,
                new_primary_id: newPrimaryImageId
            }
        };
        
        console.log('⏰ Calling PUT request...');
        console.log('📊 Updated data before submit:', updatedData);
        
        // Call the real update endpoint directly
        console.log('🚀 Calling real update endpoint...');
        router.post(route('products.update', product.id), {
            ...updatedData,
            _method: 'PUT'
        }, {
            forceFormData: true,
            onStart: () => console.log('🔄 Request started'),
            onSuccess: () => {
                console.log('✅ Product updated successfully!');
                // Clear image previews
                imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
                setSelectedImages([]);
                setImagePreviewUrls([]);
            },
            onError: (errors: any) => {
                console.error('❌ Validation errors:', errors);
            },
            onFinish: () => console.log('🏁 Request finished')
        });
    };

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validate file types and size
        const validFiles = files.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
            const isValidSize = file.size <= 10 * 1024 * 1024; // 2MB (match PHP limit)
            
            if (!isValidType) {
                alert(`File ${file.name} không đúng định dạng. Chỉ chấp nhận: JPEG, PNG, GIF, WebP`);
                return false;
            }
            
            if (!isValidSize) {
                alert(`File ${file.name} quá lớn. Kích thước tối đa 10MB`);
                return false;
            }
            
            return true;
        });

        if (selectedImages.length + validFiles.length > 10) {
            alert('Chỉ được upload tối đa 10 ảnh');
            return;
        }

        // Add new files
        const newImages = [...selectedImages, ...validFiles];
        setSelectedImages(newImages);
        
        // Update form data
        setData('images', newImages);

        // Create preview URLs
        const newPreviewUrls = [...imagePreviewUrls];
        validFiles.forEach(file => {
            newPreviewUrls.push(URL.createObjectURL(file));
        });
        setImagePreviewUrls(newPreviewUrls);
    };

    // Remove image
    const removeImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
        
        // Revoke URL to free memory
        URL.revokeObjectURL(imagePreviewUrls[index]);
        
        setSelectedImages(newImages);
        setImagePreviewUrls(newPreviewUrls);
        
        // Update form data
        setData('images', newImages);
    };

    // Helper function to convert Vietnamese characters to non-accented
    const removeVietnameseAccents = (str: string) => {
        const accentsMap: { [key: string]: string } = {
            'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a',
            'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
            'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
            'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e',
            'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
            'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
            'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o',
            'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
            'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
            'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u',
            'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
            'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
            'đ': 'd',
            // Uppercase
            'À': 'A', 'Á': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ã': 'A',
            'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ặ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
            'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ậ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
            'È': 'E', 'É': 'E', 'Ẹ': 'E', 'Ẻ': 'E', 'Ẽ': 'E',
            'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ệ': 'E', 'Ể': 'E', 'Ễ': 'E',
            'Ì': 'I', 'Í': 'I', 'Ị': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
            'Ò': 'O', 'Ó': 'O', 'Ọ': 'O', 'Ỏ': 'O', 'Õ': 'O',
            'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ộ': 'O', 'Ổ': 'O', 'Ỗ': 'O',
            'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ợ': 'O', 'Ở': 'O', 'Ỡ': 'O',
            'Ù': 'U', 'Ú': 'U', 'Ụ': 'U', 'Ủ': 'U', 'Ũ': 'U',
            'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ự': 'U', 'Ử': 'U', 'Ữ': 'U',
            'Ỳ': 'Y', 'Ý': 'Y', 'Ỵ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y',
            'Đ': 'D'
        };

        return str.replace(/[àáạảãăắằặẳẵâấầậẩẫèéẹẻẽêềếệểễìíịỉĩòóọỏõôốồộổỗơớờợởỡùúụủũưứừựửữỳýỵỷỹđÀÁẠẢÃĂẮẰẶẲẴÂẤẦẬẨẪÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỐỒỘỔỖƠỚỜỢỞỠÙÚỤỦŨƯỨỪỰỬỮỲÝỴỶỸĐ]/g, 
            (match) => accentsMap[match] || match);
    };

    // Auto-generate slug from name
    const handleNameChange = (name: string) => {
        const slug = removeVietnameseAccents(name.toLowerCase())
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');

        setData(prev => ({
            ...prev,
            name,
            slug
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

    // Image management functions for existing images
    const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
    const [newPrimaryImageId, setNewPrimaryImageId] = useState<number | null>(null);

    const removeExistingImage = (imageId: number) => {
        setRemovedImageIds(prev => [...prev, imageId]);
        console.log('Marked image for removal:', imageId);
    };

    const setPrimaryImage = (imageId: number) => {
        setNewPrimaryImageId(imageId);
        console.log('Set as primary image:', imageId);
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Sản phẩm', href: route('products.index') },
                { title: 'Thêm mới', href: route('products.create') },
            ]}
        >
            <Head title="Thêm sản phẩm mới" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto animate-slide-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <Link 
                                href={route('products.index')}
                                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/30 transition-all duration-300 hover-lift flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                <Package className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Chỉnh Sửa Sản Phẩm</h1>
                                <p className="text-indigo-100 text-lg">Cập nhật thông tin sản phẩm: {product.name}</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 right-8 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                        <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-indigo-500" />
                                Thông Tin Cơ Bản
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Nhập thông tin cơ bản của sản phẩm
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Tên sản phẩm *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => handleNameChange(e.target.value)}
                                        placeholder="Nhập tên sản phẩm..."
                                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                                    />
                                    <InputError message={suppressErrors ? '' : errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="slug" className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Slug
                                    </label>
                                    <input
                                        id="slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="ten-san-pham"
                                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                                    />
                                    <InputError message={suppressErrors ? '' : errors.slug} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-white">
                                    Mô tả ngắn *
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Mô tả ngắn gọn về sản phẩm..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white resize-none"
                                />
                                <InputError message={suppressErrors ? '' : errors.description} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="long_description" className="block text-sm font-medium text-gray-900 dark:text-white">
                                    Mô tả chi tiết
                                </label>
                                <textarea
                                    id="long_description"
                                    value={data.long_description}
                                    onChange={(e) => setData('long_description', e.target.value)}
                                    placeholder="Mô tả chi tiết về sản phẩm..."
                                    rows={5}
                                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white resize-none"
                                />
                                <InputError message={errors.long_description} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Emoji/Icon
                                    </label>
                                    <input
                                        id="image"
                                        type="text"
                                        value={data.image}
                                        onChange={(e) => setData('image', e.target.value)}
                                        placeholder="🍰"
                                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                                    />
                                    <InputError message={errors.image} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Danh mục *
                                    </label>
                                    <Select value={data.category_id ? data.category_id.toString() : undefined} onValueChange={(value) => setData('category_id', parseInt(value))}>
                                        <SelectTrigger className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl h-12">
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
                                    <InputError message={suppressErrors ? '' : errors.category_id} />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="badge" className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Badge
                                    </label>
                                    <Select value={data.badge || undefined} onValueChange={(value) => setData('badge', value === 'none' ? '' : value)}>
                                        <SelectTrigger className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl h-12">
                                            <SelectValue placeholder="Chọn badge" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Không có</SelectItem>
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
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                        <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Upload className="w-5 h-5 text-indigo-500" />
                                Hình Ảnh Sản Phẩm
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Upload hình ảnh sản phẩm (tối đa 10 ảnh, mỗi ảnh không quá 5MB)
                            </p>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                                <input
                                    type="file"
                                    id="images"
                                    multiple
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                                        <Upload className="w-8 h-8 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-medium text-gray-900 dark:text-white">Chọn hình ảnh để upload</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Hỗ trợ JPEG, PNG, GIF, WebP (tối đa 10MB mỗi file)
                                        </p>
                                    </div>
                                    <label
                                        htmlFor="images"
                                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover-lift flex items-center gap-2 shadow-lg cursor-pointer"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Chọn tệp
                                    </label>
                                </div>
                            </div>

                            {/* Existing Images */}
                            {product.images && product.images.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Hình ảnh hiện có ({product.images.length})
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {product.images
                                            .filter(image => !removedImageIds.includes(image.id))
                                            .map((image, index) => (
                                            <div key={image.id} className="relative group">
                                                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                                                    <img
                                                        src={`/storage/${image.path}`}
                                                        alt={image.alt_text || `Hình ảnh ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(image.id)}
                                                        className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                        title="Xóa ảnh"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                                    {(newPrimaryImageId === image.id || (newPrimaryImageId === null && image.is_primary)) 
                                                        ? 'Ảnh chính' 
                                                        : `Ảnh ${index + 1}`}
                                                </div>
                                                <div className="absolute top-2 left-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPrimaryImage(image.id)}
                                                        className={`p-1.5 rounded-full transition-colors shadow-lg ${
                                                            (newPrimaryImageId === image.id || (newPrimaryImageId === null && image.is_primary))
                                                                ? 'bg-green-500 text-white' 
                                                                : 'bg-white/80 text-gray-700 hover:bg-white'
                                                        }`}
                                                        title={(newPrimaryImageId === image.id || (newPrimaryImageId === null && image.is_primary)) ? 'Ảnh chính' : 'Đặt làm ảnh chính'}
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                {removedImageIds.includes(image.id) && (
                                                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center rounded-xl">
                                                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Sẽ xóa</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        💡 Nhấn vào <Eye className="inline w-4 h-4" /> để đặt làm ảnh chính, hoặc <X className="inline w-4 h-4" /> để xóa ảnh
                                    </p>
                                </div>
                            )}

                            {/* Preview Images */}
                            {imagePreviewUrls.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        Ảnh đã chọn ({imagePreviewUrls.length}/10)
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {imagePreviewUrls.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                                    {index === 0 ? 'Ảnh chính' : `Ảnh ${index + 1}`}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        💡 Ảnh đầu tiên sẽ được đặt làm ảnh chính của sản phẩm
                                    </p>
                                </div>
                            )}

                            <InputError message={errors.images} />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                        <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-indigo-500" />
                                        Thông Tin Giá & Kích Thước
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Thiết lập giá và kích thước sản phẩm
                                    </p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={addDetail} 
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover-lift flex items-center gap-2 shadow-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm kích thước
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {data.details.map((detail, index) => (
                                <div key={index} className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/30 dark:border-gray-700/30 border-dashed">
                                    <div className="flex items-start justify-between mb-4">
                                        <h4 className="font-medium text-gray-900 dark:text-white">Kích thước #{index + 1}</h4>
                                        {data.details.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDetail(index)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                                Kích thước *
                                            </label>
                                            <Select 
                                                value={detail.size} 
                                                onValueChange={(value) => updateDetail(index, 'size', value)}
                                            >
                                                <SelectTrigger className="bg-white dark:bg-gray-700 border border-gray-200/50 dark:border-gray-600/50 rounded-xl h-12">
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
                                            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                                Giá (VNĐ) *
                                            </label>
                                            <input
                                                type="number"
                                                value={detail.price}
                                                onChange={(e) => updateDetail(index, 'price', parseFloat(e.target.value) || 0)}
                                                placeholder="250000"
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                                            />
                                            <InputError message={errors[`details.${index}.price`]} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                                Hiển thị giá
                                            </label>
                                            <input
                                                type="text"
                                                value={detail.price_display}
                                                onChange={(e) => updateDetail(index, 'price_display', e.target.value)}
                                                placeholder="250.000đ"
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                                Phục vụ
                                            </label>
                                            <input
                                                type="text"
                                                value={detail.servings}
                                                onChange={(e) => updateDetail(index, 'servings', e.target.value)}
                                                placeholder="Dành cho 4-6 người ăn"
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center space-x-2">
                                        <Checkbox
                                            checked={detail.is_available}
                                            onCheckedChange={(checked) => updateDetail(index, 'is_available', !!checked)}
                                        />
                                        <label className="text-sm font-medium text-gray-900 dark:text-white">Có sẵn</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ingredients */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                        <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <ChefHat className="w-5 h-5 text-indigo-500" />
                                        Nguyên Liệu
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Thêm nguyên liệu của sản phẩm
                                    </p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={addIngredient} 
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover-lift flex items-center gap-2 shadow-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm nguyên liệu
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
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
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    Chưa có nguyên liệu nào. Nhấn "Thêm nguyên liệu" để bắt đầu.
                                </div>
                            )}
                        </div>
                    </div>

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
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg p-6">
                        <div className="flex items-center justify-end gap-4">
                            <Link 
                                href={route('products.index')}
                                className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover-lift border border-gray-200 dark:border-gray-700"
                            >
                                Hủy bỏ
                            </Link>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 hover-lift flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                {processing ? 'Đang lưu...' : 'Lưu sản phẩm'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
} 