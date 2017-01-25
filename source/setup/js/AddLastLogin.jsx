import React from "react";

import HeaderBar from "./HeaderBar";
import AddLastLoginForm from "./AddLastLoginForm";

class AddLastLogin extends React.Component {

    render() {
        return (
            <div>
                <HeaderBar />
                <h3>Add new entry</h3>
                <AddLastLoginForm />
            </div>
        );
    }

}

export default AddLastLogin;
