"""
Sistema de traducción centralizado para MAFIS
Mantiene los valores en inglés en la BD pero muestra en español al usuario
"""

# Traducciones de Prioridades
PRIORITY_TRANSLATIONS = {
    'LOW': 'Baja',
    'MEDIUM': 'Media',
    'HIGH': 'Alta'
}

PRIORITY_REVERSE = {v: k for k, v in PRIORITY_TRANSLATIONS.items()}

# Traducciones de Estados de Reportes
REPORT_STATUS_TRANSLATIONS = {
    'OPEN': 'Abierto',
    'IN_PROGRESS': 'En Progreso',
    'RESOLVED': 'Resuelto',
    'CLOSED': 'Cerrado'
}

REPORT_STATUS_REVERSE = {v: k for k, v in REPORT_STATUS_TRANSLATIONS.items()}

# Traducciones de Estados de Órdenes de Trabajo
WORK_ORDER_STATUS_TRANSLATIONS = {
    'OPEN': 'Abierto',
    'ASSIGNED': 'Asignado',
    'IN_PROGRESS': 'En Progreso',
    'COMPLETED': 'Completado',
    'CLOSED': 'Cerrado'
}

WORK_ORDER_STATUS_REVERSE = {v: k for k, v in WORK_ORDER_STATUS_TRANSLATIONS.items()}

# Traducciones de Estados de Activos
ASSET_STATUS_TRANSLATIONS = {
    'OPERATIONAL': 'Operativo',
    'DOWN': 'Fuera de Servicio',
    'MAINTENANCE': 'En Mantenimiento'
}

ASSET_STATUS_REVERSE = {v: k for k, v in ASSET_STATUS_TRANSLATIONS.items()}

# Traducciones de Tipos de Activos
ASSET_TYPE_TRANSLATIONS = {
    'EQUIPMENT': 'Equipo',
    'LOCATIVE': 'Locativo',
    'SERVICE': 'Servicio'
}

ASSET_TYPE_REVERSE = {v: k for k, v in ASSET_TYPE_TRANSLATIONS.items()}

# Traducciones de Criticidad
CRITICALITY_TRANSLATIONS = {
    'LOW': 'Baja',
    'MEDIUM': 'Media',
    'HIGH': 'Alta'
}

CRITICALITY_REVERSE = {v: k for k, v in CRITICALITY_TRANSLATIONS.items()}

# Traducciones de Roles
ROLE_TRANSLATIONS = {
    'admin': 'Administrador',
    'technician': 'Técnico',
    'requester': 'Solicitante'
}

ROLE_REVERSE = {v: k for k, v in ROLE_TRANSLATIONS.items()}


def translate_priority(priority_en):
    """Traduce prioridad de inglés a español"""
    return PRIORITY_TRANSLATIONS.get(priority_en, priority_en)


def translate_report_status(status_en):
    """Traduce estado de reporte de inglés a español"""
    return REPORT_STATUS_TRANSLATIONS.get(status_en, status_en)


def translate_work_order_status(status_en):
    """Traduce estado de orden de trabajo de inglés a español"""
    return WORK_ORDER_STATUS_TRANSLATIONS.get(status_en, status_en)


def translate_asset_status(status_en):
    """Traduce estado de activo de inglés a español"""
    return ASSET_STATUS_TRANSLATIONS.get(status_en, status_en)


def translate_asset_type(type_en):
    """Traduce tipo de activo de inglés a español"""
    return ASSET_TYPE_TRANSLATIONS.get(type_en, type_en)


def translate_criticality(criticality_en):
    """Traduce criticidad de inglés a español"""
    return CRITICALITY_TRANSLATIONS.get(criticality_en, criticality_en)


def translate_role(role_en):
    """Traduce rol de inglés a español"""
    return ROLE_TRANSLATIONS.get(role_en, role_en)


def reverse_translate_priority(priority_es):
    """Traduce prioridad de español a inglés (para recibir del frontend)"""
    return PRIORITY_REVERSE.get(priority_es, priority_es)


def reverse_translate_report_status(status_es):
    """Traduce estado de reporte de español a inglés"""
    return REPORT_STATUS_REVERSE.get(status_es, status_es)


def reverse_translate_work_order_status(status_es):
    """Traduce estado de orden de trabajo de español a inglés"""
    return WORK_ORDER_STATUS_REVERSE.get(status_es, status_es)


def reverse_translate_asset_status(status_es):
    """Traduce estado de activo de español a inglés"""
    return ASSET_STATUS_REVERSE.get(status_es, status_es)


def reverse_translate_asset_type(type_es):
    """Traduce tipo de activo de español a inglés"""
    return ASSET_TYPE_REVERSE.get(type_es, type_es)


def reverse_translate_criticality(criticality_es):
    """Traduce criticidad de español a inglés"""
    return CRITICALITY_REVERSE.get(criticality_es, criticality_es)


def reverse_translate_role(role_es):
    """Traduce rol de español a inglés"""
    return ROLE_REVERSE.get(role_es, role_es)
