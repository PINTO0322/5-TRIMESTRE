<?php

namespace App\Models;

use CodeIgniter\Model;

class PqrsResponseModel extends Model
{
    protected $table            = 'pqrs_response';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'pqrs_id',
        'user_id',
        'message',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = '';
}