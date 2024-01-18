import React, {useState, useEffect}from 'react'
import * as eva from '@eva-design/eva'
import 'react-native-get-random-values';
import {StyleSheet} from 'react-native'
import {ApplicationProvider, Layout, Button, Text} from '@ui-kitten/components'
import axios from 'axios';

export const Analyze = ({route}) => {
  const {searchVal, langVal} = route.params
  const [backData, setBackData] = useState([{}]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL)
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