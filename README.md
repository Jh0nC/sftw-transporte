# Sistema de Gestión de Transporte

## 📋 Descripción

Sistema integral de gestión de transporte de carga implementado con arquitectura de microservicios. Permite la administración completa de empresas transportadoras, gestión de usuarios, vehículos, conductores y órdenes de transporte con seguimiento en tiempo real.

## 🏗️ Arquitectura

### Microservicios

El sistema está compuesto por los siguientes microservicios independientes:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **auth-service** | 3001 | Autenticación y autorización de usuarios |
| **users-service** | 3002 | Gestión de usuarios, roles y permisos |
| **companies-service** | 3003 | Gestión de empresas administradoras y clientes |
| **states-service** | 3004 | Gestión de estados del sistema |
| **travel-orders-service** | 3005 | Gestión de órdenes de transporte |
| **database-migration** | 3006 | Migraciones y esquema de base de datos |

### Tecnologías

- **Framework**: NestJS con TypeScript
- **Base de Datos**: MySQL
- **ORM**: TypeORM
- **Comunicación**: HTTP/REST con Axios
- **Validación**: class-validator, class-transformer
- **Documentación**: Joi para validación de variables de entorno

## 🗄️ Modelo de Base de Datos

### Entidades Principales

#### 👥 Gestión de Usuarios
- **users**: Datos principales de usuarios
- **users_secondary_data**: Información secundaria (fecha nacimiento, género, fotos)
- **drivers**: Conductores con licencias y documentación
- **users_administratives**: Usuarios administrativos con cargo y dependencia
- **document_types**: Tipos de documentos de identificación

#### 🏢 Gestión de Empresas
- **admin_companies**: Empresas administradoras/transportadoras
- **client_companies**: Empresas clientes que solicitan servicios
- **company_identification_types**: Tipos de identificación empresarial
- **users_admin_companies**: Relación usuarios-empresas (tabla transaccional)

#### 🚛 Gestión de Transporte
- **travel_orders**: Órdenes de transporte
- **vehicles**: Vehículos de transporte
- **vehicle_documents**: Documentación de vehículos (SOAT, tecnicomecánica)
- **travel_stop_points**: Puntos de parada en rutas
- **travel_current_location**: Ubicación actual de vehículos
- **delivery_documents**: Documentos de entrega

#### 🔧 Configuración del Sistema
- **states**: Estados del sistema para control de flujos
- **roles**: Roles de usuario por empresa
- **permissions**: Permisos del sistema
- **load_capacity_categories**: Categorías de capacidad de carga
- **load_type_categories**: Tipos de carga

### Relaciones Principales

```
Users (1:N) UsersAdminCompanies (N:1) AdminCompanies
Users (1:1) Drivers (N:M) Vehicles
AdminCompanies (1:N) TravelOrders (N:M) ClientCompanies
TravelOrders (1:N) TravelStopPoints (1:1) DeliveryDocuments
Roles (N:M) Permissions
```

## 🚀 Funcionalidades del Sistema

### **🔐 Autenticación y Seguridad**
- **JWT + Refresh Tokens**: Sistema de autenticación seguro con tokens de acceso de corta duración (15min) y refresh tokens de larga duración (7 días)
- **Redis para Sesiones**: Almacenamiento en memoria para refresh tokens con expiración automática
- **Roles Dinámicos**: Sistema de roles por empresa con permisos granulares configurables
- **Verificación de Documentos**: Proceso completo de verificación manual de documentos con estados de flujo
- **Guards de Autorización**: Protección de endpoints basada en roles y permisos específicos

### **👥 Gestión Avanzada de Usuarios**
- **Usuarios Multientidad**: Un usuario puede pertenecer a múltiples empresas con roles diferentes
- **Conductores Especializados**: Gestión completa de licencias, categorías y documentación legal
- **Usuarios Administrativos**: Roles específicos con cargos y dependencias organizacionales
- **Datos Secundarios**: Información extendida con fotos de perfil, documentos y historial de sesiones
- **Estados de Verificación**: Control granular del estado de cada usuario según su tipo y verificación

### **🏢 Gestión Empresarial Integral**
- **Empresas Administradoras**: Gestión completa de empresas transportadoras con verificación legal
- **Empresas Fantasma**: Creación automática para conductores naturales sin empresa formal
- **Empresas Cliente**: Registro referencial para tracking de servicios prestados
- **Configuración Personalizada**: JSON config para ajustes específicos por empresa
- **Verificación DIAN**: Proceso de verificación manual con datos oficiales

