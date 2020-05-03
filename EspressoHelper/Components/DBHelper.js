import * as SQLite from 'expo-sqlite';

const DBName = 'CoffeeAnalyzer.db';
const BrewTableName = 'Brews';
const BrewPropertiesTableName = 'BrewProperties';
const BrewIDColName = 'brew_id';
const BrewNameColName = 'brew_name';
const BrewDateTimeColName = 'brew_date';
const BrewPropertyIDColName = 'brew_prop_id';
const BrewPropertyNameColName = 'brew_prop_name';
const BrewPropertyValueColName = 'brew_prop_val';
let SqlSetupChecked = false;

const db = SQLite.openDatabase(DBName);


export default function WriteBrewPropertiesToDatabase(brew)
{
    console.log(brew);
    if(!SqlSetupChecked)
        SetupDB();

        db.transaction(tx => {
            tx.executeSql("INSERT INTO Brews (brew_name, brew_date) VALUES (?,?)", [brew.Type, brew.Date]);
            tx.executeSql("SELECT * FROM BREWS", [], (res, reso) => {console.log(reso)});
        }, (err)=>console.log(err), (succ)=> console.log(succ));

}

function SetupDB()
{
    console.log("setting up db")
    db.transaction(tx => {
        tx.executeSql('DROP TABLE ' + BrewTableName, []);
    });
    db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + BrewTableName + ' (brew_id INTEGER PRIMARY KEY AUTOINCREMENT, brew_name varchar(45), ' + BrewDateTimeColName + ' varchar(15))', []);
        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + BrewPropertiesTableName + ' (brew_prop_id varchar(45) PRIMARY KEY NOT NULL, brew_id varchar(45), brew_prop_name varchar(45), brew_prop_val varchar(45))', []);
    });
    SqlSetupChecked = true;
}