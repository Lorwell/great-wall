import * as echarts from 'echarts';

echarts.registerTheme('light',
  {
    "color": [
      "#516b91",
      "#59c4e6",
      "#edafda",
      "#93b7e3",
      "#a5e7f0",
      "#cbb0e3"
    ],
    "backgroundColor": "rgba(0,0,0,0)",
    "textStyle": {},
    "title": {
      "textStyle": {
        "color": "#516b91"
      },
      "subtextStyle": {
        "color": "#93b7e3"
      }
    },
    "line": {
      "itemStyle": {
        "borderWidth": "2"
      },
      "lineStyle": {
        "width": "2"
      },
      "symbolSize": "6",
      "symbol": "emptyCircle",
      "smooth": true
    },
    "radar": {
      "itemStyle": {
        "borderWidth": "2"
      },
      "lineStyle": {
        "width": "2"
      },
      "symbolSize": "6",
      "symbol": "emptyCircle",
      "smooth": true
    },
    "bar": {
      "itemStyle": {
        "barBorderWidth": 0,
        "barBorderColor": "#ccc"
      }
    },
    "pie": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "scatter": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "boxplot": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "parallel": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "sankey": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "funnel": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "gauge": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "candlestick": {
      "itemStyle": {
        "color": "#edafda",
        "color0": "transparent",
        "borderColor": "#d680bc",
        "borderColor0": "#8fd3e8",
        "borderWidth": "2"
      }
    },
    "graph": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      },
      "lineStyle": {
        "width": 1,
        "color": "#aaaaaa"
      },
      "symbolSize": "6",
      "symbol": "emptyCircle",
      "smooth": true,
      "color": [
        "#516b91",
        "#59c4e6",
        "#edafda",
        "#93b7e3",
        "#a5e7f0",
        "#cbb0e3"
      ],
      "label": {
        "color": "#eeeeee"
      }
    },
    "map": {
      "itemStyle": {
        "areaColor": "#f3f3f3",
        "borderColor": "#516b91",
        "borderWidth": 0.5
      },
      "label": {
        "color": "#000"
      },
      "emphasis": {
        "itemStyle": {
          "areaColor": "#a5e7f0",
          "borderColor": "#516b91",
          "borderWidth": 1
        },
        "label": {
          "color": "#516b91"
        }
      }
    },
    "geo": {
      "itemStyle": {
        "areaColor": "#f3f3f3",
        "borderColor": "#516b91",
        "borderWidth": 0.5
      },
      "label": {
        "color": "#000"
      },
      "emphasis": {
        "itemStyle": {
          "areaColor": "#a5e7f0",
          "borderColor": "#516b91",
          "borderWidth": 1
        },
        "label": {
          "color": "#516b91"
        }
      }
    },
    "categoryAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#cccccc"
        }
      },
      "axisTick": {
        "show": false,
        "lineStyle": {
          "color": "#333"
        }
      },
      "axisLabel": {
        "show": true,
        "color": "#999999"
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#eeeeee"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.05)",
            "rgba(200,200,200,0.02)"
          ]
        }
      }
    },
    "valueAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#cccccc"
        }
      },
      "axisTick": {
        "show": false,
        "lineStyle": {
          "color": "#333"
        }
      },
      "axisLabel": {
        "show": true,
        "color": "#999999"
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#eeeeee"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.05)",
            "rgba(200,200,200,0.02)"
          ]
        }
      }
    },
    "logAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#cccccc"
        }
      },
      "axisTick": {
        "show": false,
        "lineStyle": {
          "color": "#333"
        }
      },
      "axisLabel": {
        "show": true,
        "color": "#999999"
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#eeeeee"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.05)",
            "rgba(200,200,200,0.02)"
          ]
        }
      }
    },
    "timeAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#cccccc"
        }
      },
      "axisTick": {
        "show": false,
        "lineStyle": {
          "color": "#333"
        }
      },
      "axisLabel": {
        "show": true,
        "color": "#999999"
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#eeeeee"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "rgba(250,250,250,0.05)",
            "rgba(200,200,200,0.02)"
          ]
        }
      }
    },
    "toolbox": {
      "iconStyle": {
        "borderColor": "#999999"
      },
      "emphasis": {
        "iconStyle": {
          "borderColor": "#666666"
        }
      }
    },
    "legend": {
      "textStyle": {
        "color": "#999999"
      }
    },
    "tooltip": {
      "axisPointer": {
        "lineStyle": {
          "color": "#cccccc",
          "width": 1
        },
        "crossStyle": {
          "color": "#cccccc",
          "width": 1
        }
      }
    },
    "timeline": {
      "lineStyle": {
        "color": "#8fd3e8",
        "width": 1
      },
      "itemStyle": {
        "color": "#8fd3e8",
        "borderWidth": 1
      },
      "controlStyle": {
        "color": "#8fd3e8",
        "borderColor": "#8fd3e8",
        "borderWidth": 0.5
      },
      "checkpointStyle": {
        "color": "#8fd3e8",
        "borderColor": "#8a7ca8"
      },
      "label": {
        "color": "#8fd3e8"
      },
      "emphasis": {
        "itemStyle": {
          "color": "#8fd3e8"
        },
        "controlStyle": {
          "color": "#8fd3e8",
          "borderColor": "#8fd3e8",
          "borderWidth": 0.5
        },
        "label": {
          "color": "#8fd3e8"
        }
      }
    },
    "visualMap": {
      "color": [
        "#516b91",
        "#59c4e6",
        "#a5e7f0"
      ]
    },
    "dataZoom": {
      "backgroundColor": "rgba(0,0,0,0)",
      "dataBackgroundColor": "rgba(255,255,255,0.3)",
      "fillerColor": "rgba(167,183,204,0.4)",
      "handleColor": "#a7b7cc",
      "handleSize": "100%",
      "textStyle": {
        "color": "#333"
      }
    },
    "markPoint": {
      "label": {
        "color": "#eeeeee"
      },
      "emphasis": {
        "label": {
          "color": "#eeeeee"
        }
      }
    }
  }
)

