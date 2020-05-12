import React, {useState} from 'react';
import { StyleSheet, Text, View, Button, Alert, FlatList, state, setState, TouchableOpacity } from 'react-native';
import MainPageButton from './button.js';
import LogPage from './LogPage.js';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import DBHelper, {WriteBrewPropertiesToDatabase, GetBrewLoggerConfigs, GetBrews} from './DBHelper';
import { setLightEstimationEnabled } from 'expo/build/AR';
import { render } from 'react-dom';
import { Directions } from 'react-native-gesture-handler';


class BrewPage extends React.Component
{
    
    constructor(props){
        console.log("constructor");
        super(props);
        var brewProps = props.route.params;

        this.BrewProperties = [];
        this.BrewProperties.push({title: "BrewType", value: brewProps.BrewType});
        this.BrewProperties.push({title: "BrewDate", value: brewProps.BrewDate});
        brewProps.BrewProps.forEach(prop => {
            this.BrewProperties.push({title: prop.brew_prop_name, value: prop.brew_prop_val});
        });
    }

    render(){
        console.log("brew props");
        console.log(this.BrewProperties);
        return (
        <View>
            <FlatList
                renderItem={({ item }) => {
                    return(
                    <View style={styles.brewItem}>
                        <Text style={styles.brewItemText}>{item.title}</Text>
                        <Text style={styles.brewItemText}>{item.value}</Text>
                    </View>)
                }}
                keyExtractor={ (item,index) => index.toString() }
                data={this.BrewProperties}
                extraData={this.BrewProperties}
            />
        </View>
    )}
}

const styles = StyleSheet.create({
    brewItem:{
        display: "flex",
        flexDirection: "row",
        padding: 8,
        borderColor:"black",
        borderBottomWidth: 1
    },
    brewItemText:{
        flex: 2,
        width: vw(50)
    }
  });

export { BrewPage }