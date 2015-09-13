An alert similar to [Bootstrap javascript alert](http://getbootstrap.com/javascript/#alerts) 

#### Attributes ####
| Name | Binding | Type | Default | Description |
| ---- | ------- | ---- | ------- | ----------- |
| **dismissable** | 1-way | boolean | true | Whether the alert contains a close button. |
| **fade** | none | boolean | true | Whether the alert will animate out when closed. |
| **type** | 1-way | string | danger | Possible types include: success, info, warning, danger. |
| **opened** | 2-way | boolean | true | Used to bind the onclose method. |

#### Events ####
| Name | Description |
| ---- | ----------- |
| **closestart** | Called immediately when the close method is called. |
| **closeend** | Called when the alert has been closed (will wait for CSS transitions to complete). |