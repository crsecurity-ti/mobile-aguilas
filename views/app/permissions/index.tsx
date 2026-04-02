import { FlatList } from 'react-native';

import CameraPermissionContainer from './components/CameraPermissionContainer';
import LocationBackgroundPermissionContainer from "./components/LocationBackgroundPermissionContainer";
import LocationPermissionContainer from "./components/LocationPermissionContainer";
import NotificationPermissionContainer from "./components/NotificationPermissionContainer";

const permissionsData = [
  { key: 'camera', component: CameraPermissionContainer },
  { key: 'location', component: LocationPermissionContainer },
  { key: 'locationBackground', component: LocationBackgroundPermissionContainer },
  { key: 'notification', component: NotificationPermissionContainer },
];

const PermissionsView = () => {
  const renderItem = ({ item }: {
    item: { key: string; component: React.FC };
  }) => {
    const Component = item.component;
    return <Component />;
  };

  return (
    <FlatList
      contentContainerStyle={{ margin: 20, paddingBottom: 30 }}
      data={permissionsData}
      renderItem={renderItem}
      keyExtractor={item => item.key}
    />
  );
};

export default PermissionsView;
