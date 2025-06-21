<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\BaseModel;

class OrderRequest extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'customer_phone',
        'customer_email',
        'customer_address',
        'message',
        'request_type',
        'urgency',
        'interested_products',
        'estimated_budget',
        'preferred_contact_time',
        'status',
        'admin_response',
        'responded_at',
        'handled_by',
        'source',
        'utm_source',
        'utm_medium',
        'utm_campaign',
    ];

    protected $casts = [
        'interested_products' => 'array',
        'estimated_budget' => 'decimal:2',
        'preferred_contact_time' => 'datetime',
        'responded_at' => 'datetime',
    ];

    // Request type constants
    const TYPE_QUOTE = 'quote';
    const TYPE_CUSTOM_ORDER = 'custom_order';
    const TYPE_CONSULTATION = 'consultation';
    const TYPE_COMPLAINT = 'complaint';
    const TYPE_OTHER = 'other';

    // Status constants
    const STATUS_NEW = 'new';
    const STATUS_CONTACTED = 'contacted';
    const STATUS_QUOTED = 'quoted';
    const STATUS_CONVERTED = 'converted';
    const STATUS_CLOSED = 'closed';

    // Urgency constants
    const URGENCY_LOW = 'low';
    const URGENCY_MEDIUM = 'medium';
    const URGENCY_HIGH = 'high';

    /**
     * Relationship with User (handled_by)
     */
    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }

    /**
     * Get request type label in Vietnamese
     */
    public function getRequestTypeLabelAttribute(): string
    {
        return match($this->request_type) {
            self::TYPE_QUOTE => 'Yêu cầu báo giá',
            self::TYPE_CUSTOM_ORDER => 'Đặt hàng theo yêu cầu',
            self::TYPE_CONSULTATION => 'Tư vấn',
            self::TYPE_COMPLAINT => 'Khiếu nại',
            self::TYPE_OTHER => 'Khác',
            default => 'Không xác định',
        };
    }

    /**
     * Get status label in Vietnamese
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            self::STATUS_NEW => 'Mới',
            self::STATUS_CONTACTED => 'Đã liên hệ',
            self::STATUS_QUOTED => 'Đã báo giá',
            self::STATUS_CONVERTED => 'Đã chuyển đổi',
            self::STATUS_CLOSED => 'Đã đóng',
            default => 'Không xác định',
        };
    }

    /**
     * Get urgency label in Vietnamese
     */
    public function getUrgencyLabelAttribute(): string
    {
        return match($this->urgency) {
            self::URGENCY_LOW => 'Thấp',
            self::URGENCY_MEDIUM => 'Trung bình',
            self::URGENCY_HIGH => 'Cao',
            default => 'Không xác định',
        };
    }

    /**
     * Get urgency color for UI
     */
    public function getUrgencyColorAttribute(): string
    {
        return match($this->urgency) {
            self::URGENCY_LOW => 'green',
            self::URGENCY_MEDIUM => 'yellow',
            self::URGENCY_HIGH => 'red',
            default => 'gray',
        };
    }

    /**
     * Check if request is overdue (no response after 24 hours for high urgency, 48 hours for medium, 72 hours for low)
     */
    public function getIsOverdueAttribute(): bool
    {
        if ($this->status !== self::STATUS_NEW) {
            return false;
        }

        $hours = match($this->urgency) {
            self::URGENCY_HIGH => 24,
            self::URGENCY_MEDIUM => 48,
            self::URGENCY_LOW => 72,
            default => 48,
        };

        return $this->created_at->addHours($hours)->isPast();
    }

    /**
     * Mark as responded
     */
    public function markAsResponded(string $response, int $handledBy): void
    {
        $this->update([
            'admin_response' => $response,
            'responded_at' => now(),
            'handled_by' => $handledBy,
            'status' => self::STATUS_CONTACTED,
        ]);
    }

    /**
     * Convert to order
     */
    public function convertToOrder(): void
    {
        $this->update([
            'status' => self::STATUS_CONVERTED,
        ]);
    }

    /**
     * Scope for filtering by status
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for filtering by request type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('request_type', $type);
    }

    /**
     * Scope for filtering by urgency
     */
    public function scopeByUrgency($query, $urgency)
    {
        return $query->where('urgency', $urgency);
    }

    /**
     * Scope for overdue requests
     */
    public function scopeOverdue($query)
    {
        return $query->where('status', self::STATUS_NEW)
                    ->where(function($q) {
                        $q->where(function($sub) {
                            $sub->where('urgency', self::URGENCY_HIGH)
                                ->where('created_at', '<', now()->subHours(24));
                        })
                        ->orWhere(function($sub) {
                            $sub->where('urgency', self::URGENCY_MEDIUM)
                                ->where('created_at', '<', now()->subHours(48));
                        })
                        ->orWhere(function($sub) {
                            $sub->where('urgency', self::URGENCY_LOW)
                                ->where('created_at', '<', now()->subHours(72));
                        });
                    });
    }

    /**
     * Scope for searching by customer info
     */
    public function scopeSearchCustomer($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('customer_name', 'like', "%{$search}%")
              ->orWhere('customer_phone', 'like', "%{$search}%")
              ->orWhere('customer_email', 'like', "%{$search}%")
              ->orWhere('message', 'like', "%{$search}%");
        });
    }
} 