function LoggerConfig(type, properties, validationFunction, analyzerFunction)
{
  this.Type = type;
  this.Properties = properties;
  this.Validator = validationFunction;
  this.Analizer = analyzerFunction;
}


function GetBrewLogConfigs()
{
    let loggerConfigs = [];

    loggerConfigs.push(EspressoConfig());
    loggerConfigs.push(V60());

    return loggerConfigs;
}


function EspressoConfig()
{
    return new LoggerConfig("Espresso", 
                        ["Grounds Weight (g)", "Grind Setting", "Ratio (1:?)", "Brew Time (s)", "Result Weight (g)"],
                        ()=>{console.log("validation function")},
                        ()=>{console.log("analyze")});
}

function V60()
{
    return new LoggerConfig("V60",
                            ["Grounds Weight (g)", "Grind Setting", "Ratio (1:?)", "Brew Time (s)"],
                            ()=>{console.log("validation function")},
                            ()=>{console.log("analyze")});
}

export {GetBrewLogConfigs}