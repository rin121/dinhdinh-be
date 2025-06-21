import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Package, Star, Calendar, Gift } from 'lucide-react';
import { FormEvent } from 'react';

interface Props {
  types: Record<string, string>;
}

const typeIcons: Record<string, any> = {
  birthday: Package,
  wedding: Star,
  chocolate: Package,
  fruit: Star,
  special: Star,
  cupcake: Package,
  cream: Package,
  seasonal: Calendar,
  promotion: Gift,
};

const emojiOptions = [
  '🍰', '🎂', '💒', '🍫', '🍓', '⭐', '🧁', '🌸', '🎉', '🍪',
  '🥧', '🍯', '🍊', '🍋', '🥝', '🍇', '🍌', '🍑', '🍒', '🥥'
];

export default function Create({ types }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm<{
    name: string;
    icon: string;
    type: string;
    description: string;
    is_active: boolean;
    sort_order: number;
  }>({
    name: '',
    icon: '🍰',
    type: 'birthday',
    description: '',
    is_active: true,
    sort_order: 0,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('categories.store'));
  };

  const TypeIcon = typeIcons[data.type] || Package;

  return (
    <AppLayout>
      <Head title="Tạo danh mục mới" />
      
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-2xl p-8 text-white animate-gradient-shift">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse-glow">
                  <Package className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Tạo danh mục mới</h1>
              </div>
              <p className="text-white/90">Thêm danh mục sản phẩm hoặc dịch vụ mới</p>
            </div>
            <Link href={route('categories.index')}>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Preview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-sm">Xem trước</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="text-2xl">{data.icon}</div>
              <div>
                <div className="font-medium">{data.name || 'Tên danh mục'}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <TypeIcon className="w-3 h-3" />
                  {types[data.type]}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-sm">Trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${data.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-sm">{data.is_active ? 'Hoạt động' : 'Tạm dừng'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-sm">Thứ tự sắp xếp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.sort_order}</div>
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin danh mục</CardTitle>
          <CardDescription>
            Điền thông tin chi tiết cho danh mục mới
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tên danh mục */}
              <div className="space-y-2">
                <Label htmlFor="name">Tên danh mục *</Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Nhập tên danh mục..."
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Icon */}
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select value={data.icon} onValueChange={(value) => setData('icon', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {emojiOptions.map((emoji) => (
                      <SelectItem key={emoji} value={emoji}>
                        <span className="text-lg mr-2">{emoji}</span>
                        {emoji}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.icon && (
                  <p className="text-sm text-red-600">{errors.icon}</p>
                )}
              </div>

              {/* Loại */}
              <div className="space-y-2">
                <Label htmlFor="type">Loại danh mục *</Label>
                <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(types).map(([key, value]) => {
                      const Icon = typeIcons[key] || Package;
                      return (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {value}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type}</p>
                )}
              </div>

              {/* Thứ tự */}
              <div className="space-y-2">
                <Label htmlFor="sort_order">Thứ tự sắp xếp</Label>
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  value={data.sort_order}
                  onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className={errors.sort_order ? 'border-red-500' : ''}
                />
                {errors.sort_order && (
                  <p className="text-sm text-red-600">{errors.sort_order}</p>
                )}
              </div>
            </div>

            {/* Mô tả */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
                placeholder="Nhập mô tả cho danh mục..."
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Trạng thái */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={data.is_active}
                onCheckedChange={(checked: boolean) => setData('is_active', checked)}
              />
              <Label htmlFor="is_active">Kích hoạt danh mục</Label>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={processing}
                className="btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                {processing ? 'Đang lưu...' : 'Lưu danh mục'}
              </Button>
              
              <Link href={route('categories.index')}>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
} 