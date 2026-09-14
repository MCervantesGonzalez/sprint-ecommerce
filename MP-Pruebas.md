# Datos de Tarjetas y Estados de Pago

## Usuarios de Prueba

User ID:
3336716316

Usuario:
TESTUSER6442680982673525874

Contraseña:
tH4PwZixvd

Código de verificación:
716316

## Tarjetas de Prueba

| Tipo de tarjeta    | Bandera          | Número              | CVV  | Fecha de caducidad |
| ------------------ | ---------------- | ------------------- | ---- | ------------------ |
| Tarjeta de crédito | Mastercard       | 5474 9254 3267 0366 | 123  | 11/30              |
| Tarjeta de crédito | Visa             | 4075 5957 1648 3764 | 123  | 11/30              |
| Tarjeta de crédito | American Express | 3711 803032 57522   | 1234 | 11/30              |
| Tarjeta de débito  | Mastercard       | 5579 0534 6148 2647 | 123  | 11/30              |
| Tarjeta de débito  | Visa             | 4189 1412 2126 7633 | 123  | 11/30              |

---

## Estados de Pago

| Código | Descripción                                                 |
| ------ | ----------------------------------------------------------- |
| APRO   | Pago aprobado                                               |
| OTHE   | Rechazado por error general                                 |
| CONT   | Pendiente de pago                                           |
| CALL   | Rechazado con validación para autorizar                     |
| FUND   | Rechazado por importe insuficiente                          |
| SECU   | Rechazado por código de seguridad inválido                  |
| EXPI   | Rechazado debido a un problema de fecha de vencimiento      |
| FORM   | Rechazado debido a un error de formulario                   |
| CARD   | Rechazado por falta de card_number                          |
| INST   | Rechazado por cuotas inválidas                              |
| DUPL   | Rechazado por pago duplicado                                |
| LOCK   | Rechazado por tarjeta deshabilitada                         |
| CTNA   | Rechazado por tipo de tarjeta no permitida                  |
| ATTE   | Rechazado debido a intentos excedidos del PIN de la tarjeta |
| BLAC   | Rechazado por estar en lista negra                          |
| UNSU   | No soportado                                                |
| TEST   | Usado para aplicar regla de montos                          |

---

## Notas

- Estas tarjetas son **datos de prueba**.
- El código `TEST` puede utilizarse para simular reglas específicas de validación de montos.
