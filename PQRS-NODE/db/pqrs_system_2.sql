-- ============================================================
-- db/pqrs_node_system_2.sql
-- Reset del esquema de permisos: role_module_permission
-- ============================================================
-- Reemplaza a module_role_user (se elimina).
-- Idempotente: se puede ejecutar varias veces sin romper nada.
--
-- Ejecución:
--   C:\xampp\mysql\bin\mysql.exe -u root pqrs_node_system < db\pqrs_node_system_2.sql
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
START TRANSACTION;

-- ------------------------------------------------------------
-- 1) Crear role_module_permission
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS role_module_permission (
  id INT NOT NULL AUTO_INCREMENT,
  role_id INT NOT NULL,
  module_id INT NOT NULL,
  permission_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_rmp (role_id, module_id, permission_id),
  KEY idx_rmp_role (role_id),
  KEY idx_rmp_module (module_id),
  KEY idx_rmp_permission (permission_id),
  CONSTRAINT fk_rmp_role FOREIGN KEY (role_id)
    REFERENCES role(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_rmp_module FOREIGN KEY (module_id)
    REFERENCES module(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_rmp_perm FOREIGN KEY (permission_id)
    REFERENCES permission(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ------------------------------------------------------------
-- 2) Migrar datos existentes (solo si module_role_user existe)
-- ------------------------------------------------------------
SET @has_mru := (
  SELECT COUNT(*) FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'module_role_user'
);

SET @sql := IF(@has_mru > 0,
  'INSERT IGNORE INTO role_module_permission (role_id, module_id, permission_id)
   SELECT DISTINCT ur.role_id, mru.module_id, mru.permission_id
   FROM module_role_user mru
   JOIN user_role ur ON ur.id = mru.user_role_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- 3) DROP de module_role_user (si existe)
-- ------------------------------------------------------------
SET @sql := IF(@has_mru > 0,
  'DROP TABLE module_role_user',
  'SELECT 1'
);
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ------------------------------------------------------------
-- 4) Datos base: permisos del rol "user" (role_id = 2)
--    Solo se insertan si NO existen (idempotente por UNIQUE)
--    Dashboard/view, PQRS/view, PQRS/create
-- ------------------------------------------------------------
INSERT IGNORE INTO role_module_permission (role_id, module_id, permission_id)
SELECT 2, m.id, p.id
FROM module m, permission p
WHERE (m.name = 'Dashboard' AND p.name = 'view')
   OR (m.name = 'PQRS'      AND p.name = 'view')
   OR (m.name = 'PQRS'      AND p.name = 'create');

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- 5) Verificación
-- ------------------------------------------------------------
SELECT '=== role_module_permission: resumen por rol ===' AS info;
SELECT r.id AS role_id, r.name AS role_name, COUNT(rmp.id) AS permisos
FROM role r
LEFT JOIN role_module_permission rmp ON rmp.role_id = r.id
GROUP BY r.id, r.name
ORDER BY r.id;

SELECT '=== module_role_user (debe fallar si se eliminó) ===' AS info;
SHOW TABLES LIKE 'module_role_user';

-- La tabla antigua ya se elimina condicionalmente arriba.
SHOW TABLES;

