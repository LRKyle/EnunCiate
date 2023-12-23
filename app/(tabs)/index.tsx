import React, {useState} from 'react'
import {Input} from '@ui-kitten/components';
import { StyleSheet, TextInput} from 'react-native';

import { Text, View } from '../../components/Themed';

export default function TabOneScreen() {
  const [value, setValue] = React.useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Language Learning</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
      <Input style ={styles.input} placeholder = 'Enter a word' value={value} onChangeText={nextValue => setValue(nextValue)}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  input: {
    fontSize: 15,
    fontStyle: 'italic',
    color: 'white',
    width: '50%',
    //textAlign: 'center',
    borderColor: 'white',
    borderWidth: 1,  // Obv
    borderHeight: 5, // Obv
    borderRadius: 5, //Controls how round the corners
    paddingTop: 10,
    paddingBottom: 10, //Padding = The space away from the input
    paddingLeft: 10, //Can't explain fr
  },

  separator: {
    marginVertical: 30,
    height: 1,
    width: '50%',
  },
});
