const isValid = function(value){
    if(typeof value == "undefined" || value == null) return false
    if (typeof value === "String" && value.trim().length === 0) return false
    if (typeof value === Number && value.trim().length === 0) return false
    return true
}


module.exports ={isValid}