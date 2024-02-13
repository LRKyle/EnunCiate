import React from 'react';
import {TouchableWithoutFeedback, StyleSheet} from 'react-native'
import {FIREBASE_AUTH} from '../firebase';
import * as eva from '@eva-design/eva'
import {ApplicationProvider, Layout, Input, Text, Button, Icon, IconRegistry, Divider,} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons'


export const Login = ({navigation}) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [protectedText, setProtectedText] = React.useState(true);
    const auth = FIREBASE_AUTH
   
    const eye = (props) => (<TouchableWithoutFeedback onPress={() => setProtectedText(!protectedText)}><Icon {...props} fill = {protectedText ? '#8F9BB3' : '#f7faff'} name={protectedText ? 'eye-off' : 'eye'}/></TouchableWithoutFeedback>);

    return (
    <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme = {eva.dark}>
            <Layout style={styles.container}>
                <Text style={{color: '#f7faff', textAlign: 'center'}} category='h2'>Login</Text>
                <Divider style={{backgroundColor: '#00E096', width: '85%', height: 1, marginTop: 10, marginBottom: 10}}/>
                <Input style = {styles.input} placeholder = 'Enter an email' onChangeText={emailValue => setEmail(emailValue)}/> 
                <Input style = {styles.input} placeholder = 'Enter a password' accessoryRight={eye} secureTextEntry={protectedText} onChangeText={passwordValue => setPassword(passwordValue)}/> 
                <Layout style = {styles.captionText}>
                    <Text style={styles.captionText} onPress={() => navigation.navigate('Search')}>Don't have an account? Sign Up (Setup the sign in page aswell)</Text>
                </Layout>
            
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
        //textAlign: 'center',
        borderColor: 'black',
        borderWidth: 1,  
        borderHeight: 5, 
        borderRadius: 10,
        paddingTop: 5,
        paddingBottom: 5, 
        paddingLeft: 10,
    },
    captionText: {
        marginLeft: '7%',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        fontSize: 12,
        fontWeight: '400',
        color: '#8F9BB3',
    },
    
});

/*<Button  onPress={async () => {
                        try {
                            setLoading(true);
                            await auth.signInWithEmailAndPassword(email, password);
                            navigation.navigate('Search');
                        } catch (e) {
                            console.log(e);
                        } finally {
                            setLoading(false);
                        }
                    }}>Login!</Button> */

//<Text style={styles.captionText}>Benefits of having an account</Text>  (It might be easier to do it this way so it's easily clickable)
//#00E096 is the color of UI Kitten's success status