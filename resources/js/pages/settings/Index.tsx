import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Eye, Settings, Database, Code, FileText } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useSweetAlert } from '@/hooks/use-sweet-alert';

interface Setting {
    id: number;
    key: string;
    value: string | object | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    settings: {
        data: Setting[];
        total: number;
    };
}

export default function SettingsIndex({ settings }: Props) {
    const { showConfirm } = useSweetAlert();
    
    const handleDelete = async (id: number, key: string) => {
        const result = await showConfirm(
            'Xác nhận xóa cài đặt',
            `Bạn có chắc chắn muốn xóa cài đặt "${key}"? Hành động này không thể hoàn tác.`
        );
        
        if (result.isConfirmed) {
            router.delete(`/general-settings/${id}`);
        }
    };

    const getValueTypeIcon = (value: any) => {
        if (typeof value === 'object') return Code;
        if (typeof value === 'string') return FileText;
        return Database;
    };

    const getSettingIcon = (key: string) => {
        if (key.includes('menu')) return FileText;
        if (key.includes('config')) return Settings;
        return Database;
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Cài Đặt', href: '/general-settings' },
            ]}
        >
            <Head title="Cài Đặt Hệ Thống" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto animate-slide-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <Settings className="w-8 h-8" />
                                Cài Đặt Hệ Thống
                            </h1>
                            <p className="text-indigo-100 text-lg">Quản lý cấu hình và thiết lập ứng dụng</p>
                        </div>
                        <Link 
                            href="/general-settings/create"
                            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 hover-lift flex items-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Thêm Cài Đặt
                        </Link>
                    </div>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 right-8 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { 
                            title: 'Tổng Cài Đặt', 
                            value: settings.total.toString(), 
                            change: '+2', 
                            icon: Database, 
                            color: 'indigo',
                            description: 'Số lượng cài đặt trong hệ thống'
                        },
                        { 
                            title: 'Cài Đặt JSON', 
                            value: settings.data.filter(s => typeof s.value === 'object').length.toString(), 
                            change: '+1', 
                            icon: Code, 
                            color: 'purple',
                            description: 'Cài đặt phức tạp với cấu trúc JSON'
                        },
                        { 
                            title: 'Cài Đặt Text', 
                            value: settings.data.filter(s => typeof s.value === 'string').length.toString(), 
                            change: '+1', 
                            icon: FileText, 
                            color: 'pink',
                            description: 'Cài đặt đơn giản dạng text'
                        }
                    ].map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div 
                                key={stat.title}
                                className={`bg-gradient-to-br ${
                                    stat.color === 'indigo' ? 'from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30' :
                                    stat.color === 'purple' ? 'from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30' :
                                    'from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/30'
                                } rounded-2xl p-6 card-hover border border-white/50 dark:border-gray-800/50 shadow-lg backdrop-blur-sm`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 bg-gradient-to-r ${
                                        stat.color === 'indigo' ? 'from-indigo-400 to-indigo-600' :
                                        stat.color === 'purple' ? 'from-purple-400 to-purple-600' :
                                        'from-pink-400 to-pink-600'
                                    } rounded-xl shadow-lg hover-lift`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{stat.change}</span>
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

                {/* Settings List */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                    <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-indigo-500" />
                                    Danh Sách Cài Đặt
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Tổng cộng {settings.total} cài đặt được tìm thấy
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {settings.data.length > 0 ? (
                            <div className="space-y-4">
                                {settings.data.map((setting, index) => {
                                    const SettingIcon = getSettingIcon(setting.key);
                                    const ValueIcon = getValueTypeIcon(setting.value);
                                    
                                    return (
                                        <div
                                            key={setting.id}
                                            className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-6 hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-all duration-200 hover-lift border border-gray-200/30 dark:border-gray-700/30"
                                            style={{ animationDelay: `${(index + 3) * 100}ms` }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="p-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl shadow-lg">
                                                        <SettingIcon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                                                {setting.key}
                                                            </h3>
                                                            <Badge 
                                                                variant="secondary"
                                                                className={`flex items-center gap-1 ${
                                                                    typeof setting.value === 'object' 
                                                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' 
                                                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                                                }`}
                                                            >
                                                                <ValueIcon className="w-3 h-3" />
                                                                {typeof setting.value === 'object' ? 'JSON' : 'String'}
                                                            </Badge>
                                                        </div>
                                                        <div className="bg-gray-100/50 dark:bg-gray-900/50 rounded-lg p-3 mb-3">
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 font-mono break-all">
                                                                {typeof setting.value === 'object'
                                                                    ? JSON.stringify(setting.value, null, 2)
                                                                    : setting.value || 'Không có giá trị'}
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                                            Cập nhật: {new Date(setting.updated_at).toLocaleDateString('vi-VN')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <Link 
                                                        href={`/general-settings/${setting.id}`}
                                                        className="p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors hover-lift"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link 
                                                        href={`/general-settings/${setting.id}/edit`}
                                                        className="p-2 bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors hover-lift"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(setting.id, setting.key)}
                                                        className="p-2 bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors hover-lift"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                                    <Settings className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Chưa có cài đặt nào
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    Tạo cài đặt đầu tiên để bắt đầu cấu hình hệ thống
                                </p>
                                <Link
                                    href="/general-settings/create"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 btn-primary"
                                >
                                    <Plus className="w-5 h-5" />
                                    Tạo Cài Đặt Đầu Tiên
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 