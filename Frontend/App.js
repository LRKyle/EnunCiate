import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import {Search} from './screens/Search'
import {Analyze} from './screens/Analyze'
import {Login} from './screens/Login'

const Stack = createNativeStackNavigator();
export default function App() {  
  return(
    <NavigationContainer> 
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Search" component={Search} options={{title: "", headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'}, headerTintColor: 'white', animation: 'slide_from_left'}}/>
        <Stack.Screen name="Analyze" component={Analyze}  initialParams={{searchVal: "Placeholder", langVal: "Placeholder"}} options={{headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'},  headerTintColor: 'white', animation: 'none'}}/>
        <Stack.Screen name="Login" component={Login} options={{title: "", headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'},  headerTintColor: 'white', animation: 'none'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}