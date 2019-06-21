import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import GanttChart from "./GanttChart";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Route path={'/'} component={GanttChart} />
            </BrowserRouter>
        )
    }
}

export default App;