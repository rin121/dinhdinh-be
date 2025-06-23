<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendOrderEmails;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderApiController extends Controller
{
    /**
     * Display a listing of orders
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::query();

        // Search by customer info
        if ($request->filled('search')) {
            $query->searchCustomer($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        // Filter by payment status
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter by date range
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->byDateRange($request->start_date, $request->end_date);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $orders = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    /**
     * Store a newly created order
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'customer_address' => 'required|string',
            'customer_notes' => 'nullable|string',
            'order_items' => 'required|array|min:1',
            'order_items.*.product_id' => 'required|integer',
            'order_items.*.product_name' => 'required|string',
            'order_items.*.product_slug' => 'required|string',
            'order_items.*.selected_size' => 'required|string',
            'order_items.*.price' => 'required|numeric|min:0',
            'order_items.*.quantity' => 'required|integer|min:1',
            'subtotal' => 'required|numeric|min:0',
            'shipping_fee' => 'nullable|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'delivery_date' => 'nullable|date|after:today',
            'delivery_time' => 'nullable|string',
            'payment_method' => ['required', Rule::in(['cash', 'transfer', 'card'])],
        ]);

        try {
            DB::beginTransaction();

            // Generate order number
            $validated['order_number'] = Order::generateOrderNumber();
            $validated['shipping_fee'] = $validated['shipping_fee'] ?? 0;

            $order = Order::create($validated);

            // Dispatch job gửi email không đồng bộ
            SendOrderEmails::dispatch($order);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Đặt hàng thành công!',
                'data' => $order,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi đặt hàng: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified order
     */
    public function show(Order $order): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $order,
        ]);
    }

    /**
     * Update the specified order
     */
    public function update(Request $request, Order $order): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'sometimes|string|max:255',
            'customer_phone' => 'sometimes|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'customer_address' => 'sometimes|string',
            'customer_notes' => 'nullable|string',
            'status' => ['sometimes', Rule::in(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])],
            'delivery_date' => 'nullable|date',
            'delivery_time' => 'nullable|string',
            'payment_method' => ['sometimes', Rule::in(['cash', 'transfer', 'card'])],
            'payment_status' => ['sometimes', Rule::in(['pending', 'paid', 'failed'])],
            'admin_notes' => 'nullable|string',
        ]);

        try {
            // Check if order can be modified
            if (isset($validated['status']) && ! $order->canBeModified() && $order->status !== $validated['status']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể thay đổi đơn hàng này.',
                ], 422);
            }

            $order->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật đơn hàng thành công!',
                'data' => $order->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cancel the specified order
     */
    public function cancel(Order $order): JsonResponse
    {
        if (! $order->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể hủy đơn hàng này.',
            ], 422);
        }

        try {
            $order->update(['status' => Order::STATUS_CANCELLED]);

            return response()->json([
                'success' => true,
                'message' => 'Đã hủy đơn hàng thành công!',
                'data' => $order->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi hủy đơn hàng: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get order statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $stats = [
            'total_orders' => Order::byDateRange($startDate, $endDate)->count(),
            'pending_orders' => Order::byDateRange($startDate, $endDate)->byStatus(Order::STATUS_PENDING)->count(),
            'confirmed_orders' => Order::byDateRange($startDate, $endDate)->byStatus(Order::STATUS_CONFIRMED)->count(),
            'delivered_orders' => Order::byDateRange($startDate, $endDate)->byStatus(Order::STATUS_DELIVERED)->count(),
            'cancelled_orders' => Order::byDateRange($startDate, $endDate)->byStatus(Order::STATUS_CANCELLED)->count(),
            'total_revenue' => Order::byDateRange($startDate, $endDate)
                ->where('payment_status', Order::PAYMENT_PAID)
                ->sum('total_amount'),
            'pending_revenue' => Order::byDateRange($startDate, $endDate)
                ->where('payment_status', Order::PAYMENT_PENDING)
                ->sum('total_amount'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }
}
