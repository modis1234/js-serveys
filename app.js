document.addEventListener("DOMContentLoaded", function () {
  const blockListEl = document.querySelector("#block-list-box");

  // 현재 URL의 쿼리 스트링을 가져옴
  // const queryString = window.location.search;

  // // URLSearchParams 객체를 사용하여 쿼리 스트링을 파싱
  // const urlParams = new URLSearchParams(queryString);

  // // 특정 쿼리 파라미터의 값을 가져옴 (예: ?name=John 일 때)
  // const userId = urlParams.get("user_id");
  // const eventId = urlParams.get("event_id");
  // console.log("userId->", userId); // "John"
  // console.log("eventId->>", eventId); // "John"

  // if (userId === null || eventId === null) {
  //   document.body.innerHTML = "<div>Not found</div>";
  //   return false;
  // }

  let event;
  let answer;

  function getEvent() {
    fetch(
      `https://event-assignment.buzzni.net/event/3?user_id=38b8599ddba36ece1f08`
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json(); // JSON 데이터를 추출합니다.
      })
      .then(function (data) {
        event = new Event(data.payload);

        const headerImg = data.payload.header_img;
        blockListEl.style.backgroundColor = data.payload.background_color;
        selectBlockRender();
        loadImage(headerImg);
      })
      .catch(function (error) {
        //   userResult.textContent = "Error: " + error.message;
      });
  }

  function postEvent({ event_id, user_id, value }) {
    fetch(`https://event-assignment.buzzni.net/event/${event_id}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,
        value,
      }),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json(); // JSON 데이터를 추출합니다.
      })
      .then(function (data) {
        console.log(data);
      });
  }

  function getAnswers({ event_id }) {
    fetch(`https://event-assignment.buzzni.net/event/${event_id}/answers`)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json(); // JSON 데이터를 추출합니다.
      })
      .then(function (data) {
        console.log(data);
      });
  }

  // 체크박스의 체크된 개수를 반환하는 함수
  function getCheckedCount(checkboxes) {
    let checkedCount = 0;
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkedCount++;
      }
    });
    return checkedCount;
  }

  function handleChange(event) {
    const inputElement = event.target;
    const value = inputElement.value;
    const checked = inputElement.checked;
    const name = inputElement.name;

    const limit = Number(inputElement.getAttribute("data-limit"));

    // 추가 로직을 여기에 추가합니다.
    const answerValue = answer.getAnswer().value;
    if (checked) {
      let checkboxEL = document.getElementsByName(name);
      const checkedCount = getCheckedCount(checkboxEL);
      if (limit < checkedCount) {
        inputElement.checked = false;
        return false;
      }
      answer.addValue(name, Number(value), limit);
    } else {
      answer.removeValue(name, Number(value));
    }
  }

  function selectBlockRender() {
    const selectBlockEL = document.createElement("div");
    selectBlockEL.className = "block-items";
    const data = event.getEvent();
    answer = new Answer(data.event_answer);
    const answerValue = answer.getAnswer().value;

    const _blockList = data.blocks;
    let blockContents = ``;

    _blockList.forEach((block) => {
      const { id: blockId, block_type, option } = block;

      if (block_type === "select") {
        const { title, items, limit, paddingBottom } = option;

        blockContents += `
        <div class="block-item select-block" style="margin-bottom: ${paddingBottom}px;">
            <div class="title">${title}</div>
            <div class="division" style="border:1px dotted #F5F5F5; margin-top: 15px;margin-bottom: 15px;"></div>
            <div class="item-list item-${blockId}">
            ${items
              .map((item, index) => {
                // event_answer.value[blockId]에 index가 포함되어 있으면 checked
                const _checked = answerValue?.[blockId]?.includes(index);

                return `<input 
                    type=${limit !== "1" ? "checkbox" : "radio"} 
                    name=${blockId}
                    value=${index} 
                    ${_checked ? "checked" : ""}
                     data-block-id="${blockId}" 
                     data-limit=${limit}
                  />
                  <label>${item}</label><br/>`;
              })
              .join("")}
            </div>
        </div>`;
      } else if (block_type === "image") {
        const { src, paddingBottom, width } = option;
        blockContents += `
          <div class="block-item image-block" style="padding-bottom: ${paddingBottom}px;">
            <img src=${src} alt="BLOCK"/>
          </div>
        `;
      } else if (block_type === "submit") {
        const { btnImg, paddingBottom, submitMsg, width } = option;
        blockContents += `
          <div class="block-item submit-button" style="padding-bottom: ${paddingBottom}px;">
            <img src=${btnImg} alt="BLOCK"/>
          </div>`;
      }
    });

    selectBlockEL.innerHTML = blockContents;

    blockListEl.appendChild(selectBlockEL);

    // 이벤트 리스너를 추가합니다.
    const inputs = selectBlockEL.querySelectorAll(
      'input[type="checkbox"], input[type="radio"]'
    );
    inputs.forEach((input) => {
      input.addEventListener("change", handleChange);
    });
  }

  /**
   * 이미지 로드 함수
   * @param {string} src data.payload.header_img
   */
  function loadImage(src) {
    const headerImgEL = document.querySelector("#header-img");
    headerImgEL.src = src;
    headerImgEL.onload = function () {
      console.log("Image loaded successfully.");
      headerImgEL.style.display = "block"; // Display the image after it has loaded
    };
    headerImgEL.onerror = function () {
      console.log("Failed to load the image.");
    };
  }

  // 쿼리 스트링을 객체로 변환하는 함수
  function getQueryParams(query) {
    const params = {};
    new URLSearchParams(query).forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }

  function setAnswerValue() {}

  getEvent();
});
