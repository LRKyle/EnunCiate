import React from 'react'
import * as eva from '@eva-design/eva'
import { StyleSheet} from 'react-native'
import {ApplicationProvider, Input, Layout, Text, Select, SelectItem, IndexPath} from '@ui-kitten/components'

export default function App() {
  const [value, setValue] = React.useState('');
  return (
    <ApplicationProvider {...eva} theme = {eva.dark}>

      <Text>{value}</Text>
      <Layout style={styles.container}>
        <Input style ={styles.input} placeholder = 'Enter a word' value={value} onChangeText={nextValue => setValue(nextValue)}/>
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

  text:{
    color: "red",
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
