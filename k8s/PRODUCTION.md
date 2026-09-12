# Production

Los manifiestos de esta carpeta pertenecen al namespace `production`.
`vps-infra/terraform/environments/prod` administra el namespace y los secretos.
El pipeline aplica los manifiestos y actualiza las imagenes con `-n production`.

El workflow conserva sus disparadores existentes (manual y push a `main`). El commit de migracion usa `[skip ci]` para conservar las imagenes actuales durante el cambio de namespace.

No crear ni modificar secretos desde este repositorio. Las variables inyectadas mediante envFrom requieren un rollout tras cambiar el Secret.
