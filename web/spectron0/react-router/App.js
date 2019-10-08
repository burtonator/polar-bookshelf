"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Navbar_1 = require("./Navbar");
const ReactRouters_1 = require("../../js/ui/ReactRouters");
class App extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (React.createElement("div", { style: { margin: '5px' } },
            React.createElement(react_router_dom_1.BrowserRouter, null,
                React.createElement(react_router_dom_1.Switch, { location: ReactRouters_1.ReactRouters.createLocationWithPathnameHash() },
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/#hello' },
                        React.createElement("div", null,
                            React.createElement(Navbar_1.Navbar, null),
                            "this is the HELLO page :)")),
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/user' },
                        React.createElement("div", null,
                            React.createElement(Navbar_1.Navbar, null),
                            "this is the USER page")),
                    React.createElement(react_router_dom_1.Route, { exact: true, path: '/' },
                        React.createElement("div", null,
                            React.createElement("div", null,
                                React.createElement(Navbar_1.Navbar, null),
                                "this is the DEFAULT page.")))))));
    }
}
exports.default = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBwLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFDL0IsdURBQWdGO0FBRWhGLHFDQUFnQztBQUNoQywyREFBc0Q7QUFFdEQsTUFBTSxHQUFPLFNBQVEsS0FBSyxDQUFDLFNBQXdCO0lBRS9DLFlBQVksS0FBUSxFQUFFLE9BQVk7UUFDOUIsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUUxQixDQUFDO0lBRU0sTUFBTTtRQUVULE9BQU8sQ0FFSCw2QkFBSyxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDO1lBRXZCLG9CQUFDLGdDQUFhO2dCQUVWLG9CQUFDLHlCQUFNLElBQUMsUUFBUSxFQUFFLDJCQUFZLENBQUMsOEJBQThCLEVBQUU7b0JBRTNELG9CQUFDLHdCQUFLLElBQUMsS0FBSyxRQUFDLElBQUksRUFBQyxTQUFTO3dCQUV2Qjs0QkFDSSxvQkFBQyxlQUFNLE9BQUU7d0RBR1AsQ0FFRjtvQkFFUixvQkFBQyx3QkFBSyxJQUFDLEtBQUssUUFBQyxJQUFJLEVBQUMsT0FBTzt3QkFFckI7NEJBQ0ksb0JBQUMsZUFBTSxPQUFFO29EQUVQLENBRUY7b0JBRVIsb0JBQUMsd0JBQUssSUFBQyxLQUFLLFFBQUMsSUFBSSxFQUFDLEdBQUc7d0JBRWpCOzRCQUNJO2dDQUNJLG9CQUFDLGVBQU0sT0FBRTs0REFHUCxDQUNKLENBRUYsQ0FFSCxDQUVHLENBRWQsQ0FFVCxDQUFDO0lBQ04sQ0FBQztDQUdKO0FBRUQsa0JBQWUsR0FBRyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtCcm93c2VyUm91dGVyLCBIYXNoUm91dGVyLCBMaW5rLCBSb3V0ZSwgU3dpdGNofSBmcm9tIFwicmVhY3Qtcm91dGVyLWRvbVwiO1xuaW1wb3J0IHtTaW1wbGVUb29sdGlwRXh9IGZyb20gXCIuLi8uLi9qcy91aS90b29sdGlwL1NpbXBsZVRvb2x0aXBFeFwiO1xuaW1wb3J0IHtOYXZiYXJ9IGZyb20gXCIuL05hdmJhclwiO1xuaW1wb3J0IHtSZWFjdFJvdXRlcnN9IGZyb20gXCIuLi8uLi9qcy91aS9SZWFjdFJvdXRlcnNcIjtcblxuY2xhc3MgQXBwPFA+IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PHt9LCBJQXBwU3RhdGU+IHtcblxuICAgIGNvbnN0cnVjdG9yKHByb3BzOiBQLCBjb250ZXh0OiBhbnkpIHtcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuXG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlcigpIHtcblxuICAgICAgICByZXR1cm4gKFxuXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luOiAnNXB4J319PlxuXG4gICAgICAgICAgICAgICAgPEJyb3dzZXJSb3V0ZXI+XG5cbiAgICAgICAgICAgICAgICAgICAgPFN3aXRjaCBsb2NhdGlvbj17UmVhY3RSb3V0ZXJzLmNyZWF0ZUxvY2F0aW9uV2l0aFBhdGhuYW1lSGFzaCgpfT5cblxuICAgICAgICAgICAgICAgICAgICAgICAgPFJvdXRlIGV4YWN0IHBhdGg9Jy8jaGVsbG8nPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyBpcyB0aGUgSEVMTE8gcGFnZSA6KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1JvdXRlPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um91dGUgZXhhY3QgcGF0aD0nL3VzZXInPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgaXMgdGhlIFVTRVIgcGFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8L1JvdXRlPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICA8Um91dGUgZXhhY3QgcGF0aD0nLyc+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE5hdmJhci8+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMgaXMgdGhlIERFRkFVTFQgcGFnZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvUm91dGU+XG5cbiAgICAgICAgICAgICAgICAgICAgPC9Td2l0Y2g+XG5cbiAgICAgICAgICAgICAgICA8L0Jyb3dzZXJSb3V0ZXI+XG5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICk7XG4gICAgfVxuXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuXG5pbnRlcmZhY2UgSUFwcFN0YXRlIHtcblxufVxuXG5cbiJdfQ==