# date-tiem-picker #

> 小程序date-time-picker

## 用法 ##

```javascript
{
  "usingComponents": {
    "date-time-picker": "./components/date-time-picker/index"
  }
}
```

```html
<date-time-picker>
  <view>选择日期</view>
</date-time-picker>
```

## 属性 ##

| 属性        | 类型    |  说明  |
| --------   | -----:   | :----: |
| header-text        | string      |   选择器的标题，仅安卓可用    |
| disabled        | boolean   |   是否禁用    |
| value        | number, string      |   表示选中的日期，格式为"yyyy-MM-dd hh:mm:ss"，或者时间戳    |
| format        | string     |   返回的格式化后的值，格式为"yyyy-MM-dd hh:mm:ss"，或者timestamp    |
| start        | string     |   表示有效日期范围的开始，格式为"yyyy-MM-dd hh:mm:ss"    |
| end        | string     |   表示有效日期范围的结束，格式为"yyyy-MM-dd hh:mm:ss"    |
| fields        | string     |  有效值 year,month,day,hour,minute,second, 表示选择器的粒度   |
| bindcancel        | eventhandle      |   取消选择时触发	    |
| bindchange        | eventhandle      |   value 改变时触发 change 事件，event.detail = {value}	    |