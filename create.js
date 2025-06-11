let args = process.argv.slice(2);

if (args.length < 1) {
  console.log('Usage: new <component-type> <name>');
  process.exit(1);
}

let cmd_args = ['npx','generate-react-cli'];

const componentType = args[0];

if (args.length < 2) {
  console.log('Usage: new component <name>');
  process.exit(1);
}

let locationArray = args[1].split('/');
const fileName = locationArray.pop();

cmd_args.push('component', fileName);

if (componentType === 'page' || componentType === 'pages' || componentType === 'pg')
  cmd_args.push('--type=page');

if (locationArray.length > 0)
  cmd_args.push('--path=src/pages/' + locationArray.join('/'));

var spawn = require('child_process').spawn;
spawn('npx', cmd_args, { stdio: 'inherit' });