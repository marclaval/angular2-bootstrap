A carousel component similar to [Bootstrap javascript carousel](http://getbootstrap.com/javascript/#carousel)

#### Attributes ####

| Name | Binding | Type | Default | Description |
| ---- | ------- | ---- | ------- | ----------- |
| **index** | 2-way | int | 0 | Index (0-based) of the active slide. |
| **interval** | 1-way | int | 5000 | The amount of time to delay between automatically cycling an item. If false or negative, carousel will not automatically cycle. |
| **pause** | none | string | "hover" | Pauses the cycling of the carousel on mouseover and resumes the cycling of the carousel on mouseout. |
| **wrap** | none | boolean | true | Whether the carousel should cycle continuously or have hard stops. |
| **noTransition** | none | boolean | false | Whether transitions are activated. |

#### Elements ####
| Name | Description |  |
| ---- | ----------- | - |
| **div[slide]** | A slide of the carousel. The content is the body of the slide, any HTML element.| |
| **div[slide] > div[caption]** | The caption of the slide, a block of HTML displayed at the bottom center. | Optionnal |

#### Events ####

| Name | Description |
| ---- | ----------- |
| **onslidestart** | This event fires immediately when the transition starts. |
| **onslideend** | This event is fired when the carousel has completed its slide transition. |
