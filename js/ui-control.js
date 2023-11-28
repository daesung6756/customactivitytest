let returnMessage = []
let imageFileArray = []
let totalImageSize = 0;

let messageType
let messageTitle = returnMessage[1]
let messageContent = returnMessage[2]
let messageTotal = returnMessage[1] + returnMessage[2]
let imageGroup = imageFileArray
let surveyStatus = false

// 인풋 작성한 내용 뷰화면 처리
function inputValueViewWrite(elem) {
    const $title = document.querySelector("[data-view-title]");
    const $content = document.querySelector("[data-view-content]");
    let $value = elem.value;

    const eventOneRequest = setTimeout(() => {
        elem.nodeName === "INPUT" ?
            (
                returnMessage[1] = $value,
                    $title.innerHTML = returnMessage[1]
            ) : (
                returnMessage[2] = $value.replaceAll(/(?:\r\n|\r|\n)/g, "<br/>"),
                    $content.innerHTML = returnMessage[2]
            )

        getByteLength(returnMessage, 0)
        clearTimeout(eventOneRequest)
    }, 300)
}

// 싱글 체크박스 값 전달
function singleCheckboxReturn( elem ) {
    const checkbox = elem;
    return surveyStatus = checkbox.checked
}

// 포커스에 컨텐츠 삽입
function insertCursorOffset( button ) {
    const $textarea = document.querySelector("[data-insert-textarea]");
    const $value = $textarea.value;
    const $addValue = button.dataset.propsCode;

    let cursorStart = $textarea.selectionStart;
    let cursorEnd = $textarea.selectionEnd;

    const positionBefore = $value.substring(0, cursorStart);  // 기존텍스트 ~ 커서시작점 까지의 문자
    const positionAfter = $value.substring(cursorEnd, $value.length);   // 커서끝지점 ~ 기존텍스트 까지의 문자

    $textarea.value = positionBefore + $addValue + positionAfter;

    inputValueViewWrite($textarea, "[data-view-content]")

    cursorStart = cursorStart + $addValue ;
    $textarea.selectionStart = cursorStart; // 커서 시작점을 추가 삽입된 텍스트 이후로 지정
    $textarea.selectionEnd = cursorStart; // 커서 끝지점을 추가 삽입된 텍스트 이후로 지정
    $textarea.focus();
}

// 메세지 용량 계산
function getByteLength ( messages , blank ){
    const elementView = document.querySelector("[data-view-size]")
    let limit = 2000;
    let byte = 0;
    const reg = /[ㄱ-ㅎㅏ-ㅣ가-힣一-龥ぁ-ゔァ-ヴー々〆〤]/;

    messages.forEach((msg) => {
        if (blank === 0) {
            msg = msg.replace(/\s+/g,"");
        }

        for( let i=0; i < msg.length;i++) {
            if (reg.test(msg[i])) {
                byte += 2
            } else {
                byte++
            }
        }


        byte > 90 ?
            (
                elementView.innerHTML = `${byte} byte /2000 byte`,
                    alert("MMS"),
                    messageType = "MMS"

            ) : (
                elementView.innerHTML = `${byte} byte /90 byte`,
                    messageType = "SMS"
            )

    })

}

// 이미지를 리스트와 뷰어에 추가하는 함수
function addImageToList(fileInput) {
    const files = fileInput.files;

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        // FileReader를 사용하여 이미지를 읽습니다.
        let reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                // 파일 정보 객체 생성
                const byteUnits = ["kb","mb","gb","tb"]
                const sizeView = document.getElementById("imageFileSize");
                let returnSize =  ""
                let returnType = ""

                let size = theFile.size;
                for (let i = 0; i < byteUnits.length; i++) {
                    size = Math.floor(size / 1024);
                    if (size < 1024) {
                        sizeView.innerHTML = `${size.toFixed(1)} ${byteUnits[i]}/ 5MB`
                        returnSize = size.toFixed(1);
                        returnType = byteUnits[i];
                        break;
                    }
                }

                const fileInfo = {
                    name: theFile.name,
                    size: returnSize ,
                    sizeType: returnType ,
                    src: URL.createObjectURL(file)
                }


                // 이미지 파일 배열에 파일 정보 추가
                imageFileArray.push(fileInfo);

                // 리스트에 이미지 정보 추가
                updateImageList();
            };
        })(file);

        // 이미지 파일 읽기
        reader.readAsDataURL(file);
    }

    fileInput.value = '';
}

// 이미지 추가 용량 처리
function addSize(size) {
    totalImageSize = totalImageSize + Number(size); // 총 크기에 더합니다.
    updateTotalSizeDisplay();
}

// 이미지 삭제 용량 처리
function subtractSize(size) {
    totalImageSize = totalImageSize - Number(size); // 총 크기에서 뺍니다.
    updateTotalSizeDisplay();
}

