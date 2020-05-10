import React from 'react';
import { StyleSheet, Text, View, Button, Alert, FlatList, state, setState, TouchableOpacity } from 'react-native';
import MainPageButton from './button.js';
import LogPage from './LogPage.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import DBHelper, {WriteBrewPropertiesToDatabase, GetBrewLoggerConfigs, GetBrews} from './DBHelper';
import { setLightEstimationEnabled } from 'expo/build/AR';


class BrewList extends React.Component{

  brewList = undefined;

  renderItem = ({Type, ID, DateTime}) => {
    console.log("hello");
    console.log(Type);
    console.log(ID);
    console.log(DateTime)

    return (
      <TouchableOpacity
        onPress={() => console.log(brew)}
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
      /*
      <View style={styles.pageContainer}>
        <FlatList
          data={this.state}
          renderItem={this.renderItem}
          extraData={this.state}/>
      </View>*/
      );
  }
}

export default  function ViewLogsPage({navigation})
{
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

        console.log(brews);
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
      width: vw(90),
      alignContent: "center",
      marginVertical: 8,
      display: "flex",
      flexDirection: "row"
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
    }
  });


function BrewItem(brew)
{
  console.log("new brew item");
  console.log(brew);
  return (
    <TouchableOpacity
      onPress={() => console.log(brew)}
      style={brewItemStyle}
    >
      <View style={brewItemStyle}>
        <View style={brewItemLeftCol}>
          <Text>{brew.ID}</Text>
        </View>
        <View style={brewItemRightCol}>
          <Text>{brew.Type}</Text>
          <Text>{brew.DateTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}