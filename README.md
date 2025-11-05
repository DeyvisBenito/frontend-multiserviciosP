## Estructura del proyecto

```text
.
├── README.md
├── app
│   ├── auth
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   └── register
│   │       └── page.tsx
│   ├── dashboard
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── product
│   │       ├── create
│   │       │   └── page.tsx
│   │       ├── details
│   │       │   ├── [id]
│   │       │   │   └── page.tsx
│   │       │   └── page.tsx
│   │       ├── page.tsx
│   │       └── update
│   │           ├── [id]
│   │           │   └── page.tsx
│   │           └── page.tsx
│   ├── layout.tsx
│   ├── lib
│   │   ├── api.ts
│   │   ├── definitions.ts
│   │   ├── useValidateToken.ts
│   │   └── utils.ts
│   ├── page.tsx
│   └── ui
│       ├── acme-logo.tsx
│       ├── button.tsx
│       ├── dashboard
│       │   ├── nav-links.tsx
│       │   └── sidenav.tsx
│       ├── fonts.ts
│       ├── global.css
│       ├── invoices
│       │   ├── breadcrumbs.tsx
│       │   ├── buttons.tsx
│       │   ├── create-form.tsx
│       │   ├── edit-form.tsx
│       │   ├── pagination.tsx
│       │   └── table.tsx
│       ├── products
│       │   ├── productFIllData.tsx
│       │   └── productoFormCreate.tsx
│       └── skeletons.tsx
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── public
│   ├── favicon.ico
│   └── layoutsImg
│       └── fondoAuth.png
├── tailwind.config.ts
└── tsconfig.json

```

# Pasos para ejecutar el proyecto

## <u>Dependencias del entorno de desarrollo </u>

Para una mejor ejecución de los proyectos es recomendable contar con el siguiente versionamiento:

**node**: v22.16.0

**npm**: 11.4.2

**pnpm**: 10.15.1

**tsc**: Version 5.8.3

### <u>Frontend </u>
En el Frontend siempre se debe utilizar **pnpm**

1. Para ejecutar el Frontend, después de clonar el proyecto, es necesario ejecutar en la terminal del proyecto:

```terminal 
pnpm install
```

Luego de realizar eso se descargarán todas las dependencias necesarias para el correcto funcionamiento del proyecto.

2. Posteriormente a esto, es necesario crear un archivo en el root del proyecto que se llame: 

```text
.env
```

Al crear este archivo en el root del proyecto, diríjase a un archivo existente llamado **.env.example**, ahí encontrará una estructura con los datos que debe colocar en su archivo **.env**, copie los datos de **.env.example** y peguelos en **.env**, posteriormente modifique esos datos del **.env** para que correspondan a los datos de su servidor Backend el cual estará consumiendo.

3. Finalmente ejecute la aplicación con el siguiente comando:
```terminal
pnpm run dev
```
Y su Frontend debería funcionar correctamente.

---

Y listo, su proyecto debería ejecutarse y trabajar correctamente.