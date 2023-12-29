import React from 'react'
import * as eva from '@eva-design/eva'
import {ApplicationProvider} from '@ui-kitten/components'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'

import { Search } from './screens/Search'
import { Analyze } from './screens/Analyze'


const Stack = createNativeStackNavigator

export default function App() {
  return (
    <Search/>
  );
}

