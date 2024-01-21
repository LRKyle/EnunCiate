import React, {useState, useEffect}from 'react'
import * as eva from '@eva-design/eva'
import {StyleSheet, View} from 'react-native'
import {ApplicationProvider, Layout, Text} from '@ui-kitten/components'
import axios from 'axios';
import {VictoryPie, VictoryAnimation, VictoryLabel} from "victory-native";

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
};

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
  }, []);

  const pronunciationScore = [
    { x: 0, y: Math.round(backData['Pronunciation Score'])},//0
    { x: 1, y: 100 - Math.round(backData['Pronunciation Score'])},//1
  ]
  const completenessScore = [
    { x: 1, y: Math.round(backData['Completeness Score'])},
    { x: 2, y: 100 - Math.round(backData['Completeness Score'])},
  ];
  const fluencyScore = [
    { x: 1, y: Math.round(backData['Fluency Score'])},
    { x: 2, y: 100 - Math.round(backData['Fluency Score'])},
  ];
  const prosodyScore = [
    { x: 1, y: Math.round(backData['Prosody Score'])},
    { x: 2, y: 100 - Math.round(backData['Prosody Score'])},
  ];

  return (
    <>
      <ApplicationProvider {...eva} theme={eva.dark}>
        <Layout style={styles.container}>
          <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            <VictoryPie
              data={pronunciationScore}
              animate={{ duration: 1000 }}
              innerRadius={90}
              cornerRadius={3}
              colorScale={['red', '#ecf0f1']}
              width={300}
              height={300}
              padding={30}
            />
          </Layout>  
          <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            <VictoryPie
              data={completenessScore}
              animate={{ duration: 1000 }}
              innerRadius={80}
              cornerRadius={2}
              colorScale={['blue', '#ecf0f1']}
              width={260}
              height={260}
              padding={30}
            />
          </Layout>
          <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            <VictoryPie
              data={fluencyScore}
              animate={{ duration: 1000 }}
              innerRadius={60}
              cornerRadius={2}
              colorScale={['yellow', '#ecf0f1']}
              width={220}
              height={220}
              padding={30}
            />
          </Layout>
          <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            <VictoryPie
              data={prosodyScore}
              animate={{ duration: 1000 }}
              innerRadius={60}
              cornerRadius={2}
              colorScale={['green', '#ecf0f1']}
              width={150}
              height={150}
              padding={30}
            />
          </Layout>
          <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            <Text category='h1'>{backData['Overall Accuracy Score']}</Text>
          </Layout>
        </Layout>
      </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
});
//'#4658db'
//backData["Overall Accuracy Score"]