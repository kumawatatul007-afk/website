<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    protected $table = 'enquiries';

    protected $fillable = [
        'type',
        'name',
        'email',
        'phone_no',
        'subject',
        'description',
        'is_check',
        'zip_code',
    ];

    protected $appends = ['message', 'is_read'];

    protected function casts(): array
    {
        return [
            'is_check' => 'boolean',
        ];
    }

    /**
     * Get the message content (maps to description field).
     */
    public function getMessageAttribute(): ?string
    {
        return $this->attributes['description'] ?? null;
    }

    /**
     * Set the message content (maps to description field).
     */
    public function setMessageAttribute($value): void
    {
        $this->attributes['description'] = $value;
    }

    /**
     * Get the is_read status (maps to is_check field).
     */
    public function getIsReadAttribute(): bool
    {
        return (bool) ($this->attributes['is_check'] ?? false);
    }

    /**
     * Set the is_read status (maps to is_check field).
     */
    public function setIsReadAttribute($value): void
    {
        $this->attributes['is_check'] = $value ? 1 : 0;
    }

    /**
     * Scope to filter unread messages.
     */
    public function scopeUnread($query)
    {
        return $query->where('is_check', 0);
    }

    /**
     * Scope to filter by is_read status (maps to is_check).
     */
    public function scopeWhereIsRead($query, $value)
    {
        return $query->where('is_check', $value ? 1 : 0);
    }
}
