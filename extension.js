const vscode = require('vscode');
const { config } = require('./src/config');
const { validateRules } = require('./src/ruleEngine');

/**
 * Activation function which is called as soon as the app is started
 */
function activate() {
	console.log('Kasaya extension in action..!');
	const vscodeDiagnostic = vscode.languages.createDiagnosticCollection('kasaya');

	/**
	 * Event handler function which validates the rules
	 */
	const vscodeEventHandler = (content) => {
		// Clearing existing store details
		vscodeDiagnostic.clear();
		if (content && content.document && content.document.fileName.endsWith('.kasaya')) {
			const textDocument = content.document.getText();
			const textLines = textDocument ? textDocument.split('\n') : [];
			const violations = validateRules(textDocument, textLines);
			const diagnostics = analyzeDiagnostics(violations, textLines);
			vscodeDiagnostic.set(vscode.window.activeTextEditor.document.uri, diagnostics);
		}
	};

	// Rules are validated for each change done in the document
	vscode.workspace.onDidChangeTextDocument(vscodeEventHandler);
	// Rules are validated when the document is saved
	vscode.workspace.onWillSaveTextDocument(vscodeEventHandler);
}

/**
 * Add violated rules as diagnostic objects which are used by vscode to display warnings & errors
 */
function analyzeDiagnostics(violations, textLines) {
	const diagnostics = [];
	if (config && config.rules) {
		Object.keys(config.rules).forEach((ruleKey) => {
			const ruleConfig = config.rules[ruleKey];
			const violationList = violations[ruleKey];
			if (violationList) {
				violationList.forEach((item) => {
					const startCharCount = textLines[item.lineNumber].indexOf(item.resource);
					const endCharCount = startCharCount + item.resource.length;
					const diagnosticObj = createDiagnostic(ruleConfig.message, item.lineNumber, startCharCount, endCharCount, ruleConfig.errorType);
					diagnostics.push(diagnosticObj);
				})
			}
		})
	}
	return diagnostics;
}

/**
 * Create diagnostic objects which are used by vscode to display warnings & errors
 */
function createDiagnostic(message, lineNumber, start, end, severityType) {
	const diagnostic = {
		message: message,
		range: new vscode.Range(new vscode.Position(lineNumber, start), new vscode.Position(lineNumber, end)),
		severity: vscode.DiagnosticSeverity[severityType],
	};
	return diagnostic;
}

/**
 * Deactivate function is called when the app is closed
 */
function deactivate() {
	console.log("Leaving Kasaya extension..!")
}

module.exports = {
	activate,
	deactivate
}
