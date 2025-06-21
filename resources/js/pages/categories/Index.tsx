import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useSweetAlert } from '@/hooks/use-sweet-alert';
import { ChefHat, Plus, Search, Filter, Eye, Edit, Trash2, Package, Star, Calendar, Gift } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  icon: string;
  type: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  categories: {
    data: Category[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    type?: string;
    search?: string;
    status?: string;
  };
  types: Record<string, string>;
  stats: {
    total: number;
    active: number;
    inactive: number;
    by_type: Record<string, number>;
  };
}

const typeIcons: Record<string, any> = {
  birthday: ChefHat,
  wedding: Star,
  chocolate: Package,
  fruit: Star,
  special: Star,
  cupcake: Package,
  cream: Package,
  seasonal: Calendar,
  promotion: Gift,
};

const typeColors: Record<string, string> = {
  birthday: 'bg-pink-100 text-pink-800 border-pink-200',
  wedding: 'bg-purple-100 text-purple-800 border-purple-200',
  chocolate: 'bg-amber-100 text-amber-800 border-amber-200',
  fruit: 'bg-green-100 text-green-800 border-green-200',
  special: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  cupcake: 'bg-rose-100 text-rose-800 border-rose-200',
  cream: 'bg-blue-100 text-blue-800 border-blue-200',
  seasonal: 'bg-orange-100 text-orange-800 border-orange-200',
  promotion: 'bg-red-100 text-red-800 border-red-200',
};

export default function Index({ categories, filters, types, stats }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedType, setSelectedType] = useState(filters.type || 'all');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
  const { showConfirm } = useSweetAlert();

  const handleSearch = () => {
    router.get(route('categories.index'), {
      search: searchTerm,
      type: selectedType !== 'all' ? selectedType : undefined,
      status: selectedStatus !== 'all' ? selectedStatus : undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = async (category: Category) => {
    const result = await showConfirm(
      'Xóa danh mục',
      `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`
    );

    if (result.isConfirmed) {
      router.delete(route('categories.destroy', category.id));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedStatus('all');
    router.get(route('categories.index'));
  };

  return (
    <AppLayout>
      <Head title="Quản lý danh mục" />
      
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white animate-gradient-shift">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse-glow">
                  <ChefHat className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
              </div>
              <p className="text-white/90">Quản lý các danh mục sản phẩm và dịch vụ</p>
            </div>
            <Link href={route('categories.create')}>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <Plus className="w-4 h-4 mr-2" />
                Thêm danh mục
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng danh mục</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tất cả danh mục</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Danh mục hoạt động</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm dừng</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
            <p className="text-xs text-muted-foreground">Danh mục tạm dừng</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loại phổ biến</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.max(...Object.values(stats.by_type))}
            </div>
            <p className="text-xs text-muted-foreground">Số lượng cao nhất</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm danh mục..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {Object.entries(types).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm dừng</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={handleSearch} className="btn-primary">
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách danh mục</CardTitle>
              <CardDescription>
                Hiển thị {categories.data.length} / {categories.total} danh mục
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {categories.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.data.map((category, index) => {
                const TypeIcon = typeIcons[category.type] || Package;
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slide-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{category.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={typeColors[category.type] || typeColors.birthday}>
                              <TypeIcon className="w-3 h-3 mr-1" />
                              {types[category.type]}
                            </Badge>
                            <Badge variant={category.is_active ? 'default' : 'secondary'}>
                              {category.is_active ? 'Hoạt động' : 'Tạm dừng'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {category.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Thứ tự: {category.sort_order}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={route('categories.show', category.id)}>
                          <Button size="sm" variant="outline" className="hover-lift">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={route('categories.edit', category.id)}>
                          <Button size="sm" variant="outline" className="hover-lift">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 hover-lift"
                          onClick={() => handleDelete(category)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có danh mục nào</h3>
              <p className="text-gray-500 mb-6">Hãy tạo danh mục đầu tiên để bắt đầu</p>
              <Link href={route('categories.create')}>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo danh mục mới
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {categories.last_page > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            {Array.from({ length: categories.last_page }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === categories.current_page ? 'default' : 'outline'}
                size="sm"
                onClick={() => router.get(route('categories.index'), { 
                  ...filters, 
                  page 
                })}
              >
                {page}
              </Button>
            ))}
          </div>
        </div>
      )}
    </AppLayout>
  );
} 