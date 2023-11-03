var connection = new Postmonger.Session();

connection.trigger("ready")

connection.on("initActivity", () => {
    console.log("클릭했다.")
    alert("커스텀엑티비틔를 설정하세요.")
})

connection.on("clickedNext", () => {
    console.log("완료했다.")
    var configuration = alert("저장 되었습니다.")
    connection.trigger('updateActivity', configuration)
})