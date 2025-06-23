<?php

namespace App\Jobs;

use App\Mail\OrderConfirmationMail;
use App\Mail\OrderNotificationMail;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendOrderEmails implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $order;

    /**
     * The number of times the job may be attempted.
     */
    public $tries = 3;

    /**
     * The maximum number of seconds the job can run.
     */
    public $timeout = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            // Gửi email xác nhận cho khách hàng (nếu có email)
            if ($this->order->customer_email) {
                try {
                    Mail::to($this->order->customer_email)->send(new OrderConfirmationMail($this->order));
                    Log::info("Customer confirmation email sent successfully for order #{$this->order->order_number} to {$this->order->customer_email}");
                } catch (\Exception $e) {
                    Log::error("Failed to send customer confirmation email for order #{$this->order->order_number}: ".$e->getMessage());
                    // Không throw exception để job không fail hoàn toàn
                }
            }

            // Gửi email thông báo cho admin
            try {
                Mail::to('kduy121@gmail.com')->send(new OrderNotificationMail($this->order));
                Log::info("Admin notification email sent successfully for order #{$this->order->order_number}");
            } catch (\Exception $e) {
                Log::error("Failed to send admin notification email for order #{$this->order->order_number}: ".$e->getMessage());
                // Throw exception để retry job nếu admin email fail
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error("SendOrderEmails job failed for order #{$this->order->order_number}: ".$e->getMessage());
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error("SendOrderEmails job completely failed for order #{$this->order->order_number}: ".$exception->getMessage());
    }
}