### **🚛 Gestión de Transporte Completa**
- **Vehículos con Documentación**: Control completo de SOAT, tecnicomecánica, tarjetas de propiedad
- **Asignación Dinámica**: Conductores asignados a vehículos con posibilidad de múltiples asignaciones
- **Categorías de Carga**: Sistema de clasificación por tipo y capacidad de carga
- **Órdenes Flexibles**: Posibilidad de cambiar vehículos durante el transporte por eventualidades
- **Seguimiento en Tiempo Real**: Ubicación GPS actualizada constantemente

### **📊 Control de Flujos y Estados**
- **Estados Centralizados**: Gestión unificada de todos los estados del sistema desde un servicio dedicado
- **Transiciones Controladas**: Flujos predefinidos para cambios de estado con validaciones
- **Historial de Cambios**: Tracking completo de modificaciones y transiciones
- **Estados Específicos**: Diferentes estados para usuarios, conductores, vehículos, empresas, etc.

### **📱 Aplicación Móvil y Web**
- **Autoregistro Móvil**: Única forma para que conductores naturales se registren en el sistema
- **Panel de Administración Web**: Gestión completa para admins de empresa y super usuarios
- **Marketplace Integrado**: Plataforma para conexión entre oferta y demanda de transporte
- **Notificaciones en Tiempo Real**: Sistema de alertas y actualizaciones (futuro)

## 🛠️ Instalación y Configuración

### Prerrequisitos
- **Node.js** >= 18.0.0
- **MySQL** >= 8.0
- **Redis** >= 6.0 (para auth-service)
- **pnpm** (recomendado) o npm >= 8.0

### Variables de Entorno por Servicio

#### **Auth-Service (.env)**
```env
# Servidor
AUTH_SERVICE_PORT=3001

# Base de datos dedicada
AUTH_DB_HOST=localhost
AUTH_DB_PORT=3306
AUTH_DB_NAME=auth_transporte_db
AUTH_DB_USERNAME=root
AUTH_DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Redis para refresh tokens
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf

# Servicios externos
USERS_SERVICE_URL=http://localhost:3002
COMPANIES_SERVICE_URL=http://localhost:3003
STATES_SERVICE_URL=http://localhost:3004
```

#### **Users-Service (.env)**
```env
# Servidor
APP_PORT=3002

# Base de datos principal
DB_HOST=localhost
DB_PORT=3306
DB_NAME=transporte_db
DB_USERNAME=root
DB_PASSWORD=password

# Servicios externos
STATES_SERVICE_URL=http://localhost:3004
COMPANIES_SERVICE_URL=http://localhost:3003
```

#### **Companies-Service (.env)**
```env
# Servidor
APP_PORT=3003

# Base de datos principal
DB_HOST=localhost
DB_PORT=3306
DB_NAME=transporte_db
DB_USERNAME=root
DB_PASSWORD=password

# Servicios externos
USERS_SERVICE_URL=http://localhost:3002
STATES_SERVICE_URL=http://localhost:3004
```

#### **States-Service (.env)**
```env
# Servidor
APP_PORT=3004

# Base de datos principal
DB_HOST=localhost
DB_PORT=3306
DB_NAME=transporte_db
DB_USERNAME=root
DB_PASSWORD=password
```

#### **Travel-Orders-Service (.env)**
```env
# Servidor
APP_PORT=3005

# Base de datos principal
DB_HOST=localhost
DB_PORT=3306
DB_NAME=transporte_db
DB_USERNAME=root
DB_PASSWORD=password

# Servicios externos
USERS_SERVICE_URL=http://localhost:3002
COMPANIES_SERVICE_URL=http://localhost:3003
STATES_SERVICE_URL=http://localhost:3004

# Redis para tiempo real (futuro)
REDIS_HOST=localhost
REDIS_PORT=6379
```

#### **Database-Migration (.env)**
```env
# Servidor
APP_PORT=3006

# Base de datos principal
DB_HOST=localhost
DB_PORT=3306
DB_NAME=transporte_db
DB_USERNAME=root
DB_PASSWORD=password
```

### Instalación Paso a Paso

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd sftw-transporte
```

2. **Configurar bases de datos**
```sql
-- Crear base de datos principal
CREATE DATABASE transporte_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear base de datos para auth-service
CREATE DATABASE auth_transporte_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3. **Instalar Redis (Windows)**
```bash
# Usando Chocolatey
choco install redis-64

# O descargar desde: https://github.com/microsoftarchive/redis/releases
```

4. **Instalar dependencias en cada servicio**
```bash
# Database Migration (ejecutar primero)
cd database-migration
pnpm install
copy .env.example .env
# Configurar variables de entorno
pnpm run start:dev

# Auth Service
cd ..\auth-service
pnpm install
copy .env.example .env
# Configurar variables de entorno

# Users Service
cd ..\users-service
pnpm install

# Companies Service
cd ..\companies-service
pnpm install

# States Service
cd ..\states-service
pnpm install

# Travel Orders Service
cd ..\travel-orders-service
pnpm install
```

