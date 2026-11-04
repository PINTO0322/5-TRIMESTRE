<?php

namespace App\Filters;

use App\Libraries\JwtService;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $jwt = new JwtService();
        $token = $jwt->getBearerToken();

        if ($token === null) {
            return service('response')->setStatusCode(401)->setJSON([
                'status'  => 'error',
                'message' => 'Token no proporcionado.',
            ]);
        }

        $payload = $jwt->validate($token);

        if (!$payload || empty($payload['id'])) {
            return service('response')->setStatusCode(401)->setJSON([
                'status'  => 'error',
                'message' => 'Token inválido o expirado.',
            ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}