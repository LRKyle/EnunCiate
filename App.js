import React, {useState} from 'react'
import * as eva from '@eva-design/eva'
import {StyleSheet} from 'react-native'
import {ApplicationProvider, Input, Layout, Text, Select, SelectItem} from '@ui-kitten/components'

const data = [
  { text: 'Option 1' },
  { text: 'Option 2' },
  { text: 'Option 3' },
];

export default function App() {
  const [value, setValue] = React.useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const onSelect = (index) => {
    setSelectedIndex(index);
  };
  

  return (
    <ApplicationProvider {...eva} theme = {eva.dark}>
      <Layout style={styles.container}>
        <Layout style={{flexDirection:'row'}}>
        <Input style ={styles.input} placeholder = 'Enter a word' value={value} onChangeText={nextValue => setValue(nextValue)}/> 
        <Select
        selectedIndex={selectedIndex}
        onSelect={onSelect}
        value={selectedIndex ? data[selectedIndex.row].text : 'Select Option'}
        >
        {data.map((item, index) => (
          <SelectItem key={index} title={item.text} />
        ))}
        </Select>
        </Layout>
        <Text>Lois</Text>
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
