const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

class CreateFunctionalComponent {
  constructor() {
    this.getComponentName();
  }  
  
  getComponentName() {
    vscode
    .window
    .showInputBox({prompt: 'Give your component a name...'})
    .then(fileName => {
      this.fileName = fileName;
      this.createComponent();
    });
  }

  createComponent() {
    fs.readFile(
      path.join(__dirname, `../templates/stub-functional-component.js`),
      'utf8',
      (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const newComponent = data.replace('$COMPONENT_NAME$', this.fileName);
          try {
            const location = path.join(__dirname, '../tests');
            if (!fs.existsSync(location)) {
              fs.mkdirSync(location);
            }
            fs.writeFileSync(
              `${__dirname}/src/tests/${this.fileName}.js`,
              newComponent,
              'utf8'
            );
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  }
}

module.exports = CreateFunctionalComponent;