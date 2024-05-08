const Handlebars = require('handlebars');
const open = require('open');
const fse = require('fs-extra');
const { generateData, generateDataPartial } = require('./dataAdapter.cjs')
const { bundle } = require('./rollup.start.cjs')
function run() {
// Read the Handlebars template file
const template = fse.readFileSync('templates/templateA/template.hbs', 'utf-8');

// Compile the template
const compiledTemplate = Handlebars.compile(template);

// const configData = fs.readFileSync('data.json');
// const data = JSON.parse(configData);
const companyInfo = fse.readJSONSync('./company.json');

generateData(companyInfo)
    .then(async data => {
        const folderPath = `dist/${data.id}`;
        fse.mkdirSync(folderPath, { recursive: true })
        fse.writeJson(`${folderPath}/data.json`, data, { spaces: 2 });

        // Render the template with the data
        const generatedHTML = compiledTemplate(data)

        fse.writeFileSync(`${folderPath}/index.html`, generatedHTML);

        const scripts = [
            'worker.js',
            'editor.js'
        ];

        const promises = scripts.map(script => {
            return bundle(`templates/templateA/${script}`, `templates/templateA/assets/js/${script.split('.')[0]}.bundle.js`)
        })
        await Promise.all(promises)

        // assets copy
        fse.cpSync('templates/templateA', folderPath, {
            force: true,
            recursive: true,
            filter: (source, destination) => {
                if (source.endsWith('.hbs')) {
                    return false;
                }
                const filename = source.split('/').slice(-1)[0]
                if (scripts.indexOf(filename) > -1) {
                    return false;
                }
                return true;
            }
        })

        open(`${folderPath}/index.html`)
    })
}

run()