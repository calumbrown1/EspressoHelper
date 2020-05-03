import React, { PropTypes, useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import {Picker} from '@react-native-community/picker';
import MainPageButton from './button.js';
import WriteBrewPropertiesToDatabase from './DBHelper';

let BrewProperties = [];
let BrewType = '';

export default function LogPage({navigation})
{
  return (
  <View style={styles.logPageContainer}>
    {BrewTypeSelector()}
    {LoggerObject("Grounds Weight (g)")}
    {LoggerObject("Grounds Setting")}
    {LoggerObject("Result Weight (g)")}
    {LoggerObject("Desired Ratio (1:?)")}
    <MainPageButton text="Log Brew" onPress={()=> LogBrew()}></MainPageButton>
  </View>
  );
}

function BrewTypeSelector(){
  const [selectedValue, setSelectedValue] = useState("Espresso");
  BrewType = selectedValue;
  return (
    <Picker
      selectedValue={selectedValue}
      style={{height: 50, width: vw(90), borderColor: 'black', borderWidth: 1, borderRadius: 30}}
      onValueChange={(itemValue, itemIndex) => {setSelectedValue(itemValue); BrewType = itemValue;}
        /* TODO CHANGE LOGGER OBJECTS AND ANALYZER BASED ON NEW VALUE*/}
      >
      <Picker.Item label="Espresso" value="Espresso" />
      <Picker.Item label="Pourover" value="Pourover" />
      <Picker.Item label="French Press" value="French Press" />
      <Picker.Item label="Aeropress" value="Aeropress" />
      <Picker.Item label="Ibik" value="Ibik" />
    </Picker>
  );
}

function LoggerObject(name)
{
  return (
    <View style={styles.loggerContainer}>
      <Text style={styles.loggerTitle}>{name}</Text>
      <TextInput style={styles.textInput} keyboardType='decimal-pad' onChangeText={(value) => HandleBrewPropertyLogging(name, value)}></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  loggerContainer:{
    display: "flex",
    marginVertical: 8,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center'
  },
  loggerTitle:{
    display: "flex",
    flex: 2,
  },
  textInput: {
    display: "flex",
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    padding:8
  },
  logPageContainer:{
    padding: 16
  }
});

function HandleBrewPropertyLogging(name, value)
{
  // Check if brew property already logged and return an index if so
  let brewIndex = GetLoggedBrewPropertyIndex(name); 

  if (brewIndex > -1){
    console.log('did an update');
    BrewProperties[brewIndex].Value = value;
  }
  else{
    console.log('no existing one found, adding a new property.')
    BrewProperties.push(new BrewProperty(name, value));
  }
}

function GetLoggedBrewPropertyIndex(name)
{
  let index = -1;
  BrewProperties.forEach((brewprop) => {
    if(brewprop.Name === name) 
      index = BrewProperties.indexOf(brewprop);
  });

  return index;
}

function BrewProperty(name, value)
{
  this.Name = name;
  this.Value = value;
}

function LogBrew()
{
  console.log("logging brew");
  let brew = new Brew(BrewType, BrewProperties);
  WriteBrewPropertiesToDatabase(brew);
}

function Brew(type, properties)
{
  var date = new Date();

  this.Type = type;
  this.Date = date.getDate();
  this.Properties = properties;
}

function LoggerConfig(type, properties, validationFunction, analyzerFunction)
{
  this.Type = type;
  this.Properties = properties;
  this.Validator = validationFunction;
  this.Analizer = analyzerFunction;
}