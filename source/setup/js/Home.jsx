import React from "react";

import ArchiveList from "./ArchiveList";
import HeaderBar from "./HeaderBar";

class Home extends React.Component {

    render() {
        return (
            <div>
                <HeaderBar />
                <div>
                    <h3>Archives</h3>
                    <ArchiveList />
                </div>
            </div>
        );
    }

}

export default Home;
