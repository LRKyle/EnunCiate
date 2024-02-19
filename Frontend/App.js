import React from 'react'
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
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

export var prevData = []//[["place", 'holder'], ['once', 'again']]

function listPrevData() {
  //console.log(prevData)
  return prevData.map((item, index) => (
    <Card key={index} style={{width: '85%', marginTop: 5, marginBottom: 5, marginLeft: 15,}} onPress={navigateToAnalyze(item, index)}>
      {console.log(item[1])}
      <Text style={{color: 'white'}} category='h4'>{item[1].charAt(0).toUpperCase() + item[1].slice(1)}</Text>
      <Divider style= {{backgroundColor: '#00E096', height: 1, marginTop: 10, marginBottom: 10}}/>
      <Text>Pronunciation Score: {item[0]['Pronunciation Score']}</Text>
      <Text>Completeness Score: {item[0]['Completeness Score']}</Text>
      <Text>Fluency Score: {item[0]['Fluency Score']}</Text>
      <Text>Prosody Score: {item[0]['Prosody Score']}</Text>
      {console.log(item[0], "is here")}
    </Card>
  ));
}


function CustomDrawerContent(props) {
  //Assuming we are not logged in, show a screen that prompts the user to login, else shows a list of previously used words
  //When you are in the Analyze screen, it shows the history of scores analyzed //justifyContent: 'center', 
  //Note: Drawer updates everytime it is opened
  //Have more args in the function to pass the data the prevData and use the prevData to display the history and use the prev arg to show if you use new data or the prevData
  //It might be better to just modify prevData so works in the place of prev arg

  function navigateToAnalyze(item, index) {
    props.navigation.navigate('Analyze', {searchVal: item[1], langVal: "Placeholder", prev: index, prevHolder: item[0]})
  }
  return (
    <>
      <ApplicationProvider {...eva} theme = {eva.dark}>
        <Layout style={{alignItems: 'center'}}> 
        <Text style={{marginTop: '15%', textAlign:'center'}} category='h3'>Assessment {'\n'} History</Text>
        <Divider style= {{backgroundColor: '#00E096', width: '85%', height: 1, marginTop: 10, marginBottom: 10}}/>
        <Text>Hi Squidward</Text>
        <Icon
          style={{width: 32, height: 32,}}
          fill='#00E096'
          name='star'
          onPress={() => props.navigation.goBack()}
        />     
        <Icon
          style={{width: 32, height: 32,}}
          fill='#00E096'
          name='star'
          onPress={() => props.navigation.navigate('Analyze', {searchVal: prevData[0][1], langVal: "Placeholder", prev: -1, prevHolder: prevData[0][0]})}
        />     
        <ScrollView style={{width: '90%', height: '65%', alignContent: 'center'}}>{listPrevData()}</ScrollView>
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
        <Stack.Screen name="Search" component={Search} options={{title: "", headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'}, headerTintColor: 'white', animation: 'none',}}/>
        <Stack.Screen name="Login" component={Login} options={{title: "", headerStyle: {backgroundColor: '#1b2137'}, headerTitleStyle: {color: 'white'},  headerTintColor: 'white', animation: 'none'}} />
        <Stack.Screen name="Analyze" component={Analyze}  initialParams={{searchVal: "Placeholder", langVal: "Placeholder", prev: -1, prevHolder: []}} options={({ navigation }) => ({ headerStyle: {backgroundColor: '#1b2137'}, title: "Results",  headerTitleStyle: {color: 'white'}, headerTintColor: 'white', animation: 'none', headerRight: () => (<Button onPress={() => navigation.goBack()} title="Go to Search" color="black"/>),})}/> 
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
