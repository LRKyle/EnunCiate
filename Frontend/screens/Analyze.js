import React, {useState, useEffect}from 'react'
import * as eva from '@eva-design/eva'
import {StyleSheet, View} from 'react-native'
import {useIsFocused} from '@react-navigation/native'
import {ApplicationProvider, Card, Layout, Text, Divider, Spinner} from '@ui-kitten/components'
import ky from 'ky'
import {VictoryPie, VictoryAnimation, VictoryLabel} from "victory-native";
import {prevData} from '../App'

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
};

export const Analyze = ({route}) => {
  const {searchVal, langVal} = route.params
  const [backData, setBackData] = useState([{}]);

  const [isCardClicked, setIsCardClicked] = useState(false)

  const [pronunColor, setPronunColor] = useState('#cc0032')
  const [compColor, setCompColor] = useState('#167d61')
  const [fluencyColor, setFluencyColor] = useState('#16A085')
  const [prosodyColor, setProsodyColor] = useState('#08b683')

  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [mistakesArr, setMistakesArr] = useState([]);
  const [accuracyArr, setAccuracyArr] = useState([]);
  const [errArr, setErrArr] = useState([])

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
    ky.get(process.env.REACT_APP_API_URL)
    .then((response) => response.json())
    .then((data) => {
      setBackData(data)
      setMistakesArr(data['errDetails']['mistakes'])
      for (var i = 0; i < data['errDetails']['accuracyScore'].length; i++) {if (data['errDetails']['accuracyScore'][i] == undefined) {data['errDetails']['accuracyScore'][i] = 0}}
      setAccuracyArr(data['errDetails']['accuracyScore'])
      setErrArr(data['errDetails']['errorType'])
      if (!prevData.includes([data, searchVal]) && [data, searchVal] == []) {prevData.push([data, searchVal])}
      //console.log([data, searchVal])
      //prevData.push([data, searchVal])
    })
    .catch((error)=> {
      console.error(error, "sda sdasd a")
    })
    }
  }, [isFocused]);


  useEffect(() => {
    if (Math.round(backData['Pronunciation Score']) <= 30) {setPronunColor("#7a001e");} //Red
    else if (Math.round(backData['Pronunciation Score']) <= 50) {setPronunColor("#d93b18");} //Yellow
    else {setPronunColor("#317256");} //Green

    if (Math.round(backData['Completeness Score']) <= 30) {setCompColor("#8a0022");}
    else if (Math.round(backData['Completeness Score']) <= 50) {setCompColor("#f26513");}
    else {setCompColor("#398564");}

    if (Math.round(backData['Fluency Score']) <= 30) {setFluencyColor("#aa002a");}
    else if (Math.round(backData['Fluency Score']) <= 50) {setFluencyColor("#f28f16");}
    else {setFluencyColor("#419873");}

    if (Math.round(backData['Prosody Score']) <= 30) {setProsodyColor("#bb002e");}
    else if (Math.round(backData['Prosody Score']) <= 50) {setProsodyColor("#f2b035");}
    else {setProsodyColor("#49ab81");}

  }, []);      


  function highlightMistakes(sentence, mistakes) {
    sentence = sentence.toLowerCase();//The problem is that the cases aren't matching up so Omissions fall through the cracks
    checkMistakes = mistakes.map((word) => word.toLowerCase());
    return sentence.split(' ').map((word, index) => {
      if (checkMistakes.includes(word)) {
        if (index == 0) {word = word[0].toUpperCase() + word.slice(1)}
        return (
          <Text key={index} style={{color: 'red'}} category='h6' onPress={() => {setSelectedWord(word); setSelectedIndex(index); setIsCardClicked(false)}}>
            {word} 
            <Text style={{fontSize: 11, lineHeight: 24}}>{accuracyArr[index] + " "}</Text>
          </Text>
        );
      } 
      else {
        if (index == 0) {word = word[0].toUpperCase() + word.slice(1)}
        return (
        <Text key={index} category='h6'>
          {word} 
          <Text style={{fontSize: 11, lineHeight: 24}}>{accuracyArr[index] + " "}</Text>
        </Text>
        );
      }
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

  const headerPS = (props) => (<Text {...props} style={{backgroundColor: pronunColor, textAlign:'center'}}>{backData['Pronunciation Score']}</Text>);
  const headerCS = (props) => (<Text {...props} style={{backgroundColor: compColor, textAlign:'center'}}>{backData['Completeness Score']}</Text>);
  const headerFS = (props) => (<Text {...props} style={{backgroundColor: fluencyColor, textAlign:'center'}}>{backData['Fluency Score']}</Text>);
  const headerProS= (props) => (<Text {...props} style={{backgroundColor: prosodyColor, textAlign:'center'}}>{backData['Prosody Score']}</Text>);      

  return (
    <>
      <ApplicationProvider {...eva} theme={eva.dark}>
        <Layout style={styles.container}>
            <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)', marginHorizontal: '37.3%'}}>
              
              <VictoryPie
                data={pronunciationScore}
                VictoryAnimation={VictoryAnimation}
                innerRadius={90}
                cornerRadius={3}
                colorScale={[pronunColor, '#ecf0f1']}
                width={300}
                height={300}
                padding={30}
                labels={() => null}
                
              />
            </Layout> 
            <Layout style={{position: 'absolute',  backgroundColor: 'rgba(0, 0, 0, 0)', marginTop: '5%', marginHorizontal: '40%'}}> 
              <VictoryPie
                data={completenessScore}
                innerRadius={80}
                cornerRadius={2}
                colorScale={[compColor, '#ecf0f1']}
                width={260}
                height={260}
                padding={30}
                labels={() => null}
              />
            </Layout>
            <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)', marginTop: '10%', marginHorizontal: '43.3%'}}>
              <VictoryPie
                data={fluencyScore}
                innerRadius={60}
                cornerRadius={2}
                colorScale={[fluencyColor, '#ecf0f1']}
                width={220}
                height={220}
                padding={30}
                labels={() => null}
              />
            </Layout>
            <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)', marginTop: '18.8%', marginHorizontal: '49.5%'}}>
              <VictoryPie
                data={prosodyScore}
                innerRadius={60}
                cornerRadius={2}
                colorScale={[prosodyColor, '#ecf0f1']}
                width={150}
                height={150}
                padding={30}
                labels={() => null}
              />
              
            </Layout>
            <Layout style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
              <Text style={{marginTop: '42%',  marginLeft: '66%'}} category='h1'>{backData['Overall Accuracy Score']}</Text>
            </Layout>
            
            <Layout style={{marginRight: '64%'}}>
              <Card style={styles.card} header={headerPS}><Text style={{fontSize: 12, textAlign: 'center'}}>Pronunciation</Text></Card>
              <Card style={styles.card} header={headerCS}><Text style={{fontSize: 12, textAlign: 'center'}}>Completeness</Text></Card>
              <Card style={styles.card} header={headerFS}><Text style={{fontSize: 12, textAlign: 'center'}}>Fluency</Text></Card>
              <Card style={styles.card} header={headerProS}><Text style={{fontSize: 12, textAlign: 'center'}}>Prosody</Text></Card>
            </Layout>

            <Layout style={{flexDirection:'row', alignItems:'center'}}>
              
              <Layout><Card style={{width: 15, height: 15, backgroundColor: '#49ab81'}}></Card></Layout>
              <Text style={{marginRight: '8%'}}>100 ~ 61 </Text>
              <Layout><Card style={{width: 15, height: 15, backgroundColor: '#f2b035'}}></Card></Layout>
              <Text style={{marginRight: '8%'}}>60 ~ 31 </Text>
              <Layout><Card style={{width: 15, height: 15, backgroundColor: '#bb002e'}}></Card></Layout>
              <Text>30 ~ 0 </Text>
            </Layout>
            <Layout style={{marginBottom: '3%'}}><Text category='h2'>Sentence Evaluation</Text></Layout>
            <Layout>    
              <Text>{highlightMistakes(searchVal, mistakesArr)}</Text>
              
              {selectedWord && !isCardClicked && (
                <Card onPress={() => setIsCardClicked(true)}>
                  <Text category='h6'>{selectedWord[0].toUpperCase() + selectedWord.slice(1)}</Text>
                  <Divider/> 
                  <Text>{errArr[selectedIndex]}</Text>
                  <Text category='s1'>Accuracy Score: {accuracyArr[selectedIndex]}</Text>
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
      alignItems: 'flex-start',
      justifyContent:'flex-start', 
      backgroundColor: 'rgba(0, 0, 0, 0)', 
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
      width: 130,
      height: 70,
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