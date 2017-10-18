import ArchiveEntryForm from "./ArchiveEntryForm";

class BaseFSArchiveEntryForm extends ArchiveEntryForm {

    constructor(props) {
        super(props);
        this.fs = null;
        this._checkingFs = false;
        this._checkAgain = false;
    }

    checkFS() {
        if (this._checkingFs) {
            this._checkAgain = true;
            return;
        }
        let fs = this.createFS();
        if (fs === null) {
            return;
        }
        this._checkingFs = true;
        fs.readDirectory("/").then(
            () => {
                this._checkingFs = false;
                this._checkAgain = false;
                this.fs = fs;
                this.forceUpdate();
            },
            () => {
                this._checkingFs = false;
                let checkAgain = this._checkAgain;
                this._checkAgain = false;
                if (checkAgain) {
                    this.checkFS();
                }
                return Promise.resolve();
            }
        );
    }

}

export default BaseFSArchiveEntryForm;
