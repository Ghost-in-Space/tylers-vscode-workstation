const { window, workspace } = require('vscode');
const path = require('path');
const config = require('./config');

const ROOT_DIR_USER_VARIABLE = /<root>/;
const COMPONENT_DIR_USER_VARIABLE = /<component>/;
const PROJECT_ROOT = workspace.workspaceFolders[0].uri.path;
const CURRENT_FILE_DIR = path.dirname(window.activeTextEditor.document.fileName);
const FILE_EXTENSTION = config().has('componentsFileExtension')
  ? config().get('componentsFileExtension')
  : '.js';

function fileNameHasPath(fileName) {

}

module.exports.determinePath = (fileName, isTestPath = false) => {
  if (/\//.test(fileName)) {
    const pathSections = fileName.split('/');
    const fileName = pathSections[pathSections.length - 1];
    const additionalDir = pathSections.slice(0, pathSections.length - 1);
  }
  const baseOutputPath = basePath(isTestPath);
  const outputFileName = fileName + FILE_EXTENSTION;

  switch (true) {
    case ROOT_DIR_USER_VARIABLE.test(baseOutputPath):
      const rootOutputDir = baseOutputPath.replace(ROOT_DIR_USER_VARIABLE, PROJECT_ROOT);
      return {
        fullPath: path.join(rootOutputDir, outputFileName),
        fileName: outputFileName,
        dir: rootOutputDir,
      };
    case COMPONENT_DIR_USER_VARIABLE.test(baseOutputPath):
      const componentOutputDir = path.join(baseOutputPath.replace(COMPONENT_DIR_USER_VARIABLE, CURRENT_FILE_DIR));
      return {
        fullPath: path.join(componentOutputDir, outputFileName),
        fileName: outputFileName,
        dir: componentOutputDir,
      };
    default:
      const defaultOutputDir = path.join(PROJECT_ROOT, baseOutputPath);
      return {
        fullPath: path.join(defaultOutputDir, outputFileName),
        fileName: outputFileName,
        dir: defaultOutputDir,
      };
  }
};

function basePath(isTestPath) {
  if (isTestPath) {
    if (config().has('testsRoot')) {
      return config().get('testsRoot');
    }
    return '__tests__';
  } else {
    if (config().has('root')) {
      return config().get('root');
    }
    return 'src/components';
  }
}
