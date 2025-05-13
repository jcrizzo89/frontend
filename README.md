# AguaLuz - Sistema de Gestión de Pedidos

## Descripción
Sistema de gestión de pedidos para la distribución de agua, desarrollado con Angular 17. Permite el seguimiento en tiempo real de pedidos, gestión de clientes y administración eficiente de la distribución.

## Características Principales
- Dashboard interactivo para seguimiento de pedidos
- Gestión de rutas y zonas de distribución
- Administración de clientes y distribuidores
- Estadísticas y reportes en tiempo real
- Integración con WhatsApp y llamadas telefónicas

## Tecnologías Utilizadas
- Angular 17
- Angular Material
- TypeScript
- RxJS
- SCSS/CSS

## Requisitos Previos
- Node.js (v18 o superior)
- npm (v9 o superior)
- Angular CLI (v17 o superior)

## Instalación
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/jcrizzo89/frontend.git
   ```
2. Instalar dependencias:
   ```bash
   cd frontend
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   ng serve
   ```
4. Abrir en el navegador:
   ```
   http://localhost:4200
   ```

## Estructura del Proyecto
```bash
frontend/
├── src/
│   ├── app/
│   │   ├── core/           # Servicios, guardias e interceptores
│   │   ├── features/       # Componentes principales
│   │   │   ├── admin/     # Módulo de administración
│   │   │   ├── auth/      # Autenticación
│   │   │   └── calls/     # Gestión de llamadas
│   │   └── shared/        # Componentes compartidos
│   ├── assets/            # Recursos estáticos
│   └── environments/      # Configuraciones por ambiente
└── ...
```

## Componentes Principales

### Dashboard
- Visualización de pedidos activos
- Filtros por estado y búsqueda
- Estadísticas en tiempo real

### Gestión de Pedidos
- Creación y edición de pedidos
- Seguimiento de estado
- Asignación a distribuidores

### Panel de Administración
- Gestión de usuarios
- Configuración del sistema
- Reportes y estadísticas

## Contribución
1. Fork del repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Estado del Proyecto
En desarrollo activo

## Contacto
Juan Rizzo - [@jcrizzo89](https://github.com/jcrizzo89)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
