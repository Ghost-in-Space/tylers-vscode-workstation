const { window, workspace } = require('vscode');
const path = require('path');
const fs = require('fs');
const config = require('../utils/config');
const { determinePath } = require('../utils/paths');
const { replaceAll } = require('../utils/stub');
const { TEMPLATE_DIR } = require('../utils/constants');

class CreateTest {
  constructor(fileName = null) {
    this.template = path.join(TEMPLATE_DIR, 'stub-jest-test.js');
    if (!fileName) {
      this.getTestName();
    } else {
      this.fileName = fileName;
      this.outputInfo = determinePath(this.fileName, true);
      this.createTest();
    }
  }

  getTestName() {
    window.showInputBox({ prompt: 'Give your component a name...' }).then(fileName => {
      this.fileName = fileName;
      this.outputInfo = determinePath(fileName);
      this.createTest();
    });
  }

  createTest() {
    fs.readFile(this.template, 'utf8', (error, content) => {
      if (error) throw new Error(error);

      this.checkIfFilenameHasDirectory();
      this.createDirectoryIfNotExists();

      const newComponent = replaceAllTest(content, '$COMPONENT_NAME$', this.fileName);
      fs.writeFileSync(this.outputInfo.fullPath, newComponent, 'utf8');

      this.openFileIfNeeded();
    });
  }

  createDirectoryIfNotExists() {
    if (!fs.existsSync(this.outputInfo.dir)) {
      fs.mkdirSync(this.outputInfo.dir);
    }
  }

  checkIfFilenameHasDirectory() {
    if (/\//.test(this.fileName)) {
      const pathSections = this.fileName.split('/');
      this.fileName = pathSections[pathSections.length - 1];
    }
  }

  openFileIfNeeded() {
    if (config().has('testsOpenAfterCreate') && config().get('testsOpenAfterCreate')) {
      const file = workspace.openTextDocument(this.outputInfo.fullPath);
      window.showTextDocument(file);
    }
  }
}

module.exports = CreateTest;
