import React, {useState}from 'react'
import * as eva from '@eva-design/eva'
import {StyleSheet} from 'react-native'
import {ApplicationProvider, Layout, Button, Text, Select, SelectItem, Divider} from '@ui-kitten/components'
import {Audio} from 'expo-av'
import {SpeechConfig, AudioConfig, SpeechRecognizer} from 'microsoft-cognitiveservices-speech-sdk'

const speechConfig = SpeechConfig.fromSubscription(process.env.REACT_APP_AZURE_KEY, process.env.REACT_APP_REGION);
const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

export const Analyze = ({route}) => {
  const {searchVal, langVal} = route.params
  const [sound, setSound] = useState(new Audio.Sound());

  const [recording, setRecording] = React.useState();
  const [rec, setRec] = React.useState();
  const [recPlaying, setPlaying] = React.useState();

  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.isPlaying) {setPlaying(true)}
    else {setPlaying()}

    if (status.didJustFinish){stopPlayback()}
  });
    
  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const {recording} = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setRec(recording.getURI())
      console.log('Recording started');
    } catch (err) {
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

  async function startPlayback() { 
    console.log('Starting playback..');
    await sound.loadAsync({uri: rec})
    await sound.playAsync()
  }
  async function stopPlayback(){
    if (recPlaying) {
      console.log('Stopping playback..');
      sound.stopAsync();
      await sound.unloadAsync({uri: rec})
    }
  }

  return (
    <ApplicationProvider {...eva} theme = {eva.dark}>
        <Layout style= {styles.container}>
          <Button
          status='success' 
          appearance='outline' 
          onPress={recording ? stopRecording : startRecording}
          >{recording ? 'Stop Recording' : 'Start Recording'}</Button>

          <Button 
          style={{marginTop: 15}} 
          status='success' 
          appearance='outline' 
          //disabled={rec ? false : true}
          onPress={recPlaying ? stopPlayback : startPlayback}
          >{recPlaying ? 'Stop Playback' : 'Start Playback'}</Button>
          
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


//var pronunciationAssessmentConfig = SpeechSDK.PronunciationAssessmentConfig.fromJSON("{\"referenceText\":\"good morning\",\"gradingSystem\":\"HundredMark\",\"granularity\":\"Phoneme\",\"phonemeAlphabet\":\"IPA\"}");