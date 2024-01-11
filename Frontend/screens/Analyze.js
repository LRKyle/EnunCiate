import React, {useState, useEffect}from 'react'
import * as eva from '@eva-design/eva'
import 'react-native-get-random-values';
import {StyleSheet} from 'react-native'
import {ApplicationProvider, Layout, Button, Text} from '@ui-kitten/components'
import axios from 'axios';

export const Analyze = ({route}) => {
  const {searchVal, langVal} = route.params
  const [backData, setBackData] = React.useState([{}]);

  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL);//Find a way to get the API from the env
    axios.get(process.env.REACT_APP_API_URL) //Use IP instead of localhost
    .then((response) => {
      setBackData(response.data);
      console.log(response.data);
    })
    .catch((error)=> {
      console.error(error, "sda sdasd a")
    })
  },[]);

  

  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
        <Layout style={styles.container}>  
          <Text>{typeof(backData)}</Text>
          <Text>{backData['Completeness Score']}</Text>
          
            
        </Layout>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
});
//backData["Overall Accuracy Score"]