const tasks = JSON.parse(allTasks)
// console.log(tasks)
 var a=0 
 var b=0 
 var c=0 
 var d=0 

 for(task of tasks){ 
     if(task.status == 'All Tasks'){ 
         a+=1 
     }else if(task.status == 'Backlog'){ 
         b+=1 
     }else if(task.status == 'In Progress'){ 
         c+=1 
     }else{ 
         d+=1 
     } 
 } 

let s=a+b+c+d 
var chrt = document.getElementById("chartId").getContext("2d");
var chartId = new Chart(chrt, {
    type: 'pie',
    data: {
        labels: ["Backlog","In progress", "Completed"],
        datasets: [{
            label: "online tutorial subjects",
            data: [b, c, d],
            backgroundColor: ['yellow', 'pink', 'aqua'],
            hoverOffset: 7
        }],
    },
});