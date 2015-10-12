import {Component} from 'angular2/angular2';

@Component({
  selector: 'doc-alert',
  templateUrl: './samples/alert/README.html'
})
export class DocAlert {
}

@Component({
  selector: 'source-html-alert',
  templateUrl: './samples/alert/demo-alert.html.source.html'
})
export class SourceHtmlAlert {
}

@Component({
  selector: 'source-ts-alert',
  templateUrl: './samples/alert/demo-alert.ts.source.html'
})
export class SourceTsAlert {
}
