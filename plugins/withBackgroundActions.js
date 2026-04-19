const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withBackgroundActions(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Asegurarse de que existe la sección application
    if (!androidManifest.manifest.application) {
      androidManifest.manifest.application = [{}];
    }

    const application = androidManifest.manifest.application[0];

    // Asegurarse de que existe la sección service
    if (!application.service) {
      application.service = [];
    }

    // Agregar el servicio de background actions
    const backgroundService = {
      $: {
        'android:name': 'com.asterinet.react.bgactions.RNBackgroundActionsTask',
        'android:foregroundServiceType': 'dataSync',
        'android:exported': 'false',
      },
    };

    // Verificar si el servicio ya existe
    const existingService = application.service.find(
      (service) => service.$['android:name'] === 'com.asterinet.react.bgactions.RNBackgroundActionsTask'
    );

    if (!existingService) {
      application.service.push(backgroundService);
    }

    return config;
  });
};