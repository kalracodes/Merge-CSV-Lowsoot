const getBtn = document.getElementById('get-btn');
let file_na = document.getElementById("file-name");
let picker = document.getElementById("demoPick");
const data = document.getElementById('dom');
let final_name ="";
var array
file_na.onchange = () => {
    final_name = file_na.value;
}

function dom(str) {
    data.innerHTML = str;
}

picker.onchange = () => {
    readmultifiles(picker.files)
}

function export_csv(csv, fileName) {
    let csvData = new Blob([csv], {
        type: 'text/csv'
    });
    let csvUrl = URL.createObjectURL(csvData);
    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
    return csv;
}

function spliting(str) {
    let splitStrings = [],
        delimiter = ',',
        flag = 0,
        word = "";
    for (i = 0; i <= str.length; i++) {
        if (str[i] == `"`) {
            if (flag == 0) {
                flag = 1;
                delimiter = '^';
            } else {
                flag = 0;
                delimiter = ',';
            }
        }
        if (str[i] == delimiter) {
            splitStrings.push(word);
            word = '';
        } else {
            word += str[i];
        }
    }
    return splitStrings;
}

function removeDuplicates(arr) {
    var unique = [];
    console.log(arr)
    arr.forEach(element => {
        if (element.Email == undefined) {
            console.log(element.Email);
        } else {
            console.log(element.Email);
            if (element.Email.lastIndexOf('@') == -1) {} else {
                unique.push([element["First Name"], element["Last Name"], element["Title"], element["Company"], element["Email"], element["Person Linkedin Url"]]);
            }
        }
    });
    return unique;
}

function csvToArray(str) {
    // covert CSV to array
    const headers = spliting(str.slice(0, str.indexOf("\n")));
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
        const values = spliting(row);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });
    return arr;
}

function readmultifiles(files) {
    array = [];
    var reader = new FileReader();
    let data;

    function readFile(index) {
        if (index >= files.length) {
            array = removeDuplicates(array);
            dom('Unique elements: ' + array.length);
            console.log(array);
            return;
        }
        var file = files[index];
        reader.onload = function (e) {
            data = csvToArray(e.target.result);
            abc = JSON.stringify(data)
            abc = JSON.parse(abc);
            for (let i = 0; i < abc.length; i++) {
                if (JSON.stringify(abc[i]) === '{}') {
                    continue;
                }
                array.push(abc[i]);
            }
            readFile(index + 1)
        }
        reader.readAsText(file);
    }
    readFile(0);
}

function getData() {
    if (final_name == ""){
        dom("Enter file name");
        return;
    }
    let arrayHeader = ["First Name", "Last Name", "Title", "Company", "Email", "Person Linkedin Url"]
    let count = 0;
    let cs = arrayHeader.join(",") + '\n';
    let a = 0;
    let len = array.length;
    let csv
    for (let i = 0; i < len; i++) {
        cs += array[i].join(",");
        cs += '\n';
        if (i+1 == len) {
            csv = export_csv(cs, final_name);
        }
    }
}


getBtn.addEventListener('click', getData);