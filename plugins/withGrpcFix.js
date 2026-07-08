const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// Fix 1: gRPC-Core 1.65.5 es pre-release en CocoaPods CDN — declarar explícitamente.
//
// Fix 2: react-native-vision-camera-face-detector@1.8.1 bug en podspec:
//         declara "GoogleMLKit/FaceDetection" (umbrella viejo) pero código Swift
//         importa "MLKitFaceDetection" (standalone). Parchamos el podspec en node_modules.
//
// Fix 3: FirebaseInstallations/Sessions resuelven a 11.9.0 causando conflicto
//         de FirebaseCore ~> 11.8.0 vs ~> 11.9.0. Pinamos a ~> 11.8.0.
//
// Fix 4: MLKitFaceDetection 6.x requiere iOS 16.0 mínimo.
//
// Fix 5: RNFBStorage importa FirebaseAuth/FirebaseAuth-Swift.h que no se genera
//         en modo static library. DEFINES_MODULE = YES fuerza la generación del
//         module map y el Swift umbrella header sin necesitar use_frameworks!.
//         (use_frameworks! :static fue descartado — rompe op-sqlite con libsql.h duplicado)
//
// Fix 6: pod install falla porque los pods Swift de Firebase (Auth, CoreInternal,
//         Crashlytics, Database, Firestore, Sessions, Storage) dependen de pods
//         ObjC (GoogleUtilities, RecaptchaInterop, FirebaseCore, etc.) que no
//         definen módulo. :modular_headers => true por pod resuelve ESTO (falla
//         de pod install), es un problema DISTINTO del Fix 5 (Swift header para
//         RNFBStorage) — son complementarios, no alternativos. NO usar
//         use_modular_headers! global (rompe gRPC-Core module maps).
//
// Fix 7: aunque DEFINES_MODULE=YES (Fix 5/6) genera el -Swift.h de cada pod
//         Firebase, lo genera en tiempo de COMPILACIÓN dentro del build product
//         del propio pod. CocoaPods solo copia a Headers/Public los .h que ya
//         existen en pod install — el -Swift.h generado nunca llega ahí, por lo
//         que otros targets (RNFBStorage, RNFBFirestore, etc.) no lo encuentran
//         aunque el header sí exista. Agregamos HEADER_SEARCH_PATHS explícito
//         apuntando al build product de cada pod Swift de Firebase, para TODOS
//         los targets (evita repetir este fix cada vez que aparece un target
//         nuevo con el mismo problema). NO usar use_frameworks! para esto
//         (rompe op-sqlite, ver Fix 5) — este fix es aditivo y no toca linkage.
//
// Fix 8: Fix 7 no alcanzó — el log de Xcode confirmó que 'Copy generated
//         compatibility header' corre para FirebaseCrashlytics/FirebaseFirestore
//         (ambos son dependencia CocoaPods directa de sus wrappers RNFB) pero NO
//         para FirebaseAuth antes de que RNFBStorage compile. Causa real: el
//         podspec de FirebaseStorage depende de FirebaseAuthInterop (protocolo),
//         NO de FirebaseAuth (implementación) — Xcode no tiene ningún target
//         dependency real entre RNFBStorage y FirebaseAuth, aunque RNFBStorage
//         importe FirebaseAuth-Swift.h indirectamente vía el umbrella Firebase.h.
//         Sin esa dependency, no hay garantía de orden de build: es carrera,
//         no problema de search path (el header puede no existir aún cuando
//         RNFBStorage compila). Forzamos la dependencia explícita en Xcode para
//         que cualquier target RNFB* espere a que FirebaseAuth termine de generar
//         su header antes de compilar.
//
// Fix 9: Fix 8 no garantiza el problema de raíz — el target que falla "se mueve"
//         entre builds (antes RNFBStorage, ahora RNFBApp), señal de que es una
//         carrera de scheduling de Xcode, no algo resuelto de forma determinística.
//         Causa raíz real: RNFBApp/RNFBStorage/RNFBCrashlytics/RNFBDatabase/
//         RNFBFirestore/RNFBMessaging importan <Firebase/Firebase.h> (umbrella),
//         que incluye FirebaseAuth-Swift.h porque @react-native-firebase/auth
//         está instalado — pero NINGUNO de esos podspecs declara 'FirebaseAuth'
//         como dependencia CocoaPods real (solo RNFBAuth la declara, vía
//         'Firebase/Auth'). Sin esa dependencia declarada, CocoaPods no genera
//         el grafo de build correcto (ni search paths ni target dependency
//         reales) — por eso Crashlytics/Firestore "funcionan" ahora mismo: es
//         suerte de scheduling (targets grandes, terminan compilando después),
//         no una garantía. RNFBCrashlytics y RNFBMessaging YA tienen precedente
//         de este mismo patrón: agregan 'FirebaseCoreExtension' a mano en su
//         podspec por el mismo motivo. Replicamos exactamente eso: parcheamos
//         los podspecs en node_modules (mismo mecanismo que Fix 2) para agregar
//         's.dependency FirebaseAuth' explícito — así CocoaPods arma el grafo
//         de dependencias/search paths correctamente, sin depender de suerte.

