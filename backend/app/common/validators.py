"""
Constants and validation helpers for enumerated values
Todos los valores están en ESPAÑOL
"""

# User Roles
VALID_ROLES = ['admin', 'technician', 'requester']  # Estos se mantienen en inglés por convención

# Report Statuses (en español)
VALID_REPORT_STATUSES = ['ABIERTO', 'EN PROGRESO', 'RESUELTO', 'CERRADO']

# Report Priorities (en español)
VALID_PRIORITIES = ['BAJA', 'MEDIA', 'ALTA']

# Work Order Statuses (en español)
VALID_WORK_ORDER_STATUSES = ['ABIERTO', 'ASIGNADO', 'EN PROGRESO', 'COMPLETADO', 'CERRADO']

# Asset Statuses (en español)
VALID_ASSET_STATUSES = ['OPERATIVO', 'FUERA DE SERVICIO', 'EN MANTENIMIENTO']

# Asset Types (en español)
VALID_ASSET_TYPES = ['EQUIPO', 'LOCATIVO', 'SERVICIO']

# Asset Criticality (en español)
VALID_CRITICALITY = ['BAJA', 'MEDIA', 'ALTA']


def validate_role(role):
    """Validate user role"""
    if role not in VALID_ROLES:
        raise ValueError(f'Rol inválido. Debe ser uno de: {", ".join(VALID_ROLES)}')
    return role


def validate_report_status(status):
    """Validate report status"""
    if status not in VALID_REPORT_STATUSES:
        raise ValueError(f'Estado de reporte inválido. Debe ser uno de: {", ".join(VALID_REPORT_STATUSES)}')
    return status


def validate_priority(priority):
    """Validate priority level"""
    if priority not in VALID_PRIORITIES:
        raise ValueError(f'Prioridad inválida. Debe ser una de: {", ".join(VALID_PRIORITIES)}')
    return priority


def validate_work_order_status(status):
    """Validate work order status"""
    if status not in VALID_WORK_ORDER_STATUSES:
        raise ValueError(f'Estado de orden inválido. Debe ser uno de: {", ".join(VALID_WORK_ORDER_STATUSES)}')
    return status


def validate_asset_status(status):
    """Validate asset status"""
    if status not in VALID_ASSET_STATUSES:
        raise ValueError(f'Estado de activo inválido. Debe ser uno de: {", ".join(VALID_ASSET_STATUSES)}')
    return status


def validate_asset_type(asset_type):
    """Validate asset type"""
    if asset_type not in VALID_ASSET_TYPES:
        raise ValueError(f'Tipo de activo inválido. Debe ser uno de: {", ".join(VALID_ASSET_TYPES)}')
    return asset_type


def validate_criticality(criticality):
    """Validate criticality level"""
    if criticality not in VALID_CRITICALITY:
        raise ValueError(f'Criticidad inválida. Debe ser una de: {", ".join(VALID_CRITICALITY)}')
    return criticality
