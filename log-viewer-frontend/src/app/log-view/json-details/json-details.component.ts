import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    QueryList,
    SimpleChanges,
    ViewChildren
} from '@angular/core';
import {ViewConfigService} from '../view-config.service';
import {Record} from '@app/log-view/record';
import {LogFile} from '@app/log-view/log-file';
import {ViewStateService} from '@app/log-view/view-state.service';
import {LvUtils} from '@app/utils/utils';
import {RecordRendererService} from '@app/log-view/record-renderer.service';

@Component({
    selector: 'lv-json-details',
    templateUrl: './json-details.template.html',
    styleUrls: ['./json-details.style.scss']
})
export class JsonDetailsComponent implements OnChanges, AfterViewInit {

    @ViewChildren('fieldVal') fieldValues: QueryList<ElementRef>;

    @Input() record: Record;

    log: LogFile;

    timestamp: string;

    fields: {fieldName: string, html: string}[];

    constructor(private changeDetectorRef: ChangeDetectorRef,
                public vs: ViewStateService,
                private recRenderer: RecordRendererService,
                private viewConfig: ViewConfigService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['record']) {
            let r = this.record;

            this.log = this.viewConfig.logById[r.logId];

            this.timestamp = r.time ? LvUtils.formatDate(LvUtils.nano2milliseconds(r.time)) : null;

            this.fields = [];

            if (this.log) {
                let fieldsCopy = [...r.fields];
                fieldsCopy.sort((a, b) => a.start - b.start);

                for (let field of fieldsCopy) {
                    // let e: HTMLElement = document.createElement('SPAN');
                    // e.className = 'rec-text';

                    // let fieldDescr = this.log.fields.find(f => f.name === field.name);
                    // this.recRenderer.renderField(e, r, field, fieldDescr);

                    this.fields.push({fieldName: field.name, html: r.s});
                    let value = this.pretty_json(r.s);
                    if(value != r.s) {
                        this.fields.push({fieldName: field.name, html: value});
                    }
                    break;
                }
            }
        }
    }

    fieldClick(event: MouseEvent) {
        this.recRenderer.handleClick(event);
    }

    ngAfterViewInit() {
        let fieldValues = this.fieldValues.toArray();

        LvUtils.assert(fieldValues.length === this.fields.length);

        for (let i = 0; i < this.fields.length; i++) {
            let value = this.fields[i].html;
            fieldValues[i].nativeElement.append(value);
        }
    }

    pretty_json (input_string: string) {
        let str = input_string.replace(/'/g, '"')
        while(str.length > 0) {
            try {
                let obj = JSON.parse(str);
                return JSON.stringify(obj, null, 2)
            } catch (e) {
                str = str.substring(1);
                // console.log(str);
            }
        }
        return input_string;
    }
}
