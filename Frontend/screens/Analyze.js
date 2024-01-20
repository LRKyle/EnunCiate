import React, {useState, useEffect}from 'react'
import * as eva from '@eva-design/eva'
import {StyleSheet} from 'react-native'
import {ApplicationProvider, Layout, Text} from '@ui-kitten/components'
import axios from 'axios';
import {ProgressChart} from 'react-native-chart-kit'


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

  const test = {
    labels: ["Completeness Score", "Overall Accuracy Score", "Overall Accuracy Score", "Completeness Score"],
    data: [backData['Completeness Score'], backData['Overall Accuracy Score'], backData['Overall Accuracy Score'], backData['Completeness Score']]
  }

  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
        <Layout style={styles.container}>  
          <Text>{backData['Completeness Score']}</Text>
          <ProgressChart
            data={test}
            width={300}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={{
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`}}
            hideLegend={false}
          />
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