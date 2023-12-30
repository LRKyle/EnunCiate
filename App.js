import React, {useState, Component} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import {Search} from './screens/Search'
import {Analyze} from './screens/Analyze'

const Stack = createNativeStackNavigator();
export default function App() {  
  return(
    <NavigationContainer> 
      <Stack.Navigator initialRouteName='Search'>
        <Stack.Screen name="Search" component={Search}/>
        <Stack.Screen name="Analyze" component={Analyze}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}