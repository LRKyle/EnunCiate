import React, {useState} from 'react'
import * as eva from '@eva-design/eva'
import {StyleSheet} from 'react-native'
import {Link} from 'expo-router'
import {ApplicationProvider, Input, Layout, Text, Select, SelectItem, Divider,Button} from '@ui-kitten/components'

const data = [
  { text: 'EN' },
  { text: 'FR' },
  { text: 'RUS' },
];

export default function App() {
  const [value, setValue] = React.useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedValue, setSelectedValue] = useState('Select A Language');

  const onSelect = (index) => {
    setSelectedIndex(index);
    setSelectedValue(data[index.row].text);
  };

  return (
    <ApplicationProvider {...eva} theme = {eva.dark}>
        <Layout style={styles.container}>
          <Layout>
            <Text category='h1'>Language Learning</Text>
            <Text style={{textAlign: 'center'}}>Voice Analyzer{"\n"}</Text>
            <Divider style = {styles.test}/>
          </Layout>
          <Layout style={styles.row}>
            <Input style ={styles.input} placeholder = 'Enter a word' value={value} onChangeText={nextValue => setValue(nextValue)}/> 
            <Select
              style = {{width: '30%'}}
              selectedIndex={selectedIndex}
              onSelect={onSelect}
              value={selectedValue}>
            {data.map((item, index) => (<SelectItem key={index} title={item.text}/>))}
            </Select>
          </Layout>
          <Button style={{marginTop: 5}} status='success' appearance='outline'><Link href='/App' isReady>Analyze your pronunciation!</Link></Button>
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

  row:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  
  input: {
    fontSize: 15,
    fontStyle: 'italic',
    color: 'black',
    width: '50%',
    //textAlign: 'center',
    borderColor: 'black',
    borderWidth: 1,  // Obv
    borderHeight: 5, // Obv
    borderRadius: 10, //Controls how round the corners
    paddingTop: 10,
    paddingBottom: 10, //Padding = The space away from the input
    paddingLeft: 10,
  },
});
