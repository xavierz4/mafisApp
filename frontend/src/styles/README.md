# 📁 Estructura CSS Modular - MAFIS MVP

Esta estructura organiza los estilos en módulos separados para mejor mantenibilidad y escalabilidad.

## 📂 Estructura de Carpetas

```
src/
├── styles/
│   ├── base/
│   │   ├── variables.css      # Variables CSS (colores, espaciado, sombras)
│   │   └── reset.css          # Reset CSS y estilos base
│   ├── components/
│   │   ├── buttons.css        # Botones (primary, secondary, action, logout)
│   │   ├── inputs.css         # Inputs, forms, select, textarea
│   │   ├── badges.css         # Badges de estado (success, danger, warning)
│   │   └── tables.css         # Tablas y transformación a tarjetas móviles
│   └── layout/
│       ├── auth.css           # Páginas de login/register
│       ├── dashboard.css      # Layout principal del dashboard
│       ├── sidebar.css        # Navegación lateral (desktop)
│       └── bottom-nav.css     # Navegación inferior (mobile PWA)
└── index.css                  # Archivo principal que importa todos los módulos
```

## 🎯 Ventajas de esta Estructura

### ✅ Mantenibilidad
- Cada archivo tiene un propósito claro y específico
- Fácil encontrar y modificar estilos
- Cambios aislados no afectan otros componentes

### ✅ Escalabilidad
- Agregar nuevos componentes es simple
- Solo crear un nuevo archivo en la carpeta correspondiente
- Importar en `index.css`

### ✅ Reutilización
- Variables CSS centralizadas
- Componentes independientes
- Estilos consistentes en toda la app

### ✅ Performance
- Importaciones organizadas
- CSS tree-shaking posible
- Carga optimizada

### ✅ Colaboración
- Múltiples desarrolladores pueden trabajar sin conflictos
- Estructura clara y documentada
- Convenciones establecidas

## 📝 Guía de Uso

### Agregar un Nuevo Componente

1. **Crear archivo en la carpeta apropiada:**
   ```
   src/styles/components/modal.css
   ```

2. **Escribir los estilos:**
   ```css
   /* ============================================
      MODAL COMPONENT
      ============================================ */
   
   .modal {
     /* estilos aquí */
   }
   ```

3. **Importar en `index.css`:**
   ```css
   @import './styles/components/modal.css';
   ```

### Modificar Variables Globales

Editar `src/styles/base/variables.css`:

```css
:root {
  --primary-blue: #0066CC;
  --primary-green: #00A651;
  /* agregar nuevas variables aquí */
}
```

### Agregar Estilos de Layout

1. Crear archivo en `src/styles/layout/`
2. Importar en `index.css` en la sección de Layout

## 🎨 Convenciones de Nombres

### Clases de Componentes
- Usar nombres descriptivos: `.btn-primary`, `.input`, `.badge-success`
- Evitar abreviaciones confusas
- Usar kebab-case: `login-card`, `dashboard-sidebar`

### Variables CSS
- Prefijo descriptivo: `--primary-`, `--text-`, `--bg-`
- Usar nombres semánticos: `--primary-blue` en vez de `--color-1`

### Comentarios
- Secciones principales con separadores:
  ```css
  /* ============================================
     SECTION NAME
     ============================================ */
  ```

## 📊 Orden de Importación

El orden en `index.css` es importante:

1. **Variables** - Primero, para que estén disponibles en todos los módulos
2. **Reset** - Estilos base y normalización
3. **Components** - Componentes reutilizables
4. **Layout** - Estructuras de página específicas

## 🔧 Troubleshooting

### Los estilos no se aplican
- Verificar que el archivo esté importado en `index.css`
- Revisar el orden de importación
- Comprobar la especificidad CSS

### Conflictos de estilos
- Usar nombres de clase más específicos
- Revisar el orden de importación
- Considerar usar CSS Modules para scope local

### Variables no funcionan
- Asegurarse de que `variables.css` se importe primero
- Verificar la sintaxis: `var(--variable-name)`

## 🚀 Próximos Pasos

### Optimizaciones Futuras
- [ ] Implementar CSS Modules para componentes React
- [ ] Agregar PostCSS para autoprefixer
- [ ] Minificar CSS en producción
- [ ] Implementar CSS-in-JS para componentes dinámicos

### Componentes Pendientes
- [ ] Modales
- [ ] Tooltips
- [ ] Dropdowns
- [ ] Alerts/Notifications

---

**Versión:** 1.0  
**Última actualización:** 24 de Noviembre, 2025
