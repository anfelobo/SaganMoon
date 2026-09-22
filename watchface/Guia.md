# SaganMoon — Guía de ejecución y prueba en Zepp OS Simulator

Guía para compilar, conectar e instalar el watchface **SaganMoon** en el **Zepp OS Simulator** usando Zeus CLI.

## 1. Requisitos

### Software

* Windows
* Git Bash
* Node.js
* npm
* Zeus CLI
* Zepp OS Simulator

### Versiones utilizadas

Esta configuración fue probada con:

```text
Node.js  : v25.6.0
npm      : v11.8.0
Zeus CLI : v1.9.3
ZPM      : v3.4.2
```

## 2. Ubicación del proyecto

El proyecto se encuentra en:

```text
D:\Developer\amazfitbipmax
```

En Git Bash:

```bash
cd /d/Developer/amazfitbipmax
```

El proyecto tiene como target:

```text
432x514-amazfit-bip-max
```

---

# 3. Importante: estructura del proyecto

Zeus analiza los archivos que están dentro del directorio del proyecto.

Por esta razón, cualquier backend, API o proyecto Node.js auxiliar que tenga dependencias como Express **no debe estar dentro de la carpeta raíz de SaganMoon**.

Por ejemplo, si existe:

```text
D:\Developer\amazfitbipmax\api_backend
```

debe moverse fuera del proyecto:

```bash
mv api_backend ../api_backend
```

La estructura principal debe contener únicamente lo necesario para Zepp OS:

```text
amazfitbipmax/
├── app.js
├── app.json
├── assets/
├── package-lock.json
└── watchface/
    ├── index.js
    ├── moon_data.js
    └── moon_data.json
```

---

# 4. Datos lunares

SaganMoon utiliza datos lunares generados previamente.

El archivo utilizado por el watchface es:

```text
watchface/moon_data.js
```

Aunque existe:

```text
watchface/moon_data.json
```

Zeus/Rollup puede tener problemas importando directamente JSON.

Por eso los datos deben convertirse a JavaScript:

```bash
node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('watchface/moon_data.json','utf8')); fs.writeFileSync('watchface/moon_data.js','export default '+JSON.stringify(data,null,2)+'\n');"
```

Y en `watchface/index.js` se debe utilizar:

```javascript
import moonData from './moon_data.js'
```

No:

```javascript
import moonData from './moon_data.json'
```

---

# 5. Configuración de Windows / Git Bash

En algunas instalaciones Zeus puede mostrar:

```text
spawnSync C:\WINDOWS\system32\cmd.exe ENOENT
```

Si ocurre este error, comprobar primero que existe:

```bash
ls /c/Windows/System32/cmd.exe
```

Si existe, establecer:

```bash
export ComSpec='C:\Windows\System32\cmd.exe'
```

Esto aplica a la sesión actual de Git Bash.

---

# 6. Compilar el proyecto

Desde:

```text
/d/Developer/amazfitbipmax
```

ejecutar:

```bash
zeus build
```

Una compilación correcta debe terminar sin errores y mostrar procesos similares a:

```text
[ℹ] Start building package, targets: 432x514-amazfit-bip-max.
[ROLLUP] Transform ... JS files
[RESIZE] Succeed resize icon.png
[PNG2TGA] Converting PNG files...
[QJSC] Compiling JS files...
```

Si aparece:

```text
[✔] 
```

y no hay errores, el paquete fue generado correctamente.

---

# 7. Abrir el Zepp OS Simulator

Abrir el **Zepp OS Simulator** antes de intentar instalar el watchface.

El simulador puede iniciar mostrando otro proyecto o watchface, por ejemplo:

```text
WeatherWidget
```

Esto es normal.

Que el simulador esté abierto **no significa todavía que SaganMoon esté instalado**.

---

# 8. Conectar Zeus con el simulador

Este es un paso fundamental.

Abrir una primera terminal Git Bash:

```bash
cd /d/Developer/amazfitbipmax
```

Ejecutar:

```bash
zeus bridge
```

Aparecerá:

```text
bridge$
```

Dentro del bridge ejecutar:

```text
connect
```

Si todo está correcto aparecerá:

```text
[ℹ] successfully connected to Simulator.
```

### IMPORTANTE

Esta terminal debe permanecer abierta.

No ejecutar:

```text
exit
```

hasta terminar las pruebas.

---

# 9. No confiar únicamente en `zeus status`

Después de conectar el bridge, puede ocurrir que:

```bash
zeus status
```

siga mostrando:

```text
simulator connect status: disconnected
```

aunque:

```text
bridge$ connect
```

haya respondido:

```text
[ℹ] successfully connected to Simulator.
```

En ese caso, utilizar como referencia la conexión confirmada por:

```text
bridge$ connect
```

y continuar con la instalación.

---

# 10. Instalar SaganMoon en el simulador

Con la terminal del bridge todavía abierta:

```text
bridge$
```

utilizar:

```text
install
```

Si se necesita consultar la sintaxis disponible:

