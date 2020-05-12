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
            tx.executeSql('INSERT INTO ' + BrewTableName + ' (' + BrewNameColName + ',' + BrewDateTimeColName +') VALUES (?,?)', [brew.Type, brew.Date],            
            function (tx, res){
                tx.executeSql('SELECT * FROM ' + BrewTableName + ' WHERE ' + BrewNameColName + ' = "' + brew.Type + '" ORDER BY ' + BrewIDColName + ' ASC',[],
                function (tx, res){
                    var newBrew = res.rows._array[res.rows._array.length -1];

                    brew.Properties.forEach(prop => {
                        tx.executeSql('INSERT INTO ' + BrewPropertiesTableName + ' (brew_id, brew_prop_name, brew_prop_val) VALUES (?,?,?)',
                        [newBrew.brew_id, prop.Name, prop.Value],
                        function (tx, succ)
                        {
                        },
                        function (tx, err)
                        {
                            console.log("failed to insert " + prop.Name);
                            console.log(err);
                        });
                    });
                    resolve();
                }, 
                function (ex, err)
                {
                    console.log(err);
                });
            }, 
            function (tx, err)
            {
                console.log(err);
                reject();
            });
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
        console.log("setting up");

        if (__DEV__) {
            db.transaction(tx => {
                tx.executeSql('DROP TABLE ' + BrewTableName, [],
                function (tx, res)
                {
                    tx.executeSql('DROP TABLE ' + BrewPropertiesTableName, [], 
                    function (tx, succ)
                    {
                        console.log(succ);
                    },
                    function (tx, err)
                    {
                        console.log(err);
                    });
                },
                function (tx, err)
                {
                    console.log(err);
                });
                
            });
        }

        db.transaction(tx => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + BrewTableName + ' (brew_id INTEGER PRIMARY KEY AUTOINCREMENT, brew_name varchar(45), ' + BrewDateTimeColName + ' varchar(15))', [],
            function (tx, res)
            {
                tx.executeSql('CREATE TABLE IF NOT EXISTS ' + BrewPropertiesTableName + ' (brew_prop_id INTEGER PRIMARY KEY AUTOINCREMENT, brew_id varchar(45), brew_prop_name varchar(45), brew_prop_val varchar(45))', [],
                function (tx, res)
                {
                    SqlSetupChecked = true;
                    resolve();
                },
                function (tx, err)
                {
                    console.log(err);
                });
            },
            function (tx, err)
            {
                console.log(err);
            });
        });

    });
}

function GetBrews()
{
    return new Promise(function(resolve, reject){
        if(!SqlSetupChecked)
            SetupDB();

        db.transaction(tx => {
            tx.executeSql("SELECT * FROM " + BrewTableName + " ORDER BY " + BrewIDColName + " DESC;", [], 
            function(tx, brewRes){
                var brews = brewRes.rows._array;
                let completeBrewInfo = [];

                brews.forEach(function(brew){
                    tx.executeSql("SELECT * FROM " + BrewPropertiesTableName + " WHERE " + BrewIDColName + " = " + brew.brew_id+".0", [], 
                    function(tx, succ){
                        var props = succ.rows._array;
                        console.log("brew");
                        completeBrewInfo.push({
                            ID: brew.brew_id,
                            Type: brew.brew_name,
                            DateTime: brew.brew_date,
                            Properties: props
                        })

                        if(completeBrewInfo.length >= brews.length)
                        {
                            console.log(completeBrewInfo)
                            resolve(completeBrewInfo);
                        }
                    },
                    function(tx, err)
                    {
                        console.log(err);
                    });
                })
            },
            function(tx, err)
            {
                console.log(err);
            });
        });
    });
}
export { WriteBrewPropertiesToDatabase, GetBrewLoggerConfigs, GetBrews }