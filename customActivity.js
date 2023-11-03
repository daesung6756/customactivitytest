var connection = new Postmonger.Session();

connection.trigger("ready")

connection.on("initActivity", (data) => {
    console.log("등록 했다.")
    document.getElementById('configuration').value = JSON.stringify(data , null , 2)
})

connection.on("clickedNext", () => {
    console.log("클릭했다.")
    var configuration = JSON.parse(document.getElementById('configuration').value)
    connection.trigger('updateActivity', configuration)
})