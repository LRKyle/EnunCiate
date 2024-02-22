import React, {useState} from 'react'
import {TouchableWithoutFeedback, StyleSheet} from 'react-native'
import {FIREBASE_AUTH} from '../firebase';
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';
import * as eva from '@eva-design/eva'
import {ApplicationProvider, Layout, Input, Text, Button, Icon, IconRegistry, Divider, Modal, Spinner} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Login = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [protectedText, setProtectedText] = useState(true)
    const [visible, setVisible] = useState(false)
    const [err, setErr] = useState('An error occurred, please try again later!');

    const storeData = async (value) => {
        try {
          const jsonValue = JSON.stringify(value)
          await AsyncStorage.setItem(`@loginData`, jsonValue)
        } catch (err) {
          console.log(err, "Trouble storing data")
        }
    }

    const signIn = async () => {
        console.log('Signing in')
        try {
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            storeData(FIREBASE_AUTH.currentUser)
        } 
        catch (err) {
            setVisible(true);
            console.log(err.message)
            switch (err.code) {
                case 'auth/invalid-email':
                  setErr('Invalid email address.');
                  break;
                case 'auth/user-disabled':
                  setErr('User account has been disabled.');
                  break;
                case 'auth/user-not-found':
                  setErr('No user found with this email.');
                  break;
                case 'auth/wrong-password':
                  setErr('Wrong password.');
                  break;
                default:
                    setErr('An error occurred, please try again later!', err.message);
            }
        }
        
    }
    
    const signUp = async () => {
        console.log('Signing up')
        try {
            await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        } catch (err) {
            setVisible(true);
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setErr('Email address already in use.');
                    break;
                case 'auth/invalid-email':
                    setErr('Invalid email address.');
                    break;
                case 'auth/operation-not-allowed':
                    setErr('Email/password accounts not enabled.');
                    break;
                case 'auth/weak-password':
                    setErr('Password is not strong enough. Make it atleast 6 characters long.');
                    break;
                default:
                    setErr('An error occurred, please try again later!', err.message);
            }
        } 
    }
   
    const eye = (props) => (<TouchableWithoutFeedback onPress={() => setProtectedText(!protectedText)}><Icon {...props} fill = {protectedText ? '#8F9BB3' : '#f7faff'} name={protectedText ? 'eye-off' : 'eye'}/></TouchableWithoutFeedback>);

    return (
    <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme = {eva.dark}>  
            <Layout style = {styles.container}>
                <Text style = {{color: '#f7faff', textAlign: 'center'}} category='h2'>Registration</Text>
                <Divider style = {{backgroundColor: '#00E096', width: '85%', height: 1, marginTop: 10, marginBottom: 10}}/>
                <Input style = {styles.input} placeholder = 'Enter an email' onChangeText={emailValue => setEmail(emailValue)}/> 
                <Input style = {styles.input} caption="  With an account, your assessment history is saved!" placeholder = 'Enter a password' accessoryRight={eye} secureTextEntry={protectedText} onChangeText={passwordValue => setPassword(passwordValue)}/> 
                <Button style = {{marginTop: 10, width: '45%'}} status='success' appearance='outline' onPress={signIn}>Login</Button>
                <Button style = {{marginTop: 10, width: '30%'}} status='success' appearance='outline' onPress={signUp}>Sign Up</Button>
                
                <Modal backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}} visible={visible}>
                    <Layout>
                    <Text style = {{textAlign: 'center',}}category='h2'>Error!</Text> 
                    <Divider/>
                    <Text style = {{textAlign: 'center', marginTop:'2%'}}>{err}</Text>
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
    input: {
        fontSize: 15,
        fontStyle: 'italic',
        color: 'black',
        width: '85%',
        borderColor: 'black',
        borderWidth: 1,  
        borderHeight: 5, 
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 5, 
        paddingLeft: 10,
    },
});