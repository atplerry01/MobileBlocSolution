/* eslint-disable prettier/prettier */
/* eslint-disable react/react-in-jsx-scope */
<<<<<<< HEAD
import {SafeAreaView, Text, View} from 'react-native';
=======
// import {TailwindProvider} from 'tailwindcss-react-native';
>>>>>>> 03d4e8325a3a0310de8b298fbd63e58d644ffc84
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import Patient from './screens/PatientScreen';
import PatientDetail from './screens/PatientDetailScreen';
import Login from './screens/Login';
<<<<<<< HEAD
import Accordion from './screens/Test';
=======
import Nfc from './screens/Nfc';
import TagDetailScreen from './screens/TagDetailScreen';
import WriteNdefScreen from './screens/WriteNdefScreen';
import DeepLinkingScreen from './screens/DeepLinkingScreen';
// import ItemScreen from './screens/ItemScreen';
>>>>>>> 03d4e8325a3a0310de8b298fbd63e58d644ffc84

const Stack = createNativeStackNavigator();

export default function App() {
  return (
<<<<<<< HEAD

      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Patients" component={Patient} />
          <Stack.Screen name="Patient Detail" component={PatientDetail} />
          <Stack.Screen name="Test" component={Accordion} />
        </Stack.Navigator>
      </NavigationContainer>

=======
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Patients" component={Patient} />
        <Stack.Screen name="Patient Detail" component={PatientDetail} />
        <Stack.Screen name="Scan" component={Nfc} />
        <Stack.Screen name="Write" component={WriteNdefScreen} />
        <Stack.Screen name="DeepLinking" component={DeepLinkingScreen} />
        <Stack.Screen name="Tag" component={TagDetailScreen} />

        {/* <Stack.Screen name="Discover" component={Discover} />
          <Stack.Screen name="ItemScreen" component={ItemScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
>>>>>>> 03d4e8325a3a0310de8b298fbd63e58d644ffc84
  );
}
