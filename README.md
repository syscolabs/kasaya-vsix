# Kasāya - VSIX
​
Visual Studio Code extension for [Kasāya](https://github.com/syscolabs/kasaya) scripting.
​

## Features
- Syntax highlighting
- Inline warnings for violations of syntax rules
- Indication of unused Constants
​

## Demo
​
![kasaya-extension](https://user-images.githubusercontent.com/22785263/73328646-8e5e1900-4280-11ea-9314-ae4712a5e2fe.gif)

# Table of Contents

- [Installation Guide](#installation-guide)
- [Development guide](#development-guide)
​​
## Installation Guide
1. Download `.vsix` from releases
2. Open Visual Studio Code
3. Go to `Extensions` or press `Ctrl+Shift+X`
4. Click `More Actions`
5. Click `Install from VSIX...`
6. Select downloaded `.vsix` file
7. Click `install`

​
![extension-installation](https://user-images.githubusercontent.com/22785263/73417744-389c7600-433f-11ea-9968-f8d80afd001b.gif)
​
## Development guide
​
Kasaya VSIX is based on Node JS.
​
#### How to checkout the code
```
$ git clone https://github.com/syscolabs/kasaya-vsix.git
$ cd kasaya-vsix
```
####  How to setup locally
 1. `npm install`
 2. open repository in vscode
 3. press `F5` or Go to `Debug` -> `Start Debugging`