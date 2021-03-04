import yargs from 'yargs';
import {generateSrc, Template} from './generate-src';
import {cleanUp} from './clean-up';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const inquirer = require('inquirer');

function validateTemplateIdentifier(templateIdentifier: string): Template {
  if (isTemplate(templateIdentifier)) {
    return templateIdentifier;
  }
  throw new Error(`Unknown template: ${templateIdentifier}`);
}

function isTemplate(
  templateIdentifier: string
): templateIdentifier is Template {
  for (const key in Template) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((Template as any)[key] === templateIdentifier) {
      return true;
    }
  }
  return false;
}

async function getTemplateIdentifier() {
  const response = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select template:',
      min: 1,
      max: 1,
      instructions: false,
      choices: Object.values(Template),
    },
  ]);
  const {template} = response;
  return template;
}

(async () => {
  const {type: extensionPoint, template: templateIdentifier} = yargs.argv;
  console.log('Create ', extensionPoint, ' extension project');
  if (!extensionPoint) {
    console.error(
      `
Warning: Unknown extension point ${extensionPoint}.
Please use a supported extension type and generate your project manually.
See README.md for instructions.
      `
    );
    return;
  }

  const template = templateIdentifier
    ? validateTemplateIdentifier(templateIdentifier as string)
    : await getTemplateIdentifier();

  console.log('✅ You selected:', template);

  generateSrc(template as Template);
  cleanUp();
})();
