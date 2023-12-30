import React from 'react'
import * as eva from '@eva-design/eva'
import {StyleSheet} from 'react-native'
import {ApplicationProvider, Input, Layout, Text, Select, SelectItem, Divider,Button} from '@ui-kitten/components'


export const Analyze = ({route}) => {
    const {searchVal, langVal} = route.params
    return (
        <ApplicationProvider {...eva} theme = {eva.dark}>
            <Layout style= {styles.container}>
                <Button status='warning' appearance='outline'>Search for {searchVal} in {langVal}</Button>
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