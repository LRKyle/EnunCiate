import React from 'react'
import * as eva from '@eva-design/eva'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {NavigationContainer} from '@react-navigation/native'
import {ApplicationProvider, Layout, Text} from '@ui-kitten/components'
//Screens Imports
import {Search} from './screens/Search'
import {Analyze} from './screens/Analyze'
import {Login} from './screens/Login'
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function CustomDrawerContent(props) {
  //Assuming we are not logged in, show a screen that prompts the user to login, else show 
  return (
    <>
      <ApplicationProvider {...eva} theme = {eva.dark}>
        <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Drawer Content</Text>
        <Text>Hi Squidward</Text>
        </Layout>
      </ApplicationProvider>
    </>
  );
}

export default function App() {  
  return(
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Search" component={Search} options={{title: "", headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'}, headerTintColor: 'white', animation: 'none' }}/>
        <Stack.Screen name="Login" component={Login} options={{title: "", headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'},  headerTintColor: 'white', animation: 'none'}} />
        <Stack.Screen name="Analyze" component={Analyze}  initialParams={{searchVal: "Placeholder", langVal: "Placeholder"}} options={{headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'},  headerTintColor: 'white', animation: 'none'}}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