5. **Ejecutar servicios en orden**
```bash
# Terminal 1: Database Migration (solo la primera vez)
cd database-migration
pnpm run start:dev

# Terminal 2: States Service (debe estar disponible para otros)
cd states-service
pnpm run start:dev

# Terminal 3: Users Service
cd users-service
pnpm run start:dev

# Terminal 4: Companies Service
cd companies-service
pnpm run start:dev

# Terminal 5: Auth Service
cd auth-service
pnpm run start:dev

# Terminal 6: Travel Orders Service
cd travel-orders-service
pnpm run start:dev
```

### Verificación de Instalación

1. **Verificar servicios activos**
```bash
# Estados
curl http://localhost:3004/states

# Usuarios
curl http://localhost:3002/document-types

# Empresas
curl http://localhost:3003/company-identification-types

# Auth (debería requerir autenticación)
curl http://localhost:3001/auth/me
```

2. **Verificar Redis**
```bash
redis-cli ping
# Debería responder: PONG
```

3. **Verificar Base de Datos**
```sql
USE transporte_db;
SHOW TABLES;
-- Debería mostrar todas las tablas migradas
```

## 🔧 Servicios y Funcionalidades Detalladas

### **🔐 Auth-Service (Puerto 3001)**
**Responsabilidad**: Autenticación, autorización y verificación de documentos

**Funcionalidades**:
- Gestión completa del ciclo de autenticación (login, logout, refresh tokens)
- Proceso de registro para todos los tipos de entidades
- Verificación y aprobación de documentos subidos
- Coordinación con otros servicios para creación de entidades verificadas
- Almacenamiento temporal de documentos y procesos de verificación
- Manejo de refresh tokens con Redis

**Base de Datos Propia**: 
- Tablas de verificación, documentos subidos, tokens de refresh
- Logs de autenticación y procesos de verificación

### **👥 Users-Service (Puerto 3002)**
**Responsabilidad**: Gestión integral de usuarios y sistema de permisos

**Funcionalidades**:
- CRUD completo de usuarios con datos principales y secundarios
- Gestión de conductores con licencias y documentación
- Usuarios administrativos con cargos y dependencias
- Sistema de roles por empresa con permisos granulares
- Gestión de tipos de documentos de identificación
- Relaciones usuario-empresa a través de tablas transaccionales

**Entidades Principales**: users, users_secondary_data, drivers, user_administratives, roles, permissions, document_types

### **🏢 Companies-Service (Puerto 3003)**
**Responsabilidad**: Gestión de empresas y vehículos

**Funcionalidades**:
- Gestión de empresas administradoras/transportadoras verificadas
- Registro de empresas clientes (solo referenciales)
- Gestión completa de vehículos con documentación
- Tipos de identificación empresarial
- Relaciones empresa-usuario y conductor-vehículo
- Gestión de empresas fantasma para conductores naturales

**Entidades Principales**: admin_companies, client_companies, vehicles, vehicle_documents, company_identification_types

### **📊 States-Service (Puerto 3004)**
**Responsabilidad**: Gestión centralizada de todos los estados del sistema

**Funcionalidades**:
- Estados para usuarios, conductores, vehículos, empresas
- Estados para roles, permisos y procesos de verificación
- Control de flujos y transiciones de estado
- Disponible para todos los servicios del ecosistema

**Entidades**: states (tabla única centralizada)

### **🚛 Travel-Orders-Service (Puerto 3005)**
**Responsabilidad**: Gestión completa de órdenes de transporte

**Funcionalidades**:
- Creación y gestión de órdenes de transporte
- Puntos de parada y rutas de entrega
- Seguimiento en tiempo real de ubicación
- Gestión de novedades y reportes de viaje
- Documentos de entrega y comprobantes
- Historial de vehículos asignados por orden

**Entidades Principales**: travel_orders, travel_stop_points, travel_current_location, travel_news, delivery_documents

### **🗄️ Database-Migration (Puerto 3006)**
**Responsabilidad**: Gestión del esquema de base de datos

**Funcionalidades**:
- Creación y actualización del esquema completo
- Migraciones de estructura de base de datos
- Datos iniciales y seeds
- Sincronización automática de entidades

## 📡 API Endpoints Detallados

### **🔐 Auth-Service (Puerto 3001)**

#### **Autenticación**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ POST | `/auth/login` | Iniciar sesión | Autenticación con email/password, retorna JWT + refresh token |
| ✅ POST | `/auth/refresh` | Renovar token | Intercambia refresh token por nuevo JWT |
| ✅ POST | `/auth/logout` | Cerrar sesión | Invalida refresh token y cierra sesión |
| ✅ GET | `/auth/me` | Perfil usuario | Obtiene información del usuario autenticado |

