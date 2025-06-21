import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Save, X, Settings, Database, Code, FileText, AlertCircle, CheckCircle, Edit3 } from 'lucide-react';
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

export default function SettingsEdit({ setting }: Props) {
    useSweetAlert(); // Auto-handle flash messages
    
    const [formData, setFormData] = useState({
        key: setting.key,
        value: typeof setting.value === 'object' ? JSON.stringify(setting.value, null, 2) : (setting.value || ''),
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jsonError, setJsonError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.put(`/general-settings/${setting.id}`, formData, {
            onFinish: () => setIsSubmitting(false)
        });
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // Validate JSON if the value looks like JSON
        if (field === 'value' && value.trim().startsWith('{')) {
            try {
                JSON.parse(value);
                setJsonError('');
            } catch (error) {
                setJsonError('JSON không hợp lệ - vui lòng kiểm tra syntax');
            }
        } else {
            setJsonError('');
        }
    };

    const getValueTypeIcon = (value: string) => {
        if (value.trim().startsWith('{') || value.trim().startsWith('[')) return Code;
        return FileText;
    };

    const getSettingIcon = (key: string) => {
        if (key.includes('menu')) return FileText;
        if (key.includes('config')) return Settings;
        return Database;
    };

    const isJsonValue = formData.value.trim().startsWith('{') || formData.value.trim().startsWith('[');
    const ValueIcon = getValueTypeIcon(formData.value);
    const SettingIcon = getSettingIcon(formData.key);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Cài Đặt', href: '/general-settings' },
                { title: 'Chỉnh Sửa', href: `/general-settings/${setting.id}/edit` },
            ]}
        >
            <Head title={`Chỉnh Sửa: ${setting.key}`} />
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
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                                <Edit3 className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Chỉnh Sửa Cài Đặt</h1>
                                <p className="text-indigo-100 text-lg">Cập nhật cài đặt: {setting.key}</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 right-8 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                {/* Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Setting Info */}
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30 rounded-2xl p-6 border border-white/50 dark:border-gray-800/50 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-xl shadow-lg">
                                <SettingIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Thông Tin Hiện Tại</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Giá trị đang sử dụng</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Key: <span className="font-medium">{setting.key}</span></p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Type: <span className="font-medium">
                                {typeof setting.value === 'object' ? 'JSON Object' : 'String'}
                            </span></p>
                        </div>
                    </div>

                    {/* Preview New Values */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 rounded-2xl p-6 border border-white/50 dark:border-gray-800/50 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl shadow-lg">
                                <ValueIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Giá Trị Mới</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Preview thay đổi</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Key: <span className="font-medium">{formData.key || 'Chưa nhập'}</span></p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Type: <span className="font-medium">
                                {isJsonValue ? 'JSON Object' : 'String'}
                            </span></p>
                            {jsonError && (
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-xs">JSON Error</span>
                                </div>
                            )}
                            {!jsonError && isJsonValue && (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-xs">JSON Valid</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                    <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Edit3 className="w-5 h-5 text-indigo-500" />
                            Chỉnh Sửa Cài Đặt
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Cập nhật key và value cho cài đặt này
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Setting Key */}
                        <div className="space-y-3">
                            <label htmlFor="key" className="block text-sm font-medium text-gray-900 dark:text-white">
                                Khóa Cài Đặt
                            </label>
                            <input
                                id="key"
                                type="text"
                                placeholder="e.g., menu, site_config, contact_info"
                                value={formData.key}
                                onChange={(e) => handleChange('key', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                                required
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <Database className="w-4 h-4" />
                                Sử dụng chữ thường và dấu gạch dưới cho key
                            </p>
                        </div>

                        {/* Setting Value */}
                        <div className="space-y-3">
                            <label htmlFor="value" className="block text-sm font-medium text-gray-900 dark:text-white">
                                Giá Trị Cài Đặt
                            </label>
                            <textarea
                                id="value"
                                placeholder="Nhập giá trị (có thể là JSON cho dữ liệu phức tạp)"
                                value={formData.value}
                                onChange={(e) => handleChange('value', e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white font-mono text-sm resize-y"
                            />
                            <div className="flex items-start justify-between">
                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                    <Code className="w-4 h-4" />
                                    Cho JSON values, sử dụng format hợp lệ: {"{"}"key": "value"{"}"}
                                </p>
                                {jsonError && (
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm">{jsonError}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !!jsonError}
                                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Đang cập nhật...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Cập Nhật Cài Đặt
                                    </>
                                )}
                            </button>
                            <Link
                                href="/general-settings"
                                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                Hủy
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
} 