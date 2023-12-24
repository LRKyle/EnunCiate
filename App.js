import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function App() {
  const [value, setValue] = React.useState('');
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <TextInput style ={styles.input} placeholder = 'Enter a word' value={value} onChangeText={nextValue => setValue(nextValue)}/>
      <StatusBar style="auto" />
      <Text>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 5, //Controls how round the corners
    paddingTop: 10,
    paddingBottom: 10, //Padding = The space away from the input
    paddingLeft: 10, //Can't explain fr
  },
});
