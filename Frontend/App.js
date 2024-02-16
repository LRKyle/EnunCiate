import React from 'react'
import * as eva from '@eva-design/eva'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer'
import {NavigationContainer} from '@react-navigation/native'
import {ApplicationProvider, Layout, Text, Divider, Icon, IconElement} from '@ui-kitten/components'
//Screens Imports
import {Search} from './screens/Search'
import {Analyze} from './screens/Analyze'
import {Login} from './screens/Login'
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();


function CustomDrawerContent(props) {
  //Assuming we are not logged in, show a screen that prompts the user to login, else shows a list of previously used words
  //When you are in the Analyze screen, it shows the history of scores analyzed //justifyContent: 'center', 
  //Figure out a way to recieve the data from Analyze.js 
  //Note: Drawer updates everytime it is opened
  return (
    <>
      <ApplicationProvider {...eva} theme = {eva.dark}>
        <Layout style={{flex: 1, alignItems: 'center'}}> 
        <Text style={{marginTop: '15%', textAlign:'center'}} category='h3'>Assessment {'\n'} History</Text>
        <Divider style= {{backgroundColor: '#00E096', width: '85%', height: 1, marginTop: 10, marginBottom: 10}}/>
        <Text>Hi Squidward</Text>
        <Icon
          style={{width: 32, height: 32,}}
          fill='#00E096'
          name='star'
          onPress={() => props.navigation.navigate('Search')}
        />

        <Icon
          style={{width: 32, height: 32,}}
          fill='#00E096'
          name='star-outline'
          onPress={() => props.navigation.navigate('Analyze')}
        />        
        </Layout>
        <Layout style={{flex: 1, alignItems: 'flex-end', justifyContent:'flex-end'}}>
          <Layout style={{flexDirection:'row', marginBottom: '20%', marginRight: '10%'}}>
            <Icon
              style={{width: 32, height: 32,}}
              fill='#00E096'
              name='log-in'
              onPress={() => props.navigation.navigate('Login')}
            />
          </Layout>
        </Layout>
      </ApplicationProvider>
    </>
  );
}

export default function App() {  
  return(
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="Search" component={Search} options={{title: "", headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'}, headerTintColor: 'white', animation: 'none',}}/>
        <Stack.Screen name="Login" component={Login} options={{title: "", headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'},  headerTintColor: 'white', animation: 'none'}} />
        <Stack.Screen name="Analyze" component={Analyze}  initialParams={{searchVal: "Placeholder", langVal: "Placeholder"}} options={{headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'},  headerTintColor: 'white', animation: 'none'}}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
