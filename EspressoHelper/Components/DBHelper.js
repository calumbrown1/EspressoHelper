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


function WriteBrewPropertiesToDatabase(brew)
{
    return new Promise(function(resolve, reject){
        if(!SqlSetupChecked)
            SetupDB();

        db.transaction(tx => {
            tx.executeSql('INSERT INTO ' + BrewTableName + ' (' + BrewNameColName + ',' + BrewDateTimeColName +') VALUES (?,?)', [brew.Type, brew.Date]);
            tx.executeSql("SELECT * FROM BREWS", [], (trn, succ) => {resolve(succ)}, (trn, err) => reject(err));
        });
    });
}

function GetBrewLoggerConfigs()
{
    return new Promise(function(resolve, reject){
        if(!SqlSetupChecked)
            SetupDB();
    });
}

function SetupDB()
{
    return new Promise(function(resolve, reject){
        db.transaction(tx => {
            tx.executeSql('DROP TABLE ' + BrewTableName, []);
            tx.executeSql('DROP TABLE ' + BrewPropertiesTableName, []);
            tx.executeSql('DROP TABLE brew_log_configs');
        });
        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + BrewTableName + ' (brew_id INTEGER PRIMARY KEY AUTOINCREMENT, brew_name varchar(45), ' + BrewDateTimeColName + ' varchar(15))', []);
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + BrewPropertiesTableName + ' (brew_prop_id INTEGER PRIMARY KEY AUTOINCREMENT, brew_id varchar(45), brew_prop_name varchar(45), brew_prop_val varchar(45))', []);
            tx.executeSql('CREATE TABLE IF NOT EXISTS brew_log_configs (brew_log_config_id INTEGER PRIMARY KEY AUTOINCREMENT, brew_log_config_name varchar(45))' )
            tx.executeSql('CREATE TABLE IF NOT EXISTS brew_log_config_props (brew_log_config_prop_id INTEGER PRIMARY KEY AUTOINCREMENT, brew_prop_name varchar(45), brew_log_config_name varchar(45)');
            tx.executeSql('INSERT INTO brew_log_configs (brew_log_config_name) VALUES ("Espresso"), ("French Press"), ("V60"), ("Chemex"), ("AeroPress"), ("Ibik")');
            tx.executeSql('SELECT * FROM brew_log_configs', [], (trn, succ)=>console.log(succ));
        });
        SqlSetupChecked = true;
    });
}


export { WriteBrewPropertiesToDatabase, GetBrewLoggerConfigs }