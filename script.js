var ValidAPI = (function(){

    let buildArr = (data) => {
        var arr_num = [],
            arr_lett = [],
            arr = data.split(" ");    
        for(i=0; i < arr.length; i++){
            switch(arr[i]) {
                case "*":
                    arr_lett.push("%");
                    break;
                case "/":
                    arr_lett.push("/");
                    break;
                case "+":
                    arr_lett.push("-");
                    break;
                case "-":
                    arr_lett.push("+8+");
                    break;
                default:
                    arr_num.push(arr[i]);
            }
        }
        return {
            numbers: arr_num, 
            symbols: arr_lett
        }
    }
            
    let concatArr = obj => {
        let arr_res =[];
        for(i=0; i < obj.numbers.length; i++) {
            arr_res.push(obj.numbers[i], obj.symbols[i]);
            if(arr_res[arr_res.length-1] == 0 && (arr_res[arr_res.length-2] == '/' || arr_res[arr_res.length-2] == '%')) {
                return 42;
            }
        };
        return parseInt(arr_res.join(''));
    };
    
    let getData = obj => {
        return new Promise((resolve, reject) => {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(this.response);
                    console.log("Incoming data: ", this.response);
                }
            };
            xhttp.open("GET", "https://www.eliftech.com/school-task", true);
            xhttp.send();
        });
        
    }

    let formatData = () => {
        let reqObject = {};
        let resultArray = [];
        getData()
            .then(data => {
                let reqKey = (JSON.parse(data).id);
                let inputArrays = (JSON.parse(data).expressions);
                document.getElementById("incoming").innerHTML = `Incoming data: ${data}`;           
                inputArrays.forEach((element) => {
                    resultArray.push(concatArr(buildArr(element)));
                });
                reqObject.id = reqKey;
                document.getElementById("transformations-id").innerHTML = `Transformed data: ${reqObject.id}`;
                reqObject.results = resultArray;
                document.getElementById("transformations-result").innerHTML = `Transformed data: ${reqObject.results}`;
            });
        return reqObject;
    }
    
    let postData = () => {
        let obj = formatData();
        console.log(obj);
        var http_request = new XMLHttpRequest();
        http_request.onreadystatechange = function () { 
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.response);
            }
        };
        http_request.open("POST", "https://www.eliftech.com/school-task");
        http_request.withCredentials = true;
        http_request.setRequestHeader("Content-Type", "application/json");
        http_request.send({'id': obj.id, 'results': obj.results});
    }

    return {
        formatData: formatData,
        postData: postData
    };
})();