A carousel component similar to [Bootstrap javascript carousel](http://getbootstrap.com/javascript/#carousel)

#### Properties ####

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| **index** | number | 0 | Index (0-based) of the active slide. |
| **interval** | number | 5000 | The amount of time to delay between automatically cycling an item. If false or negative, carousel will not automatically cycle. |
| **pause** | string | "hover" | Pauses the cycling of the carousel on mouseover and resumes the cycling of the carousel on mouseout. |
| **wrap** | boolean | true | Whether the carousel should cycle continuously or have hard stops. |
| **no-transition** | boolean | false | Whether transitions are activated. |

#### Elements ####
| Name | Description |  |
| ---- | ----------- | - |
| **carousel-slide** | A slide of the carousel. The content is the body of the slide, any HTML element.| |
| **carousel-slide > carousel-caption** | The caption of the slide, a block of HTML displayed at the bottom center. | Optional |

#### Events ####

| Name | Description |
| ---- | ----------- |
| **indexchange** | This event fires when the index changes. |
| **slidestart** | This event fires immediately when the transition starts. |
| **slideend** | This event is fired when the carousel has completed its slide transition. |
