<?php

namespace App\Models;

use CodeIgniter\Model;

class ModuleRoleUserModel extends Model
{
    protected $table            = 'module_role_user';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'module_id',
        'role_id',
        'user_id',
        'permission_id',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function getPermissionsByUser(int $userId)
    {
        $rows = $this
            ->select(
                'module.id AS module_id,
                module.name AS module_name,
                module.route,
                module.icon,
                permission.id AS permission_id,
                permission.name AS permission_name,
                role.name AS role_name'
            )
            ->join('module', 'module.id = module_role_user.module_id')
            ->join(
                'permission',
                'permission.id = module_role_user.permission_id'
            )
            ->join('role', 'role.id = module_role_user.role_id')
            ->where('module_role_user.user_id', $userId)
            ->orderBy('module.name', 'ASC')
            ->findAll();

        $grouped = [];

        foreach ($rows as $row) {
            $moduleId = $row['module_id'];

            if (!isset($grouped[$moduleId])) {
                $grouped[$moduleId] = [
                    'module_id'   => $row['module_id'],
                    'module_name' => $row['module_name'],
                    'route'       => $row['route'],
                    'icon'        => $row['icon'],
                    'permissions' => [],
                    'roles'       => [],
                ];
            }

            if (!in_array(
                $row['permission_name'],
                $grouped[$moduleId]['permissions']
            )) {
                $grouped[$moduleId]['permissions'][] =
                    $row['permission_name'];
            }

            if (!in_array(
                $row['role_name'],
                $grouped[$moduleId]['roles']
            )) {
                $grouped[$moduleId]['roles'][] = $row['role_name'];
            }
        }

        return array_values($grouped);
    }
}