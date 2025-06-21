import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Search, Plus, Filter, ChefHat, Star, Clock, Edit3, Trash2, Eye } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Quản Lý Bánh',
        href: '/cakes',
    },
];

const cakes = [
    {
        id: 1,
        name: 'Bánh Kem Chocolate Deluxe',
        description: 'Bánh kem chocolate đậm đà với lớp ganache mềm mịn',
        price: '350,000đ',
        category: 'Bánh Kem',
        status: 'Còn hàng',
        rating: 4.8,
        orders: 45,
        image: '🍫',
        badge: 'Bán chạy',
        slug: 'banh-kem-chocolate-deluxe'
    },
    {
        id: 2,
        name: 'Bánh Sinh Nhật Strawberry',
        description: 'Bánh sinh nhật với dâu tây tươi và kem vanilla',
        price: '450,000đ',
        category: 'Sinh Nhật',
        status: 'Còn hàng',
        rating: 4.9,
        orders: 67,
        image: '🎂',
        badge: 'Mới',
        slug: 'banh-sinh-nhat-strawberry'
    },
    {
        id: 3,
        name: 'Cupcake Set Rainbow',
        description: 'Bộ 6 cupcake nhiều màu sắc dành cho trẻ em',
        price: '180,000đ',
        category: 'Cupcake',
        status: 'Hết hàng',
        rating: 4.6,
        orders: 23,
        image: '🧁',
        slug: 'cupcake-set-rainbow'
    },
    {
        id: 4,
        name: 'Bánh Kem Tiramisu',
        description: 'Bánh kem tiramisu Ý truyền thống với cà phê đậm đà',
        price: '380,000đ',
        category: 'Bánh Kem',
        status: 'Còn hàng',
        rating: 4.7,
        orders: 34,
        image: '☕',
        slug: 'banh-kem-tiramisu'
    },
    {
        id: 5,
        name: 'Bánh Kem Vanilla Classic',
        description: 'Bánh kem vanilla truyền thống với topping cherry',
        price: '320,000đ',
        category: 'Bánh Kem',
        status: 'Còn hàng',
        rating: 4.5,
        orders: 56,
        image: '🍰',
        slug: 'banh-kem-vanilla-classic'
    },
    {
        id: 6,
        name: 'Bánh Mousse Chocolate',
        description: 'Bánh mousse chocolate nhẹ nhàng, tan trong miệng',
        price: '290,000đ',
        category: 'Mousse',
        status: 'Sắp hết',
        rating: 4.8,
        orders: 29,
        image: '🍮',
        badge: 'Khuyến mãi',
        slug: 'banh-mousse-chocolate'
    }
];

const categories = ['Tất cả', 'Bánh Kem', 'Sinh Nhật', 'Cupcake', 'Mousse'];
const statuses = ['Tất cả', 'Còn hàng', 'Sắp hết', 'Hết hàng'];

export default function CakeManagement() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quản Lý Bánh Kem" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto animate-slide-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <ChefHat className="w-8 h-8" />
                                Quản Lý Bánh Kem
                            </h1>
                            <p className="text-pink-100 text-lg">Tạo và quản lý những chiếc bánh tuyệt vời</p>
                        </div>
                        <Link 
                            href="/cakes/create"
                            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 hover-lift flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Thêm Bánh Mới
                        </Link>
                    </div>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 right-8 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm bánh..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                            />
                        </div>
                        <div className="flex gap-3">
                            <select className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50">
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <select className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/50">
                                {statuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <button className="p-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors hover-lift">
                                <Filter className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { title: 'Tổng Bánh', value: '124', change: '+12', icon: ChefHat, color: 'pink' },
                        { title: 'Còn Hàng', value: '98', change: '+5', icon: Eye, color: 'green' },
                        { title: 'Sắp Hết', value: '18', change: '+3', icon: Clock, color: 'yellow' },
                        { title: 'Đánh Giá TB', value: '4.7', change: '+0.2', icon: Star, color: 'purple' }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div 
                                key={stat.title}
                                className={`bg-gradient-to-br ${
                                    stat.color === 'pink' ? 'from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/30' :
                                    stat.color === 'green' ? 'from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30' :
                                    stat.color === 'yellow' ? 'from-yellow-50 to-yellow-100 dark:from-yellow-950/50 dark:to-yellow-900/30' :
                                    'from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30'
                                } rounded-2xl p-6 card-hover border border-white/50 dark:border-gray-800/50 shadow-lg backdrop-blur-sm`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 bg-gradient-to-r ${
                                        stat.color === 'pink' ? 'from-pink-400 to-pink-600' :
                                        stat.color === 'green' ? 'from-green-400 to-green-600' :
                                        stat.color === 'yellow' ? 'from-yellow-400 to-yellow-600' :
                                        'from-purple-400 to-purple-600'
                                    } rounded-xl shadow-lg hover-lift`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">+{stat.change}</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{stat.title}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Cakes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cakes.map((cake, index) => (
                        <div 
                            key={cake.id} 
                            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200/50 dark:border-gray-800/50 flex flex-col h-full card-hover"
                            style={{ animationDelay: `${(index + 4) * 100}ms` }}
                        >
                            <div className="relative flex-grow">
                                <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/50 dark:to-purple-950/30 rounded-t-2xl p-8 flex items-center justify-center h-48">
                                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300 ease-in-out animate-float">
                                        {cake.image}
                                    </span>
                                </div>
                                {cake.badge && (
                                    <div className="absolute top-4 right-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                        {cake.badge}
                                    </div>
                                )}
                                <div className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${
                                    cake.status === 'Còn hàng' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                                    cake.status === 'Sắp hết' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                }`}>
                                    {cake.status}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 flex-grow">{cake.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-10 leading-5">{cake.description}</p>
                                
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-300">Danh mục:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{cake.category}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-300">Đánh giá:</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="font-medium text-gray-900 dark:text-white">{cake.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-gray-300">Đã bán:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{cake.orders} cái</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-xl font-extrabold text-pink-500">{cake.price}</span>
                                    <div className="flex gap-2">
                                        <Link 
                                            href={`/cakes/${cake.id}`}
                                            className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors hover-lift"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link 
                                            href={`/cakes/${cake.id}/edit`}
                                            className="p-2 bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors hover-lift"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </Link>
                                        <button className="p-2 bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors hover-lift">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            Trước
                        </button>
                        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg">1</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            2
                        </button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            3
                        </button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            Sau
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 