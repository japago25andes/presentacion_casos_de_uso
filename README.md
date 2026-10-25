# Casos de Uso · Software I

Presentación interactiva para la clase de **Casos de Uso** de Software I — Ingeniería de Sistemas, Universidad Libre.

42 diapositivas: requisitos funcionales y no funcionales, qué es un caso de uso, anatomía del diagrama, include / extend / generalización, ejemplos completos (SINU, cajero automático, tienda en línea, biblioteca) y especificación de casos de uso con plantilla.

## Ver la presentación

Abre `index.html` en cualquier navegador moderno, o visita la versión publicada en GitHub Pages.

| Tecla | Acción |
|---|---|
| `→` `Espacio` `Enter` | Siguiente (revela primero los pasos de la diapositiva) |
| `←` | Anterior |
| `I` / `Esc` | Índice |
| `F` | Pantalla completa |
| `Inicio` / `Fin` | Primera / última diapositiva |

En celulares se avanza deslizando el dedo. Para exportar a PDF: `Ctrl + P` → *Guardar como PDF*.

## Estructura

```
index.html      contenido de las diapositivas
css/styles.css  estilos (paleta institucional de la Universidad Libre)
js/app.js       navegación, pasos, quiz, índice y escalado 16:9
```

## Publicar en GitHub Pages

1. Sube el contenido de esta carpeta a la rama `main` del repositorio.
2. En GitHub: *Settings → Pages → Build and deployment → Deploy from a branch*, rama `main`, carpeta `/ (root)`.
3. La presentación quedará en `https://<usuario>.github.io/<repositorio>/`.

Las notas del profesor (`docente/`) están excluidas del repositorio en `.gitignore`.
