const IPv4Regex = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/;
const MACRegex = /([0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2}[:\-][0-9a-f]{1,2})/;
const DeviceRegex = /((?:en|wl)[\w]+)/;
const InterfaceRegex = /Interface:[\s]([\w.]+)/;

export default class ARPParser {
    constructor() {}

    parse(table) {
        let rows = table.split('\n'),
            result = {
                Devices: {}
            };

        rows.forEach((row) => {
            let cols = row.split(' '),
                ip,
                mac,
                device = "en0";

            cols.forEach((col) => {
                let IPv4Result = IPv4Regex.exec(col);
                let MacResult = MACRegex.exec(col);
                let DeviceResult = DeviceRegex.exec(col);
                let InterfaceResult = InterfaceRegex.exec(col);

                if (IPv4Result) {
                    ip = IPv4Result[0];
                }

                if (MacResult) {
                    mac = MacResult[0];
                }

                if (DeviceResult || InterfaceResult) {
                    device = DeviceResult[0] || InterfaceResult[0];
                }
            });

            if (ip && mac && device) {
                result.Devices[device] = {
                    IPs: {},
                    MACs: {}
                };

                result.Devices[device].IPs[ip] = mac;
                result.Devices[device].MACs[mac] = ip;
            }
        });

        return result;
    }
}
