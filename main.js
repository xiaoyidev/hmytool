function convertViToEn(str, toUpperCase = false) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư

    return toUpperCase ? str.toUpperCase() : str;
}

function removeSpace(str) {
    return str.toString().replace(/\s/g, '');
}

function replaceStr(subStr,str) {
    return str.toString().replace(subStr,"");
}

function showModal(str1, str2) {
    $(".modal-xiaoyi-box > h1").text("Hi, I'm Xiao Yi!");
    $(".modal-xiaoyi-box > p").text(str1+str2);
    $(".container").addClass("faded-xiaoyi")
    $(".modal-xiaoyi").show();

}
function closeModal() {

    $(".ck-editor__editable").removeClass("ck-blurred").addClass("ck-focused");
    $(".container").removeClass("faded-xiaoyi")
    $(".modal-xiaoyi").hide();
}
function generateTable() {
    let text = $(".ck-content > p").text();
    if ("" === text) {

        showModal("Your Text is empty","Cannot generate table!");
    } else {

        let afterText = removeSpace(text);

        let SKU = afterText.toString().substring(0,afterText.toString().indexOf("+")).trim();

        afterText = replaceStr(SKU,afterText).trim();
        convertViToEn(afterText);
        SKU = replaceStr("*Mã",SKU);

        let colorArr = afterText.toString().trim().split("+");

        let color = "", quantity = 0;    
        $.each(colorArr, function (index,value){

            if (value !== "") {
                const elem = value.split(":");
                    if (elem.length > 2) {

                        const sub = value.split("-");
                        // console.log(sub);
                        $.each(sub, function (idx,val) {

                            if (idx > 1) {
                                val = convertViToEn(val).split(/[^A-Za-z]/);

                                // set color
                                color = convertViToEn(val[0]);
    
                                // set quantity
                                quantity = (val[1] !== "" && typeof(val[1]) !=="undefined") ? val[1] : "0";
    
                                $("#result-table").find("tbody").append($('<tr>')
                                    .append($('<td>').append($('<label>')).text(SKU+color))
                                    .append($('<td>').append($('<label>')).text(quantity))
                                ); 
                            }    
                        })
                    } else {

                        // set color
                        color = convertViToEn(elem[0]);

                        // set quantity
                        quantity = (elem[1] !== "" && typeof(elem[1]) !=="undefined") ? elem[1] : "0";

                        $("#result-table").find("tbody").append($('<tr>')
                            .append($('<td>').append($('<label>')).text(SKU+color))
                            .append($('<td>').append($('<label>')).text(quantity))
                        );  
                    }
            }
            
        });   
    }
}

function generateTable2() {

    let text = $(".ck-content > p").text();

    let afterText = text.split("\u00A0");
    let SKU = afterText[0]

    let color = "", quantity = 0;  
    
    $.each(afterText, function(idx,val){
        if(1 < idx) {
            let str = convertViToEn(val);
            console.log(str);
        }
    });

    $("#result-table").find("tbody").append($('<tr>')
                            .append($('<td>').append($('<label>')).text(SKU+color))
                            .append($('<td>').append($('<label>')).text(quantity))
                        );  
}
// get input 
$(document).ready(function() {

    $(".modal-xiaoyi").hide();
    $(".ck-editor__main").css("max-height", "232px !important");

    $("#btn-ok").click(function(){

        closeModal();
    });

    $("#btn-table").click(function() {
        if ($("[name='typeSelect']").val() == 2) {
            generateTable2();
        } else {
            generateTable();
        }
        
    });

    $("#exportButton").click(function () {
        generateTable();

        if (0 < $("#result-table > tbody tr").length) {
            $("#result-table").table2excel({
                filename: "dataHmy",
                type: ".xlsx",
            });
        }  else {

            showModal("Table is empty!"," Cannot export Excel!");
        }
    });

    $("#btn-clear").click(function () {
        $(".ck-content > p").text("")
        $("#result-table > tbody tr").remove();
    });
});

