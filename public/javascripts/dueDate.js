convertDate = function(str){
    const due = new Date(str);
    let strDay = due.getDate();
    let strMon = due.getMonth()+1;
    let strYear = due.getFullYear();
    let newDueDate = `${strDay}-${strMon}-${strYear}`;
    return newDueDate;
}

module.exports = convertDate;