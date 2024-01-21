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

const data = [
  { quarter: 1, earnings: 13000 },
  { quarter: 2, earnings: 16500 },
  { quarter: 3, earnings: 14250 },
  { quarter: 4, earnings: 19000 }
];


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
    { x: undefined, y: backData['Pronunciation Score']},//0
    { x: undefined, y: 100 - backData['Pronunciation Score']},//1
  ]
  const completenessScore = [
    { x: undefined, y: backData['Completeness Score']},
    { x: undefined, y: 100 - backData['Completeness Score']},
  ];
  const fluencyScore = [
    { x: undefined, y: backData['Fluency Score']},
    { x: undefined, y: 100 - backData['Fluency Score']},
  ];
  const prosodyScore = [
    { x: undefined, y: backData['Prosody Score']},
    { x: undefined, y: 100 - backData['Prosody Score']},
  ];

  return (
    <>
      <ApplicationProvider {...eva} theme={eva.dark}>
        <Layout style={styles.container}>
          <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            <VictoryPie
              data={pronunciationScore}
              innerRadius={90}
              colorScale={['red', '#ecf0f1']}
              width={300}
              height={300}
              padding={30}
            />
          </Layout>  
          <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            <VictoryPie
              data={completenessScore}
              innerRadius={80}
              colorScale={['blue', '#ecf0f1']}
              width={260}
              height={260}
              padding={30}
            />
          </Layout>
          <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            <VictoryPie
              data={fluencyScore}
              innerRadius={60}
              colorScale={['yellow', '#ecf0f1']}
              width={220}
              height={220}
              padding={30}
            />
          </Layout>
          <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
            <VictoryPie
              data={prosodyScore}
              innerRadius={60}
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