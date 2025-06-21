import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Settings, Database, Code, FileText, Calendar, Clock, Eye } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useSweetAlert } from '@/hooks/use-sweet-alert';

interface Setting {
    id: number;
    key: string;
    value: any;
    created_at: string;
    updated_at: string;
}

interface Props {
    setting: Setting;
}

export default function SettingsShow({ setting }: Props) {
    const { showConfirm } = useSweetAlert();
    
    const handleDelete = async () => {
        const result = await showConfirm(
            'Xác nhận xóa cài đặt',
            `Bạn có chắc chắn muốn xóa cài đặt "${setting.key}"? Hành động này không thể hoàn tác.`
        );
        
        if (result.isConfirmed) {
            router.delete(`/general-settings/${setting.id}`);
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

    const ValueIcon = getValueTypeIcon(setting.value);
    const SettingIcon = getSettingIcon(setting.key);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Cài Đặt', href: '/general-settings' },
                { title: setting.key, href: `/general-settings/${setting.id}` },
            ]}
        >
            <Head title={`Cài Đặt: ${setting.key}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto animate-slide-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <Link 
                                href="/general-settings"
                                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/30 transition-all duration-300 hover-lift flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại
                            </Link>
                            <div className="flex gap-2">
                                <Link 
                                    href={`/general-settings/${setting.id}/edit`}
                                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl font-medium hover:bg-white/30 transition-all duration-300 hover-lift flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    Chỉnh sửa
                                </Link>
                                <button 
                                    onClick={handleDelete}
                                    className="bg-red-500/80 backdrop-blur-sm border border-red-400/30 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600/80 transition-all duration-300 hover-lift flex items-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Xóa
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                <SettingIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Chi Tiết Cài Đặt</h1>
                                <p className="text-indigo-100 text-lg">Xem thông tin chi tiết cài đặt</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 right-8 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                {/* Setting Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Setting Key */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30 rounded-2xl p-6 card-hover border border-white/50 dark:border-gray-800/50 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-xl shadow-lg hover-lift">
                                <SettingIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded-full">
                                ID: {setting.id}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Khóa Cài Đặt</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white break-words">{setting.key}</p>
                        </div>
                    </div>

                    {/* Value Type */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 rounded-2xl p-6 card-hover border border-white/50 dark:border-gray-800/50 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl shadow-lg hover-lift">
                                <ValueIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                typeof setting.value === 'object' 
                                    ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50' 
                                    : 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50'
                            }`}>
                                {typeof setting.value === 'object' ? 'JSON' : 'Text'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Loại Dữ Liệu</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {typeof setting.value === 'object' ? 'JSON Object' : 'String'}
                            </p>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/30 rounded-2xl p-6 card-hover border border-white/50 dark:border-gray-800/50 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl shadow-lg hover-lift">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Cập Nhật Cuối</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {new Date(setting.updated_at).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(setting.updated_at).toLocaleTimeString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Setting Value */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                    <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Eye className="w-5 h-5 text-indigo-500" />
                            Giá Trị Cài Đặt
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Nội dung chi tiết của cài đặt
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/30 dark:border-gray-700/30">
                            <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap break-words overflow-x-auto">
{typeof setting.value === 'object' 
    ? JSON.stringify(setting.value, null, 2)
    : setting.value || 'Không có giá trị'}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Created At */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-green-400 to-green-600 rounded-xl shadow-lg">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Ngày Tạo</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Thời gian tạo cài đặt</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {new Date(setting.created_at).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(setting.created_at).toLocaleTimeString('vi-VN')}
                            </p>
                        </div>
                    </div>

                    {/* Updated At */}
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-xl shadow-lg">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Ngày Cập Nhật</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Lần cập nhật gần nhất</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                {new Date(setting.updated_at).toLocaleDateString('vi-VN')}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(setting.updated_at).toLocaleTimeString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 