#### **Registro**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ POST | `/auth/register-natural-driver` | Registro conductor natural | Registro desde app móvil (conductor + vehículo) |
| ✅ POST | `/auth/register-driver` | Registro conductor empresa | Admin registra conductor para su empresa |
| ✅ POST | `/auth/register-vehicle` | Registro vehículo | Registro de vehículo por admin o conductor |
| ✅ POST | `/auth/register-company` | Registro empresa | Solo super usuario registra empresas |
| ✅ POST | `/auth/register-user` | Registro usuario simple | Usuario administrativo sin roles especiales |

#### **Gestión de Documentos**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ POST | `/auth/upload-driver-docs/:id` | Subir docs conductor | Upload de cédula, licencia, foto personal |
| ✅ POST | `/auth/upload-vehicle-docs/:id` | Subir docs vehículo | Upload de SOAT, tecnicomecánica, tarjeta propiedad |
| ✅ GET | `/auth/pending-verifications` | Listar pendientes | Lista de documentos pendientes por verificar |
| ✅ GET | `/auth/verification/:id/documents` | Ver documentos | Visualizar documentos subidos para verificación |

#### **Verificación (Solo Admins)**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ PUT | `/auth/verify-driver/:id` | Verificar conductor | Aprobar/rechazar conductor tras revisar docs |
| ✅ PUT | `/auth/verify-vehicle/:id` | Verificar vehículo | Aprobar/rechazar vehículo tras revisar docs |
| ✅ PUT | `/auth/verify-company/:id` | Verificar empresa | Solo super usuario verifica empresas |

### **👥 Users-Service (Puerto 3002)**

#### **Gestión de Usuarios**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ GET | `/users` | Listar usuarios | Lista paginada de usuarios con filtros |
| ✅ GET | `/users/:id` | Obtener usuario | Detalle completo de usuario específico |
| ✅ POST | `/users` | Crear usuario | Creación manual de usuario (desde auth-service) |
| ✅ PUT | `/users/:id` | Actualizar usuario | Modificar datos de usuario existente |
| ✅ DELETE | `/users/:id` | Eliminar usuario | Eliminación lógica de usuario |
| ✅ GET | `/users/:id/companies` | Empresas del usuario | Lista empresas donde trabaja el usuario |

#### **Gestión de Conductores**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ GET | `/drivers` | Listar conductores | Lista de conductores con estado de verificación |
| ✅ GET | `/drivers/:id` | Obtener conductor | Detalle de conductor con licencias |
| ✅ PUT | `/drivers/:id/state` | Cambiar estado | Actualizar estado de verificación del conductor |
| ✅ GET | `/drivers/:id/vehicles` | Vehículos asignados | Lista vehículos asignados al conductor |

#### **Sistema de Roles y Permisos**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ GET | `/roles` | Listar roles | Todos los roles del sistema |
| ✅ GET | `/roles/company/:id` | Roles por empresa | Roles específicos de una empresa |
| ✅ POST | `/roles` | Crear rol | Nuevo rol con permisos asignados |
| ✅ PUT | `/roles/:id` | Actualizar rol | Modificar rol y sus permisos |
| ✅ DELETE | `/roles/:id` | Eliminar rol | Eliminar rol si no tiene usuarios asignados |
| ✅ GET | `/permissions` | Listar permisos | Todos los permisos disponibles |
| ✅ POST | `/permissions` | Crear permiso | Nuevo permiso del sistema |
| ✅ PUT | `/permissions/:id` | Actualizar permiso | Modificar permiso existente |

#### **Tipos de Documentos**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ GET | `/document-types` | Listar tipos | Tipos de documentos disponibles |
| ✅ GET | `/document-types/entity/:type` | Por entidad | Documentos requeridos por tipo de entidad |

### **🏢 Companies-Service (Puerto 3003)**

#### **Empresas Administradoras**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ GET | `/admin-companies` | Listar empresas admin | Empresas transportadoras con paginación |
| ✅ GET | `/admin-companies/:id` | Obtener empresa | Detalle completo de empresa administradora |
| ✅ POST | `/admin-companies` | Crear empresa | Nueva empresa (desde auth-service) |
| ✅ PUT | `/admin-companies/:id` | Actualizar empresa | Modificar datos de empresa |
| ✅ PUT | `/admin-companies/:id/state` | Cambiar estado | Actualizar estado de verificación |
| ✅ GET | `/admin-companies/:id/users` | Usuarios empresa | Lista usuarios asignados a la empresa |
| ✅ GET | `/admin-companies/:id/vehicles` | Vehículos empresa | Lista vehículos de la empresa |

