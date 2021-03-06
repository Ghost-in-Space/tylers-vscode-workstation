const { window } = require('vscode');
const path = require('path');
const fs = require('fs');
const { determinePath } = require('../utils/paths');
const { replaceAll } = require('../utils/stub');

class CreateFunctionalComponent {
  constructor() {
    this.getComponentName();
  }

  getComponentName() {
    window.showInputBox({ prompt: 'Give your component a name...' }).then(fileName => {
      this.fileName = fileName;
      this.outputInfo = determinePath(fileName);
      this.createComponent();
    });
  }

  createComponent() {
    const content = fs.readFileSync(
      path.join(__dirname, `../templates/stub-functional-component.js`),
      null,
      'utf8'
    );
    const newComponent = replaceAll(content, '$COMPONENT_NAME$', this.fileName);
    if (!fs.existsSync(this.outputInfo.dir)) {
      fs.mkdirSync(this.outputInfo.dir);
    }
    fs.writeFileSync(this.outputInfo.fullPath, newComponent, 'utf8');
  }
}

module.exports = CreateFunctionalComponent;
