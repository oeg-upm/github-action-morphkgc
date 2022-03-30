const core =  require('@actions/core');
const github = require('@actions/github');
const { http, https } = require('follow-redirects');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        const changes = core.getInput('changes', { required: true });
        let output_dir = core.getInput('output_dir', { required: false });
        let output_file = core.getInput('output_file', { required: false });
        let output_format = core.getInput('output_format', { required: false });
        let clean_output_dir = core.getInput('clean_output_dir', { required: false });
        let only_printable_characters = core.getInput('only_printable_characters', { required: false });
        let safe_percent_encoding = core.getInput('safe_percent_encoding', { required: false });
        let na_filter = core.getInput('na_filter', { required: false });
        let na_values = core.getInput('na_values', { required: false });
        let mapping_partition = core.getInput('mapping_partition', { required: false });
        let chunksize = core.getInput('chunksize', { required: false });
        let number_of_processes = core.getInput('number_of_processes', { required: false });
        let logging_level = core.getInput('logging_level', { required: false });
        let logging_file = core.getInput('logging_file', { required: false });

        if(output_dir){
            output_dir='output_dir=' + output_dir;
        }
        if(output_file){
            output_file='output_file=' + output_file;
        }
        if(output_format){
            output_format='output_format=' + output_format;
        }
        if(clean_output_dir){
            clean_output_dir='clean_output_dir=' + clean_output_dir;
        }
        if(only_printable_characters){
            only_printable_characters='only_printable_characters=' + only_printable_characters;
        }
        if(safe_percent_encoding){
            safe_percent_encoding='safe_percent_encoding=' + safe_percent_encoding;
        }
        if(na_filter){
            na_filter='na_filter=' + na_filter;
        }
        if(na_values){
            na_values='na_values=' + na_values;
        }
        if(mapping_partition){
            mapping_partition='mapping_partition=' + mapping_partition;
        }
        if(chunksize){
            chunksize='chunksize=' + chunksize;
        }
        if(number_of_processes){
            number_of_processes='number_of_processes=' + number_of_processes;
        }
        if(logging_level){
            logging_level='logging_level=' + logging_level;
        }
        if(logging_file){
            logging_file='logging_file=' + logging_file;
        }

        core.setOutput('run', false);

        if(fs.mkdirSync('./morph-kgc-exec/', { recursive: true })){
            let data = '[CONFIGURATION]\n#OUTPUT\n' + 
                        /* output optional parameters */
                        output_dir + '\n' + output_file + '\n' + output_format + '\n' + clean_output_dir + '\n' + only_printable_characters + '\n' + safe_percent_encoding + '\n\n#INPUT\n' +
                        /* input parameters */
                        na_filter + '\n' + na_values + '\n\n#MAPPINGS\n' +
                        /* mappings parameters */
                        mapping_partition + '\n\n#MATERIALIZATION\n' +
                        /* materialization parameters */
                        chunksize + '\n\n#MULTIPROCESSING\n' +
                        /* multiprocessing parameters */
                        number_of_processes + '\n\n#LOGS\n' +
                        /* logging parameters */
                        logging_level + '\n' + logging_file;
            fs.writeFile('./morph-kgc-exec/config.ini', data, err => {
                if (err) {
                    core.setFailed(error.message);
                }
            })
        }

        for (const file of changes.split('\n')) {
            let fle = file.split('.');
            const file_extension = fle.pop();
            if (file_extension == 'ttl' || file_extension == 'nt'){
                console.log("entro")
                const mapping_file_extension = fle.pop();
                switch (file_extension) {
                    case 'json':
                    case 'xml':
                    case 'csv':
                    case 'tsv':
                    case 'xlsx':
                    case 'parquet':
                    case 'feather': 
                    case 'orc': 
                    case 'dta':
                    case 'sas':
                    case 'sav':
                    case 'ods':
                        core.setOutput('run', true);
                        break;
                }
                switch (mapping_file_extension) {
                    case 'rml':
                    case 'rml':
                        console.log("entro")
                        fle = fle.join('/').split('/').pop();
                        core.setOutput('run', true);
                        data = '\n\n[' + "mapping_file_" + fle + ']\nmappings=./' + file;
                        fs.appendFile('./morph-kgc-exec/config.ini',data,err => {
                            if (err) {
                                core.setFailed(error.message);
                            }
                        });
                        break;
                }
            }
        }  
    }
    catch (error){
        core.setFailed(error.message);
    }
}

main();