#### **Empresas Clientes**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ GET | `/client-companies` | Listar clientes | Empresas clientes para referenciar en órdenes |
| ✅ POST | `/client-companies` | Crear cliente | Nueva empresa cliente |
| ✅ PUT | `/client-companies/:id` | Actualizar cliente | Modificar datos de empresa cliente |

#### **Gestión de Vehículos**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ GET | `/vehicles` | Listar vehículos | Vehículos con estado y empresa |
| ✅ GET | `/vehicles/:id` | Obtener vehículo | Detalle de vehículo con documentos |
| ✅ POST | `/vehicles` | Crear vehículo | Nuevo vehículo (desde auth-service) |
| ✅ PUT | `/vehicles/:id` | Actualizar vehículo | Modificar datos del vehículo |
| ✅ PUT | `/vehicles/:id/state` | Cambiar estado | Actualizar estado de verificación |
| ✅ GET | `/vehicles/:id/drivers` | Conductores asignados | Lista conductores del vehículo |
| ✅ POST | `/vehicles/:id/assign-driver` | Asignar conductor | Vincular conductor verificado al vehículo |

#### **Configuración**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ GET | `/company-identification-types` | Tipos identificación | Tipos de ID para empresas (NIT, RUT, etc.) |

### **📊 States-Service (Puerto 3004)**

#### **Gestión de Estados**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ GET | `/states` | Listar estados | Todos los estados del sistema |
| ✅ GET | `/states/:id` | Obtener estado | Detalle de estado específico |
| ✅ PUT | `/states/:id` | Actualizar estado | Modificar nombre o descripción |
| ✅ GET | `/states/entity/:type` | Estados por entidad | Estados específicos para users, drivers, etc. |

### **🚛 Travel-Orders-Service (Puerto 3005)**

#### **Órdenes de Transporte**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| 🔄 GET | `/travel-orders` | Listar órdenes | Órdenes con filtros y paginación |
| 🔄 GET | `/travel-orders/:id` | Obtener orden | Detalle completo de orden de transporte |
| 🔄 POST | `/travel-orders` | Crear orden | Nueva orden de transporte |
| 🔄 PUT | `/travel-orders/:id` | Actualizar orden | Modificar datos de la orden |
| 🔄 PUT | `/travel-orders/:id/assign-vehicle` | Asignar vehículo | Vincular vehículo a la orden |
| 🔄 PUT | `/travel-orders/:id/change-vehicle` | Cambiar vehículo | Reemplazar vehículo durante viaje |

#### **Seguimiento y Ubicación**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| 🔄 GET | `/travel-orders/:id/location` | Ubicación actual | Coordenadas actuales del vehículo |
| 🔄 PUT | `/travel-orders/:id/location` | Actualizar ubicación | Conductor reporta nueva posición |
| 🔄 GET | `/travel-orders/:id/route` | Ruta completa | Historial de ubicaciones del viaje |

#### **Puntos de Parada**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| 🔄 GET | `/travel-orders/:id/stop-points` | Puntos de parada | Lista puntos de entrega de la orden |
| 🔄 POST | `/travel-orders/:id/stop-points` | Agregar punto | Nuevo punto de parada |
| 🔄 PUT | `/stop-points/:id/complete` | Marcar completado | Conductor marca punto como entregado |
| 🔄 POST | `/stop-points/:id/documents` | Subir comprobante | Documentos de entrega del punto |

#### **Novedades y Reportes**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| 🔄 GET | `/travel-orders/:id/news` | Listar novedades | Reportes e incidencias del viaje |
| 🔄 POST | `/travel-orders/:id/news` | Reportar novedad | Conductor reporta incidencia |

### **🗄️ Database-Migration (Puerto 3006)**

#### **Gestión de Esquema**
| Método | Ruta | Propósito | Descripción |
|--------|------|-----------|-------------|
| ✅ GET | `/health` | Estado del servicio | Verificar conectividad de base de datos |
| ✅ POST | `/migrate` | Ejecutar migraciones | Aplicar cambios de esquema |
| ✅ GET | `/schema` | Ver esquema actual | Estado actual de las tablas |

**Leyenda**: ✅ Implementado | 🔄 En desarrollo | ⏳ Pendiente

## 🔒 Seguridad y Arquitectura

### **Autenticación y Autorización**
- **JWT con Refresh Tokens**: Tokens de acceso de corta duración (15 min) + refresh tokens de larga duración (7 días)
- **Redis para Gestión de Sesiones**: Almacenamiento en memoria con expiración automática
- **Encriptación BCrypt**: Hash seguro de contraseñas con salt rounds configurables
- **Guards Personalizados**: Protección de endpoints con validación de roles y permisos
- **Estrategias Passport**: Implementación de estrategias JWT y Local para flexibilidad

