import React, {useState, Component} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'
import {Search} from './screens/Search'
import {Analyze} from './screens/Analyze'

const Stack = createNativeStackNavigator();
export default function App() {  
  return(
    <NavigationContainer> 
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home" component={Search}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/*constructor(props){
   super(props);
   this.state = {
      curPage: "Home"
   };
 }

 setPage = (nextPage) => {
   this.setState({curPage: nextPage});
 }

  render(){  
    const {curPage} = this.state; 
    switch (curPage) {
      case "Home":
        return <Search getPage={this.setPage} setPage={curPage}/>
      case "Analyze":
        console.log("Yo?")
        return <Analyze getPage={this.setPage} setPage={curPage}/>
    }


  }*/