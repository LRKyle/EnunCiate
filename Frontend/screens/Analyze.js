import React, {useState, useEffect}from 'react'
import * as eva from '@eva-design/eva'
import 'react-native-get-random-values';
import {StyleSheet} from 'react-native'
import {ApplicationProvider, Layout, Button, Text} from '@ui-kitten/components'
import {Audio} from 'expo-av'

export const Analyze = ({route}) => {
  const {searchVal, langVal} = route.params
  const {backData, setBackData} = useState()
  const [sound, setSound] = useState(new Audio.Sound());

  const [recording, setRecording] = React.useState();
  const [recPlaying, setPlaying] = React.useState(); // Remove

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {setBackData(data)}
    )
     
  }, [])
    
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isPlaying) {setPlaying(true)} //Remove
    else {setPlaying()} //Remove

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
      console.log('Recording started');
    } 
    catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({allowsRecordingIOS: false});
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
  }

  return (
    <ApplicationProvider {...eva} theme={eva.dark}>
        <Layout style={styles.container}>  
          <Text>{backData ? 'Loading...' : `Overall Accuracy Score: ${backData}`}</Text>
          <Button
          status='success' 
          appearance='outline' 
          onPress={recording ? stopRecording : startRecording}
          >{recording ? 'Stop Recording' : 'Start Recording'}</Button>     
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
});
//backData["Overall Accuracy Score"]