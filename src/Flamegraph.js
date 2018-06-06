import React from "react";
import {
    scaleLinear,
    schemeOrRd,
    color as d3color,
    easeCubicInOut,
    select as d3select,
    transition
} from "d3";

const RowHeight = 20;

class FlameRect extends React.Component {
    state = {
        hideLabel: false,
        color: schemeOrRd[9][Math.floor(Math.random() * 9)],
        width: this.props.width,
        x: this.props.x
    };

    rectRef = React.createRef();
    gRef = React.createRef();
    labelRef = React.createRef();

    // animation disabled for now
    // onClick = () => this.props.onSelect();

    componentDidUpdate() {
        const { width, x, y } = this.props;

        const t = transition()
            .duration(500)
            .ease(easeCubicInOut)
            .on("end", () =>
                this.setState({
                    width,
                    x
                })
            );

        d3select(this.rectRef.current)
            .transition(t)
            .attr("width", width);

        d3select(this.gRef.current)
            .transition(t)
            .attr("transform", `translate(${x}, ${y})`);

        this.hideLabel();
    }

    componentDidMount() {
        this.hideLabel();
    }

    hideLabel() {
        if (
            this.labelRef.current &&
            this.labelRef.current.getBoundingClientRect().width >
                this.state.width
        ) {
            this.setState({ hideLabel: true });
        }
        //  else if (this.state.hideLabel) {
        //     this.setState({ hideLabel: false });
        // }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { hideLabel, width, x } = this.state,
            { selected } = this.props;

        return (
            nextState.hideLabel !== hideLabel ||
            nextProps.width !== width ||
            nextProps.x !== x ||
            nextProps.select !== selected
        );
    }

    render() {
        const { y, height, name, selected } = this.props,
            { hideLabel, width, x } = this.state;
        let { color } = this.state;

        if (selected) {
            color = d3color(color).brighter();
        }

        return (
            <g
                transform={`translate(${x}, ${y})`}
                style={{ cursor: "pointer" }}
                onClick={this.onClick}
                ref={this.gRef}
            >
                <rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    style={{
                        stroke: "white",
                        fill: color
                    }}
                    ref={this.rectRef}
                />
                {!hideLabel && (
                    <text
                        x={5}
                        y={13}
                        style={{ fontSize: "12px" }}
                        ref={this.labelRef}
                    >
                        {name}
                    </text>
                )}
            </g>
        );
    }
}

class Flamegraph extends React.Component {
    state = {
        selectedChild: null,
        // this likely means you can't change overall data after initial render
        data: this.props.data
    };

    selectChild = index => {
        const { selectedChild, data } = this.state;

        if (selectedChild === index) {
            // toggle to normal
            this.setState({
                selectedChild: null,
                data: data.map(d => ({ ...d, value: d._origValue }))
            });
        } else {
            // expand selected box
            this.setState({
                selectedChild: index === selectedChild ? null : index,
                data: data.map((d, i) => ({
                    ...d,
                    _origValue: d.value,
                    value: i === index ? d.value : d.value * 0.1
                }))
            });
        }
    };

    render() {
        const { x = 0, y = 0, width, level = 0 } = this.props,
            { data, selectedChild } = this.state;

        const xScale = scaleLinear()
            .domain([0, data.reduce((sum, d) => sum + d.value, 0)])
            .range([0, width]);

        return (
            <g transform={`translate(${x}, ${y})`}>
                {data.map((d, i) => {
                    const start = data
                        .slice(0, i)
                        .reduce((sum, d) => sum + d.value, 0);

                    return (
                        <React.Fragment key={`${level}-${d.name}`}>
                            <FlameRect
                                x={xScale(start)}
                                y={0}
                                width={xScale(d.value)}
                                height={RowHeight}
                                name={d.name}
                                onSelect={() => this.selectChild(i)}
                                selected={selectedChild === i}
                            />
                            {d.children && (
                                <Flamegraph
                                    data={d.children}
                                    x={xScale(start)}
                                    y={RowHeight}
                                    width={xScale(d.value)}
                                    level={level + 1}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </g>
        );
    }
}

export default Flamegraph;
