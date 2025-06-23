<x-mail::message>
{{-- Header với emoji và màu sắc --}}
<div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #ff6ec7 0%, #a855f7 50%, #3b82f6 100%); border-radius: 15px; margin-bottom: 30px;">
    <h1 style="color: white; font-size: 28px; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
        🎉 Yayyy! Đơn hàng đã được xác nhận! 🎂
    </h1>
    <p style="color: rgba(255,255,255,0.9); font-size: 16px; margin: 10px 0 0 0;">
        Cảm ơn bạn đã tin tương và đặt bánh tại Đình Đình House ✨
    </p>
</div>

{{-- Chào hỏi cá nhân --}}
<div style="background: #fef3ff; padding: 20px; border-radius: 12px; border-left: 4px solid #ec4899; margin-bottom: 25px;">
    <h2 style="color: #be185d; margin: 0 0 10px 0; font-size: 20px;">
        💖 Xin chào {{ $customerName }}!
    </h2>
    <p style="color: #374151; margin: 0; line-height: 1.6;">
        Chúng mình đã nhận được đơn hàng của bạn và đang chuẩn bị những chiếc bánh thơm ngon nhất! 
        Hãy cùng xem chi tiết đơn hàng nhé 👇
    </p>
</div>

{{-- Thông tin đơn hàng --}}
<div style="background: #f0f9ff; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
    <h3 style="color: #0369a1; margin: 0 0 15px 0; font-size: 18px;">
        📝 Thông tin đơn hàng
    </h3>
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">🔢 Mã đơn hàng:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">#{{ $orderNumber }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">💰 Tổng tiền:</td>
            <td style="padding: 8px 0; color: #dc2626; font-weight: 700; font-size: 18px;">{{ $totalAmount }}</td>
        </tr>
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">📅 Ngày đặt:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">{{ $order->created_at->format('d/m/Y H:i') }}</td>
        </tr>
        @if($order->delivery_date)
        <tr>
            <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">🚚 Ngày giao:</td>
            <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">{{ date('d/m/Y', strtotime($order->delivery_date)) }}</td>
        </tr>
        @endif
    </table>
</div>

{{-- Danh sách sản phẩm --}}
<div style="background: #fefce8; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
    <h3 style="color: #a16207; margin: 0 0 15px 0; font-size: 18px;">
        🛒 Sản phẩm đã đặt
    </h3>
    @if($orderItems)
        @foreach($orderItems as $item)
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #fde68a;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0 0 5px 0; color: #92400e; font-size: 16px;">
                        🍰 {{ $item['product_name'] }}
                    </h4>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                        📏 Size: {{ $item['selected_size'] }} | 🔢 Số lượng: {{ $item['quantity'] }}
                    </p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0; color: #dc2626; font-weight: 700; font-size: 16px;">
                        {{ number_format($item['price'] * $item['quantity'], 0, ',', '.') }}đ
                    </p>
                </div>
            </div>
        </div>
        @endforeach
    @endif
</div>

{{-- Lời cảm ơn và hướng dẫn --}}
<div style="background: #f0fdf4; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
    <h3 style="color: #15803d; margin: 0 0 15px 0; font-size: 18px;">
        🙏 Cảm ơn bạn rất nhiều!
    </h3>
    <p style="color: #374151; margin: 0 0 10px 0; line-height: 1.6;">
        Team Đình Đình House sẽ liên hệ với bạn sớm nhất để xác nhận và sắp xếp thời gian giao hàng nhé! 
    </p>
    <p style="color: #374151; margin: 0; line-height: 1.6;">
        Nếu có bất kỳ thắc mắc nào, đừng ngại liên hệ với chúng mình qua:
    </p>
    <ul style="color: #374151; margin: 10px 0 0 20px; line-height: 1.8;">
        <li>📞 <strong>Hotline:</strong> 0911576548</li>
        <li>📧 <strong>Email:</strong> kduy121@gmail.com</li>
        <li>💬 <strong>Zalo:</strong> 0911576548</li>
    </ul>
</div>

{{-- Call to action buttons --}}
<x-mail::button :url="config('app.frontend_url', 'http://localhost:3000')" color="primary" style="background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); border-radius: 25px; padding: 12px 30px; font-weight: 600; text-decoration: none; display: inline-block; margin: 0 10px 10px 0;">
🌐 Xem thêm sản phẩm
</x-mail::button>

<x-mail::button :url="'https://zalo.me/0911576548'" color="success" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 25px; padding: 12px 30px; font-weight: 600; text-decoration: none; display: inline-block; margin: 0 10px 10px 0;">
💬 Chat với chúng mình
</x-mail::button>

{{-- Footer dễ thương --}}
<div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 12px; margin-top: 30px;">
    <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">
        💕 Được làm với tình yêu từ đội ngũ Đình Đình House 💕
    </p>
    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
        🏠 805 Tân Xuân - Hàm Tân - Bình Thuận
    </p>
    <div style="margin-top: 15px;">
        <span style="font-size: 24px;">🍰</span>
        <span style="font-size: 24px;">✨</span>
        <span style="font-size: 24px;">💖</span>
        <span style="font-size: 24px;">🎂</span>
        <span style="font-size: 24px;">🌈</span>
    </div>
</div>

{{-- PS cute --}}
<div style="text-align: center; margin-top: 20px; padding: 15px; background: #fdf2f8; border-radius: 12px; border: 2px dashed #f472b6;">
    <p style="color: #be185d; margin: 0; font-style: italic; font-size: 14px;">
        💌 P.S: Hãy follow chúng mình trên Facebook để cập nhật những mẫu bánh mới nhất nhé! 
        <a href="https://www.facebook.com/chautrang121" style="color: #ec4899; text-decoration: none; font-weight: 600;">@chautrang121</a> 🥰
    </p>
</div>

</x-mail::message>
