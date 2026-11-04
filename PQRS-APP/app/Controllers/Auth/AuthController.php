<?php

namespace App\Controllers\Auth;

use App\Controllers\BaseController;
use App\Libraries\JwtService;
use App\Models\ModuleRoleUserModel;
use App\Models\UserModel;

class AuthController extends BaseController
{
    protected JwtService $jwt;

    public function __construct()
    {
        $this->jwt = new JwtService();
    }

    public function login()
    {
        $input = $this->request->getJSON(true);

        if (
            !is_array($input)
            || !is_string($input['username'] ?? null)
            || !is_string($input['password'] ?? null)
            || trim($input['username']) === ''
            || $input['password'] === ''
        ) {
            return $this->response->setStatusCode(400)->setJSON([
                'status' => 'error',
                'message' => 'Usuario y contraseña son obligatorios.',
            ]);
        }

        $username = trim($input['username']);
        $userModel = new UserModel();

        $user = $userModel->groupStart()
            ->where('username', $username)
            ->orWhere('email', $username)
            ->groupEnd()
            ->first();

        if (!$user) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => 'error',
                'message' => 'Credenciales inválidas.',
            ]);
        }

        if ((int) $user['status_id'] !== 1) {
            return $this->response->setStatusCode(403)->setJSON([
                'status' => 'error',
                'message' => 'El usuario no está activo.',
            ]);
        }

        if (!password_verify($input['password'], $user['password_hash'])) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => 'error',
                'message' => 'Credenciales inválidas.',
            ]);
        }

        $userModel->update($user['id'], [
            'last_login' => date('Y-m-d H:i:s'),
        ]);

        $token = $this->jwt->generate([
            'id' => (int) $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
        ]);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Login exitoso.',
            'token' => $token,
            'user' => [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
            ],
        ]);
    }

    public function me()
    {
        $token = $this->jwt->getBearerToken();

        if (!$token) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => 'error',
                'message' => 'Token no proporcionado.',
            ]);
        }

        $payload = $this->jwt->validate($token);

        if (!$payload || empty($payload['id'])) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => 'error',
                'message' => 'Token inválido o expirado.',
            ]);
        }

        $user = (new UserModel())->find((int) $payload['id']);

        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'Usuario no encontrado.',
            ]);
        }

        if ((int) $user['status_id'] !== 1) {
            return $this->response->setStatusCode(403)->setJSON([
                'status' => 'error',
                'message' => 'El usuario no está activo.',
            ]);
        }

        return $this->response->setJSON([
            'status' => 'success',
            'user' => [
                'id' => (int) $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
            ],
        ]);
    }

    public function permissions()
    {
        $token = $this->jwt->getBearerToken();

        if (!$token) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => 'error',
                'message' => 'Token no proporcionado.',
            ]);
        }

        $payload = $this->jwt->validate($token);

        if (!$payload || empty($payload['id'])) {
            return $this->response->setStatusCode(401)->setJSON([
                'status' => 'error',
                'message' => 'Token inválido o expirado.',
            ]);
        }

        $user = (new UserModel())->find((int) $payload['id']);

        if (!$user) {
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'Usuario no encontrado.',
            ]);
        }

        if ((int) $user['status_id'] !== 1) {
            return $this->response->setStatusCode(403)->setJSON([
                'status' => 'error',
                'message' => 'El usuario no está activo.',
            ]);
        }

        $permissions = (new ModuleRoleUserModel())
            ->getPermissionsByUser((int) $user['id']);

        return $this->response->setJSON([
            'status' => 'success',
            'message' => 'Permisos obtenidos correctamente.',
            'data' => $permissions,
        ]);
    }
}