// 변경사항 이미지 추가/삭제 용량 뷰처리.
function updateTotalSizeDisplay() {
    const sizeView = document.getElementById("imageFileSize");
    sizeView.innerHTML = `${totalImageSize} kb / 1MB`
    // 여기서는 단순히 콘솔에 로그를 찍고 있지만, 웹페이지에서 적절한 요소를 업데이트해야 합니다.
    console.log(`Total size: ${totalImageSize} bytes`);
}

// 이미지 리스트를 업데이트하는 함수
function updateImageList() {
    const list = document.querySelector('.image-list');
    const view = document.querySelector("[data-view-images]")
    totalImageSize = 0;
    list.innerHTML = ''; // 리스트 초기화
    view.innerHTML = ''; // 이미지 뷰 초기화

    imageFileArray.length > 0 ?

        imageFileArray.forEach(function(fileInfo, index) {
            const listItem = document.createElement('div');
            listItem.className = 'image-list-item';

            const text = document.createTextNode(`${fileInfo.name}, 크기: ${fileInfo.size} bytes`);
            listItem.appendChild(text);

            addSize(fileInfo.size)

            // 삭제 버튼 생성
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.onclick = function() {
                // 이미지 파일 배열과 리스트에서 해당 파일 정보 삭제
                subtractSize(imageFileArray[index].size)
                imageFileArray.splice(index, 1);
                updateImageList();

            };

            listItem.appendChild(deleteButton);

            // 이미지 미리보기 추가
            const imgPreview = document.createElement('img');
            imgPreview.src = fileInfo.src;
            view.appendChild(imgPreview);

            list.appendChild(listItem);
        })
        : list.innerHTML = "<p>파일을 선택하세요.</p>"
}

// 작성 내용 서버에 포스트 처리.
async function postData(){
    sendData = {
        messageType : messageType,
        messageTitle : returnMessage[1],
        messageContent : returnMessage[2],
        messageTotal : returnMessage[1] + returnMessage[2],
        imageGroup : imageFileArray,
        surveyStatus: surveyStatus,
    }
    //console.log(sendData)
    // POST 요청을 보내는 함수
    const url = 'http://172.20.4.200:8080/';
    axios.post(url, sendData)
        .then((response) => {
            console.log(response.data)
            alert('POST 전송성공')
        })
        .catch((error) => {
            console.error(error);
            alert('POST 전송실패')
        })
}

const UI = {
    init : function () {
        this.messageTypeSelect.init();
        this.messageInputView.init();
        this.toggles.init();
    },
    messageTypeSelect : {
        name: "UI > Message type Radio",
        items : document.querySelectorAll("[data-messagetype]"),
        phoneElement : document.querySelector(".phone-wrap"),
        init: function () {
            this.items.length > 0 ?
                this.events()
                : false
        },
        events: function () {
            const _this = this;
            const elem = document.querySelector(".notification-wrap");
            this.items.forEach((radio) => {
                radio.checked === true ?
                    radio.id === "sms" || radio.id === "kko" ?
                        (
                            messageType  = "SMS" || "KKO",
                                _this.phoneElement.classList.add(radio.id)
                        ) : _this.phoneElement.classList.remove(radio.id)
                    : false

                radio.addEventListener("click", () => {
                    radio.id === "sms" ?
                        (
                            _this.phoneElement.classList.remove("kko"),
                                _this.phoneElement.classList.add("sms"),
                                elem.classList.remove("is-hide"),
                                messageType  = "SMS"
                        ) : (
                            _this.phoneElement.classList.remove("sms"),
                                _this.phoneElement.classList.add("kko"),
                                elem.classList.add("is-hide"),
                                messageType  = "KKO"
                        )

                })
            })
        }
    },
    messageInputView: {
        name: 'UI > input message view',
        limitByte : 90,
        init : function () {
            this.events()
        },
        events: function () {

        },
        notification : function ( status ) {
            const elem = document.querySelector(".notification-wrap");
            status === "SMS" ? elem.innerHTML = "SMS" : elem.innerHTML = "MMS"
            elem.classList.remove("is-ani")
            const addAnimation = setTimeout(()=> {
                elem.classList.add("is-ani")
                clearTimeout(addAnimation)
            }, 300)
        },
    },
    toggles : {
        items: document.querySelectorAll("[data-toggle]"),
        itemArray : [],
        init : function () {
            this.items.length > 0 ?
                this.dataCollection()
                : false
        },
        dataCollection: function () {
            this.items.forEach((item) => {
                this.itemArray.indexOf(item.dataset.toggle) === -1 ?
                    this.itemArray.push(item.dataset.toggle) : false
            })
            this.events()
        },
        events: function() {
            this.itemArray.forEach((dataName) => {
                const action = document.querySelector(`[data-toggle=${dataName}]`)
                const panel = document.querySelector(`[data-toggle-panel=${dataName}]`)

                action.addEventListener("click", () => {
                    action.classList.toggle('is-active')
                    panel.classList.toggle("is-show")
                })
            })
        }
    }
}

//UI Run
UI.init()