const GRPC_FIX_MARKER = "# gRPC-Core / Firebase sub-pods version fix";
const POST_INSTALL_MARKER = "# Fix FirebaseAuth DEFINES_MODULE";
const HEADER_SEARCH_MARKER = "# Fix HEADER_SEARCH_PATHS para -Swift.h generados de Firebase";
const BUILD_ORDER_MARKER = "# Fix build order RNFB* -> FirebaseAuth (target dependency explícita)";

module.exports = function withGrpcFix(config) {
  return withDangerousMod(config, [
    "ios",
    (mod) => {
      // --- Fix 2: parchear podspec de VisionCameraFaceDetector ---
      const podspecPath = path.join(
        mod.modRequest.projectRoot,
        "node_modules/react-native-vision-camera-face-detector/VisionCameraFaceDetector.podspec"
      );

      if (fs.existsSync(podspecPath)) {
        let podspec = fs.readFileSync(podspecPath, "utf8");
        if (podspec.includes('GoogleMLKit/FaceDetection')) {
          podspec = podspec.replace(
            's.dependency "GoogleMLKit/FaceDetection"',
            's.dependency "MLKitFaceDetection", "~> 6.0"'
          );
          fs.writeFileSync(podspecPath, podspec);
        }
      }

      // --- Fix 9: agregar 'FirebaseAuth' como dependencia CocoaPods real en los
      // podspecs de RNFB que importan <Firebase/Firebase.h> pero no la declaran ---
      const rnfbPodspecs = [
        "app/RNFBApp.podspec",
        "crashlytics/RNFBCrashlytics.podspec",
        "database/RNFBDatabase.podspec",
        "firestore/RNFBFirestore.podspec",
        "messaging/RNFBMessaging.podspec",
        "storage/RNFBStorage.podspec",
      ];
      rnfbPodspecs.forEach((relPath) => {
        const rnfbPodspecPath = path.join(
          mod.modRequest.projectRoot,
          "node_modules/@react-native-firebase",
          relPath
        );
        if (fs.existsSync(rnfbPodspecPath)) {
          let rnfbPodspec = fs.readFileSync(rnfbPodspecPath, "utf8");
          if (!/s\.dependency\s+'FirebaseAuth'/.test(rnfbPodspec)) {
            rnfbPodspec = rnfbPodspec.replace(
              /(s\.dependency\s+'Firebase\/[^']+'.*\n)/,
              `$1  s.dependency          'FirebaseAuth'\n`
            );
            fs.writeFileSync(rnfbPodspecPath, rnfbPodspec);
          }
        }
      });

      // --- Asegurar que use_frameworks NO esté activado (revertir si fue seteado) ---
      const podfilePropertiesPath = path.join(
        mod.modRequest.platformProjectRoot,
        "Podfile.properties.json"
      );
      if (fs.existsSync(podfilePropertiesPath)) {
        const props = JSON.parse(fs.readFileSync(podfilePropertiesPath, "utf8"));
        delete props["ios.useFrameworks"];
        fs.writeFileSync(podfilePropertiesPath, JSON.stringify(props, null, 2));
      }

      // --- Fix 1 + 3 + 4 + 5: parchear Podfile ---
      const podfilePath = path.join(mod.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf8");

      // Fix 4: deployment target 16.0 para MLKitFaceDetection 6.x
      contents = contents.replace(
        /platform :ios, podfile_properties\['ios\.deploymentTarget'\] \|\| '[^']+'/,
        "platform :ios, '16.0'"
      );

      // Fix 1 + 3: pods explícitos dentro del target
      if (!contents.includes(GRPC_FIX_MARKER)) {
        const pods = [
          "  # gRPC-Core pre-release — declarar explícitamente para forzar instalación",
          "  pod 'gRPC-Core', '1.65.5'",
          "  pod 'gRPC-C++', '1.65.5'",
          "",
          "  # Firebase ObjC pods: pinar versión + modular_headers para Swift interop.",
          "  # NO usar use_modular_headers! global — rompe gRPC-Core module maps.",
          "  pod 'FirebaseInstallations', '~> 11.8.0', :modular_headers => true",
          "  pod 'FirebaseSessions', '~> 11.8.0', :modular_headers => true",
          "  pod 'FirebaseCoreExtension', '~> 11.8.0', :modular_headers => true",
          "  pod 'FirebaseAuth', :modular_headers => true",
          "  pod 'FirebaseCore', :modular_headers => true",
          "  pod 'FirebaseCoreInternal', :modular_headers => true",
          "  pod 'FirebaseFirestoreInternal', :modular_headers => true",
          "  pod 'FirebaseAuthInterop', :modular_headers => true",
          "  pod 'FirebaseAppCheckInterop', :modular_headers => true",
          "  pod 'GoogleUtilities', :modular_headers => true",
          "  pod 'GoogleDataTransport', :modular_headers => true",
          "  pod 'RecaptchaInterop', :modular_headers => true",
          "  pod 'leveldb-library', :modular_headers => true",
          "  pod 'nanopb', :modular_headers => true",
        ].join("\n");

        contents = contents.replace(
          "\n  post_install do |installer|",
          `\n  ${GRPC_FIX_MARKER}\n${pods}\n\n  post_install do |installer|`
        );
      }

      // Fix 5: DEFINES_MODULE = YES para FirebaseAuth dentro del post_install
      // Insertamos antes de installer.target_installation_results (siempre presente)
      if (!contents.includes(POST_INSTALL_MARKER)) {
        const firebaseAuthFix = [
          `    ${POST_INSTALL_MARKER}`,
          "    installer.pods_project.targets.each do |target|",
          "      if target.name == 'FirebaseAuth'",
          "        target.build_configurations.each do |cfg|",
          "          cfg.build_settings['DEFINES_MODULE'] = 'YES'",
          "        end",
          "      end",
          "    end",
          "",
        ].join("\n");

        contents = contents.replace(
          "\n    installer.target_installation_results",
          `\n${firebaseAuthFix}    installer.target_installation_results`
        );
      }

      // Fix 7: HEADER_SEARCH_PATHS para que cualquier target encuentre los
      // -Swift.h generados por los pods Swift de Firebase (DEFINES_MODULE=YES
      // solo genera el header dentro del build product del pod que lo genera;
      // CocoaPods no lo copia a Headers/Public porque no existe hasta compile-time).
      if (!contents.includes(HEADER_SEARCH_MARKER)) {
        const headerSearchFix = [
          `    ${HEADER_SEARCH_MARKER}`,
          "    firebase_swift_pods = %w[",
          "      FirebaseAuth FirebaseCoreInternal FirebaseCrashlytics",
          "      FirebaseDatabase FirebaseFirestore FirebaseSessions FirebaseStorage",
          "    ]",
          "    installer.pods_project.targets.each do |target|",
          "      target.build_configurations.each do |cfg|",
          "        cfg.build_settings['HEADER_SEARCH_PATHS'] ||= ['$(inherited)']",
          "        firebase_swift_pods.each do |pod_name|",
          "          cfg.build_settings['HEADER_SEARCH_PATHS'] << \"\\\"${PODS_CONFIGURATION_BUILD_DIR}/#{pod_name}\\\"\"",
          "        end",
          "      end",
          "    end",
          "",
        ].join("\n");

        contents = contents.replace(
          "\n    installer.target_installation_results",
          `\n${headerSearchFix}    installer.target_installation_results`
        );
      }

      // Fix 8: forzar target dependency RNFB* -> FirebaseAuth para garantizar
      // orden de build (ver comentario Fix 8 arriba).
      if (!contents.includes(BUILD_ORDER_MARKER)) {
        const buildOrderFix = [
          `    ${BUILD_ORDER_MARKER}`,
          "    firebase_auth_target = installer.pods_project.targets.find { |t| t.name == 'FirebaseAuth' }",
          "    if firebase_auth_target",
          "      installer.pods_project.targets.each do |target|",
          "        if target.name.start_with?('RNFB') && target.name != 'FirebaseAuth'",
          "          target.add_dependency(firebase_auth_target)",
          "        end",
          "      end",
          "    end",
          "",
        ].join("\n");

        contents = contents.replace(
          "\n    installer.target_installation_results",
          `\n${buildOrderFix}    installer.target_installation_results`
        );
      }

      fs.writeFileSync(podfilePath, contents);

      return mod;
    },
  ]);
};
