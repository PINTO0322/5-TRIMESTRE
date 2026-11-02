<?php

namespace App\Models;

use CodeIgniter\Model;

class PqrsModel extends Model
{
    protected $table            = 'pqrs';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'tracking_number',
        'user_id',
        'pqrs_type_id',
        'pqrs_status_id',
        'assigned_to',
        'subject',
        'description',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
}