### **Validación y Consistencia de Datos**
- **Class-Validator**: Validación robusta en DTOs con decoradores personalizados
- **Joi para Variables de Entorno**: Validación estricta de configuración al inicio
- **Transformación de Datos**: Normalización automática con class-transformer
- **Manejo Centralizado de Errores**: Respuestas consistentes en todos los servicios
- **Logging Estructurado**: Logs detallados para auditoría y debugging

### **Comunicación entre Servicios**
- **HTTP/REST**: Comunicación síncrona con manejo de errores y reintentos
- **Base Integration Service**: Clase base para comunicación con patrones consistentes
- **Circuit Breaker Pattern**: Prevención de fallos en cascada (futuro)
- **Service Discovery**: URLs configurables por ambiente

### **Base de Datos y Persistencia**
- **TypeORM**: ORM robusto con migraciones automáticas y relaciones complejas
- **Múltiples Bases de Datos**: Separación lógica auth-service vs servicios principales
- **Transacciones**: Manejo de operaciones complejas con rollback automático
- **Índices Optimizados**: Performance mejorado en consultas frecuentes
- **Soft Deletes**: Eliminación lógica para mantenimiento de historial

### **Escalabilidad y Performance**
- **Arquitectura de Microservicios**: Escalado independiente por servicio
- **Redis Cache**: Almacenamiento en memoria para datos de acceso frecuente
- **Paginación Inteligente**: Control de carga en endpoints de listado
- **Lazy Loading**: Carga bajo demanda de relaciones pesadas
- **Connection Pooling**: Gestión eficiente de conexiones a base de datos

## 🏢 Arquitectura del Sistema

### **Patrón de Microservicios**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Auth        │    │ Users       │    │ Companies   │
│ Service     │◄──►│ Service     │◄──►│ Service     │
│ :3001       │    │ :3002       │    │ :3003       │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ States      │    │ Travel      │    │ Database    │
│ Service     │    │ Orders      │    │ Migration   │
│ :3004       │    │ Service     │    │ :3006       │
└─────────────┘    │ :3005       │    └─────────────┘
                   └─────────────┘
```

### **Flujo de Datos**
```
📱 Mobile App ──→ Auth Service ──→ Users/Companies Service
                      │                       │
                      ▼                       ▼
🖥️ Web Panel ──→ Redis Cache ──→ MySQL Database
                      │                       │
                      ▼                       ▼
