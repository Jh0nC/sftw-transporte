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

## 🚀 Funcionalidades

### 👨‍💼 Gestión de Usuarios
- Registro y autenticación de usuarios
- Sistema de roles y permisos por empresa
- Gestión de conductores con licencias
- Usuarios administrativos con cargos específicos

### 🏪 Gestión de Empresas
- Registro de empresas administradoras
- Gestión de empresas clientes
- Asignación de usuarios a empresas
- Configuración personalizada por empresa

### 🚚 Gestión de Transporte
- Creación y gestión de órdenes de transporte
- Asignación de vehículos y conductores
- Seguimiento en tiempo real
- Gestión de puntos de entrega
- Documentación de entregas

### 📊 Control y Seguimiento
- Estados de flujo para todas las entidades
- Reportes y análisis de transporte
- Gestión de documentación digital
- Control de permisos y accesos

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js >= 18
- MySQL >= 8.0
- pnpm (recomendado) o npm

### Variables de Entorno

Cada microservicio requiere las siguientes variables de entorno:

```env
# Configuración de la aplicación
APP_PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=transporte_db
DB_USERNAME=root
DB_PASSWORD=password

# URLs de otros servicios (según corresponda)
USERS_SERVICE_URL=http://localhost:3002
COMPANIES_SERVICE_URL=http://localhost:3003
STATES_SERVICE_URL=http://localhost:3004
```

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd sftw-transporte
```

2. **Instalar dependencias en cada servicio**
```bash
# Para cada servicio
cd auth-service && pnpm install
cd ../users-service && pnpm install
cd ../companies-service && pnpm install
cd ../states-service && pnpm install
cd ../travel-orders-service && pnpm install
cd ../database-migration && pnpm install
```

3. **Configurar base de datos**
```bash
# Ejecutar migraciones
cd database-migration
pnpm run start:dev
```

4. **Ejecutar servicios**
```bash
# En terminales separadas para cada servicio
cd auth-service && pnpm run start:dev
cd users-service && pnpm run start:dev
cd companies-service && pnpm run start:dev
cd states-service && pnpm run start:dev
cd travel-orders-service && pnpm run start:dev
```

## 📡 API Endpoints

### Users Service (Puerto 3002)
- `GET /document-types` - Obtener tipos de documentos
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `GET /roles` - Listar roles
- `POST /roles` - Crear rol
- `GET /permissions` - Listar permisos

### Companies Service (Puerto 3003)
- `GET /admin-companies` - Listar empresas administradoras
- `POST /admin-companies` - Crear empresa administradora
- `GET /client-companies` - Listar empresas clientes
- `GET /company-identification-types` - Tipos de identificación

### States Service (Puerto 3004)
- `GET /states` - Listar estados
- `PUT /states/:id` - Actualizar estado

## 🔒 Seguridad

- Autenticación basada en JWT
- Sistema de roles y permisos granular
- Validación de datos con class-validator
- Manejo centralizado de errores
- Logs de seguridad y auditoría

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

## 📈 Estado del Desarrollo

- ✅ **Usuarios**: Completamente implementado
- ✅ **Empresas**: Completamente implementado
- ✅ **Estados**: Completamente implementado
- ✅ **Base de Datos**: Esquema completo definido
- 🔄 **Autenticación**: En desarrollo
- 🔄 **Órdenes de Transporte**: En desarrollo
- ⏳ **Dashboard**: Pendiente
- ⏳ **Reportes**: Pendiente

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
