import type { ScaledSize } from "react-native";
import { Dimensions } from "react-native";

export const listOfColors = [
  "#e6194b",
  "#3cb44b",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#808080",
  "#ffffff",
  "#ffe119",
  "#000000",
];

export const HEADER_HEIGHT = 100;

export const window: ScaledSize = Dimensions.get("window");

export const routes = [
  {
    name: "home",
    drawerLabel: "Inicio",
    title: "Aguilas Seguridad",
    roles: ["guard", "supervisor", "admin"],
  },
  {
    name: "profile",
    drawerLabel: "Mi Perfil",
    title: "Mi Perfil",
    roles: ["guard", "supervisor", "admin"],
  },
  {
    name: "rounds",
    drawerLabel: "Mis Rondas",
    title: "Mis Rondas",
    roles: ["guard", "supervisor"],
  },
  {
    name: "events",
    drawerLabel: "Mis Eventos",
    title: "Mis Eventos",
    roles: ["guard"],
  },
  {
    name: "new-event",
    drawerLabel: "Nuevo Evento",
    title: "Crear Nuevo Evento",
    roles: [],
  },
  {
    name: "permissions",
    drawerLabel: "Revisar Permisos",
    title: "Revisar Permisos",
    roles: ["guard", "supervisor", "admin"],
  },
  {
    name: "details",
    drawerLabel: "",
    title: "",
    roles: [],
  },
  {
    name: "camera",
    drawerLabel: "Validar Código QR",
    title: "Validar Código QR",
    roles: [],
  },
  {
    name: "simple-camera",
    drawerLabel: "Nueva Foto",
    title: "Nueva Foto",
    roles: [],
  },
  {
    name: "camera-supervisor",
    drawerLabel: "Validar Código QR Supervisor",
    title: "Validar Código QR Supervisor",
    roles: [],
  },
  {
    name: "list-contractors",
    drawerLabel: "Personal: Listado de Instalaciones",
    title: "Personal: Listado de Instalaciones",
    roles: ["admin"],
  },
  {
    name: "list-rounds",
    drawerLabel: "Listado de Rondas",
    title: "Listado de Rondas",
    roles: [],
  },
  {
    name: "map-admin",
    drawerLabel: "",
    title: "",
    roles: [],
  },
  {
    name: "list-contractors-general",
    drawerLabel: "General: Listado de Instalaciones",
    title: "General: Listado de Instalaciones",
    roles: ["admin"],
  },
  {
    name: "map-admin-contractor",
    drawerLabel: "",
    title: "",
    roles: [],
  },
  {
    name: "events-supervisor",
    drawerLabel: "Mis Eventos",
    title: "Mis Eventos",
    roles: ["supervisor"],
  },
  {
    name: "access",
    drawerLabel: "Ingreso de Personal Externo",
    title: "Ingreso de Personal Externo",
    roles: ["guard"],
  },
  {
    name: "access-historial",
    drawerLabel: "Historial de Acceso Externo",
    title: "Historial de Acceso Externo",
    roles: [],
  },
  {
    name: "access-manual",
    drawerLabel: "Ingreso de Personal Manual",
    title: "Ingreso de Personal Manual",
    roles: [],
  },
  {
    name: "access-personal-out",
    drawerLabel: "Marcar Salida del Establecimiento",
    title: "Marcar Salida del Establecimiento",
    roles: [],
  },
  {
    name: "access-personal-scanner",
    drawerLabel: "Scanner de Personal Externo",
    title: "Scanner de Personal Externo",
    roles: [],
  },
  {
    name: "access-worker",
    drawerLabel: "Control de Acceso Interno",
    title: "Control de Acceso Interno",
    roles: ["guard"],
  },
  {
    name: "list-documents",
    drawerLabel: "Listado de documentos",
    title: "Firmar Documentos",
    roles: ["guard", "supervisor"],
  },
  {
    name: "qr-code-list",
    drawerLabel: "Listado Códigos QR",
    title: "Listado Códigos QR",
    roles: ["guard", "supervisor"],
  },
  {
    name: "validate-qr-code",
    drawerLabel: "Validación de Código QR",
    title: "Validación de Código QR",
    roles: [],
  },
  {
    name: "todo-list",
    drawerLabel: "Listado de Tareas",
    title: "Listado de Tareas",
    roles: ["guard", "supervisor"],
  },
  {
    name: "todo-simple",
    drawerLabel: "Tarea Simple",
    title: "Tarea Simple",
    roles: [],
  },
  {
    name: "sync",
    drawerLabel: "Sincronizaciones",
    title: "Sincronizaciones",
    roles: ["guard", "supervisor"],
  },
  {
    name: "camera-face-recognition",
    drawerLabel: "Reconocimiento Facial",
    title: "Reconocimiento Facial",
    roles: ["guard"],
  },
  { name: "map", drawerLabel: "Mapa", roles: [] },
];

export const LOCATION_TASK_NAME = "background-location-task";
