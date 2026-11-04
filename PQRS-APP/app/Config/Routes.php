<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->get('/', 'Home::index');

$routes->group(
    'api/auth',
    ['namespace' => 'App\Controllers\Auth'],
    function ($routes) {
        $routes->post('login', 'AuthController::login');
        $routes->get('me', 'AuthController::me');
        $routes->get('permissions', 'AuthController::permissions');
    }
);