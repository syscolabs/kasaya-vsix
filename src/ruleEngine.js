const { rawCommandStore } = require('./commands');
const commands = rawCommandStore.map((command) => command.replace(/\$[a-zA-Z0-9_]+/g, '((\".*\")|(\\$.+)|(\{(.+)\})|([0-9.]+))'));

/**
 * Extract constants, macros and imports from the .kasaya file
 */
function extractConstantsAndMacrosFromDocument(textLines) {
    const store = {
        constants: [],
        macros: []
    }
    let isInActiveContext = false;
    // Store the constant and macros
    textLines.forEach((line, lineNumber) => {
        line = line.trim();
        // Ignore comment lines
        if (line.startsWith('#')) {
            return;
        }
        // Store defined constants, import constants and macros
        if (line.startsWith('in this context')) {
            isInActiveContext = true;
            return;
        }
        if (isInActiveContext) {
            if (line.startsWith('end')) {
                isInActiveContext = false;
                return;
            }
            // Check whether the line contains a constant definition
            // if so, store the resource in store
            const constants = line.match(/^([A-Z_][0-9A-Z_]*) is (.+)/);
            if (constants) {
                const [, resource] = constants;
                store.constants.push({ lineNumber, resource });
                return;
            }
            // Check whether the line contains a constant, macro or json import
            // if so, store the resource in store
            const importMacro = line.match(/^(.+) is from (.+)/);
            if (importMacro) {
                const [, resource] = importMacro;
                const regexResource = resource.replace(/\$[a-zA-Z0-9_]*/g, '(.+)');
                store.macros.push({ lineNumber, resource: regexResource });
                return;
            }
        }
        // Check whether the line contains a macro definition initializing command
        // if so, store the resource in store
        if (line.startsWith('how to ')) {
            const definedMacro = line.match(/how to (.+)/i);
            if (definedMacro) {
                const [, resource] = definedMacro;
                const regexResource = resource.replace(/\$[a-zA-Z0-9]+/g, '(.)+')
                store.macros.push({ lineNumber, resource: regexResource });
            }
        }
    })
    return store;
}

/**
 * Validate rules against stored syntaxes
 */
function validateRules(textDocument, textLines) {
    const store = extractConstantsAndMacrosFromDocument(textLines);

    // Violation store
    const violations = {
        constantNotUsed: [],
        lineDefinitionNotFound: [],
        constantNotFound: []
    }

    // Check whether the defined or import constants have been used
    store.constants.forEach((constant) => {
        const regExpForConstant = new RegExp(`\\$${constant.resource}`, 'g');
        if (!regExpForConstant.test(textDocument)) {
            violations.constantNotUsed.push(constant);
        }
    })

    let isInMacro = false;
    let isInStartBlock = false;
    textLines.forEach((line, lineNumber) => {
        line = line.trim();
        // Ignore comment lines
        if (line.startsWith('#')) {
            return;
        }
        // Check whether the line contains a constant 
        // if so validate it with the stored constants
        const matches = line.match(/\$[A-Z_][0-9A-Z_]*/g);
        if (matches) {
            matches.forEach((constant) => {
                const isFound = store.constants.find((constantObj) => {
                    return constantObj.resource === constant.replace('$', '');
                });
                if (!isFound) {
                    violations.constantNotFound.push({ lineNumber, resource: constant })
                }
            })
        }
        if (line.startsWith('how to ')) {
            isInMacro = true;
            return;
        }
        if (line.startsWith('start')) {
            isInStartBlock = true;
            return;
        }
        if (isInMacro && line.startsWith('end')) {
            isInMacro = false;
            return;
        }
        if (isInStartBlock && line.startsWith('end')) {
            isInStartBlock = false;
            return;
        }

        // Check whether the line inside the macro or start/end block has been defined in the store
        if (isInMacro || isInStartBlock) {
            const foundInMacros = store.macros.find((macro) => {
                const lineRegex = new RegExp(`${macro.resource}$`, 'g');
                return lineRegex.test(line);
            });
            const foundInCommands = commands.find((command) => {
                const lineRegex = new RegExp(`${command}$`, 'g');
                return lineRegex.test(line)
            });
            if (!(foundInCommands || foundInMacros)) {
                violations.lineDefinitionNotFound.push({ resource: line, lineNumber });
            }
        }
    })

    return violations;
}

module.exports = { validateRules }