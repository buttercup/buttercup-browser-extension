import { Datasources } from "./buttercup.js";
import { buildClient } from "./secureFileClient.js";

const { TextDatasource, registerDatasource } = Datasources;

export default class LocalFileDatasource extends TextDatasource {
    constructor(filePath, credentials) {
        super();
        this._path = filePath;
        this._token = credentials.getValueOrFail("token");
        this.client = buildClient(this._token);
    }

    get path() {
        return this._path;
    }

    get token() {
        return this._token;
    }

    /**
     * Load archive history from the datasource
     * @param {Credentials} credentials The credentials for archive decryption
     * @returns {Promise.<Array.<String>>} A promise resolving archive history
     * @memberof LocalFileDatasource
     */
    load(credentials) {
        // return this.hasContent
        //     ? super.load(credentials)
        //     : this.client.getFileContents(this.path, { format: "text" }).then(content => {
        //           this.setContent(content);
        //           return super.load(credentials);
        //       });
    }

    /**
     * Save archive contents to the WebDAV service
     * @param {Array.<String>} history Archive history
     * @param {Credentials} credentials The credentials for encryption
     * @returns {Promise} A promise resolving when the save is complete
     * @memberof LocalFileDatasource
     */
    save(history, credentials) {
        // return super
        //     .save(history, credentials)
        //     .then(encrypted => this.client.putFileContents(this.path, encrypted));
    }

    /**
     * Whether or not the datasource supports bypassing remote fetch operations
     * @returns {Boolean} True if content can be set to bypass fetch operations,
     *  false otherwise
     * @memberof LocalFileDatasource
     */
    supportsRemoteBypass() {
        return false;
    }

    /**
     * Output the datasource as an object
     * @returns {Object} An object describing the datasource
     * @memberof LocalFileDatasource
     */
    toObject() {
        return {
            type: "localfile",
            path: this.path
        };
    }
}

/**
 * Create an instance from an object
 * @param {Object} obj The datasource info object
 * @param {Credentials=} hostCredentials The server credentials
 * @static
 * @memberof LocalFileDatasource
 */
LocalFileDatasource.fromObject = function fromObject(obj, credentials) {
    if (obj.type === "localfile") {
        return new LocalFileDatasource(obj.path, credentials);
    }
    throw new Error(`Unknown or invalid type: ${obj.type}`);
};

/**
 * Create an instance from a string
 * @param {String} str The string representation of the datasource
 * @param {Credentials=} hostCredentials The server credentials
 * @static
 * @memberof LocalFileDatasource
 */
LocalFileDatasource.fromString = function fromString(str, hostCredentials) {
    return LocalFileDatasource.fromObject(JSON.parse(str), hostCredentials);
};

registerDatasource("localfile", LocalFileDatasource);
