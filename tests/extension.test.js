const { validateRules } = require('../src/ruleEngine');
const fs = require('fs');

describe('extension test suite', () => {
    test('error free script', () => {
        const document = fs.readFileSync('./tests/__mocks__/error-free-script.kasaya', "utf8");
        const textLines = document.split('\n');

        const violations = validateRules(document, textLines);
        expect(violations).toEqual({
            constantNotUsed: [],
            lineDefinitionNotFound: [],
            constantNotFound: []
        });
    })

    test('constants not defined script', () => {
        const document = fs.readFileSync('./tests/__mocks__/constants-not-defined-script.kasaya', "utf8");
        const textLines = document.split('\n');

        const violations = validateRules(document, textLines);
        expect(violations).toEqual({
            constantNotUsed: [],
            lineDefinitionNotFound: [],
            constantNotFound: [
                {
                    "lineNumber": 6,
                    "resource": "$VERSION",
                }
            ]
        });
    })

    test('constants not used script', () => {
        const document = fs.readFileSync('./tests/__mocks__/constants-not-used-script.kasaya', "utf8");
        const textLines = document.split('\n');

        const violations = validateRules(document, textLines);
        expect(violations).toEqual({
            constantNotUsed: [
                {
                    "lineNumber": 1,
                    "resource": "NAME",
                }
            ],
            lineDefinitionNotFound: [],
            constantNotFound: []
        });
    })

    test('macro not defined script', () => {
        const document = fs.readFileSync('./tests/__mocks__/macro-not-defined-script.kasaya', "utf8");
        const textLines = document.split('\n');

        const violations = validateRules(document, textLines);
        expect(violations).toEqual({
            constantNotUsed: [],
            lineDefinitionNotFound: [
                {
                    "lineNumber": 9,
                    "resource": "display",
                }
            ],
            constantNotFound: []
        });
    })


    test('multiple errors script', () => {
        const document = fs.readFileSync('./tests/__mocks__/multiple-error-script.kasaya', "utf8");
        const textLines = document.split('\n');

        const violations = validateRules(document, textLines);
        expect(violations).toEqual({
            constantNotUsed: [
                {
                    "lineNumber": 2,
                    "resource": "ID",
                }
            ],
            lineDefinitionNotFound: [
                {
                    "lineNumber": 11,
                    "resource": "display",
                }
            ],
            constantNotFound: [
                {
                    "lineNumber": 7,
                    "resource": "$VERSION_NUMBER",
                }
            ]
        });
    })
})