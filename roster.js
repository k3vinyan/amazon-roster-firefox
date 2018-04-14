$( document ).ready(function(){
    let driversArray = [];
    $('#pageRosterViewContent').prepend(optionButton('dlRoster', 'Roster Download', '#FFFFFF', '#cc0000', '5px'));

    let node = $('body');
    let roster = $(node).find('#cspDATable > tbody')[1].children;

    for(let i = 0; i < roster.length; i++){
      let driver = $(roster[i], 'tr')[0].children;
      let driverId = $(driver[0]).text();
      let driverName = $(driver[1]).text();
      let driverCurrentStatus = $(driver[2]).text();
      let driverBlockTime = $(driver[4]).text();
      let driverStartTime = $(driver[5]).text();
      let driverEndTime = $(driver[6]).text();

      driversArray.push({'id': driverId, 'name':driverName, 'blockTime': driverBlockTime, 'startTime': driverStartTime, 'endTime': driverEndTime});
    }

    //click event for excel file
    $("#dlRoster").click(function(){
       //time in miliary hours;
       let hourNow = new Date().getHours();

       //prompt for time
       let time = prompt("Input Military Hour?", hourNow);
       let headers = ['Driver Name', 'Driver ID', 'Block Time', 'Start Time', 'End Time', 'Check-In', 'Check-Out'];
       let excel = $JExcel.new();
       console.log(excel);
       //format for headers
       var formatHeader = excel.addStyle({border: "none,none,none,thin #551A8B",font: "Calibri 12 #FFFFFF B", fill: "#000000"});
       console.log(formatHeader)

       for(let i=0; i < headers.length; i++){
         excel.set(0, i, 0, headers[i], formatHeader);
         if(i == 2) {
           excel.set(0, i, undefined, 9);
         } else if(i == 3 || i == 4){
            excel.set(0, i, undefined, 9);
         } else if(i == 5 || i == 6){
            excel.set(0, i, undefined, 10);
         } else {
            excel.set(0, i, undefined, "auto");
         }
       }

       let sortedArray = sortArray();

        let position = 1;
        for(let i=1; i < sortedArray.length; i++){
          let driverStartTime = convertToTime(sortedArray[i]['startTime']);

          if(driverStartTime > time){
            excel.set(0,0,position, sortedArray[i]['name']);
            excel.set(0,1,position, sortedArray[i]['id']);
            excel.set(0,2,position, sortedArray[i]['blockTime']);
            excel.set(0,3,position, sortedArray[i]['startTime']);
            excel.set(0,4,position, sortedArray[i]['endTime']);
            position++;
          }
        }

        excel.generate("rosters.xlsx");
      });

    //sort array alphabetically and by time block
    function sortArray(){
      let startTime;
      let endTime;
      let sortArray = [];
      let result = [];

      for(let i = 0; i < driversArray.length; i++){
        if(startTime == undefined){
          startTime = driversArray[i]['startTime'];
          //endTime = driversArray[i]['endTime'];
        }
        if(startTime == driversArray[i]['startTime']){
          sortArray.push(driversArray[i])
        } else{
          startTime = driversArray[i]['startTime'];
          //endTime = driversArray[i]['endTime'];
          sortArray.sort(function(a,b){
            let nameA = a.name.toLowerCase();
            let nameB = b.name.toLowerCase();

            if(nameA < nameB){
              return -1;
            }
            if(nameA > nameB){
              return 1;
            }
            return 0;
          })

          for(let i = 0; i < sortArray.length; i++){
            result.push(sortArray[i]);
          }

          sortArray = [];
          sortArray.push(driversArray[i])

        }
      }
     return result;
    }

    //convert drivers startime to Military hours(integers)
    function convertToTime(time){
      let strNum = "";
      let period = "";
      let num;
      if(time[2] == ":"){
        strNum += time[0] + time[1];
        period += time[6] + time[7];
      } else {
        strNum += time[0];
        period += time[5] + time[6];
      }

      if(period == "pm" && strNum != "12"){
        num = parseInt(strNum) + 12;
      } else {
        num = parseInt(strNum)
      }

      return num;
    }

    //create button with additonal options
    function optionButton(id, value, color, bgColor, padding){
      var id = id;
      var value = value;
      var color = color;
      var bgColor = bgColor;
      var padding = padding;
      var string;

      string = "<input id='" + id + "' type='button' value='" + value +
      "' style='" +"color: " + color + "; " + "background-color:" + bgColor +
      "; " + "padding: " + padding + "; border-style: none;'></button>";

      return string;
    };
});
