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
        <Stack.Screen name="Search" component={Search}/>
        <Stack.Screen name="Analyze" component={Analyze}  initialParams={{searchVal: "Placeholder", langVal: "Placeholder"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}