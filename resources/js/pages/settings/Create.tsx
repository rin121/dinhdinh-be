import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowLeft, Plus, X, Settings, Database, Code, FileText, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useSweetAlert } from '@/hooks/use-sweet-alert';

export default function SettingsCreate() {
    useSweetAlert(); // Auto-handle flash messages
    
    const [formData, setFormData] = useState({
        key: '',
        value: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jsonError, setJsonError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        router.post('/general-settings', formData, {
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
                { title: 'Tạo Mới', href: '/general-settings/create' },
            ]}
        >
            <Head title="Tạo Cài Đặt Mới" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 overflow-x-auto animate-slide-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl p-8 text-white relative overflow-hidden">
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
                                <Plus className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Tạo Cài Đặt Mới</h1>
                                <p className="text-emerald-100 text-lg">Thêm cài đặt mới cho ứng dụng</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 right-8 w-16 h-16 bg-white/5 rounded-full animate-float"></div>
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full"></div>
                </div>

                {/* Preview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Setting Preview */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30 rounded-2xl p-6 border border-white/50 dark:border-gray-800/50 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl shadow-lg">
                                <SettingIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Preview Cài Đặt</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Xem trước cài đặt mới</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300">Key: <span className="font-medium">{formData.key || 'Chưa nhập'}</span></p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Type: <span className="font-medium">
                                {isJsonValue ? 'JSON Object' : 'String'}
                            </span></p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Length: <span className="font-medium">{formData.value.length} ký tự</span></p>
                        </div>
                    </div>

                    {/* Validation Status */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 rounded-2xl p-6 border border-white/50 dark:border-gray-800/50 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-lg">
                                <ValueIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">Trạng Thái</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Validation check</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                {formData.key ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-gray-400" />
                                )}
                                <span className="text-sm text-gray-600 dark:text-gray-300">Setting Key</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {formData.value ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <AlertCircle className="w-4 h-4 text-gray-400" />
                                )}
                                <span className="text-sm text-gray-600 dark:text-gray-300">Setting Value</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {jsonError ? (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                ) : isJsonValue ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                <span className="text-sm text-gray-600 dark:text-gray-300">JSON Format</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Form */}
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                    <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-emerald-500" />
                            Thông Tin Cài Đặt
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Nhập key và value cho cài đặt mới
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Setting Key */}
                        <div className="space-y-3">
                            <label htmlFor="key" className="block text-sm font-medium text-gray-900 dark:text-white">
                                Khóa Cài Đặt *
                            </label>
                            <input
                                id="key"
                                type="text"
                                placeholder="e.g., menu, site_config, contact_info"
                                value={formData.key}
                                onChange={(e) => handleChange('key', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-gray-900 dark:text-white"
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
                                Giá Trị Cài Đặt *
                            </label>
                            <textarea
                                id="value"
                                placeholder="Nhập giá trị (có thể là JSON cho dữ liệu phức tạp)"
                                value={formData.value}
                                onChange={(e) => handleChange('value', e.target.value)}
                                rows={6}
                                className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-gray-900 dark:text-white font-mono text-sm resize-y"
                                required
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

                        {/* Quick Templates */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                Templates Nhanh
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        key: 'menu',
                                        value: '{\n  "url": "/",\n  "label": "Trang chủ"\n}'
                                    })}
                                    className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all text-left"
                                >
                                    <div className="font-medium text-emerald-700 dark:text-emerald-300">Menu Item</div>
                                    <div className="text-xs text-emerald-600 dark:text-emerald-400">Navigation menu</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        key: 'site_config',
                                        value: '{\n  "title": "DinhDinh",\n  "description": "Cake Management"\n}'
                                    })}
                                    className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-left"
                                >
                                    <div className="font-medium text-blue-700 dark:text-blue-300">Site Config</div>
                                    <div className="text-xs text-blue-600 dark:text-blue-400">Website settings</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({
                                        key: 'contact_info',
                                        value: 'support@dinhdinh.com'
                                    })}
                                    className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all text-left"
                                >
                                    <div className="font-medium text-purple-700 dark:text-purple-300">Contact</div>
                                    <div className="text-xs text-purple-600 dark:text-purple-400">Simple string</div>
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting || !!jsonError || !formData.key || !formData.value}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Đang tạo...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Tạo Cài Đặt
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