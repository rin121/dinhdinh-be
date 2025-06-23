<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderRequestApiController extends Controller
{
    /**
     * Display a listing of order requests
     */
    public function index(Request $request): JsonResponse
    {
        $query = OrderRequest::with('handler');

        // Search by customer info
        if ($request->filled('search')) {
            $query->searchCustomer($request->search);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        // Filter by request type
        if ($request->filled('type')) {
            $query->byType($request->type);
        }

        // Filter by urgency
        if ($request->filled('urgency')) {
            $query->byUrgency($request->urgency);
        }

        // Filter overdue requests
        if ($request->boolean('overdue')) {
            $query->overdue();
        }

        // Filter by handler
        if ($request->filled('handled_by')) {
            $query->where('handled_by', $request->handled_by);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $requests = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => $requests,
        ]);
    }

    /**
     * Store a newly created order request
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'customer_address' => 'nullable|string',
            'message' => 'required|string',
            'request_type' => ['required', Rule::in(['quote', 'custom_order', 'consultation', 'complaint', 'other'])],
            'urgency' => ['sometimes', Rule::in(['low', 'medium', 'high'])],
            'interested_products' => 'nullable|array',
            'interested_products.*.product_id' => 'required_with:interested_products|integer',
            'interested_products.*.product_name' => 'required_with:interested_products|string',
            'interested_products.*.selected_size' => 'nullable|string',
            'interested_products.*.quantity' => 'required_with:interested_products|integer|min:1',
            'estimated_budget' => 'nullable|numeric|min:0',
            'preferred_contact_time' => 'nullable|date',
            'source' => 'nullable|string|max:50',
            'utm_source' => 'nullable|string|max:100',
            'utm_medium' => 'nullable|string|max:100',
            'utm_campaign' => 'nullable|string|max:100',
        ]);

        try {
            $orderRequest = OrderRequest::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.',
                'data' => $orderRequest,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi gửi yêu cầu: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified order request
     */
    public function show(OrderRequest $orderRequest): JsonResponse
    {
        $orderRequest->load('handler');

        return response()->json([
            'success' => true,
            'data' => $orderRequest,
        ]);
    }

    /**
     * Update the specified order request
     */
    public function update(Request $request, OrderRequest $orderRequest): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => 'sometimes|string|max:255',
            'customer_phone' => 'sometimes|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'customer_address' => 'nullable|string',
            'message' => 'sometimes|string',
            'request_type' => ['sometimes', Rule::in(['quote', 'custom_order', 'consultation', 'complaint', 'other'])],
            'urgency' => ['sometimes', Rule::in(['low', 'medium', 'high'])],
            'status' => ['sometimes', Rule::in(['new', 'contacted', 'quoted', 'converted', 'closed'])],
            'admin_response' => 'nullable|string',
            'handled_by' => 'nullable|integer|exists:users,id',
        ]);

        try {
            $orderRequest->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật yêu cầu thành công!',
                'data' => $orderRequest->fresh(['handler']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Respond to an order request
     */
    public function respond(Request $request, OrderRequest $orderRequest): JsonResponse
    {
        $validated = $request->validate([
            'response' => 'required|string',
            'handled_by' => 'required|integer|exists:users,id',
        ]);

        try {
            $orderRequest->markAsResponded($validated['response'], $validated['handled_by']);

            return response()->json([
                'success' => true,
                'message' => 'Đã phản hồi yêu cầu thành công!',
                'data' => $orderRequest->fresh(['handler']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi phản hồi: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Convert order request to order
     */
    public function convertToOrder(OrderRequest $orderRequest): JsonResponse
    {
        try {
            $orderRequest->convertToOrder();

            return response()->json([
                'success' => true,
                'message' => 'Đã chuyển đổi thành đơn hàng thành công!',
                'data' => $orderRequest->fresh(['handler']),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi chuyển đổi: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified order request
     */
    public function destroy(OrderRequest $orderRequest): JsonResponse
    {
        try {
            $orderRequest->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa yêu cầu thành công!',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi xóa: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get order request statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        $stats = [
            'total_requests' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])->count(),
            'new_requests' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])
                ->byStatus(OrderRequest::STATUS_NEW)->count(),
            'contacted_requests' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])
                ->byStatus(OrderRequest::STATUS_CONTACTED)->count(),
            'converted_requests' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])
                ->byStatus(OrderRequest::STATUS_CONVERTED)->count(),
            'overdue_requests' => OrderRequest::overdue()->count(),
            'by_type' => [
                'quote' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])
                    ->byType(OrderRequest::TYPE_QUOTE)->count(),
                'custom_order' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])
                    ->byType(OrderRequest::TYPE_CUSTOM_ORDER)->count(),
                'consultation' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])
                    ->byType(OrderRequest::TYPE_CONSULTATION)->count(),
                'complaint' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])
                    ->byType(OrderRequest::TYPE_COMPLAINT)->count(),
                'other' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])
                    ->byType(OrderRequest::TYPE_OTHER)->count(),
            ],
            'by_urgency' => [
                'high' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])
                    ->byUrgency(OrderRequest::URGENCY_HIGH)->count(),
                'medium' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])
                    ->byUrgency(OrderRequest::URGENCY_MEDIUM)->count(),
                'low' => OrderRequest::whereBetween('created_at', [$startDate, $endDate])
                    ->byUrgency(OrderRequest::URGENCY_LOW)->count(),
            ],
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
