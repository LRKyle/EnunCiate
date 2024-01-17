import React, {useState} from 'react'
import * as eva from '@eva-design/eva'
import {TouchableWithoutFeedback, StyleSheet} from 'react-native'
import {Audio} from 'expo-av'
import {ApplicationProvider, Input, Layout, Text, Select, SelectItem, Divider, Button, Icon, IconRegistry,} from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import axios from 'axios';
import ky from 'ky'
import * as Sharing from 'expo-sharing'



import * as FileSystem from 'expo-file-system'

const data = [
  { text: 'EN' },
  { text: 'FR' },
  { text: 'RUS' },
];

export const Search = ({navigation}) => {
  const [value, setValue] = useState('');
  const [sound, setSound] = useState(new Audio.Sound());
  const [done, setDone] = useState(false);
  const [recording, setRecording] = useState();
  const [uri, setURI] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedValue, setSelectedValue] = useState(data[0].text);
  
  //micOff / micOn  
  const micOutline = (props) => (<TouchableWithoutFeedback onPress={startRecording}><Icon {...props} fill = {'#8F9BB3'} name='mic-outline'/></TouchableWithoutFeedback>);
  const micFill = (props) => (<TouchableWithoutFeedback onPress={stopRecording}><Icon {...props} style={{ width: '30px', height: '30px' }} fill = {'#f7faff'} name='mic'/></TouchableWithoutFeedback>);

  const onSelect = (index) => {
    setSelectedIndex(index);
    setSelectedValue(data[index.row].text);
  };
  
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish){stopPlayback()}
  });

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log('Starting recording..');
      const recording = new Audio.Recording();

      await recording.startAsync();
      setRecording(recording);
      setDone(false);
      console.log('Recording started');
    } 
    catch (err) {console.error('Failed to start recording', err);}
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({allowsRecordingIOS: false});
    setURI(recording.getURI());
    setRecording();
    setDone(true);
    console.log('Recording stopped and stored');
  }

  const test = async () => {
    const filetype = uri.split(".").pop();
    const filename = "audioFile"
    const fd = new FormData();
    fd.append("audio-record", {
      uri: uri,
      type: `audio/${filetype}`,
      name: filename,

    });
    await ky.post(process.env.REACT_APP_AUDIO, {
      body: fd,
    });
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme = {eva.dark}>
        <Layout style={styles.container}>
          <Layout>
            <Text style={styles.color = '#f7faff'} category='h1'>Language Assessment</Text>
            <Text style={{textAlign: 'center'}}>Enter a word or sentence that you would like to pronunce then click the mic and pronunce it!</Text>
            <Text  style={{textAlign: 'center', marginBottom: '5%'}}>Remember to select a language!</Text>
            <Divider style = {styles.test}/>
          </Layout>
          <Layout style={styles.row}>
            <Input style ={styles.input} placeholder = 'Pronunced Word' value={value} accessoryRight={recording ? micFill : micOutline} onChangeText={nextValue => setValue(nextValue)}/> 
            
          </Layout>
          <Select
            style = {{width: '30%'}}
            selectedIndex={selectedIndex}
            onSelect={onSelect}
            value={selectedValue}>
            {data.map((item, index) => (<SelectItem key={index} title={item.text}/>))}
          </Select>
          <Button style={{marginTop: 5}} status='success' disabled = {value && done ? false : true} appearance='outline' onPress={test}>Analyze your pronunciation!</Button>
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

  row:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  
  input: {
    fontSize: 15,
    fontStyle: 'italic',
    color: 'black',
    width: '75%',
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