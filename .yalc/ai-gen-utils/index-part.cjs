const Handlebars = require('handlebars');
const open = require('open');
const fse = require('fs-extra');
const { generateDataPartial } = require('./dataAdapter.cjs')

function partialPatch(id) {
    // Read the Handlebars template file
    const folderPath = `dist/${id}`;

    const template = fse.readFileSync('templates/templateA/template2.hbs', 'utf-8');
    const lastResponse = fse.readJSONSync(`${folderPath}/data.json`);
    delete lastResponse?.raw
    // Compile the template
    const compiledTemplate = Handlebars.compile(template);

    const companyInfo = fse.readJSONSync('./company.json');
    generateDataPartial(companyInfo, lastResponse, 'footer.txt')
        .then(data => {
            const folderPath = `dist/${data.id}`;
            fse.mkdirSync(folderPath, { recursive: true })

            fse.writeJson(`${folderPath}/data.json`, data, { spaces: 2 });

            // Render the template with the data
            
            const generatedHTML = compiledTemplate(data)

            fse.writeFileSync(`${folderPath}/index.html`, generatedHTML);
            // assets copy
            fse.cpSync('templates/templateA', folderPath, {
                force: true,
                recursive: true,
                filter: (source, destination) => {
                    if (source.endsWith('.hbs')) {
                        return false;
                    }
                    return true;
                }
            })

            open(`${folderPath}/index.html`)
        })
}

partialPatch('ddyUYgabmsrP_Qet0YGnD')