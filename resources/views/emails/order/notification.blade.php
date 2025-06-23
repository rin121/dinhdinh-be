<x-mail::message>
{{-- Header --}}
<div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; margin-bottom: 30px;">
    <h1 style="color: white; font-size: 24px; margin: 0;">
        🔔 Đơn hàng mới từ Đình Đình House
    </h1>
    <p style="color: #d1d5db; font-size: 16px; margin: 10px 0 0 0;">
        Có khách hàng vừa đặt hàng - Cần xử lý ngay
    </p>
</div>

{{-- Thông tin đơn hàng tổng quan --}}
<div style="background: #fef2f2; padding: 20px; border-radius: 12px; border-left: 4px solid #dc2626; margin-bottom: 25px;">
    <h2 style="color: #dc2626; margin: 0 0 15px 0; font-size: 20px;">
        📋 Thông tin đơn hàng #{{ $orderNumber }}
    </h2>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500; width: 30%;">Mã đơn hàng:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 700;">#{{ $orderNumber }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Ngày đặt:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">{{ $order->created_at->format('d/m/Y H:i:s') }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Tổng tiền:</td>
            <td style="padding: 8px 0; color: #dc2626; font-weight: 700; font-size: 18px;">{{ $totalAmount }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Phương thức thanh toán:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">{{ $paymentMethod }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Ngày giao hàng:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">{{ $deliveryDate }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Thời gian giao:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">{{ $deliveryTime }}</td>
        </tr>
    </table>
</div>

{{-- Thông tin khách hàng --}}
<div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
    <h3 style="color: #1d4ed8; margin: 0 0 15px 0; font-size: 18px;">
        👤 Thông tin khách hàng
    </h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500; width: 25%;">Tên khách hàng:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">{{ $customerName }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Số điện thoại:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">
                <a href="tel:{{ $customerPhone }}" style="color: #1d4ed8; text-decoration: none;">{{ $customerPhone }}</a>
            </td>
        </tr>
        @if($customerEmail)
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Email:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">
                <a href="mailto:{{ $customerEmail }}" style="color: #1d4ed8; text-decoration: none;">{{ $customerEmail }}</a>
            </td>
        </tr>
        @endif
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500; vertical-align: top;">Địa chỉ:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600; line-height: 1.5;">{{ $customerAddress }}</td>
        </tr>
    </table>
</div>

{{-- Chi tiết sản phẩm --}}
<div style="background: #fefce8; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
    <h3 style="color: #a16207; margin: 0 0 15px 0; font-size: 18px;">
        🛒 Chi tiết sản phẩm
    </h3>
    @if($orderItems)
        @foreach($orderItems as $index => $item)
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #fde68a;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="color: #92400e; font-weight: 700; font-size: 16px; padding-bottom: 5px;" colspan="2">
                        {{ $index + 1 }}. {{ $item['product_name'] }}
                    </td>
                </tr>
                <tr>
                    <td style="color: #6b7280; font-size: 14px; width: 20%;">Size:</td>
                    <td style="color: #1f2937; font-size: 14px;">{{ $item['selected_size'] }}</td>
                </tr>
                <tr>
                    <td style="color: #6b7280; font-size: 14px;">Số lượng:</td>
                    <td style="color: #1f2937; font-size: 14px;">{{ $item['quantity'] }}</td>
                </tr>
                <tr>
                    <td style="color: #6b7280; font-size: 14px;">Đơn giá:</td>
                    <td style="color: #1f2937; font-size: 14px;">{{ number_format($item['price'], 0, ',', '.') }}đ</td>
                </tr>
                <tr>
                    <td style="color: #6b7280; font-size: 14px; font-weight: 600;">Thành tiền:</td>
                    <td style="color: #dc2626; font-size: 16px; font-weight: 700;">
                        {{ number_format($item['price'] * $item['quantity'], 0, ',', '.') }}đ
                    </td>
                </tr>
            </table>
        </div>
        @endforeach
    @endif
</div>

{{-- Tổng kết đơn hàng --}}
<div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
    <h3 style="color: #15803d; margin: 0 0 15px 0; font-size: 18px;">
        💰 Tổng kết đơn hàng
    </h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Tạm tính:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">{{ $subtotal }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Phí giao hàng:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">{{ $shippingFee }}</td>
        </tr>
        <tr style="border-top: 2px solid #d1fae5;">
            <td style="padding: 12px 0 8px 0; color: #15803d; font-weight: 700; font-size: 18px;">TỔNG CỘNG:</td>
            <td style="padding: 12px 0 8px 0; color: #dc2626; font-weight: 700; font-size: 20px; text-align: right;">{{ $totalAmount }}</td>
        </tr>
    </table>
</div>

{{-- Ghi chú từ khách hàng --}}
@if($order->customer_notes)
<div style="background: #fef3ff; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
    <h3 style="color: #a21caf; margin: 0 0 15px 0; font-size: 18px;">
        💬 Ghi chú từ khách hàng
    </h3>
    <p style="color: #1f2937; margin: 0; line-height: 1.6; font-style: italic; background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #ec4899;">
        "{{ $order->customer_notes }}"
    </p>
</div>
@endif

{{-- Các nút hành động --}}
<div style="text-align: center; margin: 30px 0;">
    <x-mail::button :url="'tel:' . $customerPhone" color="primary" style="background: #059669; border-radius: 8px; margin: 0 10px 10px 0;">
        📞 Gọi khách hàng
    </x-mail::button>
    
    @if($customerEmail)
    <x-mail::button :url="'mailto:' . $customerEmail" color="secondary" style="background: #7c3aed; border-radius: 8px; margin: 0 10px 10px 0;">
        📧 Gửi email
    </x-mail::button>
    @endif
    
    <x-mail::button :url="'https://zalo.me/' . str_replace(['+84', ' ', '-'], ['0', '', ''], $customerPhone)" color="success" style="background: #0369a1; border-radius: 8px; margin: 0 10px 10px 0;">
        💬 Chat Zalo
    </x-mail::button>
</div>

{{-- Footer --}}
<div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px; margin-top: 30px;">
    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
        ⚡ Email được gửi tự động từ hệ thống Đình Đình House
    </p>
    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
        📅 {{ now()->format('d/m/Y H:i:s') }}
    </p>
</div>

</x-mail::message>
