<?php

namespace App\Models;

use CodeIgniter\Model;

class ModuleModel extends Model
{
    protected $table            = 'module';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'name',
        'route',
        'icon',
        'description',
        'is_active',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function getAll()
    {
        return $this->orderBy('id', 'ASC')->findAll();
    }
}