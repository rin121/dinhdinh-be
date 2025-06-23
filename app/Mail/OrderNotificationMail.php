<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    /**
     * Create a new message instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🔔 Đơn hàng mới #'.$this->order->order_number.' - Đình Đình House',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.order.notification',
            with: [
                'order' => $this->order,
                'customerName' => $this->order->customer_name,
                'customerPhone' => $this->order->customer_phone,
                'customerEmail' => $this->order->customer_email,
                'customerAddress' => $this->order->customer_address,
                'orderNumber' => $this->order->order_number,
                'totalAmount' => number_format($this->order->total_amount, 0, ',', '.').'đ',
                'subtotal' => number_format($this->order->subtotal, 0, ',', '.').'đ',
                'shippingFee' => number_format($this->order->shipping_fee, 0, ',', '.').'đ',
                'orderItems' => is_string($this->order->order_items) ? json_decode($this->order->order_items, true) : $this->order->order_items,
                'paymentMethod' => $this->getPaymentMethodLabel($this->order->payment_method),
                'deliveryDate' => $this->order->delivery_date ? date('d/m/Y', strtotime($this->order->delivery_date)) : 'Chưa chọn',
                'deliveryTime' => $this->order->delivery_time ?? 'Chưa chọn',
            ],
        );
    }

    /**
     * Get payment method label
     */
    private function getPaymentMethodLabel($method): string
    {
        return match ($method) {
            'cash' => 'Tiền mặt',
            'transfer' => 'Chuyển khoản',
            'card' => 'Thẻ tín dụng',
            default => $method
        };
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
