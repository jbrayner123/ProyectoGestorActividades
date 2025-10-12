Gestor de Trabajo Personal — Entregable 2 (MVP Integrado)
Emmanuel Roman Solarte Aguirre - Brayner Minotta Ruiz - José Alejandro Castillo Arce
Elevator Pitch
Muchas personas pierden tiempo y productividad por la desorganización de sus tareas y/o actividades diarias. Nuestro Gestor de Trabajo Personal ofrece una solución óptima para organizar, priorizar y recibir alertas de pendientes. Con una interfaz intuitiva y funciones inteligentes, ayuda a mantener el enfoque y cumplir objetivos. Está diseñado para estudiantes, profesionales y cualquier persona que quiera mejorar su distribución de tiempo.

1. Objetivo del entregable
Entregar un MVP funcional e integrado que:

Respete el alcance, usuarios, flujos críticos, Kpis y criterios de aceptación definidos en D1.

Eleve el backend (autenticación JWT, hashing de contraseñas, validación y manejo de errores).

Implemente CRUD real de al menos 3 entidades en total (incluye +2 nuevas respecto al corte anterior).

Justifique cambios respecto a D1 y muestre impacto.

2. Alcance funcional (ligado a D1)
Mantener las historias de usuario y flujos definidos en D1 (no se ampliaron sin documentar).

KPI(s) detectables: velocidad de creación de tareas (ej.: "crear X tareas en ≤ N pasos") y tiempo de login exitoso.

Demo navegable del flujo principal (login → listado de tareas → creación/edición) — pendiente de grabación GIF si se solicita.

3. Estado del avance (resumen)
Implementado:

Autenticación con JWT (token de acceso devuelto al iniciar sesión).

Hashing de contraseñas con Passlib usando el esquema pbkdf2_sha256 (no se guardan contraseñas en texto plano).

Persistencia en MySQL (se migró desde JSON).

Entidades en la base de datos: User, Task, Notification (3 entidades).

Token almacenado en localStorage y enviado en cabecera Authorization: Bearer <token> desde el frontend.

Scripts para instalación de dependencias y arranque del servidor (ver sección Ejecución).

Rate Limiting / API Throttling: (recomendado: 5 req/min para endpoints de auth y 60 req/min para API autenticada).

Ejemplos claros de respuesta 429.

4. Backend — Qué se ha implementado
Framework: FastAPI (estructura del proyecto siguiendo el patrón sugerido en D2).

Endpoints principales implementados (resumen):

POST /auth/register — registro de usuarios (hash de contraseña).

POST /auth/login — login → devuelve access_token (JWT) con expiración.

GET /user como un GET /me — datos del usuario autenticado (protegido por JWT).

CRUD básico sobre tasks y users (crear, listar, obtener por id, actualizar, eliminar).

Endpoints para notifications, users y notifications según lo requerido.

Validación con Pydantic en requests/responses: presentes en esquemas principales.

Manejo de errores centralizado para códigos comunes (401, 403, 404, 422, 500, 429).

Persistencia con una base de datos relacional MySQL

5. Cambios respecto a D1 (justificación e impacto)
Base de datos: Se migró de JSON a MySQL para persistencia real, el impacto es positivo: integridad referencial, facilidad de consultas, concurrente real.

Modelo de datos: Se consolidaron users, tasks, notifications (3 entidades). Reduce complejidad inicial y permite cumplir el requisito de 3 entidades con relaciones.

Seguridad: Se añadió hashing robusto con Passlib (pbkdf2_sha256) y JWT para sesiones; impacto: mejora la seguridad y cumplimiento de la rúbrica.

6. Notas técnicas relevantes
Hasheo de contraseñas: Passlib con esquema pbkdf2_sha256.

Token: token de acceso devuelto en login y guardado en localStorage por el frontend (Authorization Bearer 'Token').

Posible código de error frecuente: 403 Forbidden — significa que la solicitud fue entendida por el servidor pero no autorizada: revisar permisos, roles, configuración y cabeceras Authorization.

7. Estructura del repositorio
/ (raíz)
README.md
/backend
pyproject.toml
app/
main.py
api/routers/*.py
core/config.py
models/*.py
schemas/*.py
db/session.py
services/*.py
.env.example
/frontend
package.json
vite.config.*
src/
api/client.(ts|js)
pages/
components/
hooks/
auth/
styles/
.env.example

8. Variables .env
Backend

SECRET_KEY=una_clave_super_secreta_y_larga ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=mysql+pymysql://user:password@127.0.0.1:3306/tasks_db RATE_LIMIT_AUTH_PER_MIN=5
RATE_LIMIT_API_PER_MIN=60

Frontend

VITE_API_URL=http://127.0.0.1:8000

9. Ejecución local (Backend)
Usar Git Bash dentro del proyecto y ejecutar los comandos a continuación desde la carpeta raíz cuando corresponda.

Antes del backend dirigase al punto 12 para crear y ejecutar la base de datos, ademas ajuste las varables de entoro en .env segun corresponda y continue aqui.

Entrar en la carpeta del backend:

cd ./task-backend

Crear entorno virtual (comando provisto por el equipo):
uv venv .venv

Activar entorno virtual:
source .venv/Scripts/activate

Instalar dependencias:
uv pip install -r requirements.txt

Arrancar el backend:
uv run uvicorn app.main:app --reload --port 8000

Si el comando anterior no funciona, usar la alternativa:

uvicorn app.main:app --reload

IMPORTANTE: Sí hay error al ejecutar y su version de python es 3.13 o superior, vuelva y cree el entorno virtual (.venv) pero en vez de uv venv .venv use py -3.10 -m venv .venv o con version 3.11 o 3.12

Notas:

Cambiar .env y ajustar variables antes de arrancar.

Las rutas de activación pueden variar según plataforma; los comandos provistos son los entregados por el equipo.

10. Frontend (resumen)
Frontend desarrollado con Vite + React.

Manejo del token JWT en localStorage y uso de Authorization: Bearer <token> al hacer peticiones autenticadas.

Páginas implementadas: login/registro, listado de tareas, detalle/edición y creación de tareas.

Configuración por .env (VITE_API_URL).

11. Usuarios de ejemplo
Usuario ejemplo:

Email: demo@ejemplo.com

Clave: Demo1234! (guardada hasheada)

ejecutar frontend:

cd ./frontend

npm run dev

12. Crear y ejecutar Base de datos en MySQL

CREATE DATABASE tasks_db;

USE tasks_db;

-- Tabla de usuarios

CREATE TABLE users (

id INT(11) AUTO_INCREMENT PRIMARY KEY,

name VARCHAR(100) NOT NULL,

email VARCHAR(150) NOT NULL UNIQUE,

hashed_password VARCHAR(255) NOT NULL,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tareas

CREATE TABLE tasks (

id INT(11) AUTO_INCREMENT PRIMARY KEY,

title VARCHAR(200) NOT NULL,

description VARCHAR(2000),

due_date DATE,

due_time TIME,

priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',

status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',

important TINYINT(1) DEFAULT 0,

user_id INT(11) NOT NULL,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

completed_at TIMESTAMP NULL DEFAULT NULL,

is_completed TINYINT(1) DEFAULT 0,

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de notificaciones

CREATE TABLE notifications (

id INT(11) AUTO_INCREMENT PRIMARY KEY,

task_id INT(11) NOT NULL,

user_id INT(11) NOT NULL,

message VARCHAR(255) NOT NULL,

is_read TINYINT(1) DEFAULT 0,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- README generado para Entregable 2 con mucho esfuerzo y dedicación.

13. Ejecutar frontend

cd ./frontend

npm run dev

