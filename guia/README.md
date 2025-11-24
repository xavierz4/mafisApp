# Guía de Construcción Paso a Paso: MAFIS MVP

Bienvenido a la guía de construcción de MAFIS MVP. Esta serie de documentos está diseñada para guiarte paso a paso en la creación de la aplicación desde cero.

## Índice de Pasos

Sigue estos pasos en orden para replicar el proyecto:

1.  **[Paso 1: Estructura y Backend Base](./01_Estructura_y_Backend_Base.md)**
    *   Configuración del entorno Python.
    *   Estructura de carpetas del Backend.
    *   Configuración de Flask (Application Factory).

2.  **[Paso 2: Base de Datos y Modelos](./02_Base_de_Datos_y_Modelos.md)**
    *   Conexión a MySQL.
    *   Creación del modelo de Usuario.
    *   Scripts de inicialización de base de datos.

3.  **[Paso 3: Autenticación Backend](./03_Autenticacion_Backend.md)**
    *   Implementación de JWT.
    *   Rutas de Login y Registro.
    *   Protección de rutas.

4.  **[Paso 4: Frontend Base y Configuración](./04_Frontend_Base_y_Configuracion.md)**
    *   Creación del proyecto React con Vite.
    *   Instalación de Tailwind CSS.
    *   Configuración de Axios e Interceptores.

5.  **[Paso 5: Frontend Auth y Dashboard](./05_Frontend_Auth_y_Dashboard.md)**
    *   Integración con la API de Autenticación.
    *   Gestión de estado con Zustand.
    *   Creación del Layout del Dashboard y Rutas Protegidas.

6.  **[Paso 6: Gestión de Activos](./06_Gestion_de_Activos.md)**
    *   Servicio frontend para Activos.
    *   Listado y CRUD de Activos.
    *   Formularios reutilizables.

7.  **[Paso 7: Gestión de Reportes](./07_Gestion_de_Reportes.md)**
    *   Servicio frontend para Reportes.
    *   Relación entre Reportes y Activos (Select dinámico).
    *   Visualización de estados.

8.  **[Paso 8: Solución de Problemas JWT](./08_Solucion_JWT.md)**
    *   Diagnóstico del error "Subject must be a string".
    *   Corrección en autenticación JWT.
    *   Configuración mejorada y validaciones.

## Requisitos Previos

*   **Python 3.8+**
*   **Node.js 16+**
*   **MySQL Server**
*   **Git** (Opcional pero recomendado)

## Cómo usar esta guía

Cada archivo contiene explicaciones teóricas seguidas de los bloques de código exactos que debes copiar. Se recomienda leer la explicación antes de copiar el código para entender qué está haciendo cada parte.
