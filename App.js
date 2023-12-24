import React from 'react'
import * as eva from '@eva-design/eva'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text} from 'react-native';
import {ApplicationProvider, Input, Layout, Select, SelectItem, IndexPath} from '@ui-kitten/components'

export default function App() {
  const [value, setValue] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState<IndexPath | IndexPath[0]>(new IndexPath(0));
//<StatusBar style="auto" />
  return (
    <ApplicationProvider {...eva} theme = {eva.dark}>
      <Layout style={styles.container}>
        <Input style ={styles.input} placeholder = 'Enter a word' value={value} onChangeText={nextValue => setValue(nextValue)}/>
        <Text>{value}</Text>
        <Select selectedIndex={selectedIndex} onSelect={index => setSelectedIndex(index)}>
          <SelectItem title='Option 1'/>
          <SelectItem title='Option 2'/>
          <SelectItem title='Option 3'/>
        </Select>
      </Layout>
    </ApplicationProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  input: {
    fontSize: 15,
    fontStyle: 'italic',
    color: 'black',
    width: '50%',
    //textAlign: 'center',
    borderColor: 'white',
    borderWidth: 1,  // Obv
    borderHeight: 5, // Obv
    borderRadius: 10, //Controls how round the corners
    paddingTop: 10,
    paddingBottom: 10, //Padding = The space away from the input
    paddingLeft: 10,
  },
});