📊 Admin Panel ──→ States Service ──→ Travel Orders Service
```

### **Separación de Responsabilidades**

#### **Capa de Presentación**
- Controllers: Manejo de requests HTTP y validación de entrada
- DTOs: Definición de estructura de datos de entrada y salida
- Guards: Validación de autenticación y autorización

#### **Capa de Negocio**
- Services: Lógica de negocio principal
- Integration Services: Comunicación entre microservicios
- Utilities: Funciones auxiliares y helpers

#### **Capa de Datos**
- Entities: Definición de modelo de datos con TypeORM
- Repositories: Acceso a datos con patrones de consulta
- Migrations: Control de versiones de esquema de base de datos

## 📊 Monitoreo y Observabilidad

### **Logging**
- **Structured Logging**: JSON logs con contexto completo
- **Correlation IDs**: Tracking de requests entre servicios
- **Error Tracking**: Captura detallada de excepciones
- **Performance Metrics**: Tiempo de respuesta por endpoint

### **Health Checks**
- **Service Health**: Endpoints /health en cada servicio
- **Database Connectivity**: Verificación de conexiones
- **External Dependencies**: Status de servicios externos
- **Resource Usage**: Memoria, CPU, conexiones activas

### **Métricas (Futuro)**
- **Request Metrics**: Throughput, latencia, error rate
- **Business Metrics**: Órdenes completadas, usuarios activos
- **Infrastructure Metrics**: CPU, memoria, disco
- **Custom Dashboards**: Visualización en tiempo real

## 🏢 Estructura del Proyecto

```
sftw-transporte/
├── auth-service/           # Autenticación
├── users-service/          # Gestión de usuarios
├── companies-service/      # Gestión de empresas
├── states-service/         # Estados del sistema
├── travel-orders-service/  # Órdenes de transporte
├── database-migration/     # Migraciones DB
└── README.md
```

## 📈 Estado del Desarrollo y Roadmap

### **✅ Completado**
- **Base de Datos**: Esquema completo con 25+ entidades y relaciones complejas
- **Users-Service**: CRUD completo de usuarios, conductores, roles y permisos
- **Companies-Service**: Gestión de empresas administradoras, clientes y vehículos  
- **States-Service**: Gestión centralizada de estados del sistema
- **Database-Migration**: Servicio de migraciones y esquema inicial
- **Integración entre Servicios**: Comunicación HTTP con manejo de errores
- **Validación de Datos**: DTOs con class-validator en todos los servicios
- **Arquitectura Base**: Estructura de microservicios establecida

### **🔄 En Desarrollo**
- **Auth-Service**: 
  - ✅ Estructura base y configuración
  - 🔄 Sistema de autenticación JWT + Redis
  - 🔄 Proceso de registro y verificación de documentos
  - 🔄 Integración con otros servicios para creación de entidades
- **Travel-Orders-Service**:
  - ✅ Estructura base definida
  - 🔄 CRUD de órdenes de transporte
  - 🔄 Sistema de seguimiento en tiempo real
  - 🔄 Gestión de puntos de parada y entregas

### **⏳ Próximas Fases**

#### **Fase 1: Core Authentication (2-3 semanas)**
- 🔄 Completar auth-service con todas las funcionalidades
- 🔄 Implementar guards y estrategias de autenticación
- 🔄 Sistema completo de verificación de documentos
- 🔄 Integración Redis para refresh tokens

#### **Fase 2: Travel Management (3-4 semanas)**
- ⏳ Completar travel-orders-service
- ⏳ Sistema de seguimiento GPS en tiempo real
- ⏳ Gestión avanzada de rutas y puntos de entrega
- ⏳ Reportes y novedades de viaje

#### **Fase 3: Mobile Application (4-6 semanas)**
- ⏳ Aplicación móvil para conductores (React Native)
- ⏳ Autoregistro y verificación de documentos
- ⏳ Recepción y gestión de órdenes
- ⏳ Tracking en tiempo real y reportes

#### **Fase 4: Web Dashboard (3-4 semanas)**
- ⏳ Panel de administración para super usuarios
- ⏳ Dashboard para administradores de empresa
- ⏳ Sistema de verificación de documentos
- ⏳ Reportes y analytics

#### **Fase 5: Marketplace (4-5 semanas)**
- ⏳ Plataforma de ofertas de transporte
- ⏳ Sistema de matching automático
- ⏳ Gestión de tarifas y pagos
- ⏳ Sistema de calificaciones

#### **Fase 6: Advanced Features (6-8 semanas)**
- ⏳ Sistema de notificaciones (email, SMS, push)
- ⏳ Inteligencia artificial para optimización de rutas
- ⏳ Sistema de pagos integrado
- ⏳ Reportes avanzados y business intelligence
- ⏳ API pública para terceros

### **🛡️ Funcionalidades de Seguridad Pendientes**
- ⏳ Rate limiting y throttling
- ⏳ Encriptación de datos sensibles
- ⏳ Auditoría completa de acciones
- ⏳ Backup automático y disaster recovery
- ⏳ Compliance con normativas de protección de datos

### **⚡ Optimizaciones de Performance**
- ⏳ Cache distribuido con Redis Cluster
- ⏳ CDN para archivos estáticos
- ⏳ Optimización de consultas de base de datos
- ⏳ Implementación de CQRS para operaciones pesadas
- ⏳ Load balancing entre instancias

### **📊 Métricas y Monitoreo**
- ⏳ Implementación de Prometheus + Grafana
- ⏳ APM (Application Performance Monitoring)
- ⏳ Log aggregation con ELK Stack
- ⏳ Alerting automatizado
- ⏳ Health checks avanzados

### **🔧 DevOps y Deployment**
- ⏳ Containerización con Docker
- ⏳ Orquestación con Kubernetes
- ⏳ CI/CD pipelines automatizados
- ⏳ Infrastructure as Code
- ⏳ Environments de staging y producción

## 🎯 Objetivos del Proyecto

### **Objetivos Técnicos**
- ✅ Arquitectura escalable de microservicios
- 🔄 Sistema de autenticación robusto y seguro
- ⏳ Performance óptimo para 10,000+ usuarios concurrentes
- ⏳ Disponibilidad 99.9% con disaster recovery
- ⏳ API RESTful completa y documentada

### **Objetivos de Negocio**
- ⏳ Digitalización completa de procesos de transporte
- ⏳ Marketplace competitivo en el sector logístico
- ⏳ Reducción de tiempos de gestión en 70%
- ⏳ Aumento de transparencia y trazabilidad
- ⏳ Expansión a mercados regionales

### **Objetivos de Usuario**
- ⏳ Interfaz intuitiva para todos los tipos de usuario
- ⏳ Proceso de registro simplificado
- ⏳ Tracking en tiempo real confiable
- ⏳ Gestión eficiente de documentación
- ⏳ Soporte 24/7 integrado

## 👥 Contribución

1. Fork el proyecto
2. Crear una rama para la feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 🔄 Procesos y Flujos del Sistema

### **1. Registro de Conductor Persona Natural (App Móvil)**
*ÚNICA forma de autoregistro en el sistema*

```
📱 Descarga app móvil → 📝 Registro básico → 📧 Verificación email
    ↓
