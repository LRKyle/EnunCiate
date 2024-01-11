import React, {useState} from 'react'
import * as eva from '@eva-design/eva'
import {StyleSheet} from 'react-native'
import {Audio} from 'expo-av'
import {ApplicationProvider, Input, Layout, Text, Select, SelectItem, Divider, Button, Icon, IconRegistry,} from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons';

const data = [
  { text: 'EN' },
  { text: 'FR' },
  { text: 'RUS' },
];

const micOn = (props) => (
  <Icon {...props} name='star'/>
);

export const Search = ({navigation}) => {
  const [value, setValue] = React.useState('');
  const [sound, setSound] = useState(new Audio.Sound());
  const [done, setDone] = useState(false);
  const [recording, setRecording] = React.useState();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedValue, setSelectedValue] = useState(data[0].text);

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
      await recording.prepareToRecordAsync({
        android: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_PCM_16BIT,
          sampleRate: 16000,
          numberOfChannels: 1,
        },

        ios: {
          extension: '.wav',
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 256000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });

      await recording.startAsync();
      setRecording(recording);
      setDone(false);
      console.log('Recording started');
    } 
    catch (err) {console.error('Failed to start recording', err);}
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording();
    setDone(true);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({allowsRecordingIOS: false});
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme = {eva.dark}>
        <Layout style={styles.container}>
          <Layout> 
            <Text category='h1'>Language Learning</Text>
            <Text style={{textAlign: 'center'}}>Voice Analyzer{"\n"}</Text>
            <Divider style = {styles.test}/>
          </Layout>
          <Layout style={styles.row}>
            <Input style ={styles.input} placeholder = 'Pronunced Word' value={value} onChangeText={nextValue => setValue(nextValue)}/> 
            <Select
              style = {{width: '30%'}}
              selectedIndex={selectedIndex}
              onSelect={onSelect}
              value={selectedValue}>
            {data.map((item, index) => (<SelectItem key={index} title={item.text}/>))}
            </Select>
          </Layout>
          <Button
            status='success' 
            appearance='outline' 
            onPress={recording ? stopRecording : startRecording}
            accessoryLeft={micOn}
            >Hi</Button>

            
          <Button style={{marginTop: 5}} status='success' disabled = {value && done ? false : true} appearance='outline' onPress={() => navigation.navigate("Analyze", {searchVal: value, langVal: selectedValue})}>Analyze your pronunciation!</Button>
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
  icon: {
    width: 32,
    height: 32,
  },
});
