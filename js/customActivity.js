var connection = new Postmonger.Session();

connection.trigger("ready")

connection.on("initActivity", () => {
    console.log("클릭했다.")
})

connection.on("clickedNext", () => {
    console.log("완료했다.")
    var configuration = "";
    connection.trigger('updateActivity', configuration)
    connection.trigger('requestEndpoints', console.log("요청 엔드포인트"))
})

