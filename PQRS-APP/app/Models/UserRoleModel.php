<?php

namespace App\Models;

use CodeIgniter\Model;

class UserRoleModel extends Model
{
    protected $table            = 'user_role';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'user_id',
        'role_id',
        'status_id',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function getRolesByUserId(int $userId)
    {
        return $this->select('role.id, role.name, role.description')
            ->join('role', 'role.id = user_role.role_id')
            ->where('user_role.user_id', $userId)
            ->where('user_role.status_id', 1)
            ->findAll();
    }
}