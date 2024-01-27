import React, {useState, useEffect}from 'react'
import * as eva from '@eva-design/eva'
import {StyleSheet, View} from 'react-native'
import {ApplicationProvider, Card, Button, Layout, Text, Divider} from '@ui-kitten/components'
import ky from 'ky'
import {VictoryPie, VictoryAnimation, VictoryLabel} from "victory-native";

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
};

export const Analyze = ({route}) => {
  const {searchVal, langVal} = route.params
  const [backData, setBackData] = useState([{}]);

  const [isCardClicked, setIsCardClicked] = useState(false)

  const [selectedWord, setSelectedWord] = useState(null);
  const [backDataMistakes, setBackDataMistakes] = useState([]);
  
  useEffect(() => {
    ky.get(process.env.REACT_APP_API_URL)
    .then((response) => response.json())
    .then((data) => {
      setBackData(data)
      setBackDataMistakes(data['errDetails']['word'])
    })
    .catch((error)=> {
      console.error(error, "sda sdasd a")
    })
  }, []);

  function highlightMistakes(sentence, mistakes) {
    
    sentence = sentence.toLowerCase();//The problem is that the cases aren't matching up so Omissions fall through the cracks
    checkMistakes = mistakes.map((word) => word.toLowerCase());
    return sentence.split(' ').map((word, index) => {
      if (checkMistakes.includes(word)) {
        if (index == 0) {word = word[0].toUpperCase() + word.slice(1)}
        return (
          <Text key={index} style={{color: 'red'}} category='h6' onPress={() => {setSelectedWord(word); setIsCardClicked(false)}}>
            {word + " "} 
          </Text>
        );
      } 
      else {
        if (index == 0) {word = word[0].toUpperCase() + word.slice(1)}
        return <Text key={index} category='h6'>{word + " "}</Text>;}//The formating previously broke the code so if it breaks again, this is the problem, the original format is at the bottom
    });
  }

  const pronunciationScore = [
    { x: 1, y: Math.round(backData['Pronunciation Score'])},//0
    { x: 2, y: 100 - Math.round(backData['Pronunciation Score'])},//1
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

  const headerPS = (props) => (<Text {...props} style={{backgroundColor: '#0E6655', textAlign:'center'}}>{backData['Pronunciation Score']}</Text>);
  const headerCS = (props) => (<Text {...props} style={{backgroundColor: '#167d61', textAlign:'center'}}>{backData['Completeness Score']}</Text>);
  const headerFS = (props) => (<Text {...props} style={{backgroundColor: '#16A085', textAlign:'center'}}>{backData['Fluency Score']}</Text>);
  const headerProS= (props) => (<Text {...props} style={{backgroundColor: '#08b683', textAlign:'center'}}>{backData['Prosody Score']}</Text>);
  
  return (
    <>
      <ApplicationProvider {...eva} theme={eva.dark}>
        <Layout style={styles.container}>
            <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)', }}>
              <VictoryPie
                data={pronunciationScore}
                VictoryAnimation={VictoryAnimation}
                innerRadius={90}
                cornerRadius={3}
                colorScale={['#0E6655', '#ecf0f1']}
                width={300}
                height={300}
                padding={30}
                labels={() => null}
                style={{ data: { strokeWidth: 3 } }}
              />
            </Layout>  
            <Layout style={{position: 'absolute',  backgroundColor: 'rgba(0, 0, 0, 0)', borderWidth: 20, borderColor: 'rgba(0, 0, 0, 0)'}}>
              <VictoryPie
                data={completenessScore}
                innerRadius={80}
                cornerRadius={2}
                colorScale={['#167d61', '#ecf0f1']}
                width={260}
                height={260}
                padding={30}
                labels={() => null}
              />
            </Layout>
            <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)', borderWidth: 40, borderColor: 'rgba(0, 0, 0, 0)'}}>
              <VictoryPie
                data={fluencyScore}
                innerRadius={60}
                cornerRadius={2}
                colorScale={['#16A085', '#ecf0f1']}
                width={220}
                height={220}
                padding={30}
                labels={() => null}
              />
            </Layout>
            <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)', borderWidth: 75, borderColor: 'rgba(0, 0, 0, 0)'}}>
              <VictoryPie
                data={prosodyScore}
                innerRadius={60}
                cornerRadius={2}
                colorScale={['#08b683', '#ecf0f1']}
                width={150}
                height={150}
                padding={30}
                labels={() => null}
              />
            </Layout>
            <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)', borderWidth: 125, borderColor: 'rgba(0, 0, 0, 0)'}}>
              <Text category='h1'>{backData['Overall Accuracy Score']}</Text>
            </Layout>
            
            <Layout style={[styles.resultKeys, {marginTop: '100%'}]}>
              <Card style={styles.card} header={headerPS}><Text style={{textAlign:'center'}}>Pronunciation Score</Text></Card>
              <Card style={styles.card} header={headerCS}><Text style={{textAlign:'center'}}>Completeness Score</Text></Card>
            </Layout>
            <Layout style={[styles.resultKeys, {marginTop: '125%'}]}>
              <Card style={styles.card} header={headerFS}><Text style={{textAlign:'center'}}>Fluency {"\n"} Score</Text></Card>
              <Card style={styles.card} header={headerProS}><Text style={{textAlign:'center'}}>Prosody {"\n"} Score</Text></Card>
            </Layout>

            <Layout style={[styles.sentence, {marginBottom:'10%'}]}>
              <Text>{highlightMistakes(searchVal, backDataMistakes)}</Text>
              {selectedWord && !isCardClicked && (
                <Card style={{}} onPress={() => setIsCardClicked(true)}>
                  <Text category='h6'>{selectedWord[0].toUpperCase() + selectedWord.slice(1)}</Text>
                  <Divider/>
                  <Text>{backData['errDetails']['errorType'][backData['errDetails']['word'].indexOf(selectedWord)]}</Text>
                  <Text category='s1'>Accuracy Score: {backData['errDetails']['accuracyScore'][backData['errDetails']['word'].indexOf(selectedWord)]}</Text>
                </Card>
              )}
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
    },
    resultKeys: {
      flex: 1, 
      alignItems: 'center',
      justifyContent:'center', 
      backgroundColor: 'rgba(0, 0, 0, 0)', 
      flexDirection:'row',
      position: 'absolute',
    },
    sentence: {
      flex: 1, 
      alignItems: 'center',
      justifyContent:'center', 
      backgroundColor: 'rgba(0, 0, 0, 0)', 
    },
    card: {
      margin: 2,
      width: 150,
      height: 90,
      backgroundColor: '#1b2137'
    },
});
//'#4658db'
//backData["Overall Accuracy Score"]
//Instead of borderWidth, you could have used MarginTop and MarginLeft to position the progress bars
//const headerOAS= (props) => (<Text {...props} style={{backgroundColor: 'white', textAlign:'center', color: 'black'}}>{backData['Overall Accuracy Score']}</Text>);
/*else {
  return <Text key={index}>{word} </Text>;
  } */

//{console.log(selectedWord, " || ", backData['errDetails']['errorType'], " || ",  backData['errDetails']['word'].indexOf(selectedWord))}