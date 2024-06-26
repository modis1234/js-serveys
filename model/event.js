class Event {
  constructor(data) {
    this.setEvent(data);
  }

  setEvent(data) {
    this.id = data.id;
    this.title = data.title;
    this.event_type = data.event_type;
    this.header_img = data.header_img;
    this.background_color = data.background_color;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.event_answer = data.event_answer;
    this.blocks = data.blocks;
  }

  getEvent() {
    return this;
  }

  updateEvent(key, value) {
    if (this?.[key] !== undefined) return;
    this[key] = value;
  }
}
