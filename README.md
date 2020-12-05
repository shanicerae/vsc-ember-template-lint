# Description

A simple Visual Studio Code extension to view ember-template-lint results for the active `.hbs` file in your editor.

## Features

- Uses the config defined in the `.template-lintrc.js` file in the root of your project
- Creates an output channel called Template Linter
- Provides commands to:
  - Show the output channel
  - Run the linter on the file currently open in your editor
- Automatically runs the template linter upon saving an hbs file

## Requirements

Extension is only activated when there is an existing `.template-lintrc.js` file in the root of your project
