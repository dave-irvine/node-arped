/*eslint-env mocha */
/*eslint-disable no-unused-expressions*/
'use strict';

import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import FS from 'fs';

chai.use(sinonChai);

const Parser = require('../src/parsers/Parser').default;
const FixturesPath = './test/fixtures/';

describe('Parser', () => {
    let fixtures = {},
        parser,
        sandbox;

    before(() => {
        sandbox = sinon.sandbox.create();

        let files = FS.readdirSync(FixturesPath);
        files.forEach((file) => {
            fixtures[file] = FS.readFileSync(`${FixturesPath}${file}`).toString();
        });
    });

    beforeEach(() => {
        parser = new Parser();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('parse', () => {
        it('should throw an Error if not passed a table to parse', () => {
            return expect(() => {
                parser.parse();
            }).to.throw(`Missing table to parse`);
        });

        it('should throw an Error if passed an empty string as a table', () => {
            return expect(() => {
                parser.parse('');
            }).to.throw(`Missing table to parse`);
        });

        it('should throw an Error if passed a number as a table', () => {
            return expect(() => {
                parser.parse(99);
            }).to.throw(`Missing table to parse`);
        });

        it('should throw an Error if passed a boolean as a table', () => {
            return expect(() => {
                parser.parse(true);
            }).to.throw(`Missing table to parse`);
        });

        it('should throw an Error if the passed table has no rows', () => {
            return expect(() => {
                parser.parse("A B C D");
            }).to.throw(`Table has only one row`);
        });

        it('should return a results object when parsing is successful', () => {
            let result = parser.parse(fixtures['LinuxARP-Simple.txt']);

            return expect(result).to.deep.equal({
                Devices: {
                    eth0: {
                        IPs: {
                            '192.168.0.1': '00:aa:22:bb:33:cc'
                        },
                        MACs: {
                            '00:aa:22:bb:33:cc': '192.168.0.1'
                        }
                    }
                }
            });
        });

        it('should parse multiple Devices', () => {
            let result = parser.parse(fixtures['LinuxARP-DualInterface.txt']);

            return expect(result).to.deep.equal({
                Devices: {
                    eth0: {
                        IPs: {
                            '192.168.0.1': '00:aa:22:bb:33:cc'
                        },
                        MACs: {
                            '00:aa:22:bb:33:cc': '192.168.0.1'
                        }
                    },
                    eth1: {
                        IPs: {
                            '192.168.0.2': '11:bb:33:cc:44:dd'
                        },
                        MACs: {
                            '11:bb:33:cc:44:dd': '192.168.0.2'
                        }
                    }
                }
            });
        });
    });
});