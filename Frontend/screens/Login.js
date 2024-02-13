import React from 'react';
import {TouchableWithoutFeedback, StyleSheet} from 'react-native'
import {FIREBASE_AUTH} from '../firebase';
import * as eva from '@eva-design/eva'
import {ApplicationProvider, Layout, Input, Text, Button,} from '@ui-kitten/components';


export const Login = ({navigation}) => {
    //const {login} = useAuth();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const auth = FIREBASE_AUTH

    return (
        <>
            <ApplicationProvider {...eva} theme = {eva.dark}>
                <Layout style={styles.container}>
                    <Text style={{color: '#f7faff', textAlign: 'center'}} category='h2'>Login</Text>
                    <Input style = {styles.input} placeholder = 'Enter your email!' onChangeText={emailValue => setEmail(nextValue)}/> 
                    <Input style = {styles.input} placeholder = '' onChangeText={passwordsValue => setPassword(nextValue)}/> 
                    <Text style={styles.captionText}>Benefits of having an account!</Text>
                    
                    
                    
                    
                    <Button  onPress={async () => {
                        try {
                            setLoading(true);
                            await auth.signInWithEmailAndPassword(email, password);
                            navigation.navigate('Search');
                        } catch (e) {
                            console.log(e);
                        } finally {
                            setLoading(false);
                        }
                    }}>Login!</Button>
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
        width: '75%',
        //textAlign: 'center',
        borderColor: 'black',
        borderWidth: 1,  // Obv
        borderHeight: 5, // Obv
        borderRadius: 10, //Controls how round the corners
        paddingTop: 5,
        paddingBottom: 5, //Padding = The space away from the input
        paddingLeft: 10,
    },
    captionText: {
        marginLeft: '17%',
        alignSelf: 'flex-start',
        fontSize: 12,
        fontWeight: '400',
        color: '#8F9BB3',
    },
    
});