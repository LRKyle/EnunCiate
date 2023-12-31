import React, {useState} from 'react'
import * as eva from '@eva-design/eva'
import {StyleSheet} from 'react-native'
import {ApplicationProvider, Layout, Text, Select, SelectItem, Divider, Button} from '@ui-kitten/components'
import { Recording } from 'expo-av/build/Audio'
import {Audio} from 'expo-av'


export const Analyze = ({route}) => {
    const {searchVal, langVal} = route.params

    return (
        <ApplicationProvider {...eva} theme = {eva.dark}>
            <Layout style= {styles.container}>
                <Button titlestatus='warning' appearance='outline' onPress={rec ? stopRecording : startRecording}>{rec ? 'Stop Recording' : 'Start Recording'}</Button>
                <Button onPress={clearRec}></Button>
            </Layout>
        </ApplicationProvider>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }
});