```text
install -h
```

La instalación mediante `bridge` es el mecanismo importante para cargar el watchface directamente en el simulador.

No es necesario utilizar el código QR.

---

# 11. Flujo completo recomendado

Cada vez que se quiera probar SaganMoon desde cero:

### Terminal 1 — Bridge

```bash
cd /d/Developer/amazfitbipmax
zeus bridge
```

Después:

```text
bridge$ connect
```

Esperar:

```text
[ℹ] successfully connected to Simulator.
```

Mantener esta terminal abierta.

### Terminal 2 — Compilación

```bash
cd /d/Developer/amazfitbipmax
zeus build
```

Después instalar mediante el bridge:

```text
bridge$ install
```

---

# 12. Flujo de desarrollo

Para trabajar normalmente:

```text
┌─────────────────────────────┐
│       Zepp Simulator        │
│      abierto y ejecutando   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        zeus bridge           │
│                             │
│  bridge$ connect             │
└──────────────┬──────────────┘
               │
               ▼
       Simulator conectado
               │
               ▼
┌─────────────────────────────┐
│          zeus build          │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       bridge$ install        │
└──────────────┬──────────────┘
               │
               ▼
       SaganMoon en simulador
```

---

# 13. Problemas encontrados y solución

## Problema: npm install falla en la raíz

Error:

```text
ENOENT ... package.json
```

### Solución

No ejecutar:

```bash
npm install
```

en la raíz del proyecto Zepp si no existe `package.json`.

Zeus se encarga del proceso de build.

---

## Problema: Zeus intenta procesar el backend

Error relacionado con:

```text
api/server.js
```

o:

```text
api_backend/server.js
```

### Causa

Zeus analiza archivos dentro del directorio del proyecto.

### Solución

Mover el backend fuera:

```bash
mv api_backend ../api_backend
```

---

## Problema: Rollup no puede importar JSON

Error:

```text
Unexpected token
Note that you need @rollup/plugin-json to import JSON files
```

### Solución

Convertir:

```text
moon_data.json
```

a:

```text
moon_data.js
```

y cambiar:

```javascript
import moonData from './moon_data.json'
```

por:

```javascript
import moonData from './moon_data.js'
```

---

## Problema: `zeus preview` genera QR

El comando:

```bash
zeus preview
```

puede generar un QR para probar el watchface en el dispositivo.

### En este proyecto

No utilizar el QR.

El flujo recomendado es:

```text
Zepp OS Simulator
        ↓
zeus bridge
        ↓
connect
        ↓
install
```

---

## Problema: `zeus status` dice disconnected

Puede aparecer:

```text
simulator connect status: disconnected
```

aunque el bridge haya respondido:

```text
[ℹ] successfully connected to Simulator.
```

En ese caso, verificar primero la conexión directamente desde:

```text
bridge$ connect
```

Si devuelve:

```text
[ℹ] successfully connected to Simulator.
```

continuar con la instalación.

---

# 14. Target del proyecto

El target utilizado por SaganMoon es:

```text
432x514-amazfit-bip-max
```

Por tanto, cuando se utilice `dev`, el comando correspondiente es:

```bash
zeus dev -t "432x514-amazfit-bip-max"
```

Sin embargo, para cargar explícitamente la aplicación en el simulador, el flujo probado es:

```text
zeus bridge
    ↓
connect
    ↓
install
```

---

# 15. Comandos rápidos

## Entrar al proyecto

```bash
cd /d/Developer/amazfitbipmax
```

## Compilar

```bash
zeus build
```

## Abrir bridge

```bash
zeus bridge
```

## Conectar simulador

```text
connect
```

## Ver ayuda de instalación

```text
install -h
```

## Instalar

```text
install
```

## Salir del bridge

```text
exit
```

---

# 16. Checklist antes de probar

* [ ] Zepp OS Simulator está abierto.
* [ ] Estamos en `D:\Developer\amazfitbipmax`.
* [ ] El backend está fuera de la carpeta del proyecto.
* [ ] `moon_data.js` existe.
* [ ] `index.js` importa `moon_data.js`.
* [ ] `zeus build` termina correctamente.
* [ ] `zeus bridge` está ejecutándose.
* [ ] `connect` devuelve `successfully connected to Simulator`.
* [ ] La terminal del bridge permanece abierta.
* [ ] Se ejecuta `install`.
* [ ] SaganMoon aparece en el simulador.

---

# 17. Flujo mínimo para recordar

La próxima vez, recordar solamente:

```bash
cd /d/Developer/amazfitbipmax
zeus build
```

Luego:

```bash
zeus bridge
```

Y dentro:

```text
connect
install
```

**Ese es el flujo principal para probar SaganMoon en el Zepp OS Simulator sin utilizar QR.**

API bbase de datos https://www.freeastroapi.com/moon?utm_source



Regla rápida posicion objetos
x mayor → derecha   ➡️
x menor → izquierda ⬅️
y menor → arriba    ⬆️
y mayor → abajo     ⬇️