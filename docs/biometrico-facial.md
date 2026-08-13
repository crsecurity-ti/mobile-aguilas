# Reconocimiento Facial — Documentación Técnica

Existen dos flujos de reconocimiento facial distintos en la app. Este documento explica cómo funciona cada uno en código y en uso.

---

## Dependencias

| Librería | Versión | Uso |
|---|---|---|
| `react-native-vision-camera` | 4.7.3 | Control de cámara nativa |
| `react-native-vision-camera-face-detector` | 1.8.1 | Detección facial en tiempo real (ML Kit) |
| `@react-native-firebase/auth` | — | Autenticación con custom token |
| `ky` | — | HTTP client para llamadas a API |

---

## Flujo 1: Login con reconocimiento facial

### ¿Para qué sirve?

Permite que guardias y supervisores entren a la app usando su cara en lugar de email + contraseña.

### Ruta en la app

```
(auth)/camera-facial-recognition
```

Se accede desde el botón "Reconocimiento Facial" en la pantalla de login.

### Archivos involucrados

| Archivo | Rol |
|---|---|
| `views/auth/signIn/index.tsx` | Botón que navega a la pantalla de cámara |
| `app/(auth)/camera-facial-recognition.tsx` | Screen wrapper (Expo Router) |
| `components/Camera/CameraSignIn.tsx` | Cámara frontal + botón de captura manual |
| `api/loginWithFacial.ts` | POST imagen al backend → recibe customToken |
| `views/auth/signIn/hooks/useSignIn.tsx` | `onLoginWithCustomToken()` → Firebase Auth |

### Flujo de código paso a paso

```
Usuario presiona "Reconocimiento Facial"
  → navega a /camera-facial-recognition
  → CameraSignIn monta cámara frontal (useCameraDevice("front"))
  → Usuario presiona el botón de captura
  → camera.current.takePhoto({ flash: "off", enableShutterSound: false })
  → loginWithFacial({ imageUri })
      → FormData con file: image/jpeg
      → POST a /account/login/facial (timeout: 100s)
      → responde: { customToken: string }
  → onLoginWithCustomToken(customToken)
      → auth().signInWithCustomToken(customToken)    ← Firebase
      → checkUserInformationByUid(uid)
          → valida: usuario activo
          → valida: rol !== "client"
          → valida: si rol === "guard" → tiene contractorUuid asignado
      → setUser() en Zustand store
      → contexto de auth detecta usuario → redirige a /home
```

### Código clave — `CameraSignIn.tsx`

```typescript
// Captura foto al presionar botón
const takePhoto = useCallback(async () => {
  const photo = await camera.current.takePhoto({
    flash: "off",
    enableShutterSound: false,
  });
  await onMediaCaptured(photo);
}, [onMediaCaptured]);

// Envía al backend y procesa resultado
const onMediaCaptured = async (media: PhotoFile) => {
  const result: any = await loginWithFacial({ imageUri: media.path });
  if (result?.customToken) {
    onLoginWithCustomToken(result.customToken);
  } else {
    throw new Error("Cara no registrada, o la fotografía no es clara");
  }
};
```

### Código clave — `api/loginWithFacial.ts`

```typescript
export const loginWithFacial = async ({ imageUri }: { imageUri: string }) => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri.startsWith("file://") ? imageUri : `file://${imageUri}`,
    type: "image/jpeg",
    name: "facial_image.jpg",
  } as any);

  const response = await ky
    .post(`${process.env.EXPO_PUBLIC_API_URL}account/login/facial`, {
      body: formData,
      timeout: 100000,
      headers: { "Content-Type": "multipart/form-data" },
    })
    .json();

  return response; // { customToken: string }
};
```

### Problemas identificados

- Captura **manual**: el usuario presiona el botón sin que la app valide si hay una cara en el encuadre.
- Sin feedback previo de "cara detectada" — el usuario no sabe si está bien posicionado.
- Sin liveness detection — una foto de una foto funciona igual.
- Timeout de 100 segundos es excesivo para UX móvil.

---

## Flujo 2: Validación de personal en ingreso

### ¿Para qué sirve?

Permite al guardia verificar la identidad de un trabajador externo que entra o sale de la instalación, comparando la cara en tiempo real con la base de datos del contratista.

### Ruta en la app

```
(app)/camera-face-recognition
```

Accesible desde el menú principal. Requiere usuario autenticado con `businessUuid` y `contractorUuid`.

### Archivos involucrados

| Archivo | Rol |
|---|---|
| `app/(app)/camera-face-recognition.tsx` | Screen wrapper (headerShown: false) |
| `components/Camera/CameraFaceRecognition/CameraFaceRecognition.tsx` | Lógica principal: detección + captura + resultado |
| `components/Camera/CameraFaceRecognition/SuccessMatchCard.tsx` | Card verde: nombre, RUT, porcentaje de match |
| `components/Camera/CameraFaceRecognition/ErrorMatchCard.tsx` | Card roja: "No hay coincidencia" |
| `api/validatePersonBiometric.ts` | POST imagen + contexto del contratista → API |
| `store/auth.ts` | Provee `businessUuid` y `contractorUuid` del guardia logueado |

### Flujo de código paso a paso

```
Guardia abre /camera-face-recognition
  → FaceDetection monta Camera con faceDetectionCallback habilitado
  → ML Kit procesa cada frame y llama handleFacesDetected(faces, frame)
      → si isProcessingFaceDetection = true → ignora frame (debounce activo)
      → si faces.length === 0 → muestra "No hay rostros detectados"
      → calcula faceAreaPercentage = (face.width * face.height) / (frame.width * frame.height) * 100
      → si faceAreaPercentage <= 3% → muestra "Favor acerque la cara más"
      → si faceAreaPercentage > 3%:
          → isProcessingFaceDetection = true
          → cameraRef.current.takePhoto({ flash: "off" })
          → validatePersonBiometric({ imageUri, businessUuid, contractorUuid })
              → POST multipart/form-data a /people/validate-biometric (timeout: 100s)
              → responde: { success, name, rut, matchPercentage: number[] }
          → si success = true:
              → muestra SuccessMatchCard (nombre, RUT, matchPercentage[0] * 100 + "%")
          → si success = false:
              → muestra ErrorMatchCard ("No hay coincidencia")
          → setTimeout 2s → isProcessingFaceDetection = false (debounce)
  → intervalo cada 2s: si han pasado 5s desde último resultado → limpiar resultado
