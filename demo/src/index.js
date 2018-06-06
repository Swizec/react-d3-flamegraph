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

                <h2>Static flamegraph</h2>
                <svg width={1280} height={420}>
                    <Flamegraph data={stacks} width={1280} />
                </svg>

                <h2>Flamegraph with currently not very performant animation</h2>

                <svg width={1280} height={420}>
                    <Flamegraph data={stacks} width={1280} enableClick />
                </svg>
            </div>
        );
    }
}

render(<Demo />, document.querySelector("#demo"));
