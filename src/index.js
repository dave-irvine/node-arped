import GenericARP from './fetchers/GenericARP';
import LinuxARP from './fetchers/LinuxARP';
import ARPParser from './parsers/Parser';

export default class Arped {
    constructor() {
        if (/linux/.test(process.platform)) {
            this.arpFetcher = new LinuxARP();
        } else {
            this.arpFetcher = new GenericARP();
        }

        this.arpParser = new ARPParser();
    }

    table() {
        return this.arpFetcher.fetch();
    }

    parse(table) {
        return this.arpParser.parse(table);
    }
}
