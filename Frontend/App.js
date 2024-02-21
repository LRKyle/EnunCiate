import React, {useEffect, useState} from 'react'
import {Button, ScrollView} from 'react-native'
import * as eva from '@eva-design/eva'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {NavigationContainer} from '@react-navigation/native'
import {ApplicationProvider, Layout, Text, Divider, Icon, Card} from '@ui-kitten/components'

//Screens Imports
import {Search} from './screens/Search'
import {Analyze} from './screens/Analyze'
import {Login} from './screens/Login'
import {FIREBASE_AUTH} from './firebase'
import { set } from 'lodash'
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export var prevData = [["place", 'holder'], ['once1', 'again2'], ['once3', 'again4'], ['once5', 'again6'], ['once7', 'again8'], ['once9', 'again10']]
var userState = false

function listPrevData(props) {
  //console.log(prevData)
  if (prevData.length == 0) {return <Card style={{width: '85%', marginTop: 5, marginBottom: 5, marginLeft: 15,}}><Text category='h4'>No previous data</Text></Card>}
  if (prevData.length > 5) {prevData.pop();}
  return prevData.map((item, index) => (
    <Card key={index} style={{width: '85%', marginTop: 5, marginBottom: 5, marginLeft: 15,}} onPress={() => props.navigation.navigate('Analyze', {searchVal: item[1], langVal: "Placeholder", prev: index})}>
      <Text style={{color: 'white'}} category='h4'>{item[1].charAt(0).toUpperCase() + item[1].slice(1)}</Text>
      <Divider style= {{backgroundColor: '#00E096', height: 1, marginTop: 10, marginBottom: 10}}/>
      <Text>Pronunciation Score: {item[0]['Pronunciation Score']}</Text>
      <Text>Completeness Score: {item[0]['Completeness Score']}</Text>
      <Text>Fluency Score: {item[0]['Fluency Score']}</Text>
      <Text>Prosody Score: {item[0]['Prosody Score']}</Text>
    </Card>
  ));
}

const signOut = async () => {
  FIREBASE_AUTH.signOut()
  .then(() => {
    console.log('User signed out!');
  })
  .catch((error) => {
    console.error('Error signing out: ', error);
  });

}


function CustomDrawerContent(props) {
  const {state} = props;
  const currentScreen = state.routes[state.index].name;
  let icon = 'log-in';
  if (currentScreen == 'Login') {icon = 'home-outline'}
  else if (userState) {icon = 'log-out'} 
  else {icon = 'log-in'}  

  return (
    <>
      <ApplicationProvider {...eva} theme = {eva.dark}>
        <Layout style={{alignItems: 'center'}}> 
        <Text style={{marginTop: '15%', textAlign:'center'}} category='h3'>Assessment {'\n'} History</Text>
        <Divider style= {{backgroundColor: '#00E096', width: '85%', height: 1, marginTop: 10, marginBottom: 10}}/>
        <ScrollView style={{width: '90%', height: '65%', alignContent: 'center'}}>{listPrevData(props)}</ScrollView>
        </Layout>
        <Layout style={{flex: 1, alignItems: 'flex-end', justifyContent:'flex-end'}}>
          <Layout style={{flexDirection:'row', marginBottom: '20%', marginRight: '10%'}}>
            <Icon
              style={{width: 32, height: 32,}}
              fill='#00E096'
              name={icon}
              onPress={() => {
                if (currentScreen == 'Login') {props.navigation.navigate('Search');}
                else if (userState) {signOut(); console.log('You have been signed out!');} 
                else {props.navigation.navigate('Login');}    
              }}
            />
          </Layout>
        </Layout>
      </ApplicationProvider>
  </>
  ); 
}

export default function App() {  
  useEffect(() => {
    FIREBASE_AUTH.onAuthStateChanged((user) => {
      if (user) {console.log('User is signed in'); userState = true} 
      else {console.log('No user is signed in'); userState = false}
    });
  }, []);
  
  return(
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
        <Stack.Screen name="Search" component={Search} options={{title: "", headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'}, headerTintColor: 'white', animation: 'none',}}/>
        <Stack.Screen name="Login" component={Login} options={{title: "", headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'},  headerTintColor: 'white', animation: 'none'}} />
        <Stack.Screen name="Analyze" component={Analyze}  initialParams={{searchVal: "Placeholder", langVal: "Placeholder", prev: -1}} options={({ navigation }) => ({ headerStyle: {backgroundColor: '#1b2137'}, title: "Results",  headerTitleStyle: {color: 'white'}, headerTintColor: 'white', animation: 'none', headerRight: () => (<Button onPress={() => navigation.goBack()} title="Go to Search" color="black"/>),})}/> 
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
