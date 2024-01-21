import React, {useState} from 'react'
import * as eva from '@eva-design/eva'
import {TouchableWithoutFeedback, StyleSheet} from 'react-native'
import {Audio} from 'expo-av'
import {ApplicationProvider, Input, Layout, Text, Select, SelectItem, SelectGroup, Divider, Button, Icon, IconRegistry, Spinner, Modal} from '@ui-kitten/components'
import { EvaIconsPack } from '@ui-kitten/eva-icons'
import ky from 'ky'

const langSetting = [
  {
    language: 'English',
    dialects: ['American Dialect', 'Canadian Dialect', 'British Dialect', 'Australia Dialect', 'Indian Dialect'],
    regionCode: ['en-US', 'en-CA', 'en-GB', 'en-AU', 'en-IN'] 
  },
  {language: 'French', dialects: ['French Dialect', 'Canadian Dialect'], regionCode: ['fr-FR', 'fr-CA']},
  {language: 'Spanish', dialects: ['Spaniard Dialect', 'Mexico Dialect'], regionCode: ['es-ES', 'es-MX']},
  {language: 'Chinese', dialects: ['Mandarin Dialect (Simplified)', 'Cantonese Dialect (Traditional)'], regionCode: ['zh-CN', 'zh-HK']},
]

export const Search = ({navigation}) => {
  const [value, setValue] = useState('');
  const [sound, setSound] = useState(new Audio.Sound());
  const [done, setDone] = useState(false);
  const [recording, setRecording] = useState();
  const [uri, setURI] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [lang, setLang] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);

  
  //micOff / micOn  
  const micOff = (props) => (<TouchableWithoutFeedback onPress={startRecording}><Icon {...props} fill = {'#8F9BB3'} name='mic-outline'/></TouchableWithoutFeedback>);
  const micOn = (props) => (<TouchableWithoutFeedback onPress={stopRecording}><Icon {...props} style={{ width: '30px', height: '30px' }} fill = {'#f7faff'} name='mic'/></TouchableWithoutFeedback>);
  
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
      });

      console.log('Starting recording..');
      const {recording} = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setDone(false);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
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

  const submit = async () => {
    setIsLoading(true)
    const filetype = uri.split(".").pop();
    const fd = new FormData();
    fd.append("audio-record", {
      name: "audioFile",
      uri: uri,
      type: `audio/${filetype}`,
    });
    fd.append("searchVal", value);
    fd.append("lang", lang);
     
    try{await ky.post(process.env.REACT_APP_AUDIO, {body: fd}); setIsLoading(false); navigation.navigate('Analyze', {searchVal: value, lang: lang});}
    catch(error){setIsLoading(false); setVisible(true);}
  }

  if (isLoading){
    return(
      <ApplicationProvider {...eva} theme = {eva.dark}><Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Spinner status= "success" size = "giant" style={{ justifyContent: 'center', alignItems: 'center'}}/></Layout></ApplicationProvider>
    )
  }

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme = {eva.dark}>
        <Layout style={styles.container}>
          <Layout>
            <Text style={styles.color = '#f7faff'} category='h2'>Language Assessment</Text>
            <Text style={{textAlign: 'center', marginBottom: '5%'}}>Enter a word or sentence that you would like to pronunce then click the mic and pronunce it!</Text>
            <Divider/>
          </Layout>
          <Layout style={styles.row}>
            <Input style ={styles.input} placeholder = 'Pronunced Word' value={value} accessoryRight={recording ? micOn : micOff} onChangeText={nextValue => setValue(nextValue)}/> 
          </Layout>
          <Select
            style={{width: '45%'}}
            onSelect={(item) => { 
              setSelectedValue(langSetting[item.section].dialects[item.row]);
              setLang(langSetting[item.section].regionCode[item.row]);
            }}
            placeholder={selectedValue ? selectedValue : 'Select a language'}
          >
            {langSetting.map((group, index) => (
              <SelectGroup key={index} title={group.language}>
                {group.dialects.map((dialect, index) => (<SelectItem key={index} title={dialect}/>))}
              </SelectGroup>
            ))}
          </Select>
          <Button style={{marginTop: 5}} status='success' appearance='outline' disabled = {value && done && selectedValue ? false : true} onPress={submit}>Analyze your pronunciation!</Button>
          <Modal backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} visible={visible}>
            <Layout>
              <Text style={{textAlign: 'center',}}category='h2'>Error!</Text> 
              <Divider/>
              <Text style={{textAlign: 'center',marginTop:'2%'}}> Please try again when you have a{"\n"}stable internet connection.</Text>
              <Divider/>
              <Button status='danger' appearance='outline' onPress={() => setVisible(false)}>OK</Button>
            </Layout>
          </Modal>
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