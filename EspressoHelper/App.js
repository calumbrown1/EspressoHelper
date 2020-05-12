import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import MainPageButton from './Components/button.js';
import LogPage from './Components/LogPage.js';
import ViewLogsPage from './Components/ViewLogsPage.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import ViewBrewPage, {BrewPage} from './Components/ViewBrewPage.js';

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Coffee Analyzer" component={HomePage} options={{
          headerStyle: {
            backgroundColor: '#432711',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}/>
          <Stack.Screen name="Log Brew" component={LogPage} options={{
          headerStyle: {
            backgroundColor: '#432711',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        <Stack.Screen name="View Logs" component={ViewLogsPage} options={{          
          headerStyle: {
            backgroundColor: '#432711',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        <Stack.Screen name="Brew" component={BrewPage} options={{          
          headerStyle: {
            backgroundColor: '#432711',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export function HomePage({navigation})
{  
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <MainPageButton text="Log Brew" onPress={()=> navigation.navigate("Log Brew")}></MainPageButton>
        <MainPageButton text="View Logged Brews" onPress={()=> navigation.navigate("View Logs")}></MainPageButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#9A7B4F',
    padding: 16,
  },
});
