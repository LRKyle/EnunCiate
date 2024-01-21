import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import {Search} from './screens/Search'
import {Analyze} from './screens/Analyze'

const Stack = createNativeStackNavigator();
export default function App() {  
  return(
    <NavigationContainer> 
      <Stack.Navigator initialRouteName='Analyze'>
        <Stack.Screen name="Search" component={Search} options={{title: "", headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'}, animation: 'slide_from_left'}}/>
        <Stack.Screen name="Analyze" component={Analyze}  initialParams={{searchVal: "Placeholder", langVal: "Placeholder"}} options={{animation: 'none'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}