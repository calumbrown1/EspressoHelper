import React, { PropTypes, useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import {Picker} from '@react-native-community/picker';
import MainPageButton from './button.js';
import DBHelper, {WriteBrewPropertiesToDatabase, GetBrewLoggerConfigs} from './DBHelper';
import {GetBrewLogConfigs} from './Config.js';

let BrewProperties = [];
let BrewType = '';
let LoggerConfigs = [];
let SelectedLoggerConfig;

export default function LogPage({navigation})
{
  LoggerConfigs = GetBrewLogConfigs();
  BrewProperties = [];
  
  if(SelectedLoggerConfig == null || SelectedLoggerConfig == undefined)
    SelectedLoggerConfig = LoggerConfigs[0];
  
  const [selectedValue, setSelectedValue] = useState(SelectedLoggerConfig);
  return (
  <View style={styles.logPageContainer}>
    <Picker
      selectedValue={selectedValue}
      style={{height: 50, width: vw(90), borderColor: 'black', borderWidth: 1, borderRadius: 30}}
      onValueChange={(itemValue, itemIndex) => {
        console.log(itemValue);
        BrewType = itemValue;
        SelectedLoggerConfig = LoggerConfigs[GetSelectedBrewTypeByName(itemValue)];
        console.log(SelectedLoggerConfig);
        setSelectedValue(itemValue); 
      }
    }
      >
      {BrewSelectorItems()}
    </Picker>
    {LoggerProperties()}
    <MainPageButton text="Log Brew" onPress={()=> LogBrew()}></MainPageButton>
  </View>
  );
}

function BrewSelectorItems()
{
  let pickerItems = [];

  for(let i=0; i<LoggerConfigs.length; i++)
  {
    pickerItems.push(PickerItem(LoggerConfigs[i].Type));
  }

  return pickerItems;
}

function PickerItem(name)
{
  return(
    <Picker.Item label={name} value={name} />
  );
}

function LoggerProperties()
{
  let properties = [];
  for(let i=0; i<SelectedLoggerConfig.Properties.length; i++)
  {
    properties.push(LoggerObject(SelectedLoggerConfig.Properties[i]));
  }
  return(
    <View>
      {properties}
    </View>
  )
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

function GetSelectedBrewTypeByName(name)
{
  let index = -1;
  LoggerConfigs.forEach((conf) => {
    if(conf.Type === name) 
      index = LoggerConfigs.indexOf(conf);
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
  let brew = new Brew(BrewType, BrewProperties);
  var brews = WriteBrewPropertiesToDatabase(brew).then(function(success) {
    console.log(success);
  }, function (err){
    console.log(err);
  });
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