📸 Subida documentos conductor → 📸 Subida documentos vehículo
    ↓
👨‍💼 Super Usuario verifica documentos → ✅ Aprobación
    ↓
🏢 Creación automática empresa fantasma → 🔗 Asignación conductor-vehículo
    ↓
🎯 Conductor listo para recibir ofertas
```

### **2. Registro de Conductor por Admin de Empresa**
*Solo admins de empresas verificadas pueden registrar usuarios*

```
👨‍💼 Admin empresa registra conductor → 📧 Notificación al conductor
    ↓
📸 Conductor sube documentos → 👨‍💼 Admin verifica
    ↓
✅ Conductor verificado → 🚛 Disponible para asignación a vehículos
```

### **3. Gestión de Vehículos**

```
👨‍💼 Admin/Conductor registra vehículo → 📸 Subida documentos
    ↓
👨‍💼 Verificación por admin → ✅ Vehículo verificado
    ↓
👥 Asignación de conductores → 🔗 Relación drivers_vehicles
    ↓
🎯 Vehículo disponible para órdenes
```

### **4. Órdenes de Transporte**

```
📋 Creación orden (origen, destino, carga) → 🏢 Asignación empresa admin
    ↓
🏪 Vinculación empresa cliente (referencial) → 🚛 Asignación vehículo
    ↓
👤 Conductor asignado automáticamente vía vehículo → 📱 Ejecución orden
    ↓
📍 Seguimiento tiempo real → 📝 Reportes de novedades → ✅ Finalización
```

### **5. Marketplace de Transporte**

#### **Escenario A: Empresa busca conductor**
```
🏢 Empresa cliente publica oferta → 📱 Conductores naturales ven oferta
    ↓
🤝 Conductor acepta → 📋 Creación orden automática
```

#### **Escenario B: Empresa ofrece servicios**
```
🏢 Empresa transportadora publica capacidad → 📱 Empresas clientes ven ofertas
    ↓
🤝 Contratación de servicio → 📋 Creación orden
```

### **6. Sistema de Roles y Permisos**

#### **Super Usuario**
- ✅ `absolute_permission` - Acceso total al sistema
- ✅ `full_users_*` - Gestión global de usuarios
- ✅ Registro y verificación de empresas
- ✅ Verificación de conductores y vehículos

#### **Admin de Empresa Verificada**
- ✅ `comp_users_*` - Gestión usuarios de su empresa
- ✅ Registro de conductores en su empresa
- ✅ Verificación de conductores y vehículos propios
- ✅ Asignación conductor-vehículo
- ✅ Gestión de órdenes de transporte

#### **Conductor Persona Natural**
- ✅ Autoregistro vía app móvil (ÚNICO método)
- ✅ Registro de UN vehículo propio
- ✅ Recepción y ejecución de órdenes
- ❌ NO puede registrar otros usuarios

#### **Empresas Cliente**
- 📋 Solo información referencial en órdenes
- ❌ NO tienen usuarios en el sistema
- ❌ NO requieren autenticación

### **7. Estados del Sistema**

| ID | Estado | Aplicación |
|----|--------|------------|
| 100 | us_active | Usuarios activos |
| 101 | us_inactive | Usuarios inactivos |
| 102 | us_blocked | Usuarios bloqueados |
| 103 | us_driv_unverified | Conductores sin verificar |
| 104 | us_driv_verified_active | Conductores verificados activos |
| 105 | us_driv_verified_inactive | Conductores verificados inactivos |
| 106 | us_admin_active | Administrativos activos |
| 107 | us_admin_inactive | Administrativos inactivos |
| 108-111 | perm_*/rol_* | Permisos y roles |
| 112 | comp_unverified | Empresas sin verificar |
| 113 | comp_verified_active | Empresas verificadas activas |
| 114 | comp_verified_inactive | Empresas verificadas inactivas |

### **8. Flujo de Verificación de Documentos**

```
📸 Subida documento → 💾 Almacenamiento auth-service
    ↓
👨‍💼 Revisión admin → ✅/❌ Decisión
    ↓
📡 Notificación a servicio correspondiente → 🔄 Actualización estado
    ↓
📱 Usuario notificado del cambio (futuro sistema notificaciones)
```

## 📄 Licencia

Este proyecto es privado y confidencial.
