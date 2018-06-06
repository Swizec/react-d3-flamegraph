import React, { Component } from "react";
import { render } from "react-dom";

import "./index.css";
import "./demo.css";

import Flamegraph from "../../src/Flamegraph";
import stacks from "./stacks.json";

class Demo extends Component {
    render() {
        return (
            <div className="App">
                <h1>react-d3-flamegraph Demo</h1>

                <svg width={1280} height={720}>
                    <Flamegraph data={stacks} width={1280} />
                </svg>
            </div>
        );
    }
}

render(<Demo />, document.querySelector("#demo"));
