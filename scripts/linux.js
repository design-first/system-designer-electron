/*
 * System Designer
 *
 * https://designfirst.io/systemdesigner/
 *
 * Copyright 2022 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const packager = require('electron-packager');
const setLanguages = require('electron-packager-languages');
const package = require('../package.json');

const options = {
  executableName: 'SystemDesigner',
  dir: './',
  out: 'dist',
  platform: 'linux',
  arch: 'x64',
  asar: true,
  overwrite: true,
  icon: 'Icon.png',
  appVersion: package.version,
  buildVersion: package.buildVersion,
  appCopyright: 'Copyright © 2022 Erwan Carriou.',
  afterCopy: [setLanguages([
    'en', 'en-US'
  ])]
};

packager(options)
  .then(path => console.log(`Successfully created System Designer package at ${path}`))
  .catch((err) => {
    console.error('Error creating Linux package:');
    console.error(err, err.stack);
    process.exit(1);
  });