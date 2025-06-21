import Swal from 'sweetalert2';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

interface PageProps {
    flash?: {
        success?: string;
        error?: string;
        info?: string;
        warning?: string;
    };
    [key: string]: any;
}

export const useSweetAlert = () => {
    const { props } = usePage<PageProps>();

    useEffect(() => {
        if (props.flash?.success) {
            Swal.fire({
                title: 'Thành công!',
                text: props.flash.success,
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#10b981',
                background: '#ffffff',
                color: '#1f2937',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-xl font-bold',
                    confirmButton: 'rounded-xl px-6 py-3 font-semibold'
                },
                showClass: {
                    popup: 'animate-scale-in'
                },
                hideClass: {
                    popup: 'animate-scale-out'
                }
            });
        }

        if (props.flash?.error) {
            Swal.fire({
                title: 'Lỗi!',
                text: props.flash.error,
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444',
                background: '#ffffff',
                color: '#1f2937',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-xl font-bold',
                    confirmButton: 'rounded-xl px-6 py-3 font-semibold'
                },
                showClass: {
                    popup: 'animate-scale-in'
                },
                hideClass: {
                    popup: 'animate-scale-out'
                }
            });
        }

        if (props.flash?.warning) {
            Swal.fire({
                title: 'Cảnh báo!',
                text: props.flash.warning,
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f59e0b',
                background: '#ffffff',
                color: '#1f2937',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-xl font-bold',
                    confirmButton: 'rounded-xl px-6 py-3 font-semibold'
                },
                showClass: {
                    popup: 'animate-scale-in'
                },
                hideClass: {
                    popup: 'animate-scale-out'
                }
            });
        }

        if (props.flash?.info) {
            Swal.fire({
                title: 'Thông tin!',
                text: props.flash.info,
                icon: 'info',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3b82f6',
                background: '#ffffff',
                color: '#1f2937',
                customClass: {
                    popup: 'rounded-2xl shadow-2xl',
                    title: 'text-xl font-bold',
                    confirmButton: 'rounded-xl px-6 py-3 font-semibold'
                },
                showClass: {
                    popup: 'animate-scale-in'
                },
                hideClass: {
                    popup: 'animate-scale-out'
                }
            });
        }
    }, [props.flash]);

    const showSuccess = (title: string, text?: string) => {
        return Swal.fire({
            title,
            text,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#10b981',
            background: '#ffffff',
            color: '#1f2937',
            customClass: {
                popup: 'rounded-2xl shadow-2xl',
                title: 'text-xl font-bold',
                confirmButton: 'rounded-xl px-6 py-3 font-semibold'
            }
        });
    };

    const showError = (title: string, text?: string) => {
        return Swal.fire({
            title,
            text,
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#ef4444',
            background: '#ffffff',
            color: '#1f2937',
            customClass: {
                popup: 'rounded-2xl shadow-2xl',
                title: 'text-xl font-bold',
                confirmButton: 'rounded-xl px-6 py-3 font-semibold'
            }
        });
    };

    const showConfirm = (title: string, text?: string) => {
        return Swal.fire({
            title,
            text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            background: '#ffffff',
            color: '#1f2937',
            customClass: {
                popup: 'rounded-2xl shadow-2xl',
                title: 'text-xl font-bold',
                confirmButton: 'rounded-xl px-6 py-3 font-semibold',
                cancelButton: 'rounded-xl px-6 py-3 font-semibold'
            }
        });
    };

    const showLoading = (title: string = 'Đang xử lý...') => {
        Swal.fire({
            title,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            background: '#ffffff',
            color: '#1f2937',
            customClass: {
                popup: 'rounded-2xl shadow-2xl',
                title: 'text-xl font-bold'
            },
            didOpen: () => {
                Swal.showLoading();
            }
        });
    };

    const closeLoading = () => {
        Swal.close();
    };

    return {
        showSuccess,
        showError,
        showConfirm,
        showLoading,
        closeLoading
    };
}; 