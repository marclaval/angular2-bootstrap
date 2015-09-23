import {Component, View, NgNonBindable} from 'angular2/angular2';

@Component({
  selector: 'doc-alert'
})
@View({
  templateUrl: './samples/alert/README.html'
})
export class DocAlert {
}

@Component({
  selector: 'source-html-alert'
})
@View({
  templateUrl: './samples/alert/demo-alert.html.source.html',
  directives: [NgNonBindable]
})
export class SourceHtmlAlert {
}

@Component({
  selector: 'source-ts-alert'
})
@View({
  templateUrl: './samples/alert/demo-alert.ts.source.html',
  directives: [NgNonBindable]
})
export class SourceTsAlert {
}
