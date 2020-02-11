const config = {
    rules: {
        constantNotUsed: {
            message: 'The resource has not been used!',
            errorType: 'Warning'
        },
        lineDefinitionNotFound: {
            message: 'The command or macro is not defined!',
            errorType: 'Error'
        },
        constantNotFound: {
            message: 'The constant is not defined!',
            errorType: 'Error'
        }
    }
}

module.exports = { config };