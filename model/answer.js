class Answer {
  constructor(data) {
    this.setAnswer(data);
  }

  setAnswer(data) {
    this.user_id = data.user_id;
    this.value = data.value;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  //   setAnswersValue(id, value) {
  //     console.log("this.value->", this.value[id]);
  //     console.log("id->", id);
  //     console.log("value->", value);
  //     let _valueId = this.value[id];
  //     _valueId.push(Number(value));
  //     console.log("_updateValue->", _valueId);
  //     this.value = {
  //       ...this.value,
  //       [id]: _valueId,
  //     };
  //   }

  addValue(id, value, limit) {
    let _valueId = this.value[id];

    let _valueIdLength = _valueId.length;

    if (_valueIdLength === limit) _valueId[_valueIdLength - 1] = value;
    else _valueId.push(value);

    this.value = {
      ...this.value,
      [id]: _valueId,
    };
  }

  removeValue(id, value) {
    let _valueId = this.value[id];
    _valueId = _valueId.filter((v) => v !== value);
    this.value = {
      ...this.value,
      [id]: _valueId,
    };
  }

  getAnswer() {
    return this;
  }

  getAnswersValue() {
    return this.value;
  }
}
