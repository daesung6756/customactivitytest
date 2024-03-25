
const connection = new Postmonger.Session();

connection.trigger("ready", ()=> {
    console.log("ready 된 상태")
})

connection.trigger('requestTokens', () => {
    console.log("requestTokens 발동")
});
connection.trigger('requestEndpoints', () => {
    console.log("requestEndpoints 발동")
});
connection.trigger('nextStep', () => {
    console.log("nextStep 발동")
});
connection.trigger('prevStep', () => {
    console.log("prevStep 발동")
});
connection.trigger('requestCulture', () => {
    console.log("requestCulture 발동")
});
connection.trigger('destroy', () => {
    console.log("destroy 발동")
});

connection.trigger('requestInteractionDefaults', () => {
    console.log('requestInteractionDefaults 발동')
});

connection.trigger('requestInteraction', () => {
    console.log('requestInteraction 발동')
});

connection.on("initActivity", (payload) => {
    console.log("initActivity 발동", console.log(payload))
})

connection.on("clickedNext", () => {
    console.log("넥스트 클릭.")
    var configuration = "";
    connection.trigger('updateActivity', configuration)
    connection.trigger('requestEndpoints', console.log("요청 엔드포인트"))
})