```

### Código clave — `CameraFaceRecognition.tsx`

```typescript
// Configuración de detección facial
const faceDetectionOptions: FaceDetectionOptions = {
  performanceMode: "fast",
  classificationMode: "all",
  contourMode: "all",
  landmarkMode: "all",
  windowWidth: width,
  windowHeight: height,
  autoMode: true,
  minFaceSize: 0.7,
};

// Callback por cada frame con cara detectada
const handleFacesDetected = async (faces: Face[], frame: Frame) => {
  if (isProcessingFaceDetection) return;
  setIsProcessingFaceDetection(true);

  try {
    const { bounds } = faces[0];
    const faceAreaPercentage =
      ((bounds.width * bounds.height) / (frame.width * frame.height)) * 100;

    if (faceAreaPercentage > 3) {
      const photo = await cameraRef.current?.takePhoto({ flash: "off" });
      await onMediaCaptured(photo);
    } else {
      setCurrentText("Favor acerque la cara más para confirmar");
    }
  } finally {
    setTimeout(() => setIsProcessingFaceDetection(false), 2000);
  }
};

// Envía foto al backend y muestra resultado
const onMediaCaptured = async (media: PhotoFile) => {
  const result: any = await validatePersonBiometric({
    imageUri: media.path,
    businessUuid: user?.userInformation?.businessUuid ?? "",
    contractorUuid: user?.userInformation?.contractorUuid ?? "",
  });

  if (result?.success === true) {
    setCurrentMatchStatus({ matchStatus: "success", currentUpdateTime: new Date() });
    setCurrentMatchData({
      name: result.name,
      rut: result.rut,
      matchPercentage: result.matchPercentage[0] * 100,
    });
  } else {
    setCurrentMatchStatus({ matchStatus: "error", currentUpdateTime: new Date() });
  }
};
```

### Código clave — `api/validatePersonBiometric.ts`

```typescript
export const validatePersonBiometric = async ({
  imageUri,
  businessUuid,
  contractorUuid,
}: {
  imageUri: string;
  businessUuid: string;
  contractorUuid: string;
}) => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri.startsWith("file://") ? imageUri : `file://${imageUri}`,
    type: "image/jpeg",
    name: "facial_image.jpg",
  } as any);
  formData.append("businessUuid", businessUuid);
  formData.append("contractorUuid", contractorUuid);

  const response = await ky
    .post(`${process.env.EXPO_PUBLIC_API_URL}people/validate-biometric`, {
      body: formData,
      timeout: 100000,
      headers: { "Content-Type": "multipart/form-data" },
    })
    .json();

  return response;
  // { success: boolean, name: string, rut: string, matchPercentage: number[] }
};
```

### Problemas identificados

- Umbral del **3% de área** es muy bajo — cara detectada a distancia genera fotos de baja resolución → más fallos.
- Sin indicador visual del cooldown de 2 segundos — el guardia no sabe por qué "no pasa nada".
- `matchPercentage` es un array `number[]` pero solo se usa el índice `[0]`. Los otros valores son desconocidos.
- Sin liveness detection — una foto de una foto funciona igual.
- Timeout de 100 segundos es excesivo.
- Si el usuario no tiene `contractorUuid` asignado, lanza error genérico sin redirigir.

---

## Comparación de ambos flujos

| | Login (`CameraSignIn`) | Validación ingreso (`CameraFaceRecognition`) |
|---|---|---|
| **Captura** | Manual (botón) | Automática (detección por frame) |
| **API endpoint** | `POST /account/login/facial` | `POST /people/validate-biometric` |
| **Respuesta API** | `{ customToken }` | `{ success, name, rut, matchPercentage[] }` |
| **Detección facial previa** | No | Sí (ML Kit, umbral 3% área) |
| **Requiere usuario logueado** | No (es el login) | Sí (necesita `businessUuid` + `contractorUuid`) |
| **Post-acción** | Firebase sign-in → redirige a /home | Muestra resultado → limpia en 5 segundos |
| **Cámara** | Solo frontal | Frontal por defecto, flip disponible |

---

## API — resumen de endpoints

```
POST /account/login/facial
  Content-Type: multipart/form-data
  Body:
    file: image/jpeg

  Response:
    { customToken: string }


POST /people/validate-biometric
  Content-Type: multipart/form-data
  Body:
    file: image/jpeg
    businessUuid: string
    contractorUuid: string

  Response:
    {
      success: boolean,
      name: string,
      rut: string,
      matchPercentage: number[]   // índice [0] = confianza principal (0-1)
    }
```

Ambos endpoints tienen timeout de 100 segundos. Errores se reportan a Firebase Crashlytics via `logCatchErr`.
