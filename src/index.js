import GenericARP from './fetchers/GenericARP';
import LinuxARP from './fetchers/LinuxARP';
import ARPParser from './parsers/Parser';

export default class Arped {
    constructor() {
        this.arpFetcher = new GenericARP();

        if (/linux/.test(process.platform)) {
            this.arpFetcher = new LinuxARP();
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
