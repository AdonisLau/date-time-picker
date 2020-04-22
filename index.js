import { genRangesByField, genDateTime, getMonthDays, toDate, formatDate } from './utils';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fields: {
      type: String,
      value: 'second'
    },

    value: {
      type: [String, Number, Date],
      value: ''
    },

    format: {
      type: String,
      value: 'timestamp'
    },

    start: {
      type: String,
      value: ''
    },

    end: {
      type: String,
      value: ''
    },

    disabled: {
      type: Boolean,
      value: false
    },

    headerText: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    ranges: [],
    datetime: []
  },

  lifetimes: {
    attached() {
      let datetime = genDateTime(this.data.value);
      let ranges = genRangesByField(this.data.fields);

      this._datetime_ = datetime.slice(0, ranges.length);

      this.setData({
        ranges,
        datetime: this._datetime_.slice()
      });
    }
  },

  observers: {
    value(value) {
      // attached会执行
      if (!this._datetime_) {
        return;
      }

      let datetime = genDateTime(value);

      this._datetime_ = datetime.slice(0, this._datetime_.length);

      this.setData({
        datetime: this._datetime_.slice()
      });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleColumnChange(e) {
      let datetime = this._datetime_;
      let { column, value } = e.detail;

      datetime[column] = value;

      let needToReset = false;
      let len = datetime.length;
      // 判断日是否超出当前月
      if (column < 3 && len >= 3) {
        let year = datetime[0];
        let month = datetime[1];
        let day = datetime[2];
        let days = getMonthDays(year, month);
        let index = days - 1;

        if (index < day) {
          needToReset = true;
          datetime[2] = index;
        }
      }

      if (this.data.start) {
        let min = this.min || (this.min = genDateTime(this.data.start));
        let timestamp = this.min_timestamp || (this.min_timestamp = toDate(min).getTime());
  
        datetime.some((v, i) => {
          let t = toDate(datetime).getTime();

          if (t >= timestamp) {
            return true;
          }

          if (v < min[i]) {
            needToReset = true;
            datetime[i] = min[i];
          }
        });
      }

      if (this.data.end) {
        let max = this.max || (this.max = genDateTime(this.data.end));
        let timestamp = this.max_timestamp || (this.max_timestamp = toDate(max).getTime());
  
        datetime.some((v, i) => {
          let t = toDate(datetime).getTime();

          if (t <= timestamp) {
            return true;
          }

          if (v > max[i]) {
            needToReset = true;
            datetime[i] = max[i];
          }
        });
      }

      if (needToReset) {
        this.setData({
          datetime: datetime.slice()
        });
      }
    },

    handleChange() {
      let format = this.data.format;
      let date = toDate(this._datetime_);

      this.setData({
        datetime: this._datetime_.slice()
      });

      if (format === 'timestamp') {
        date = date.getTime();
      } else {
        date = formatDate(date, format);
      }

      this.triggerEvent('change', { value: date });
    },

    handleCancel() {
      this.triggerEvent('cancel', {});
    }
  }
})
