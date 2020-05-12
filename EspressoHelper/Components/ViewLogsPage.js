import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Alert, FlatList, state, setState, TouchableOpacity } from 'react-native';
import MainPageButton from './button.js';
import LogPage from './LogPage.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import DBHelper, {WriteBrewPropertiesToDatabase, GetBrewLoggerConfigs, GetBrews} from './DBHelper';
import { setLightEstimationEnabled } from 'expo/build/AR';

let Navigation;

class BrewList extends React.Component{

  brewList = undefined;

  renderItem = ({Type, ID, DateTime, Properties}) => {
    return (
      <TouchableOpacity
        onPress={function(){
          console.log("touched");
          Navigation.navigate("Brew", {
          BrewType: Type,
          BrewID: ID,
          BrewDate: DateTime,
          BrewProps: Properties
        })}}
        style={styles.brewItemStyle}>
        <View style={styles.brewItemStyle}>
          <View style={styles.brewItemLeftCol}>
            <Text style={styles.brewID}>{ID}</Text>
          </View>
          <View style={styles.brewItemRightCol}>
            <Text style={styles.brewType}>{Type}</Text>
            <Text style={styles.brewDate}>{DateTime}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
   }

  constructor(props)
  {
    super(props);
    this.state = {brewData: []};
    this.brewList = this;
  }

  componentDidMount()
  {
    let brewlisto = this.brewList;
    GetBrewData().then(function(brews){
      brewlisto.setState({brewData:brews});
    }, 
    function(err)
    {
      console.log("error");
      console.log(err);
    })
  }

  render(){
    return (
      <FlatList
        renderItem={({ item }) => ( this.renderItem(item))}
        keyExtractor={ (item,index) => index.toString() }
        data={this.state.brewData}
        extraData={this.state.brewData}
      />
      );
  }
}

export default  function ViewLogsPage({navigation})
{
  Navigation = navigation;

  return (
  <View style={styles.pageContainer}>
    <BrewList/>
  </View>
  );
}

function GetBrewData()
{
  return new Promise(function(resolve, reject){
    GetBrews().then(
      function(succ){

        let brews = [];

        succ.forEach(
          function(brew){
            brews.push(
              {
                ID: brew.ID,
                Type: brew.Type,
                DateTime: brew.DateTime,
                Properties: brew.Properties
              }
            )
          });

        resolve(brews);
      },
      function(err){
        reject(err);
      });
  });
}

const styles = StyleSheet.create({
    pageContainer:{
      padding: 16
    },
    brewItemStyle:{
      borderRadius:8,
      paddingHorizontal:8,
      backgroundColor: '#2C1503',
      alignContent: "center",
      marginVertical: 8,
      display: "flex",
      flexDirection: "row",
      flex: 1
    },
    brewItemLeftCol:{
      flex:1
    },
    brewItemRightCol:{
      flex: 3
    },
    brewDate:{
      color: "grey",
      fontSize: 12
    },
    brewID:{
      fontSize: 26,
      color: "white"
    },
    brewType:{
      color: "white",
      fontSize: 20
    },
    brewModal:{
      width:vw(100),
      height:vh(100)
    }
  });