echarts.registerTheme('dark',
  {
    "color": [
      "#dd6b66",
      "#759aa0",
      "#e69d87",
      "#8dc1a9",
      "#ea7e53",
      "#eedd78",
      "#73a373",
      "#73b9bc",
      "#7289ab",
      "#91ca8c",
      "#f49f42"
    ],
    "backgroundColor": "rgba(51,51,51,1)",
    "textStyle": {},
    "title": {
      "textStyle": {
        "color": "#eeeeee"
      },
      "subtextStyle": {
        "color": "#aaaaaa"
      }
    },
    "line": {
      "itemStyle": {
        "borderWidth": 1
      },
      "lineStyle": {
        "width": 2
      },
      "symbolSize": 4,
      "symbol": "circle",
      "smooth": false
    },
    "radar": {
      "itemStyle": {
        "borderWidth": 1
      },
      "lineStyle": {
        "width": 2
      },
      "symbolSize": 4,
      "symbol": "circle",
      "smooth": false
    },
    "bar": {
      "itemStyle": {
        "barBorderWidth": 0,
        "barBorderColor": "#ccc"
      }
    },
    "pie": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "scatter": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "boxplot": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "parallel": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "sankey": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "funnel": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "gauge": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      }
    },
    "candlestick": {
      "itemStyle": {
        "color": "#fd1050",
        "color0": "#0cf49b",
        "borderColor": "#fd1050",
        "borderColor0": "#0cf49b",
        "borderWidth": 1
      }
    },
    "graph": {
      "itemStyle": {
        "borderWidth": 0,
        "borderColor": "#ccc"
      },
      "lineStyle": {
        "width": 1,
        "color": "#aaaaaa"
      },
      "symbolSize": 4,
      "symbol": "circle",
      "smooth": false,
      "color": [
        "#dd6b66",
        "#759aa0",
        "#e69d87",
        "#8dc1a9",
        "#ea7e53",
        "#eedd78",
        "#73a373",
        "#73b9bc",
        "#7289ab",
        "#91ca8c",
        "#f49f42"
      ],
      "label": {
        "color": "#eeeeee"
      }
    },
    "map": {
      "itemStyle": {
        "areaColor": "#eee",
        "borderColor": "#444",
        "borderWidth": 0.5
      },
      "label": {
        "color": "#000"
      },
      "emphasis": {
        "itemStyle": {
          "areaColor": "rgba(255,215,0,0.8)",
          "borderColor": "#444",
          "borderWidth": 1
        },
        "label": {
          "color": "rgb(100,0,0)"
        }
      }
    },
    "geo": {
      "itemStyle": {
        "areaColor": "#eee",
        "borderColor": "#444",
        "borderWidth": 0.5
      },
      "label": {
        "color": "#000"
      },
      "emphasis": {
        "itemStyle": {
          "areaColor": "rgba(255,215,0,0.8)",
          "borderColor": "#444",
          "borderWidth": 1
        },
        "label": {
          "color": "rgb(100,0,0)"
        }
      }
    },
    "categoryAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#eeeeee"
        }
      },
      "axisTick": {
        "show": true,
        "lineStyle": {
          "color": "#eeeeee"
        }
      },
      "axisLabel": {
        "show": true,
        "color": "#eeeeee"
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#aaaaaa"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "#eeeeee"
          ]
        }
      }
    },
    "valueAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#eeeeee"
        }
      },
      "axisTick": {
        "show": true,
        "lineStyle": {
          "color": "#eeeeee"
        }
      },
      "axisLabel": {
        "show": true,
        "color": "#eeeeee"
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#aaaaaa"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "#eeeeee"
          ]
        }
      }
    },
    "logAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#eeeeee"
        }
      },
      "axisTick": {
        "show": true,
        "lineStyle": {
          "color": "#eeeeee"
        }
      },
      "axisLabel": {
        "show": true,
        "color": "#eeeeee"
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#aaaaaa"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "#eeeeee"
          ]
        }
      }
    },
    "timeAxis": {
      "axisLine": {
        "show": true,
        "lineStyle": {
          "color": "#eeeeee"
        }
      },
      "axisTick": {
        "show": true,
        "lineStyle": {
          "color": "#eeeeee"
        }
      },
      "axisLabel": {
        "show": true,
        "color": "#eeeeee"
      },
      "splitLine": {
        "show": true,
        "lineStyle": {
          "color": [
            "#aaaaaa"
          ]
        }
      },
      "splitArea": {
        "show": false,
        "areaStyle": {
          "color": [
            "#eeeeee"
          ]
        }
      }
    },
    "toolbox": {
      "iconStyle": {
        "borderColor": "#999999"
      },
      "emphasis": {
        "iconStyle": {
          "borderColor": "#666666"
        }
      }
    },
    "legend": {
      "textStyle": {
        "color": "#eeeeee"
      }
    },
    "tooltip": {
      "axisPointer": {
        "lineStyle": {
          "color": "#eeeeee",
          "width": "1"
        },
        "crossStyle": {
          "color": "#eeeeee",
          "width": "1"
        }
      }
    },
    "timeline": {
      "lineStyle": {
        "color": "#eeeeee",
        "width": 1
      },
      "itemStyle": {
        "color": "#dd6b66",
        "borderWidth": 1
      },
      "controlStyle": {
        "color": "#eeeeee",
        "borderColor": "#eeeeee",
        "borderWidth": 0.5
      },
      "checkpointStyle": {
        "color": "#e43c59",
        "borderColor": "#c23531"
      },
      "label": {
        "color": "#eeeeee"
      },
      "emphasis": {
        "itemStyle": {
          "color": "#a9334c"
        },
        "controlStyle": {
          "color": "#eeeeee",
          "borderColor": "#eeeeee",
          "borderWidth": 0.5
        },
        "label": {
          "color": "#eeeeee"
        }
      }
    },
    "visualMap": {
      "color": [
        "#bf444c",
        "#d88273",
        "#f6efa6"
      ]
    },
    "dataZoom": {
      "backgroundColor": "rgba(47,69,84,0)",
      "dataBackgroundColor": "rgba(255,255,255,0.3)",
      "fillerColor": "rgba(167,183,204,0.4)",
      "handleColor": "#a7b7cc",
      "handleSize": "100%",
      "textStyle": {
        "color": "#eeeeee"
      }
    },
    "markPoint": {
      "label": {
        "color": "#eeeeee"
      },
      "emphasis": {
        "label": {
          "color": "#eeeeee"
        }
      }
    }
  }
)

export default {}