# webperfscore

web 性能评分工具。

## 安装使用

1. 安装依赖

```bash
npm install webperfscore --save 
```

2. 运行计算

    ```js
    import { webperfscore } from 'webperfscore';

    const result = webperfscore({
      'first-contentful-paint': 2000,
      'first-meaningful-paint': 2000,
      'speed-index': 3000,
      'fully-loaded': 4000,
    });

    console.log(result.score); // 分值
    ```

3. 分析结果：`webperfscore` 默认采用 10 分制度。

    - 0-2 分：堪忧
    - 2-4 分：较差
    - 4-6 分：一般
    - 6-8 分：较好
    - 8-10 分：非常好

## API

- `webperfscore(metrics, options)`：计算性能评分

    - metrics：性能指标值。metrics 是个 Map 对象，key 为指标名，value 为指标值。如果是时间，那么以毫秒为单位。
    - options：配置选项，可以决定评分总分值，以及各个性能指标的权重和得分计算，参考[默认值](./blob/master/src/index.ts#L110)。

- `defaultScoreOptions`：默认配置选项，总分默认 10 分。

    - [first-contentful-paint](https://www.desmos.com/calculator/mgvri1deue)：首次内容渲染时间
    - [first-meaningful-paint](https://www.desmos.com/calculator/lcdgpkbaqs)：首次有效渲染时间
    - [speed-index](https://www.desmos.com/calculator/fmegpfhf2i)：速度指数
    - [fully-loaded](https://www.desmos.com/calculator/ix2a8su01j)：完全加载时长

- `defaultAudits`：默认指标配置
