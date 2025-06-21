import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { TrendingUp, Package, Users, ShoppingCart, ChefHat, Star, Calendar, DollarSign } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const stats = [
    {
        title: 'Doanh Thu Tháng',
        value: '45.2M',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
        gradient: 'from-green-400 to-green-600',
        bgGradient: 'from-green-50 to-green-100',
        darkBgGradient: 'from-green-950/50 to-green-900/30'
    },
    {
        title: 'Đơn Hàng Mới',
        value: '2,451',
        change: '+8.3%',
        trend: 'up',
        icon: ShoppingCart,
        gradient: 'from-blue-400 to-blue-600',
        bgGradient: 'from-blue-50 to-blue-100',
        darkBgGradient: 'from-blue-950/50 to-blue-900/30'
    },
    {
        title: 'Khách Hàng',
        value: '12,849',
        change: '+15.2%',
        trend: 'up',
        icon: Users,
        gradient: 'from-purple-400 to-purple-600',
        bgGradient: 'from-purple-50 to-purple-100',
        darkBgGradient: 'from-purple-950/50 to-purple-900/30'
    },
    {
        title: 'Bánh Bán Chạy',
        value: '847',
        change: '+23.1%',
        trend: 'up',
        icon: ChefHat,
        gradient: 'from-pink-400 to-pink-600',
        bgGradient: 'from-pink-50 to-pink-100',
        darkBgGradient: 'from-pink-950/50 to-pink-900/30'
    }
];

const recentOrders = [
    { id: '#2451', customer: 'Nguyễn Hạnh', product: 'Bánh Kem Chocolate', amount: '299,000đ', status: 'Hoàn thành', time: '10 phút trước' },
    { id: '#2450', customer: 'Trần Minh', product: 'Bánh Sinh Nhật', amount: '450,000đ', status: 'Đang làm', time: '25 phút trước' },
    { id: '#2449', customer: 'Lê Thu Hà', product: 'Cupcake Set', amount: '180,000đ', status: 'Mới', time: '1 giờ trước' },
    { id: '#2448', customer: 'Phạm Đức', product: 'Bánh Kem Dâu', amount: '320,000đ', status: 'Hoàn thành', time: '2 giờ trước' },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto animate-slide-in-up">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại! 👋</h1>
                        <p className="text-pink-100 text-lg">Hãy cùng tạo ra những chiếc bánh tuyệt vời hôm nay</p>
                    </div>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 right-8 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div 
                                key={stat.title} 
                                className={`bg-gradient-to-br ${stat.bgGradient} dark:${stat.darkBgGradient} rounded-2xl p-6 card-hover border border-white/50 dark:border-gray-800/50 shadow-lg backdrop-blur-sm`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 bg-gradient-to-r ${stat.gradient} rounded-xl shadow-lg hover-lift`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-semibold">
                                        <TrendingUp className="w-4 h-4 mr-1" />
                                        {stat.change}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{stat.title}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-pink-500" />
                                Đơn Hàng Gần Đây
                            </h2>
                            <button className="text-pink-500 hover:text-pink-600 text-sm font-medium hover:underline">
                                Xem tất cả
                            </button>
                        </div>
                        <div className="space-y-4">
                            {recentOrders.map((order, index) => (
                                <div 
                                    key={order.id} 
                                    className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-all duration-200 hover-lift"
                                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">{order.id.slice(-2)}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{order.customer}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.product}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900 dark:text-white">{order.amount}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                order.status === 'Hoàn thành' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                                                order.status === 'Đang làm' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' :
                                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                                            }`}>
                                                {order.status}
                                            </span>
                                            <span className="text-xs text-gray-400">{order.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Products */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            Bánh Bán Chạy
                        </h2>
                        <div className="space-y-4">
                            {[
                                { name: 'Bánh Kem Chocolate', sales: '156 cái', icon: '🍫', growth: '+15%' },
                                { name: 'Bánh Sinh Nhật', sales: '142 cái', icon: '🎂', growth: '+12%' },
                                { name: 'Cupcake Dâu', sales: '98 cái', icon: '🧁', growth: '+8%' },
                                { name: 'Bánh Kem Vanilla', sales: '87 cái', icon: '🍰', growth: '+5%' }
                            ].map((product, index) => (
                                <div 
                                    key={product.name} 
                                    className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-all duration-200"
                                    style={{ animationDelay: `${(index + 8) * 100}ms` }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{product.icon}</span>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white text-sm">{product.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.sales}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">{product.growth}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg animate-scale-in">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            Thống Kê Doanh Thu
                        </h2>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300 rounded-lg text-sm font-medium">7 ngày</button>
                            <button className="px-3 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm">30 ngày</button>
                        </div>
                    </div>
                    <div className="relative min-h-[300px] flex items-center justify-center bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-blue-50/20 dark:from-pink-950/20 dark:via-purple-950/10 dark:to-blue-950/5 rounded-xl border border-pink-100/50 dark:border-pink-900/20">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                                <span className="text-white text-2xl">📊</span>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">Biểu đồ thống kê</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Sẽ được triển khai sớm</p>
                            </div>
                        </div>
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-pink-200/30 dark:stroke-pink-800/20" />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
