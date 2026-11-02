<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table            = 'user';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;

    protected $allowedFields = [
        'username',
        'email',
        'password_hash',
        'status_id',
        'last_login',
    ];

    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    public function getAllWithProfile()
    {
        $users = $this
            ->select(
                'user.id, user.username, user.email, user.status_id,
                user.last_login, user.created_at, user.updated_at,
                user_status.name AS status_name'
            )
            ->join('user_status', 'user_status.id = user.status_id')
            ->orderBy('user.id', 'ASC')
            ->findAll();

        $profileModel = new ProfileModel();
        $userRoleModel = new UserRoleModel();

        foreach ($users as &$user) {
            $user['profile'] = $profileModel->getByUserId(
                (int) $user['id']
            );
            $user['roles'] = $userRoleModel->getRolesByUserId(
                (int) $user['id']
            );
        }
        unset($user);

        return $users;
    }

    public function getUserWithProfile(int $id)
    {
        $user = $this
            ->select(
                'user.id, user.username, user.email, user.status_id,
                user.last_login, user.created_at, user.updated_at,
                user_status.name AS status_name'
            )
            ->join('user_status', 'user_status.id = user.status_id')
            ->where('user.id', $id)
            ->first();

        if (!$user) {
            return null;
        }

        $profileModel = new ProfileModel();
        $userRoleModel = new UserRoleModel();

        $user['profile'] = $profileModel->getByUserId($id);
        $user['roles'] = $userRoleModel->getRolesByUserId($id);

        return $user;
    }
}